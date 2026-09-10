'use strict';
const { test, beforeEach, afterEach } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const { execFileSync } = require('node:child_process');
const { createHash } = require('node:crypto');
const vm = require('node:vm');
const { Distribution, MANIFEST, canonical, digest, parse_json, safe_path, git, verify, preflight, core_inventory, links } = require('../scripts/distribution.cjs');
const ROOT = path.resolve(__dirname, '..');
if (!!process.env.HARNESS_TEST_SOURCE !== !!process.env.HARNESS_TEST_COMMIT) throw Error('set both HARNESS_TEST_SOURCE and HARNESS_TEST_COMMIT');
const release = process.env.HARNESS_TEST_SOURCE
  ? new Distribution(process.env.HARNESS_TEST_SOURCE, process.env.HARNESS_TEST_COMMIT) : null;
let base, source, target, v1;
function put(root, name, bytes) {
  const p = safe_path(root, name);
  fs.mkdirSync(path.dirname(p), { recursive: true }); fs.writeFileSync(p, bytes);
}
function read(name) { const p = safe_path(target, name); return fs.existsSync(p) ? fs.readFileSync(p) : null; }
function snapshot(root) {
  const result = {};
  function walk(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (entry.name === '.git') continue;
      const p = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(p);
      else if (entry.isFile()) result[path.relative(root, p).split(path.sep).join('/')] = fs.readFileSync(p);
    }
  }
  walk(root); return result;
}
function commit() {
  git(source, 'add', 'distribution');
  git(source, '-c', 'user.name=Fixture', '-c', 'user.email=fixture@example.invalid', 'commit', '--allow-empty', '-m', 'Fixture version');
  return git(source, 'rev-parse', 'HEAD').toString().trim();
}
function apply_fixture(plan) {
  assert.equal(path.dirname(target), base, 'fixture only');
  for (const [name, before, after] of plan) {
    assert.deepEqual(read(name), before, 'concurrent edit');
    if (after === null) fs.unlinkSync(safe_path(target, name));
    else put(target, name, after);
  }
}
function record_fixture(version) { put(target, 'harness/install.json', JSON.stringify(version.record()) + '\n'); }
function install_fixture() {
  apply_fixture(preflight(target, null, v1));
  for (const row of v1.manifest.files) {
    if (row.mode === 'seed' && !fs.existsSync(safe_path(target, row.target))) put(target, row.target, v1.contents[row.source]);
  }
  put(target, 'AGENTS.md', Buffer.concat([read('AGENTS.md'), Buffer.from('\n'), v1.contents['distribution/templates/agents-entry.md']]));
  put(target, 'harness/state/journal/new.md', v1.contents['distribution/core/templates/worklog.md']);
  record_fixture(v1); verify(target, v1);
}
function version2() {
  const m = structuredClone(v1.manifest);
  const removed = m.files.find(r => r.source.endsWith('/worklog.md'));
  m.files = m.files.filter(r => r !== removed);
  fs.unlinkSync(safe_path(source, removed.source));
  m.files.push({ source: 'distribution/core/extra.md', target: 'harness/core/extra.md', mode: 'core' });
  put(source, 'distribution/core/extra.md', 'Added in fixture v2\n');
  put(source, 'distribution/core/guide.md', 'Changed in fixture v2\n');
  put(source, MANIFEST, JSON.stringify(m) + '\n');
  return new Distribution(source, commit());
}
beforeEach(() => {
  base = fs.mkdtempSync(path.join(os.tmpdir(), 'harness-node-'));
  source = path.join(base, 'source'); target = path.join(base, 'target');
  fs.mkdirSync(source); fs.mkdirSync(target);
  git(source, 'init'); git(target, 'init');
  if (release) {
    put(source, MANIFEST, release.manifest_bytes);
    for (const [name, bytes] of Object.entries(release.contents)) put(source, name, bytes);
  } else fs.cpSync(path.join(ROOT, 'distribution'), path.join(source, 'distribution'), { recursive: true });
  v1 = new Distribution(source, commit());
  put(target, 'AGENTS.md', '# Existing project instructions\n');
  put(target, 'harness/state/journal/existing.md', 'Original work\n');
  put(target, '.agents/skills/local/SKILL.md', 'Original upstream\n');
  put(target, 'skills-lock.json', '{"preserved":true}\n');
});
afterEach(() => {
  // Only the exact TemporaryDirectory created above may be removed recursively.
  assert.equal(path.dirname(base), path.resolve(os.tmpdir()));
  assert.ok(path.basename(base).startsWith('harness-node-'));
  fs.rmSync(base, { recursive: true, force: true });
});

