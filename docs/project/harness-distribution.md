---
type: How-To
title: 共通ハーネス配布物の導入と保守
description: 固定Git版の配布物を照合し固有領域を保持して導入・移行・更新・巻戻し・撤去する明示手順。
tags: [harness, distribution]
status: stable
layer: shared
generated:
  by: codex/gpt-6
  at: "2026-09-06"
code_globs: ["distribution/**", "tests/test_distribution.py"]
related: ["/backlog/T-0013-extract-distributable-core.md"]
---

# 共通ハーネス配布物の導入と保守

配布元は `https://github.com/shirashu687/harness`。使う完全SHAと確認結果は [T-0013](/backlog/T-0013-extract-distributable-core.md) の結果を参照する。本書中の例示値を実在値に置き換える。タグ・ブランチの最新状態で配布版を代用しない。契約の正本は配布コミット内の `HARNESS_SPEC.md` §9.1.2〜§9.2.1。

配布はmanifestの11ファイルだけ。coreの6本を継続管理し、seedは初回作成後project所有、manualは既存入口へ反映する断片である。上流は対象側から直接導入する。Gitリポジトリ全体のcloneを対象へコピーしない。

## 1. 準備と固定版の取得

PowerShell、Git、Python標準ライブラリを使う。次のPython実体は環境ごとに確認し、以後同じものを使う。例はPythonを対話起動して一操作ずつ確認する形式であり、専用インストーラーは提供しない。自動演習用の書込み関数は実プロジェクトに使わない。

```powershell
$taskPython = (Get-Command python -ErrorAction Stop).Source
& $taskPython --version
$taskRepository = 'https://github.com/shirashu687/harness'
$taskCommit = '<確認済みの40桁SHA>'
$taskSource = '<新しいcloneの絶対パス>'
$taskTarget = '<導入先Gitルートの絶対パス>'
git clone --no-checkout $taskRepository $taskSource
if ($LASTEXITCODE -ne 0) { throw 'clone failed' }
git -C $taskSource checkout --detach $taskCommit
if ($LASTEXITCODE -ne 0) { throw 'checkout failed' }
git -C $taskSource rev-parse HEAD
git -C $taskSource status --short
git -C $taskTarget rev-parse HEAD
git -C $taskTarget status --short
& $taskPython -B -m unittest discover -s "$taskSource/tests" -p test_distribution.py
if ($LASTEXITCODE -ne 0) { throw 'distribution tests failed' }
& $taskPython -B
```

次のPython文は同じ対話内で実行する。`tests/test_distribution.py` の `Distribution` / `verify` / `preflight` は読取り専用の照合器。使う前に固定版のコードも確認する。読み込む版はcheckoutした配布SHAに一致させる。

```python
from pathlib import Path
import runpy, json, base64
source = Path('<取得済みcloneの絶対パス>')
target = Path('<導入先Gitルートの絶対パス>')
sha = '<確認済みの40桁SHA>'
check = runpy.run_path(str(source / 'tests/test_distribution.py'))
Distribution, verify, preflight = (check[n] for n in ('Distribution', 'verify', 'preflight'))
safe_path, links = check['safe_path'], check['links']
desired = Distribution(source, sha)
print(desired.manifest)
print(desired.record())  # 内容確認用。まだ保存しない
```

manifestと全配布ファイルはGit blobから読む。未知schema、不正UTF-8/BOM、パス逸脱、未列挙ファイル、重複、大小文字衝突、symlink/junctionは停止する。ハッシュはCRLF/CRだけをLFへ正規化し、末尾改行・空白・文字は保存する。生バイトやGit blob IDとは別の値である。

## 2. 操作前の退避と変更計画

先に下の操作別手順で `current` と `plan` を作る。計画は `(配置先, 操作前bytesまたはNone, 操作後bytesまたはNone)` の一覧であり、Noneは不存在を示す。更新・巻戻しでは両版の和集合、撤去では現行管理対象のみとなる。現行版が別ならそのコミットも取得し、`Distribution(source, old_sha)` として解決する。SHA・manifestが取れない時は操作を始めない。

`preflight` が全件成功してから、計画と変更する入口・seed・固有設定・記録のパスを作業記録へ列挙する。手修正・欠落・未知ファイル・不正記録がある場合は、変更前に止めて差分を解決する。未知ファイルを配布対象へ追加して辻褄を合わせない。

```python
for name, before, after in plan:
    print(name, 'delete' if after is None else 'add' if before is None else 'compare/update')
# extraは今回手動編集する入口・seed等の明示一覧。実計画に合わせて埋める。
extra = ['harness/install.json']
names = sorted({name for name, _, _ in plan} | set(extra))
before = {n: safe_path(target,n).read_bytes() if safe_path(target,n).exists() else None for n in names}
backup = Path('<対象外に置く今回専用の退避JSON絶対パス>')
assert not backup.exists()
backup.write_text(json.dumps({n: None if b is None else base64.b64encode(b).decode() for n,b in before.items()}, indent=2), encoding='utf-8')
```

