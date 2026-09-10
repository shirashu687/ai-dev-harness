// Read-only distribution checks. Writes belong to reviewed manual operations.
'use strict';
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const { createHash } = require('node:crypto');
const { isDeepStrictEqual } = require('node:util');

const FORMAT = 'sha256-canonical-text-v1';
const MANIFEST = 'distribution/manifest.json';
const REPOSITORY = 'https://github.com/shirashu687/ai-dev-harness.git';
const decoder = new TextDecoder('utf-8', { fatal: true, ignoreBOM: true });
function canonical(data) {
  if (data.subarray(0, 3).equals(Buffer.from([0xef, 0xbb, 0xbf]))) throw Error('BOM');
  return Buffer.from(decoder.decode(data).replace(/\r\n?/g, '\n'), 'utf8');
}
function digest(data) { return createHash('sha256').update(canonical(data)).digest('hex'); }

// JSON.parse alone silently discards duplicate keys. Parse each object before
// that information is lost, including escaped spellings of the same key.
function parse_json(data) {
  const text = canonical(data).toString('utf8');
  let at = 0;
  const ws = () => { while (/[\t\n\r ]/.test(text[at] || '\0')) at++; };
  function string() {
    const start = at++;
    while (at < text.length) {
      if (text[at] === '\\') { at += 2; continue; }
      if (text[at++] === '"') return JSON.parse(text.slice(start, at));
    }
    throw Error('unterminated JSON string');
  }
  function value() {
    ws();
    if (text[at] === '"') return string();
    if (text[at] === '{') {
      at++; ws();
      const result = {};
      const keys = new Set();
      if (text[at] === '}') { at++; return result; }
      for (;;) {
        ws();
        if (text[at] !== '"') throw Error('JSON key required');
        const key = string();
        if (keys.has(key)) throw Error('duplicate JSON key');
        keys.add(key); ws();
        if (text[at++] !== ':') throw Error('JSON colon required');
        ws(); const start = at;
        const item = value();
        // Preserve Python's distinction between an integer schema and 1.0/1e0.
        if (key === 'schema_version' && !/^-?\d+$/.test(text.slice(start, at))) throw Error('integer schema required');
        Object.defineProperty(result, key, { value: item, enumerable: true, writable: true, configurable: true });
        ws(); const end = text[at++];
        if (end === '}') return result;
        if (end !== ',') throw Error('JSON comma required');
      }
    }
    if (text[at] === '[') {
      at++; ws(); const result = [];
      if (text[at] === ']') { at++; return result; }
      for (;;) {
        result.push(value()); ws(); const end = text[at++];
        if (end === ']') return result;
        if (end !== ',') throw Error('JSON comma required');
      }
    }
    const token = /^(?:true|false|null|-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?)/.exec(text.slice(at));
    if (!token) throw Error('invalid JSON value');
    at += token[0].length;
    const result = JSON.parse(token[0]);
    if (typeof result === 'number' && !Number.isFinite(result)) throw Error('non-finite JSON number');
    return result;
  }
  const result = value(); ws();
  if (at !== text.length) throw Error('trailing JSON content');
  return result;
}

