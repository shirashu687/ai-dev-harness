---
type: How-To
title: Pythonなしで共通ハーネスを導入・保守する
description: Node.js標準ライブラリで固定配布版を照合し、退避・導入・更新・巻戻し・撤去・復旧を行う操作例。
tags: [harness, distribution, nodejs]
status: stable
layer: shared
generated:
  by: codex/gpt-6
  at: "2026-09-10T14:19:00Z"
code_globs: ["scripts/distribution.cjs", "tests/test_distribution.cjs", "distribution/**"]
related: ["/project/harness-distribution.md", "/backlog/T-0018-python-node-js.md"]
---

# Pythonなしで共通ハーネスを導入・保守する

Node.js 22以上とGitを使用する。npmパッケージの追加は不要。シェル例はPowerShell、ファイル操作例はNode.jsの対話環境で実行する。Windows以外では同じ値を各シェルから渡す。PowerShellだけで動く実装ではない。

共通の判断・順序は [導入と保守](/project/harness-distribution.md) の各節に従う。本書はそのPythonコードを置き換える操作例である。特にconfigの必須検証、既存入口の手動接続、通知の保持、検証失敗時の停止を省略しない。対象アプリがPythonを必要とする場合、その依存まで取り除くものではない。

## 1. 固定版と照合器の準備

共通手順§0で現在版・目的版、出所、検証根拠とライセンスを確認する。Node.js照合器が配布版に含まれる場合は同じcheckoutを使う。含まれない旧配布版では、Node.js照合器と本書を含む別の固定SHAを取得し、出所・SHA・以下の互換検証をworklogに記録する。契約は `HARNESS_SPEC.md` §9.1.4。未コミットのコードを公開済みの固定版とは扱わない。

```powershell
$taskRepository = 'https://github.com/shirashu687/ai-dev-harness.git'
$taskCommit = '<配布版の40桁SHA>'
$taskSource = '<配布版cloneの絶対パス>'
$taskTarget = '<導入先Gitルートの絶対パス>'
$taskCheckerCommit = '<Node.js照合器を含む40桁SHA。同版ならtaskCommitと同じ>'
$taskChecker = '<照合器cloneの絶対パス。同版ならtaskSourceと同じ>'
node --version
if ($LASTEXITCODE -ne 0) { throw 'Node.js required' }
git clone --no-checkout $taskRepository $taskSource
if ($LASTEXITCODE -ne 0) { throw 'clone failed' }
git -C $taskSource checkout --detach $taskCommit
if ($LASTEXITCODE -ne 0) { throw 'checkout failed' }
if ($taskChecker -ne $taskSource) {
    git clone --no-checkout $taskRepository $taskChecker
    if ($LASTEXITCODE -ne 0) { throw 'checker clone failed' }
    git -C $taskChecker checkout --detach $taskCheckerCommit
    if ($LASTEXITCODE -ne 0) { throw 'checker checkout failed' }
}
if ((git -C $taskSource rev-parse HEAD) -ne $taskCommit) { throw 'release SHA mismatch' }
if ((git -C $taskChecker rev-parse HEAD) -ne $taskCheckerCommit) { throw 'checker SHA mismatch' }
git -C $taskSource status --short
git -C $taskChecker status --short
git -C $taskTarget rev-parse HEAD
git -C $taskTarget status --short
# 照合器のコードを確認し、checkoutに差分がないことを確認してから実行する。
$env:HARNESS_TEST_SOURCE = $taskSource
$env:HARNESS_TEST_COMMIT = $taskCommit
node --test "$taskChecker/tests/test_distribution.cjs"
if ($LASTEXITCODE -ne 0) { throw 'distribution tests failed' }
Remove-Item Env:HARNESS_TEST_SOURCE, Env:HARNESS_TEST_COMMIT
node
```

テストは指定SHAのGit blobから一時fixtureを作る。通常はPython相互照合1件だけskipされ、その他が成功することを確認する。配布物がこの照合器の対応範囲にない場合はテスト失敗で止まる。

以後のJavaScriptは同じNode.js対話内で、一操作ずつ確認して実行する。パスには `/` を使える。

