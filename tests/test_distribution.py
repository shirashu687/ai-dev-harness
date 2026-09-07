"""Read-only distribution checks and disposable lifecycle fixtures; no installer CLI."""
import copy
from datetime import datetime, timezone
import hashlib
import json
from pathlib import Path
import re
import stat
import subprocess
import tempfile
import unittest

ROOT = Path(__file__).resolve().parents[1]
FORMAT = 'sha256-canonical-text-v1'
MANIFEST = 'distribution/manifest.json'
REPOSITORY = 'https://github.com/shirashu687/ai-dev-harness.git'


def canonical(data):
    if data.startswith(b'\xef\xbb\xbf'):
        raise ValueError('BOM')
    return data.decode('utf-8').replace('\r\n', '\n').replace('\r', '\n').encode('utf-8')


def digest(data):
    return hashlib.sha256(canonical(data)).hexdigest()


def parse_json(data):
    def unique(pairs):
        result = {}
        for key, value in pairs:
            if key in result:
                raise ValueError('duplicate JSON key')
            result[key] = value
        return result
    return json.loads(canonical(data), object_pairs_hook=unique)


def safe_path(root, relative):
    if not isinstance(relative, str) or not relative:
        raise ValueError('empty path')
    parts = relative.split('/')
    if any(p in ('', '.', '..') or p.endswith((' ', '.')) for p in parts):
        raise ValueError('non-canonical path')
    if re.search(r'[\\:*?\[\]<>|\x00-\x1f]', relative):
        raise ValueError('unsafe path')
    if any(re.fullmatch(r'(?i)(CON|PRN|AUX|NUL|COM[1-9]|LPT[1-9])(\..*)?', p) for p in parts):
        raise ValueError('reserved path')
    root = Path(root).absolute()
    path = root.joinpath(*parts)
    for parent in (path, *path.parents):
        if parent.is_symlink():
            raise ValueError('symlink')
        if parent.exists() and getattr(parent.stat(), 'st_file_attributes', 0) & stat.FILE_ATTRIBUTE_REPARSE_POINT:
            raise ValueError('junction/reparse point')
    if not path.resolve().is_relative_to(root.resolve()):
        raise ValueError('outside root')
    return path


def git(root, *args):
    return subprocess.check_output(['git', '-c', 'core.autocrlf=false', '-C', str(root), *args], stderr=subprocess.PIPE)


class Distribution:
    """Read immutable blobs; a dirty checkout never supplies release contents."""
    def __init__(self, root, commit, repository=REPOSITORY):
        if not re.fullmatch(r'[0-9a-f]{40}', commit):
            raise ValueError('full SHA required')
        if not re.fullmatch(r'https://github\.com/[A-Za-z0-9_.-]+/[A-Za-z0-9_.-]+(?:\.git)?', repository):
            raise ValueError('GitHub source required')
        self.root, self.commit, self.repository = Path(root), commit, repository
        if git(root, 'rev-parse', commit + '^{commit}').decode().strip() != commit:
            raise ValueError('not a commit')
        self.manifest_bytes = self.blob(MANIFEST)
        self.manifest = parse_json(self.manifest_bytes)
        m = self.manifest
        if type(m.get('schema_version')) is not int or m['schema_version'] != 1 or m.get('hash_format') != FORMAT:
            raise ValueError('unknown manifest format')
        if not isinstance(m.get('files'), list) or not m['files']:
            raise ValueError('empty manifest')
        sources, targets = set(), set()
        self.contents = {}
        for row in m['files']:
            if set(row) != {'source', 'target', 'mode'}:
                raise ValueError('invalid manifest row')
            source, target, mode = row['source'], row['target'], row['mode']
            safe_path(root, source)
            safe_path(root, target)
            if mode not in ('core', 'seed', 'manual'):
                raise ValueError('mode')
            if not source.startswith('distribution/') or source == MANIFEST:
                raise ValueError('source scope')
            if mode == 'core' and (not source.startswith('distribution/core/') or not target.startswith('harness/core/')):
                raise ValueError('core scope')
            expected_seed = {'harness/project/config.md', 'harness/project/skill-profile.md', 'harness/ledger.md'}
            if mode == 'seed' and target not in expected_seed:
                raise ValueError('seed scope')
            if mode == 'manual' and target not in {'AGENTS.md', 'CLAUDE.md'}:
                raise ValueError('manual scope')
            if source.casefold() in sources or target.casefold() in targets:
                raise ValueError('duplicate/case collision')
            sources.add(source.casefold())
            targets.add(target.casefold())
            self.contents[source] = self.blob(source)
            canonical(self.contents[source])
        listed = {r['source'] for r in m['files']} | {MANIFEST}
        actual = set(git(root, 'ls-tree', '-r', '--name-only', commit, '--', 'distribution').decode().splitlines())
        if actual != listed:
            raise ValueError('unlisted or missing distribution file')
        for paths in (sources, targets):
            if any(a != b and b.startswith(a + '/') for a in paths for b in paths):
                raise ValueError('file/parent collision')

    def blob(self, name):
        safe_path(self.root, name)
        entry = git(self.root, 'ls-tree', self.commit, '--', name).decode()
        if not entry.startswith(('100644 blob ', '100755 blob ')):
            raise ValueError('non-regular blob')
        return git(self.root, 'show', self.commit + ':' + name)

    def managed(self):
        return [dict(source=r['source'], target=r['target'], sha256=digest(self.contents[r['source']]))
                for r in self.manifest['files'] if r['mode'] == 'core']

    def record(self, installed_at=None):
        return dict(schema_version=1, hash_format=FORMAT,
                    source=dict(repository=self.repository, commit=self.commit, manifest=MANIFEST),
                    manifest_sha256=digest(self.manifest_bytes),
                    installed_at=installed_at or datetime.now(timezone.utc).isoformat().replace('+00:00', 'Z'),
                    managed_files=self.managed())