function stat_if_present(name) {
  try { return fs.lstatSync(name); }
  catch (error) { if (error.code === 'ENOENT') return null; throw error; }
}
function safe_path(root, relative) {
  if (typeof relative !== 'string' || !relative) throw Error('empty path');
  const parts = relative.split('/');
  if (parts.some(p => !p || p === '.' || p === '..' || /[ .]$/.test(p))) throw Error('non-canonical path');
  if (/[\\:*?\[\]<>|\x00-\x1f]/.test(relative)) throw Error('unsafe path');
  if (parts.some(p => /^(CON|PRN|AUX|NUL|COM[1-9]|LPT[1-9])(\..*)?$/i.test(p))) throw Error('reserved path');
  root = path.resolve(root);
  const result = path.join(root, ...parts);
  for (let p = result; ; p = path.dirname(p)) {
    if (stat_if_present(p)?.isSymbolicLink()) throw Error('symlink/junction');
    if (p === path.dirname(p)) break;
  }
  const resolved = path.relative(root, result);
  if (resolved === '..' || resolved.startsWith('..' + path.sep) || path.isAbsolute(resolved)) throw Error('outside root');
  return result;
}
function git(root, ...args) {
  return execFileSync('git', ['-c', 'core.autocrlf=false', '-c', 'core.quotePath=false', '-C', root, ...args],
    { stdio: ['ignore', 'pipe', 'pipe'], maxBuffer: 32 * 1024 * 1024, windowsHide: true });
}
const object = v => v !== null && typeof v === 'object' && !Array.isArray(v);
// Conservative Unicode caseless comparison, also catching sharp-s and sigma.
const caseless = s => s.toUpperCase().toLowerCase();
class Distribution {
  constructor(root, commit, repository = REPOSITORY) {
    if (typeof commit !== 'string' || !/^[0-9a-f]{40}$/.test(commit)) throw Error('full SHA required');
    if (typeof repository !== 'string' || !/^https:\/\/github\.com\/[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+(?:\.git)?$/.test(repository)) throw Error('GitHub source required');
    this.root = path.resolve(root); this.commit = commit; this.repository = repository;
    if (git(this.root, 'rev-parse', commit + '^{commit}').toString().trim() !== commit) throw Error('not a commit');
    this.manifest_bytes = this.blob(MANIFEST);
    this.manifest = parse_json(this.manifest_bytes);
    const m = this.manifest;
    if (!object(m) || m.schema_version !== 1 || m.hash_format !== FORMAT) throw Error('unknown manifest format');
    if (!Array.isArray(m.files) || !m.files.length) throw Error('empty manifest');
    const sources = new Set(), targets = new Set();
    this.contents = {};
    for (const row of m.files) {
      if (!object(row) || Object.keys(row).sort().join(',') !== 'mode,source,target') throw Error('invalid manifest row');
      const { source, target, mode } = row;
      safe_path(this.root, source); safe_path(this.root, target);
      if (!['core', 'seed', 'manual'].includes(mode)) throw Error('mode');
      if (!source.startsWith('distribution/') || source === MANIFEST) throw Error('source scope');
      if (mode === 'core' && (!source.startsWith('distribution/core/') || !target.startsWith('harness/core/'))) throw Error('core scope');
      if (mode === 'seed' && !['harness/project/config.md', 'harness/project/skill-profile.md', 'harness/ledger.md'].includes(target)) throw Error('seed scope');
      if (mode === 'manual' && !['AGENTS.md', 'CLAUDE.md'].includes(target)) throw Error('manual scope');
      if (sources.has(caseless(source)) || targets.has(caseless(target))) throw Error('duplicate/case collision');
      sources.add(caseless(source)); targets.add(caseless(target));
      this.contents[source] = this.blob(source); canonical(this.contents[source]);
    }
    const listed = new Set([...m.files.map(r => r.source), MANIFEST]);
    const actual = new Set(git(this.root, 'ls-tree', '-r', '-z', '--name-only', commit, '--', 'distribution').toString('utf8').split('\0').filter(Boolean));
    if (!isDeepStrictEqual(actual, listed)) throw Error('unlisted or missing distribution file');
    for (const paths of [sources, targets]) {
      for (const a of paths) for (const b of paths) {
        if (a !== b && b.startsWith(a + '/')) throw Error('file/parent collision');
      }
    }
  }
  blob(name) {
    safe_path(this.root, name);
    const entry = git(this.root, 'ls-tree', this.commit, '--', name).toString();
    if (!/^(100644|100755) blob /.test(entry)) throw Error('non-regular blob');
    return git(this.root, 'show', this.commit + ':' + name);
  }
  managed() {
    return this.manifest.files.filter(r => r.mode === 'core').map(r => ({ source: r.source, target: r.target, sha256: digest(this.contents[r.source]) }));
  }
  record(installed_at = new Date().toISOString()) {
    return { schema_version: 1, hash_format: FORMAT,
      source: { repository: this.repository, commit: this.commit, manifest: MANIFEST },
      manifest_sha256: digest(this.manifest_bytes), installed_at, managed_files: this.managed() };
  }
}

function core_inventory(target) {
  const core = safe_path(target, 'harness/core');
  const found = new Set();
  function walk(relative) {
    const p = safe_path(target, relative), stat = fs.lstatSync(p);
    if (stat.isDirectory()) {
      for (const name of fs.readdirSync(p)) walk(relative + '/' + name);
    } else if (stat.isFile()) found.add(relative);
    else throw Error('non-regular core file');
  }
  if (stat_if_present(core)) {
    if (!fs.statSync(core).isDirectory()) throw Error('core is not a directory');
    walk('harness/core');
  }
  return found;
}
function utc_timestamp(stamp) {
  // Accept both runtimes' UTC ISO output, including Python microseconds.
  const m = typeof stamp === 'string' && /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.\d+)?Z$/.exec(stamp);
  if (!m || +m[1] < 1 || +m[4] > 23 || +m[5] > 59 || +m[6] > 59) throw Error('UTC timestamp required');
  const date = new Date(stamp);
  if (!Number.isFinite(date.getTime()) || date.toISOString().slice(0, 19) !== stamp.slice(0, 19)) throw Error('invalid UTC timestamp');
}
function verify(target, source) {
  const record = parse_json(fs.readFileSync(safe_path(target, 'harness/install.json')));
  if (!object(record) || record.schema_version !== 1) throw Error('unknown record schema');
  utc_timestamp(record.installed_at);
  if (!isDeepStrictEqual(record, source.record(record.installed_at))) throw Error('record differs from immutable source');
  if (!isDeepStrictEqual(core_inventory(target), new Set(source.managed().map(r => r.target)))) throw Error('unknown or missing core file');
  for (const row of source.managed()) {
    if (digest(fs.readFileSync(safe_path(target, row.target))) !== row.sha256) throw Error('modified core: ' + row.target);
  }
  return record;
}
function preflight(target, current = null, desired = null) {
  const record_path = safe_path(target, 'harness/install.json');
  if (current) verify(target, current);
  else if (stat_if_present(record_path) || core_inventory(target).size) throw Error('existing core/record requires explicit migration');
  function destination(name) {
    const p = safe_path(target, name), stat = stat_if_present(p);
    if (stat && !stat.isFile()) throw Error('destination is not a regular file');
    for (let parent = path.dirname(p); ; parent = path.dirname(parent)) {
      const s = stat_if_present(parent);
      if (s && !s.isDirectory()) throw Error('parent is a file');
      if (parent === path.dirname(parent)) break;
    }
    return p;
  }
  if (desired) for (const row of desired.manifest.files) destination(row.target);
  const before = new Map(current ? current.managed().map(r => [r.target, current.contents[r.source]]) : []);
  const after = new Map(desired ? desired.managed().map(r => [r.target, desired.contents[r.source]]) : []);
  return [...new Set([...before.keys(), ...after.keys()])].sort().map(name => {
    const p = destination(name), exists = !!stat_if_present(p);
    if (!before.has(name) && exists) throw Error('unknown destination');
    return [name, exists ? fs.readFileSync(p) : null, after.get(name) ?? null];
  });
}
function links(target) {
  function walk(directory) {
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      if (entry.name === '.git') continue;
      const p = path.join(directory, entry.name);
      if (entry.isSymbolicLink()) throw Error('symlink/junction');
      if (entry.isDirectory()) walk(p);
      else if (entry.isFile() && entry.name.endsWith('.md')) {
        for (const [, ref] of decoder.decode(fs.readFileSync(p)).matchAll(/\[[^\]]*\]\(([^)]+)\)/g)) {
          if (!ref.includes('://') && !ref.startsWith('#') && !fs.existsSync(path.resolve(directory, ref.split('#')[0]))) throw Error('broken link: ' + p + ': ' + ref);
        }
      }
    }
  }
  walk(path.resolve(target));
}

module.exports = { FORMAT, MANIFEST, REPOSITORY, canonical, digest, parse_json, safe_path, git, Distribution, core_inventory, verify, preflight, links };