退避先、操作前SHA、現在版・目的版、既存変更、許容差分、復旧方法をworklogに残す。対象への並行編集を避ける。各書込み前には操作前値と一致することを再確認する。以下の反映片を使う場合も、`plan` は事前照合済みの全件に限定し、失敗後に残りを続行しない。

```python
for n, old, new in plan:
    p = safe_path(target,n)
    assert (p.read_bytes() if p.exists() else None) == old, ('concurrent edit', n)
    if new is None:
        p.unlink()  # 個別ファイルのみ
    elif new != old:
        p.parent.mkdir(parents=True, exist_ok=True)
        p.write_bytes(new)
```

反映した各パスと反映直後のbytes/不存在を退避と同形式の別JSONへ記録する。手動編集も差分・直後値を記録し、プロセス中断に備えて一変更ごとに保存する。中断時に直後値が不明なら現物と配布blob・意図した差分を照合し、不明な変更は復旧で上書きしない。

## 3. 新規導入・同版再導入

1. `current = None; plan = preflight(target, desired=desired)` で全コア配置先・記録の不存在を確認する。記録なし既存コアは移行手順へ送る。
2. 同版の有効な記録が既にあれば `verify(target, desired)` と入口・必須設定の照合を行い、変更なしで終了する。seed・入口・台帳を再適用しない。
3. manifestのseedが既存なら現物の役割・不足だけを確認する。不足するseedと手動編集する入口を `extra` に明示して退避する。
4. §2のcore反映後、存在しないseedだけをコピーする。

```python
for row in desired.manifest['files']:
    if row['mode'] == 'seed':
        p = safe_path(target,row['target'])
        if not p.exists():
            p.parent.mkdir(parents=True,exist_ok=True)
            p.write_bytes(desired.contents[row['source']])
```

5. configの未設定を既存の実配置・実コマンド・強制点・限界で埋め、profileの候補と採用済みを分ける。非OKFなら理由を記入しOKFの依存を追加しない。必須役割や不適合を「運用のみ」で隠さない。
6. `agents-entry.md` の内容を確認して既存AGENTSへ必要な参照だけ手動追加する。既存指示を保持する。CLAUDE断片は接続が必要な場合だけ使う。製品実機成功とは別判定にする。
7. 下記§8の参照・必須検証を行い、成功後にだけ記録を作って再照合する。

## 4. 記録なしpilotの明示移行

okf-devkitの移行はT-0013の次セッションで行う。新規導入の停止を無効化せず、以下の独立した変更として扱う。

1. 移行開始SHA・現物・全対象一覧を保存する。抽出元policyの制約表と「強制点の適用範囲」を既存configへ移す差分を列挙する。保護一覧、宣言形式、終了値、CIのPR/push差、GitHub権限と限界を欠落させない。
2. guideの25スキル採用索引・製品配置・確認状態は既存profile側で保持する。共通カタログへの置換差分を列挙する。コアchecker、テスト、CI、上流両コピー、lock、通知、製品設定、既存journal・ledgerは保持する。
3. 対象configの実書式で同名worklogと `.changes.json` を作る。今回はこの配布元で用意したseedを既存config/profileへ上書きしない。
4. 既存コア全件を開始時の退避と照合し、配布先全件が説明されたものだけであると確認する。各ファイルの移設差分と期待内容を確認してから、コア6本を固定版のbytesへ置き換え、列挙した固有差分だけを手動反映する。
5. 役割参照・既存機能・保持対象を操作前と独立に照合する。必要検証は対象ルートの `.venv/Scripts/python.exe tests/run_all.py`、同Pythonの `harness/project/check_changes.py --base <移行開始SHA>`。OKF変更があればconfigの文書検査も実行する。検査緩和で解決しない。
6. §8で出所がGitHub URLの記録を新設し、6本一致を再確認する。許容移設以外の差分があれば完了にしない。

## 5. 更新

1. 記録の出所を確認し、その完全SHAを取得する。記録の管理一覧だけを信用せず `current = Distribution(source, old_sha)`、`verify(target,current)` で再計算・照合する。
2. `plan = preflight(target,current,desired)` で追加・変更・削除の和集合を確認する。目的版の追加先の未知既存物、管理ディレクトリ内の未知ファイルでも停止する。
3. 目的版の参照条件を既存入口/config/profileで満たせるか確認し、必要な固有変更を別途列挙する。退避後に§2を実行する。seed/manualを再適用しない。
4. 参照と必要検証後、§8で目的版のコアだけを記録して再照合する。