def core_inventory(target):
    core = safe_path(target, 'harness/core')
    found = set()
    if core.exists():
        if not core.is_dir():
            raise ValueError('core is not a directory')
        for p in core.rglob('*'):
            safe_path(target, p.relative_to(target).as_posix())
            if p.is_file():
                found.add(p.relative_to(target).as_posix())
    return found


def verify(target, source):
    record = parse_json(safe_path(target, 'harness/install.json').read_bytes())
    if not isinstance(record, dict) or type(record.get('schema_version')) is not int or record['schema_version'] != 1:
        raise ValueError('unknown record schema')
    stamp = record.get('installed_at')
    if not isinstance(stamp, str) or not stamp.endswith('Z'):
        raise ValueError('UTC timestamp required')
    datetime.fromisoformat(stamp.replace('Z', '+00:00'))
    if record != source.record(stamp):
        raise ValueError('record differs from immutable source')
    expected = {r['target'] for r in source.managed()}
    if core_inventory(target) != expected:
        raise ValueError('unknown or missing core file')
    for row in source.managed():
        if digest(safe_path(target, row['target']).read_bytes()) != row['sha256']:
            raise ValueError('modified core')
    return record


def preflight(target, current=None, desired=None):
    """Validate the entire union, returning a read-only explicit content plan."""
    record_path = safe_path(target, 'harness/install.json')
    if current:
        verify(target, current)
    elif record_path.exists() or core_inventory(target):
        raise ValueError('existing core/record requires explicit migration')
    if desired:
        # Initial seeds and manual entries are inspected before any core writes.
        for row in desired.manifest['files']:
            p = safe_path(target, row['target'])
            if p.exists() and not p.is_file():
                raise ValueError('destination is not a regular file')
            if any(parent.exists() and not parent.is_dir() for parent in p.parents):
                raise ValueError('parent is a file')
    before = {r['target']: current.contents[r['source']] for r in current.managed()} if current else {}
    after = {r['target']: desired.contents[r['source']] for r in desired.managed()} if desired else {}
    plan = []
    for name in sorted(before.keys() | after.keys()):
        p = safe_path(target, name)
        if name not in before and p.exists():
            raise ValueError('unknown destination')
        if p.exists() and not p.is_file():
            raise ValueError('not a file')
        for parent in p.parents:
            if parent.exists() and not parent.is_dir():
                raise ValueError('parent is a file')
        plan.append((name, p.read_bytes() if p.exists() else None, after.get(name)))
    return plan


def links(target):
    """Check installed Markdown targets, including a copied journal template."""
    for p in target.rglob('*.md'):
        for ref in re.findall(r'\[[^\]]*\]\(([^)]+)\)', p.read_text(encoding='utf-8')):
            if '://' not in ref and not ref.startswith('#'):
                if not (p.parent / ref.split('#')[0]).resolve().exists():
                    raise ValueError(f'broken link: {p}: {ref}')