```javascript
var fs = require('node:fs');
var path = require('node:path');
var assert = require('node:assert/strict');
var source = '<配布版cloneの絶対パス>';
var target = '<導入先Gitルートの絶対パス>';
var checker = '<照合器cloneの絶対パス>';
var sha = '<配布版の40桁SHA>';
var check = require(path.join(checker, 'scripts/distribution.cjs'));
var { Distribution, verify, preflight, safe_path, core_inventory, digest, links } = check;
var desired = new Distribution(source, sha);
var read = n => {
  var p = safe_path(target, n);
  return fs.existsSync(p) ? fs.readFileSync(p) : null;
};
console.log(desired.manifest);
console.log(desired.record()); // 確認用。まだ保存しない。
```

照合器は配布データを固定コミットから読む。ハッシュと記録の契約は `HARNESS_SPEC.md` §9.1.3。Python版で作った記録も読み取れ、Node.js版で作った記録もPython版で照合できる。日時はUTCで、Pythonのマイクロ秒表記も受け入れる。

## 2. 操作ごとの計画

次の表から**今回の操作1つだけ**を選ぶ。`old_sha` は導入記録の出所を確認して取得した現在版の完全SHA。別コミットがsource内にない場合は同じ正式配布元から取得して確認しておく。

| 操作 | 同じ対話内で実行する式 |
| --- | --- |
| 新規導入 | `var current = null; var plan = preflight(target, null, desired);` |
| 同版の再確認 | `verify(target, desired);`。入口・必須設定・通知も照合し、変更なしで終了する |
| 更新 | `var current = new Distribution(source, old_sha); var plan = preflight(target, current, desired);` |
| 巻戻し | `desired = new Distribution(source, rollback_sha); var current = new Distribution(source, old_sha); var plan = preflight(target, current, desired);` |
| 撤去 | `var current = new Distribution(source, old_sha); var plan = preflight(target, current);` |

記録なしの既存pilotは新規扱いにしない。共通手順§4で明示した移行計画を作り、既存コアと固有情報の移設を個別に照合する。

## 3. 退避と反映

共通手順§2のとおり、変更パス、既存差分、退避先、操作前SHA、復旧方法を作業記録へ残す。`extra` には今回変更する入口・seed・設定・通知・記録を全件列挙する。新規seedは既存なら保持する。`backup` と `appliedFile` は対象リポジトリ外の新しいファイルを指定する。

```javascript
console.log(plan.map(([n, old, next]) => [n, next === null ? 'delete' : old === null ? 'add' : 'compare/update']));
var extra = ['harness/install.json']; // 今回の手動変更対象と不足seedを追加する。
var names = [...new Set([...plan.map(r => r[0]), ...extra])].sort();
var before = Object.fromEntries(names.map(n => [n, read(n)]));
var backup = '<対象外の新しい退避JSON絶対パス>';
var appliedFile = '<対象外の新しい反映直後JSON絶対パス>';
var encode = data => JSON.stringify(Object.fromEntries(Object.entries(data).map(([n, b]) => [n, b === null ? null : b.toString('base64')])), null, 2) + '\n';
fs.writeFileSync(backup, encode(before), { encoding: 'utf8', flag: 'wx' });
var applied = {};
fs.writeFileSync(appliedFile, encode(applied), { encoding: 'utf8', flag: 'wx' });
```

各書込みの直前にも操作前値を照合する。以下の`writeChange`は今回の退避済みパスだけを変更し、反映直後値を毎回保存する。いずれかが失敗したら残りの書込みを続けず§6へ進む。外部エディターでの手動変更も、その直後値を同じ`applied`へ記録する。

```javascript
var writeChange = (n, old, next) => {
  assert(Object.hasOwn(before, n), 'backup missing: ' + n);
  assert.deepEqual(read(n), old, 'concurrent edit: ' + n);
  var p = safe_path(target, n);
  if (next === null) {
    if (old !== null) fs.unlinkSync(p); // 個別ファイルのみ。
  } else if (old === null || !next.equals(old)) {
    fs.mkdirSync(path.dirname(p), { recursive: true });
    fs.writeFileSync(p, next);
  }
  applied[n] = next;
  fs.writeFileSync(appliedFile, encode(applied), 'utf8');
};
// 撤去の場合は先に共通手順§7の参照解消と必須検証を済ませる。
for (var [n, old, next] of plan) writeChange(n, old, next);
```