## 6. 巻戻し

以前の配布SHAを `desired` として§5を実施する。現行版だけのコアは照合後に個別削除し、旧版だけのコアを復元する。projectの設定・入口が旧版にも適合するか確認する。Git全体のresetや広いrevertを使用しない。旧コアへ戻したのに新しい版の管理一覧を残さない。

## 7. 撤去・再導入

1. `plan = preflight(target,current)` を全件確認し退避する。
2. PowerShellの `rg -n 'harness/core|core/|install.json' AGENTS.md CLAUDE.md harness/project harness/ledger.md` などで参照候補を列挙する。存在しない任意ファイルは検索対象から外す。相対リンクや役割写像も読む。過去journalの証拠参照と現在の実行導線を区別する。
3. 入口・config/profile/ledgerの実行導線からコア参照だけ手動編集する。元の指示・検証・上流への導線を保持し、差分を確認する。自動除去マーカーは使用しない。
4. 参照解消とプロジェクト本来の検証を確認後、§2で一致する管理ファイルだけを個別削除する。`harness/install.json` も退避値と変わっていないことを確認して個別削除する。ディレクトリを再帰削除しない。
5. project、state、ledger、上流、lock、通知、既存文書が残ることを照合する。再導入は§3を使い、既存seedと台帳を保持し、入口の重複がないことを確認する。

## 8. 参照確認・検証・記録の確定

導入後の配置を基準にリンクを辿り、configの役割・コマンドの実在、profileの採用済み依存、worklogをjournalへ複製した後の参照も確認する。`links(target)` はMarkdownリンク先の存在だけを検査し、コマンドの実在・内容の妥当性・製品の発見は別途実確認する。既存の履歴文書の壊れた参照は原因を区別し、黙って無視しない。

configが指定する必須検証を実行し、成功 / 失敗 / 未実行 / 実行不能、対象版、コマンド、終了状態、証拠、限界をworklogへ残す。仕様軸・標準軸reviewに未コミット・未追跡の対象を含める。全条件が揃ってから記録を確定する。

```python
# pre-record: immutable core contents must already match, including unknown-file check
assert check['core_inventory'](target) == {r['target'] for r in desired.managed()}
for row in desired.managed():
    assert check['digest'](safe_path(target,row['target']).read_bytes()) == row['sha256']
record_path = safe_path(target,'harness/install.json')
assert (record_path.read_bytes() if record_path.exists() else None) == before['harness/install.json']
record_path.write_text(json.dumps(desired.record(),ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
verify(target,desired)
```

上流と自前は別コミットにする。コミット後の完全SHAをworklogへ記録する。配布コミットへ自己SHAを書き足して作り直さない。記録コミットと配布版を混同しない。

## 9. 途中失敗の復旧

失敗を記録し、残りの書込みと記録確定を停止する。退避JSONから操作前bytes/不存在を読み、反映直後JSONの全対象と現物を**復旧書込み前に全件**照合する。別変更と衝突したら停止して判断を求める。ここで使う `applied` は直後JSONから復元した今回変更分のみ、`saved` は退避から復元した辞書とする。

```python
def decode_backup(path):
    return {n: None if v is None else base64.b64decode(v) for n,v in json.loads(Path(path).read_text(encoding='utf-8')).items()}
saved = decode_backup(backup)
applied = decode_backup('<反映直後JSONの絶対パス>')
assert set(applied) <= set(saved)
for n, data in applied.items():
    p=safe_path(target,n)
    assert (p.read_bytes() if p.exists() else None) == data, ('recovery conflict',n)
for n in applied:
    p=safe_path(target,n)
    if saved[n] is None:
        if p.exists(): p.unlink()
    else:
        p.parent.mkdir(parents=True,exist_ok=True)
        p.write_bytes(saved[n])
```

復旧後は退避全件と現物を再照合し、現行記録が元々あれば `verify(target,current)` を実行してから再試行する。対象外の並行変更を戻さない。自動トランザクション機構は提供しない。

## 10. 演習と検証の境界

標準ライブラリunittestは実配布物を一時Gitへ入れ、11ファイル境界、6本の記録、改行、パス・記録破損、pilot fixture、追加変更削除のv1/v2/v1、復旧・再試行・競合・撤去・再導入を検査する。テスト用v2は正式配布版にしない。

テストとは別に、§1〜§9の手順を一時Gitで実行し、終了後のファイル一覧・ハッシュ・固有データと入口参照を独立確認する。新規fixtureのconfigには実在する小さな検証コマンドを設定し、pilot fixtureは移設差分を明示する。演習した版、5操作、初回失敗と再実行結果をT-0013へ残す。fixtureの成功をokf-devkit移行・CI・Claude Code実機の成功へ読み替えない。