def put(root, name, data):
    p = safe_path(root, name)
    p.parent.mkdir(parents=True, exist_ok=True)
    p.write_bytes(data)


def snapshot(root):
    return {p.relative_to(root).as_posix(): p.read_bytes() for p in root.rglob('*')
            if p.is_file() and '.git' not in p.parts}


class DistributionTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.base = Path(self.temp.name)
        self.source = self.base / 'source'
        self.source.mkdir()
        git(self.source, 'init')
        for p in (ROOT / 'distribution').rglob('*'):
            if p.is_file():
                put(self.source, p.relative_to(ROOT).as_posix(), p.read_bytes())
        self.v1 = self.commit()
        self.target = self.base / 'target'
        self.target.mkdir()
        git(self.target, 'init')
        put(self.target, 'AGENTS.md', b'# Existing project instructions\n')
        put(self.target, 'harness/state/journal/existing.md', b'Original work\n')
        put(self.target, '.agents/skills/local/SKILL.md', b'Original upstream\n')
        put(self.target, 'skills-lock.json', b'{"preserved":true}\n')

    def commit(self):
        git(self.source, 'add', 'distribution')
        git(self.source, '-c', 'user.name=Fixture', '-c', 'user.email=fixture@example.invalid', 'commit', '-m', 'Fixture version')
        return Distribution(self.source, git(self.source, 'rev-parse', 'HEAD').decode().strip())

    def install_fixture(self):
        plan = preflight(self.target, desired=self.v1)
        self.apply_fixture(plan)
        for row in self.v1.manifest['files']:
            if row['mode'] == 'seed':
                p = safe_path(self.target, row['target'])
                if not p.exists():
                    put(self.target, row['target'], self.v1.contents[row['source']])
        entry = self.v1.contents['distribution/templates/agents-entry.md']
        p = self.target / 'AGENTS.md'
        p.write_bytes(p.read_bytes() + b'\n' + entry)
        put(self.target, 'harness/state/journal/new.md', self.v1.contents['distribution/core/templates/worklog.md'])
        self.record_fixture(self.v1)
        verify(self.target, self.v1)

    def apply_fixture(self, plan):
        # Mutation helper only for this TemporaryDirectory, never a public installer.
        if not self.target.is_relative_to(self.base):
            raise ValueError('fixture only')
        for name, before, after in plan:
            p = safe_path(self.target, name)
            if (p.read_bytes() if p.exists() else None) != before:
                raise ValueError('concurrent edit')
            if after is None:
                p.unlink()
            else:
                put(self.target, name, after)

    def record_fixture(self, version):
        put(self.target, 'harness/install.json', (json.dumps(version.record()) + '\n').encode())

    def v2(self):
        m = copy.deepcopy(self.v1.manifest)
        removed = next(r for r in m['files'] if r['source'].endswith('/worklog.md'))
        m['files'].remove(removed)
        safe_path(self.source, removed['source']).unlink()
        m['files'].append(dict(source='distribution/core/extra.md', target='harness/core/extra.md', mode='core'))
        put(self.source, 'distribution/core/extra.md', b'Added in fixture v2\n')
        put(self.source, 'distribution/core/guide.md', b'Changed in fixture v2\n')
        put(self.source, MANIFEST, (json.dumps(m) + '\n').encode())
        return self.commit()

    def test_boundary(self):
        self.assertEqual(len(self.v1.manifest['files']), 11)
        self.assertEqual(len(self.v1.managed()), 6)
        for data in self.v1.contents.values():
            text = canonical(data).decode()
            for forbidden in ('C:/Users/', 'okf-devkit', 'check_changes.py', 'tests/run_all.py', '.venv/', '25スキル'):
                self.assertNotIn(forbidden, text)
            self.assertFalse(text.startswith('---'))

    def test_install_repeat_links_non_okf(self):
        self.install_fixture()
        links(self.target)
        before = snapshot(self.target)
        preflight(self.target, self.v1, self.v1)
        verify(self.target, self.v1)
        self.assertEqual(before, snapshot(self.target))
        self.assertFalse((self.target/'HARNESS_SPEC.md').exists())
        profile = (self.target/'harness/project/skill-profile.md').read_text(encoding='utf-8')
        self.assertIn('初期状態はなし', profile)
        self.assertNotIn('.agents/skills/', (self.target/'harness/core/guide.md').read_text(encoding='utf-8'))

    def test_update_rollback_remove_reinstall(self):
        self.install_fixture()
        original = snapshot(self.target)
        v2 = self.v2()
        self.apply_fixture(preflight(self.target, self.v1, v2))
        self.record_fixture(v2)
        verify(self.target, v2)
        self.assertTrue((self.target/'harness/core/extra.md').exists())
        self.assertFalse((self.target/'harness/core/templates/worklog.md').exists())
        self.apply_fixture(preflight(self.target, v2, self.v1))
        self.record_fixture(self.v1)
        verify(self.target, self.v1)
        self.assertFalse((self.target/'harness/core/extra.md').exists())
        for name, data in original.items():
            if name != 'harness/install.json':
                self.assertEqual(data, safe_path(self.target, name).read_bytes())
        plan = preflight(self.target, self.v1)
        # Manual removal of reviewed references, preserving original instructions.
        put(self.target, 'AGENTS.md', b'# Existing project instructions\n')
        put(self.target, 'harness/project/config.md', b'# Project commands remain\n')
        put(self.target, 'harness/project/skill-profile.md', b'# Upstream remains\n')
        put(self.target, 'harness/ledger.md', b'# Project ledger remains\n')
        self.apply_fixture(plan)
        (self.target/'harness/install.json').unlink()
        links(self.target)
        self.assertFalse(core_inventory(self.target))
        preserved = snapshot(self.target)
        self.install_fixture()
        for name, data in preserved.items():
            if name != 'AGENTS.md':
                self.assertEqual(data, safe_path(self.target, name).read_bytes())
        self.assertEqual((self.target/'AGENTS.md').read_bytes().count(b'## '), 1)

    def test_modified_missing_unknown_stop_without_writes(self):
        self.install_fixture()
        baseline = snapshot(self.target)
        for name, value in [('harness/core/guide.md', b'edit'), ('harness/core/guide.md', None), ('harness/core/unknown.md', b'unknown')]:
            with self.subTest(name=name, value=value):
                if value is None:
                    (self.target/name).unlink()
                else:
                    put(self.target, name, value)
                before = snapshot(self.target)
                with self.assertRaises((ValueError, OSError)):
                    preflight(self.target, self.v1, self.v1)
                self.assertEqual(before, snapshot(self.target))
                if name in baseline:
                    put(self.target, name, baseline[name])
                else:
                    (self.target/name).unlink()

    def test_record_corruption(self):
        self.install_fixture()
        for field, value in [('schema_version', 2), ('schema_version', True), ('schema_version', 1.0), ('managed_files', []), ('manifest_sha256', '0'*64), ('hash_format', 'other'), ('installed_at', 'bad')]:
            with self.subTest(field=field):
                r = self.v1.record()
                r[field] = value
                put(self.target, 'harness/install.json', json.dumps(r).encode())
                before = snapshot(self.target)
                with self.assertRaises(ValueError):
                    preflight(self.target, self.v1, self.v1)
                self.assertEqual(before, snapshot(self.target))
        for data in (b'{', b'{"schema_version":1,"schema_version":1}'):
            put(self.target, 'harness/install.json', data)
            with self.assertRaises(ValueError):
                verify(self.target, self.v1)
        r=self.v1.record(); r['managed_files'][0]['sha256']='0'*64
        put(self.target, 'harness/install.json', json.dumps(r).encode())
        with self.assertRaises(ValueError):
            verify(self.target, self.v1)

    def test_hash_contract(self):
        expected = hashlib.sha256(b'a\nb\n').hexdigest()
        for data in (b'a\nb\n', b'a\r\nb\r\n', b'a\rb\r'):
            self.assertEqual(digest(data), expected)
        for data in (b'a\nb', b'a \nb\n', b'A\nb\n'):
            self.assertNotEqual(digest(data), expected)
        for data in (b'\xef\xbb\xbfa', b'\xff'):
            with self.assertRaises(ValueError):
                digest(data)
        self.install_fixture()
        p=self.target/'harness/core/guide.md'; data=p.read_bytes()
        p.write_bytes(data.replace(b'\n', b'\r\n'))
        verify(self.target,self.v1)

    def test_paths(self):
        for name in ('/absolute', '../escape', 'a/../b', 'C:/x', 'a\\b', 'a/*', 'a//b', 'a/CON', 'a./b', 'a:stream', './b'):
            with self.subTest(name=name), self.assertRaises(ValueError):
                safe_path(self.target, name)
        p = self.target/'link'
        try:
            p.symlink_to(self.source, target_is_directory=True)
        except OSError:
            # Windows junctions do not require symbolic-link privilege.
            if __import__('os').name == 'nt':
                subprocess.run(['cmd', '/c', 'mklink', '/J', str(p), str(self.source)], check=True, capture_output=True)
            else:
                raise
        try:
            with self.assertRaises(ValueError):
                safe_path(self.target, 'link/distribution/manifest.json')
        finally:
            if p.is_symlink():
                p.unlink()
            else:
                p.rmdir()

    def test_manifest_faults(self):
        original=(self.source/MANIFEST).read_bytes()
        cases=[]
        m=copy.deepcopy(self.v1.manifest); m['schema_version']=2; cases.append(m)
        m=copy.deepcopy(self.v1.manifest); m['files'].append(m['files'][0]); cases.append(m)
        m=copy.deepcopy(self.v1.manifest); m['files'][1]['target']=m['files'][0]['target'].upper(); cases.append(m)
        m=copy.deepcopy(self.v1.manifest); m['files'][0]['target']='../outside'; cases.append(m)
        m=copy.deepcopy(self.v1.manifest); m['files'][0]['target']='harness/state/x.md'; cases.append(m)
        for m in cases:
            put(self.source,MANIFEST,json.dumps(m).encode())
            with self.assertRaises(ValueError):
                self.commit()
        put(self.source,MANIFEST,original)
        put(self.source,'distribution/unlisted.md',b'not allowed')
        with self.assertRaises(ValueError):
            self.commit()

    def test_unknown_new_destination_parent(self):
        self.install_fixture()
        v2=self.v2()
        (self.target/'harness/core/extra.md').mkdir()
        before=snapshot(self.target)
        with self.assertRaises(ValueError):
            preflight(self.target,self.v1,v2)
        self.assertEqual(before,snapshot(self.target))

    def test_pilot_explicit_migration(self):
        self.install_fixture()
        (self.target/'harness/install.json').unlink()
        put(self.target,'harness/core/policy/requirements.md',b'Pilot constraint + local check details\n')
        before=snapshot(self.target)
        with self.assertRaises(ValueError):
            preflight(self.target,desired=self.v1)
        self.assertEqual(before,snapshot(self.target))
        # Explicit, enumerated pilot transformation, independently checked afterwards.
        config=before['harness/project/config.md']+b'\nPilot constraint + local check details\n'
        put(self.target,'harness/project/config.md',config)
        put(self.target,'harness/core/policy/requirements.md',self.v1.contents['distribution/core/policy/requirements.md'])
        self.record_fixture(self.v1)
        verify(self.target,self.v1)
        for name,data in before.items():
            if name not in ('harness/project/config.md','harness/core/policy/requirements.md'):
                self.assertEqual(data,safe_path(self.target,name).read_bytes())

    def test_interruption_recovery_and_concurrent_edit(self):
        self.install_fixture()
        baseline=snapshot(self.target)
        v2=self.v2(); plan=preflight(self.target,self.v1,v2)
        changed=plan[:2]
        self.apply_fixture(changed)  # Inject interruption before remaining files/record.
        with self.assertRaises(ValueError):
            verify(self.target,self.v1)
        reverse=[(name,after,before) for name,before,after in reversed(changed)]
        self.apply_fixture(reverse)
        self.assertEqual(baseline,snapshot(self.target))
        verify(self.target,self.v1)
        self.apply_fixture(plan); self.record_fixture(v2); verify(self.target,v2)
        # Recovery after another writer changed a touched file must stop.
        put(self.target,plan[0][0],b'parallel edit')
        before=snapshot(self.target)
        with self.assertRaises(ValueError):
            self.apply_fixture([(plan[0][0],plan[0][2],plan[0][1])])
        self.assertEqual(before,snapshot(self.target))


if __name__ == '__main__':
    unittest.main()