test('distribution boundary and immutable source despite a dirty checkout', () => {
  assert.equal(v1.manifest.files.length, 11); assert.equal(v1.managed().length, 6);
  for (const bytes of Object.values(v1.contents)) {
    const text = canonical(bytes).toString();
    for (const forbidden of ['C:/Users/', 'okf-devkit', 'check_changes.py', 'tests/run_all.py', '.venv/', '25スキル']) assert.ok(!text.includes(forbidden));
    assert.ok(!text.startsWith('---'));
  }
  put(source, 'distribution/core/guide.md', 'dirty checkout');
  assert.deepEqual(new Distribution(source, v1.commit).contents, v1.contents);
  assert.throws(() => new Distribution(source, 'HEAD'), /full SHA/);
  assert.throws(() => new Distribution(source, v1.commit, source), /GitHub source/);
});
test('install, repeat and links preserve project-owned files', () => {
  install_fixture(); links(target);
  const before = snapshot(target);
  preflight(target, v1, v1); verify(target, v1);
  assert.deepEqual(snapshot(target), before);
  assert.ok(!fs.existsSync(path.join(target, 'HARNESS_SPEC.md')));
  assert.match(read('harness/project/skill-profile.md').toString(), /初期状態はなし/);
  assert.ok(!read('harness/core/guide.md').toString().includes('.agents/skills/'));
});
test('update, rollback, remove and reinstall preserve owned data', () => {
  install_fixture(); const original = snapshot(target); const v2 = version2();
  apply_fixture(preflight(target, v1, v2)); record_fixture(v2); verify(target, v2);
  assert.ok(read('harness/core/extra.md')); assert.equal(read('harness/core/templates/worklog.md'), null);
  apply_fixture(preflight(target, v2, v1)); record_fixture(v1); verify(target, v1);
  assert.equal(read('harness/core/extra.md'), null);
  for (const [name, bytes] of Object.entries(original)) if (name !== 'harness/install.json') assert.deepEqual(read(name), bytes);
  const plan = preflight(target, v1);
  put(target, 'AGENTS.md', '# Existing project instructions\n');
  put(target, 'harness/project/config.md', '# Project commands remain\n');
  put(target, 'harness/project/skill-profile.md', '# Upstream remains\n');
  put(target, 'harness/ledger.md', '# Project ledger remains\n');
  apply_fixture(plan); fs.unlinkSync(safe_path(target, 'harness/install.json'));
  links(target); assert.equal(core_inventory(target).size, 0);
  const preserved = snapshot(target); install_fixture();
  for (const [name, bytes] of Object.entries(preserved)) if (name !== 'AGENTS.md') assert.deepEqual(read(name), bytes);
  assert.equal(read('AGENTS.md').toString().split('## ').length - 1, 1);
});
test('modified, missing and unknown files stop without writes', () => {
  install_fixture(); const baseline = snapshot(target);
  for (const [name, value] of [['harness/core/guide.md', 'edit'], ['harness/core/guide.md', null], ['harness/core/unknown.md', 'unknown']]) {
    if (value === null) fs.unlinkSync(safe_path(target, name)); else put(target, name, value);
    const before = snapshot(target); assert.throws(() => preflight(target, v1, v1));
    assert.deepEqual(snapshot(target), before);
    if (baseline[name]) put(target, name, baseline[name]); else fs.unlinkSync(safe_path(target, name));
  }
});
test('corrupt records, invalid dates and duplicate keys are rejected', () => {
  install_fixture();
  for (const [field, value] of [['schema_version', 2], ['schema_version', true], ['managed_files', []], ['manifest_sha256', '0'.repeat(64)], ['hash_format', 'other'], ['installed_at', 'bad'], ['installed_at', '2026-02-30T00:00:00Z']]) {
    const r = v1.record(); r[field] = value; put(target, 'harness/install.json', JSON.stringify(r));
    const before = snapshot(target); assert.throws(() => preflight(target, v1, v1)); assert.deepEqual(snapshot(target), before);
  }
  for (const data of ['{', '{"schema_version":1,"schema_version":1}', JSON.stringify(v1.record()).replace('"schema_version":1', '"schema_version":1.0')]) {
    put(target, 'harness/install.json', data); assert.throws(() => verify(target, v1));
  }
  const r = v1.record(); r.managed_files[0].sha256 = '0'.repeat(64);
  put(target, 'harness/install.json', JSON.stringify(r)); assert.throws(() => verify(target, v1));
});
test('JSON parsing keeps nested duplicate detection and rejects invalid syntax', () => {
  for (const text of ['{"a":1,"\\u0061":2}', '{"a":{"x":1,"x":2}}', '[1,]', '{"x":1,}', '01', 'true false', '"bad\nstring"', '{"schema_version":1e0}']) assert.throws(() => parse_json(Buffer.from(text)));
  assert.deepEqual(parse_json(Buffer.from('{"a":[null,true,false,1.5,-2e3,"日本語\\n"]}')), { a: [null, true, false, 1.5, -2000, '日本語\n'] });
  assert.ok(Object.hasOwn(parse_json(Buffer.from('{"__proto__":42}')), '__proto__'));
});
test('canonical hash contract and CRLF installation', () => {
  const expected = createHash('sha256').update('a\nb\n').digest('hex');
  for (const text of ['a\nb\n', 'a\r\nb\r\n', 'a\rb\r']) assert.equal(digest(Buffer.from(text)), expected);
  for (const text of ['a\nb', 'a \nb\n', 'A\nb\n']) assert.notEqual(digest(Buffer.from(text)), expected);
  for (const bytes of [Buffer.from([0xef, 0xbb, 0xbf, 97]), Buffer.from([255]), Buffer.from([0xc0, 0xaf])]) assert.throws(() => digest(bytes));
  install_fixture(); put(target, 'harness/core/guide.md', read('harness/core/guide.md').toString().replace(/\n/g, '\r\n')); verify(target, v1);
  const plan = preflight(target, v1, v1);
  assert.deepEqual(plan.find(r => r[0] === 'harness/core/guide.md')[1], read('harness/core/guide.md'));
});
test('unsafe paths and junctions are rejected including ancestor roots', () => {
  for (const name of ['/absolute', '../escape', 'a/../b', 'C:/x', 'a\\b', 'a/*', 'a//b', 'a/CON', 'a./b', 'a:stream', './b', 'a/NUL.txt', 'a/b ', 'a/?.md']) assert.throws(() => safe_path(target, name));
  const link = path.join(target, 'link');
  fs.symlinkSync(source, link, process.platform === 'win32' ? 'junction' : 'dir');
  try {
    assert.throws(() => safe_path(target, 'link/distribution/manifest.json'), /symlink/);
    assert.throws(() => safe_path(link, 'distribution/manifest.json'), /symlink/);
  } finally { fs.unlinkSync(link); }
});
test('manifest schema, collisions, scope and unlisted files are rejected', () => {
  const faults = [m => { m.schema_version = 2; }, m => { m.files.push(m.files[0]); },
    m => { m.files[1].target = m.files[0].target.toUpperCase(); },
    m => { m.files[0].target = '../outside'; }, m => { m.files[0].target = 'harness/state/x.md'; },
    m => { m.files[0].target = 'harness/core/policy'; }, m => { m.files[0].extra = true; },
    m => { m.files[6].target = 'harness/core/seed.md'; }, m => { m.files[9].target = 'README.md'; }];
  for (const fault of faults) {
    const m = structuredClone(v1.manifest); fault(m); put(source, MANIFEST, JSON.stringify(m));
    const sha = commit(); assert.throws(() => new Distribution(source, sha));
  }
  put(source, MANIFEST, v1.manifest_bytes); put(source, 'distribution/unlisted.md', 'not allowed');
  const sha = commit(); assert.throws(() => new Distribution(source, sha), /unlisted/);
});
test('non-regular Git blobs are rejected', () => {
  const name = 'distribution/core/guide.md';
  const oid = git(source, 'rev-parse', v1.commit + ':' + name).toString().trim();
  git(source, 'update-index', '--cacheinfo', '120000,' + oid + ',' + name);
  git(source, '-c', 'user.name=Fixture', '-c', 'user.email=fixture@example.invalid', 'commit', '-m', 'Symlink fixture');
  const sha = git(source, 'rev-parse', 'HEAD').toString().trim();
  assert.throws(() => new Distribution(source, sha), /non-regular blob/);
});
test('unknown destination directories and file parents stop before any writes', () => {
  install_fixture(); const v2 = version2();
  fs.mkdirSync(safe_path(target, 'harness/core/extra.md'));
  const before = snapshot(target); assert.throws(() => preflight(target, v1, v2)); assert.deepEqual(snapshot(target), before);
  fs.rmdirSync(safe_path(target, 'harness/core/extra.md'));
  fs.unlinkSync(safe_path(target, 'harness/project/config.md')); fs.mkdirSync(safe_path(target, 'harness/project/config.md'));
  assert.throws(() => preflight(target, v1, v2));
});
test('pilot needs explicit migration and keeps local constraints', () => {
  install_fixture(); fs.unlinkSync(safe_path(target, 'harness/install.json'));
  put(target, 'harness/core/policy/requirements.md', 'Pilot constraint + local check details\n');
  const before = snapshot(target); assert.throws(() => preflight(target, null, v1)); assert.deepEqual(snapshot(target), before);
  put(target, 'harness/project/config.md', Buffer.concat([before['harness/project/config.md'], Buffer.from('\nPilot constraint + local check details\n')]));
  put(target, 'harness/core/policy/requirements.md', v1.contents['distribution/core/policy/requirements.md']);
  record_fixture(v1); verify(target, v1);
  for (const [name, bytes] of Object.entries(before)) if (!['harness/project/config.md', 'harness/core/policy/requirements.md'].includes(name)) assert.deepEqual(read(name), bytes);
});
test('interruption, recovery, retry and concurrent edit', () => {
  install_fixture(); const baseline = snapshot(target); const v2 = version2(); const plan = preflight(target, v1, v2);
  const changed = plan.slice(0, 2); apply_fixture(changed); assert.throws(() => verify(target, v1));
  const reverse = changed.toReversed().map(([name, before, after]) => [name, after, before]);
  apply_fixture(reverse); assert.deepEqual(snapshot(target), baseline); verify(target, v1);
  apply_fixture(plan); record_fixture(v2); verify(target, v2);
  put(target, plan[0][0], 'parallel edit'); const before = snapshot(target);
  assert.throws(() => apply_fixture([[plan[0][0], plan[0][2], plan[0][1]]])); assert.deepEqual(snapshot(target), before);
});
test('documented Node snippets install, update, recover and reject recovery conflicts', () => {
  const doc = fs.readFileSync(path.join(ROOT, 'docs/project/harness-distribution-node.md'), 'utf8');
  const snippets = [...doc.matchAll(/```javascript\r?\n([\s\S]*?)```/g)].map(m => m[1]);
  assert.equal(snippets.length, 6);
  const values = { '<配布版cloneの絶対パス>': source, '<導入先Gitルートの絶対パス>': target,
    '<照合器cloneの絶対パス>': ROOT, '<配布版の40桁SHA>': v1.commit,
    '<対象外の新しい退避JSON絶対パス>': path.join(base, 'before.json'),
    '<対象外の新しい反映直後JSON絶対パス>': path.join(base, 'applied.json') };
  const context = vm.createContext({ require, Buffer, Set, console: { log() {} } });
  const run = code => {
    for (const [token, value] of Object.entries(values)) code = code.replaceAll(token, value.split(path.sep).join('/'));
    return vm.runInContext(code, context);
  };
  const baseline = snapshot(target);
  run(snippets[0]);
  run('var current = null; var plan = preflight(target, null, desired);');
  const backupCode = snippets[1].replace("['harness/install.json']", "['harness/install.json', 'AGENTS.md', ...desired.manifest.files.filter(r => r.mode === 'seed').map(r => r.target)]");
  run(backupCode); run(snippets[2]); run(snippets[3]);
  run("writeChange('AGENTS.md', before['AGENTS.md'], Buffer.concat([before['AGENTS.md'], Buffer.from('\\n'), desired.contents['distribution/templates/agents-entry.md']]));");
  run(snippets[4]); verify(target, v1);
  run(snippets[5]); assert.deepEqual(snapshot(target), baseline);
  // Create another installation, then exercise the same documented recovery
  // with an update interrupted after two paths and a concurrent edit.
  install_fixture(); const installed = snapshot(target); const v2 = version2();
  context.old_sha = v1.commit; context.next_sha = v2.commit;
  run('var current = new Distribution(source, old_sha); var desired = new Distribution(source, next_sha); var plan = preflight(target, current, desired);');
  values['<対象外の新しい退避JSON絶対パス>'] = path.join(base, 'update-before.json');
  values['<対象外の新しい反映直後JSON絶対パス>'] = path.join(base, 'update-applied.json');
  run(backupCode);
  run(snippets[2].replace('of plan)', 'of plan.slice(0, 2))'));
  const touched = run('plan[0][0]'); const appliedBytes = read(touched);
  put(target, touched, 'concurrent edit'); const conflict = snapshot(target);
  assert.throws(() => run(snippets[5]), /recovery conflict/); assert.deepEqual(snapshot(target), conflict);
  put(target, touched, appliedBytes); run(snippets[5]); assert.deepEqual(snapshot(target), installed); verify(target, v1);
});
test('Python and Node records interoperate in both directions (optional)', { skip: !process.env.HARNESS_TEST_PYTHON }, () => {
  install_fixture();
  const script = `import json, runpy, sys\nfrom pathlib import Path\nc=runpy.run_path(sys.argv[1])\nd=c['Distribution'](Path(sys.argv[2]),sys.argv[3])\nc['verify'](Path(sys.argv[4]),d)\nprint(json.dumps(d.record('2026-09-10T01:02:03.123456Z')))\n`;
  const bytes = execFileSync(process.env.HARNESS_TEST_PYTHON, ['-B', '-c', script, path.join(ROOT, 'tests/test_distribution.py'), source, v1.commit, target], { windowsHide: true });
  const record = parse_json(bytes);
  assert.deepEqual(record, v1.record('2026-09-10T01:02:03.123456Z'));
  put(target, 'harness/install.json', bytes); verify(target, v1);
});