新規導入だけは不足seedを次で作る。先に`extra`に含めて退避しておく。更新・巻戻しで実行しない。

```javascript
for (var row of desired.manifest.files) {
  if (row.mode === 'seed' && read(row.target) === null) {
    writeChange(row.target, null, desired.contents[row.source]);
  }
}
```

configの必須欄とprofileを設定し、入口は配布断片を確認して既存の指示へ必要な参照だけを追加する。例えば編集内容をUTF-8の`Buffer`として用意し、`writeChange('AGENTS.md', before['AGENTS.md'], reviewedEntryBytes)`で反映できる。seedをさらに編集するときの`old`は作成直後値とする。通知の保持は共通手順§0、その他の判断は§3〜§7に従う。

撤去では参照を解消してからcoreを個別削除し、最後に `writeChange('harness/install.json', before['harness/install.json'], null)` で記録を削除する。project・state・ledger・上流・通知と既存指示の保持を確認し、次節の新規記録作成は実行しない。

## 4. 必須検証と記録の確定

共通手順§8に従い、役割・コマンドの実在と各プロジェクトの必須検証を確認する。`links(target)` はMarkdownリンク先の存在を検査する補助であり、参照内容や製品の発見を保証しない。失敗・未実行・実行不能を成功としない。

全条件が揃った後だけ、次で記録を作る。

```javascript
links(target);
assert.deepEqual(core_inventory(target), new Set(desired.managed().map(r => r.target)));
for (var row of desired.managed()) assert.equal(digest(read(row.target)), row.sha256);
writeChange('harness/install.json', before['harness/install.json'], Buffer.from(JSON.stringify(desired.record(), null, 2) + '\n'));
verify(target, desired);
```

上流と自前コアは別コミットにし、コミット後の完全SHAをworklogへ残す。照合器のSHAと配布物のSHAが違う場合は両者を区別する。

## 5. 同版確認・更新後の利用

`verify(target, desired)`は既存ファイルへ書き込まない。同版確認ではseed・入口・台帳を再適用しない。更新・巻戻しでは計画に含まれるコアの和集合だけを反映し、固有設定の変更は別に明示する。再導入では§2の新規計画を使い、既存seedを保持して入口の重複も確認する。

## 6. 途中失敗の復旧

共通手順§9に従い、失敗を記録して記録確定を停止する。以下は今回の反映直後値が全件記録できている場合の例である。書込み直後のプロセス中断等で直後JSONが不完全・破損なら、退避全件の現物・配布blob・手動差分から変更範囲を確認してから復旧する。不明な変更は上書きしない。

```javascript
var decodeBackup = filename => Object.fromEntries(Object.entries(check.parse_json(fs.readFileSync(filename))).map(([n, v]) => {
  assert(v === null || (typeof v === 'string' && Buffer.from(v, 'base64').toString('base64') === v), 'invalid backup bytes');
  return [n, v === null ? null : Buffer.from(v, 'base64')];
}));
var saved = decodeBackup(backup);
var applied = decodeBackup(appliedFile);
// 復旧書込み前に今回の変更分を全件照合する。
for (var [n, bytes] of Object.entries(applied)) {
  assert(Object.hasOwn(saved, n), 'missing backup: ' + n);
  assert.deepEqual(read(n), bytes, 'recovery conflict: ' + n);
}
for (var n of Object.keys(applied)) {
  assert.deepEqual(read(n), applied[n], 'concurrent edit: ' + n);
  var p = safe_path(target, n);
  if (saved[n] === null) {
    if (read(n) !== null) fs.unlinkSync(p);
  } else {
    fs.mkdirSync(path.dirname(p), { recursive: true });
    fs.writeFileSync(p, saved[n]);
  }
}
for (var [n, bytes] of Object.entries(saved)) assert.deepEqual(read(n), bytes, 'restore incomplete: ' + n);
if (current) verify(target, current);
```

復旧後は新しい計画・退避で再試行する。全体resetやディレクトリの再帰削除を使わない。
