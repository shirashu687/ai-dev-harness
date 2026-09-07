---
type: Backlog Item
title: ObsidianとOKFの知識導線を接続する
description: okf-devkitの同じMarkdownをObsidianで閲覧し、OKFの索引・検査と共存させながら別の正本や無制限な記録を作らない運用を確認する。
tags: [shared, enhancement, ready-for-agent]
status: stable
layer: shared
generated:
  by: "codex/gpt-6"
  at: "2026-09-06"
state: doing
priority: medium
effort: M
feasibility: B
ai: assisted
cost: false
created: "2026-09-05"
done_at: null
accepts: ["⑬", "⑭"]
spec: ["§4.2", "§6", "§8.1"]
target: okf-devkit
evidence:
  - "okf-devkit target implementation: e75a041713ca1666c2fe236e9aee06c43c8a0810, a7d0c82df81bf6f94f6fae0350d49c0c7d6fad2e, 996f7a08685e90a63f0aec9505db1678456b1d83"
  - "target worklog evidence commit: 8a9545feb406e32b113dbeb1ddddc62145406a9b"
  - "target worklog handoff-history correction: 008c63e029db77e75337ce02479c946c0d879501"
  - "target worklog final handoff note: 1a646369621dcdf7c918c04493963784ff95a5cb"
  - "target worklog: C:/Users/rinta/Documents/1_projects/okf-devkit/harness/state/journal/T-0007-obsidian-okf.md"
  - "verification: 163 tests passed; index/lint/check/render/affected/change-declaration and static Markdown navigation recorded in target worklog"
  - "review: fixed point cfdbffe1a01e99432aa9d527c12192fb5a9e3669; specification and standards review completed, findings fixed; low-confidence P3 test-fixture duplication retained as non-blocking candidate"
  - "runtime boundary: Computer Use returned apps: []; Obsidian Vault/search/link/frontmatter operations are実行不能, not treated as static success"
related: ["/backlog/T-0006-retro-and-ledger.md", "/backlog/T-0008-pilot-two-products.md"]
---

# ObsidianとOKFの知識導線を接続する

## やりたいこと

`okf-devkit` のリポジトリルートをObsidian Vaultとして開き、既存のMarkdown、frontmatter、リンク、index、台帳をそのまま人間向けUIで扱う。

## 背景・現状

Obsidianは新しい知識庫ではなく、Markdown + Gitという正本を読む画面にする。OKF固有の規約はプロジェクトアダプターへ置き、共通ハーネスはOKF未採用リポジトリでも動けるようにする。

### 詳細化の事前調査（2026-09-06）

- 実装先は `C:/Users/rinta/Documents/1_projects/okf-devkit`。今回の作業は設計側の詳細化であり、対象への実装・Obsidian実機検証はまだ行っていない。
- 対象の `okf.yml` は `bundle_root: docs`。生成された `docs/index.md` の `/agents/index.md` などはOKFバンドル起点であり、SPEC §6.2で指定するリポジトリルートのVaultとは起点が異なる。既存リンクがそのまま全てObsidianで動くとは扱わない。
- 対象の `docs/CONVENTIONS.md` §4は本文の相対リンクを許容する。一方、生成indexは手編集できないため、索引のリンク形式を変える場合は生成側の対応が必要になる。
- `harness/project/config.md` に「OKFと製品の接続」が既にあり、配置・検査範囲・Obsidian利用案内の接続先として使える。`harness/` とルート入口・CONTEXTはOKFバンドル外なので、OKF lintだけではVault全体の導線を確認できない。
- 調査時、対象ルートと `docs/` に `.obsidian/` はなく、対象 `.gitignore` にもその除外はない。実装開始時に再確認する。
- T-0006の `harness/ledger.md` とretro手順は調査時点で未設置。T-0007では先行成果物を再確認し、未設置なら台帳への導線の実証を成功にしない。T-0006の実装を本タスクへ取り込まない。
- Obsidian公式の [Settings](https://obsidian.md/help/settings) では、Markdownリンクの生成とファイル相対パスを選べる。これは新しく生成するリンクの設定であり、OKFの既存リンクを変換する機能とは別である。
- Obsidian公式の [Properties](https://obsidian.md/help/properties) ではネストしたプロパティは非対応とされ、ソース表示が案内されている。OKFの `generated` / `verified` 等をUIに合わせて平坦化せず、元のYAMLを保持する。`related` の文字列をそのままクリック可能な内部リンクやバックリンクとして扱えるとも保証しない。
- 索引生成は `src/okf_devkit/cli.py` の `build_index_block` と `build_backlog_block` に分かれる。前者の子ディレクトリ、通常文書・非推奨文書、後者のdoneを含む各状態のリンクをすべて同じ設定へ接続する必要がある。`Doc.bundle_rel` は他用途でも使うため、その意味を変更する方法は採らない。
- `tests/test_index.py` に既定出力のgolden、冪等性、手書き前文保持、マーカー破損時の全体書込み中止の検査がある。`tests/test_render.py` と `renderer.py` にはリンクのHTML変換がある。新設定はこれらの振る舞いを維持して追加検証する。
- `docs/project/decisions/index.md` は調査時点で空。ADR導線は既存索引と未作成という状態を確認し、実在しないADRの追加を合格条件にしない。
- `lint` は通常warnだけでも終了0、`stale` は候補があっても終了0になる。終了コードだけでなくlint件数、stale候補と対応理由を確認する。L11はfrontmatterの `related` の検査であり、本文リンク全体やObsidian実機の成功証拠にはならない。

## 進め方

### 着手前提と範囲

T-0004〜T-0006の成果物を含む `okf-devkit` で実装する。開始時に先行成果物・現在のHEAD・既存差分を再確認する。台帳などが未設置なら、独立した索引機能の実装・検証は進められるが、依存する導線の実証は未完として残す。本タスクの詳細化と実装完了は別であり、実装前は `state: todo` を保つ。

| 変更先 | 実装内容 |
| --- | --- |
| `src/okf_devkit/defaults.yml`、`src/okf_devkit/cli.py` | 索引リンク形式の設定と生成処理。通常・backlog双方に適用する |
| `tests/test_index.py`、関連設定テスト、`tests/test_render.py` | 下表の振る舞いを既存の一時バンドルで検証する |
| `okf.yml` | 対象リポジトリで相対リンク設定を有効にする |
| `docs/CONVENTIONS.md`、`README.md`、コード変更による影響文書 | 設定の意味・既定値・利用例、本文の相対リンクとfrontmatterの役割、生成indexの規約を更新する |
| `docs/**/index.md` | CLIで再生成する。マーカー内を手編集しない |
| `harness/project/config.md` | 既存の役割対応表と「OKFと製品の接続」に、主要導線・Vault利用案内・OKF検査の範囲と限界を接続する |
| `.gitignore` | リポジトリルートの `/.obsidian/` を除外する |
| 主要導線上の手書きMarkdown | 必要な本文リンクをファイル相対へ修正する。frontmatterやコード例の一括文字列置換は行わない |
| `harness/state/journal/T-0007-obsidian-okf.md` と同名 `.changes.json` | 開始版、変更、検証・実機確認・レビューの証拠、保護対象の変更宣言を記録する |

対象外は、全既存ノートの一括リンク移行、Wikiリンクへの変換、community plugin、Obsidian専用コピー、自動同期・公開、上流スキル、製品権限・CIの変更、後続タスクの詳細化。`AGENTS.md` から既存configへ到達できるため、同じ案内を入口へ複製しない。renderer本体の変更は新設定の互換性を満たすために必要な最小修正だけとする。

### 索引設定の実装契約

対象固有のCLI仕様として、次の設定を追加する。ハーネス共通規定にCLIのキー名を埋め込まない。

```yaml
index:
  link_style: relative
```

- 許容値は `bundle-absolute` / `relative`。省略時の既定値は `bundle-absolute` とし、既存利用者の生成結果を維持する。対象の `okf.yml` だけで `relative` を明示する。
- `relative` は生成する `index.md` の親ディレクトリを起点とする。例: `docs/index.md` → `docs/project/index.md` は `./project/index.md`、`docs/project/index.md` → 同階層の `overview.md` は `./overview.md`、backlog索引 → 同階層のタスクは `./T-....md`。区切りはWindowsでも `/` とする。
- リンク先だけを切り替え、ラベル・説明・状態の集計・並び順・frontmatter・マーカー・手書き前後文を保持する。パスのエスケープは既存処理と接続し、二重エンコードしない。空白・括弧・`%`・日本語を含む実在パスも確認する。
- `Doc.bundle_rel` と `related` のOKFバンドル起点の意味は維持する。索引の出力リンクを決める処理を通常/backlogで共用し、個々の出力箇所へ設定分岐を重複させない。
- 未知の文字列、null、数値・リスト等の不正型は、明示的な設定エラーとして非0終了する。暗黙に既定値へ戻さず、indexを部分書込みしない。既存の設定読込み・エラー表示方式に合わせる。
- `index --write`、`index --check`、lintのL13、syncからの索引生成が同じ設定を使う。設定を既定値へ戻して再生成すれば元形式へ戻せることを一時バンドルで検証する。

### 主要導線とObsidian利用案内

既存configの役割対応表を起点に、次を本文の通常Markdownリンクで辿れるようにする。別のリンク集・別Vault・同じ本文のコピーは作らない。

| 始点 | 到達先・期待する状態 |
| --- | --- |
| `AGENTS.md` | `harness/project/config.md` の役割対応表 |
| config | `CONTEXT.md`、`docs/CONVENTIONS.md`、`README.md` の現行仕様・利用案内 |
| config | `docs/index.md` → 子ディレクトリ索引 → 実在する文書 |
| config | `docs/backlog/index.md` → 実在するタスク本文 |
| config | `docs/project/decisions/index.md`。ADRがなければ空の状態を正しく説明する |
| config | `harness/state/journal/T-0007-obsidian-okf.md` など実在する進行中worklog。具体的作業へのリンクは今回の確認用に記録し、configに履歴を列挙し続けない |
| config | T-0006で設置した `harness/ledger.md` → 実在する項目の見出し・根拠worklog |

SPECの正本 `HARNESS_SPEC.md` は別の設計リポジトリにあり、対象Vault内へコピーしない。上表の「仕様」は対象内の実在する現行文書を指す。上表を辿るために修正した本文からの主要リンクも確認し、対象外に残るbundle起点リンクの制約はworklogへ明記する。

Obsidianの案内は同じリポジトリフォルダを既存Vaultとして開き、閲覧・検索を主用途とする。ローカル設定の推奨はMarkdownリンク、ファイル相対パス、Propertiesのソース表示。自動リンク更新による生成index等の書換えを避け、移動・改名は既存の編集手順とCLI再生成で扱う。UIの見栄えのためにYAMLを書き換えない。OKFの `related` は機械用の関連情報として維持し、人間が辿る必要がある関係は本文リンクで表す。

`.obsidian/` の扱い・記録の寿命・OKF未使用時の代替は → SPEC §6、§7.4。GitのignoreはObsidianの読込み・検索除外ではないことも案内する。隠しフォルダ、検索・グラフの対象外設定による見え方をアクセス制御とは扱わない。

### 実装・検査の順序

1. 両リポジトリの入口、現在のSPEC、本タスク、対象の制約/config/docs規約、先行成果物を読む。開始SHAを完全形で固定し、既存差分と今回の変更をworklogで区別する。
2. 索引設定・生成・テストを実装し、既定のgoldenを維持する。次に対象で相対設定を有効化し、CLIで索引を再生成する。保護対象の設定・テスト・configの変更を同じ作業の宣言へ列挙する。
3. 対象の影響文書確認コマンドを開始SHAで実行し、出力に従って本文と更新メタデータを更新する。今回の設定をREADMEと執筆規約へ反映し、主要導線を接続する。コード変更分のlog更新は対象の規約・設定に従い、履歴を捏造しない。
4. 下表の自動検証と主要導線の静的確認を行い、次にObsidian実機で確認する。画面操作手段が使えなければ実機項目は実行不能として、開くVault・操作・期待結果・未確認項目を残す。静的成功を実機成功へ置き換えず、可能な実装・検証を先に完了させてから必要な確認だけ依頼する。
5. 対象configの既存テスト、index生成・lint・index確認、変更宣言検査を実行する。staleは変更前後で候補の種類・件数・差・対応理由を記録し、無関係な候補を消すためだけの文書更新をしない。CI test/smokeは実結果を別記する。
6. 開始SHAから作業ツリー・未追跡を含む対象版を仕様軸と標準軸でreviewし、修正した部分の検証を再実行する。retroゲートは設置済みのT-0006手順に従う。
7. 必須証拠と成果物コミットが揃った場合だけ設計側の本タスクをdoneにし、evidence・検証表・結果を更新する。不足があれば4値と次の一手をworklogへ残す。操作権限は → SPEC §4.2。

| 検査 | 成功条件・記録内容 |
| --- | --- |
| index-default-compat | 設定省略と明示 `bundle-absolute` で従来の通常/backlog出力を保持する |
| index-relative | ルート・多階層・同階層・子索引・非推奨・backlog各状態（doneを含む）で生成リンクを起点から解決すると期待する実在ファイルになる。空白・括弧・`%`・日本語のパスも確認する |
| index-invalid-config | 不正値で明確なエラー・非0終了となり、既存indexも未生成indexも書き込まれない |
| index-regeneration | 2回目に差分なし、check/L13成功、手書き前後文保持、マーカー破損時に全体書込み中止。設定を元へ戻した再生成でも互換形式へ戻る |
| render-relative | 新形式で生成した索引をHTMLへ変換し、子索引と本文へのリンクが正しいHTMLを指す。隣接出力と別outputの両方を確認し、元Markdownとfrontmatterを変更しない |
| markdown-navigation | 上の導線表の始点・リンク先・解決先を記録する。bundle外の導線も対象とし、空ADRは状態を確認する |
| obsidian-same-source | 実機のバージョン・Vaultの実パスを記録。同じMarkdownを開き、既知の語句で検索し、主要導線と生成indexのリンクをクリックして意図した文書へ到達する |
| obsidian-frontmatter | 実在するネストYAMLをソース表示で確認。閲覧前後のGit差分で、閲覧によるMarkdownの意図しない変更・コピー作成がない |
| private-settings-ignore | `git check-ignore` で `/.obsidian/workspace.json` 等が除外され、`git ls-files -- .obsidian` が空。既存tracked設定が見つかった場合は内容を露出させず、今回変更と区別して対処する |
| okf-index-lint-stale | 索引生成・check成功、lintはerror 0 / warn 0。staleは候補の有無を成功判定と混同せず、前後差と対応を記録する |

対象ルートで使うコマンドは以下。環境が変わっていれば対象configを再確認する。

```text
.venv/Scripts/python.exe tests/run_all.py
.venv/Scripts/python.exe -m okf_devkit.cli affected --base <開始SHA>
.venv/Scripts/python.exe -m okf_devkit.cli index --write
.venv/Scripts/python.exe -m okf_devkit.cli lint
.venv/Scripts/python.exe -m okf_devkit.cli index --check
.venv/Scripts/python.exe -m okf_devkit.cli stale --format json
.venv/Scripts/python.exe harness/project/check_changes.py --base <開始SHA>
```

HTML生成の結合検証は既存テストの一時バンドルを使い、本番Vaultに演習文書や巨大な画像証拠を残さない。画面確認は少数の代表文書で行い、スクリーンショットの大量保存を必須にしない。

## 決定と根拠

- Obsidian、OKF、Gitの役割を分離する。→ SPEC §6.1
- 同じ文書のObsidian専用コピーを作らない。→ SPEC §6.2
- OKFはアダプターであり、共通コアの必須依存にしない。→ SPEC §6.3
- 生成indexも辿れるよう、既定の生成形式を維持した相対リンク設定をOKFへ追加する。利用者合意（Q1、2026-09-06）。通常/backlog両方とHTML互換性まで含め、工数目安をMとする。
- 新設定のキー名・許容値・出力例・検証ケースは上記の実装契約で固定する。既存CLIの責務に収め、別の変換ツールは作らない。
- 対象Vault内の主要導線を整備し、全既存文書の移行は今回の範囲に含めない。ネストYAML・relatedは既存形式を保ち、本文の導線とソース表示で接続する。

## 完了条件

- [ ] リポジトリの同じMarkdownをVaultから閲覧・検索できる（受け入れ⑬。Obsidian実機実行不能）
- [x] 仕様、ADR、バックログ、worklog、台帳の導線を静的に解決できる（Obsidian UI操作は未確認）
- [x] 相対リンク設定が通常/backlog索引の全出力へ適用され、既定形式と再生成の互換性が保たれる
- [x] 不正設定時の非書込み、特殊文字、HTMLリンク互換性の検証がある
- [ ] 主要本文リンクと生成indexをObsidian実機で確認し、YAMLとMarkdownの同一性が保たれる（実行不能）
- [x] `.obsidian/` の個人状態がGit管理外である
- [x] `okf index`、`okf lint`、`okf stale` が成立する（受け入れ⑭。staleはinfo 5件）
- [x] OKF未使用時の代替がMarkdown + Gitとして説明されている
- [x] 重複ノート・チャット全文・巨大ログを作っていない
- [x] 既存テスト・変更宣言検査・仕様/標準reviewの証拠と、実機未確認を含む残存制約が記録されている
- [x] 必須検証を4値で記録した
- [x] 成果物コミットを `evidence` に記入した
- [ ] タスクを完了状態にした（Obsidian実機・CI test/smoke未確認のため未達）

## 検証記録

| 識別子 | 結果 | 対象 | 証拠 |
| --- | --- | --- | --- |
| index-default-compat | 成功 | `996f7a0` / 隔離golden | 設定省略・明示bundle-absoluteで通常/backlogの従来形式を確認。全163件OK |
| index-relative | 成功 | `996f7a0` / 隔離テスト | 通常/backlog全state、deprecated、多階層、特殊文字を起点解決。全163件OK |
| index-invalid-config | 成功 | `996f7a0` / 隔離CLI | unknown/null/数値/リストで非0、stderr明示、sentinel不変。全163件OK |
| index-regeneration | 成功 | `996f7a0` / 隔離・対象 | 冪等write/check、marker保護、relative→既定/明示bundle-absolute復帰。対象index最新 |
| render-relative | 成功 | `996f7a0` / 隔離HTML | 隣接・`_site`で子索引/本文リンクを変換し、Markdown原文不変。11ページ/warn0 |
| obsidian-same-source | 実行不能 | Computer Use | `cua.getState()`が`apps: []`、Obsidianを解決/起動できず、Vault検索・リンク移動未確認 |
| obsidian-frontmatter | 実行不能 | Computer Use | ObsidianのProperties/source表示と前後Git差分を未確認。静的成功へ読み替えなし |
| markdown-navigation | 成功 | `996f7a0` / 静的 | config→主要文書/索引/台帳の16リンク全てTrue。backlog/decisions空状態、ledger項目を確認 |
| okf-index-lint-stale | 成功 | `996f7a0` / 対象CLI | index write/check最新、lint error0/warn0、stale終了0・info5件 |
| private-settings-ignore | 成功 | `996f7a0` / Git | `.gitignore:27:/.obsidian/`で2例除外、tracked出力なし |
| project-required | 成功 | `996f7a0` / Windows venv | `tests/run_all.py`: 163件、失敗0、エラー0、スキップ0、終了0 |
| change-declaration | 成功 | base `cfdbffe...` / working-tree | `check_changes.py`: `result=ok`、protected変更は宣言済み |
| code-review-spec | 成功 | base `cfdbffe...` → `996f7a0` | 初回P2 2件を検出・修正・再検証。P0/P1なし。追補reviewはタイムアウト |
| code-review-standards | 成功 | base `cfdbffe...` → `996f7a0` | P0-P2なし。P3低確信fixture重複を非ブロッキング候補として記録 |
| ci-test | 未実行 | GitHub Actions | ローカル結果から推定しない |
| ci-smoke | 未実行 | GitHub Actions | ローカル結果から推定しない |

## 結果

実装・自動検証・静的導線確認・仕様/標準reviewは完了（2026-09-06）。対象版は `996f7a08685e90a63f0aec9505db1678456b1d83`。Obsidian実機はComputer Useのネイティブアプリ面がなく、`obsidian-same-source` / `obsidian-frontmatter` を実行不能とした。CI test/smokeは未実行であり、必須証拠が揃っていないため、設計側T-0007は `state: doing` のまま完了にしない。次の一手はObsidian実機で同一Vaultを開いて検索・主要導線・YAML source表示・前後Git差分を確認し、CI実結果を記録することである。

### lunaへの依頼プロンプト

```text
C:/Users/rinta/Documents/1_projects/harness/docs/backlog/T-0007-obsidian-okf.md を読み、T-0007を実装してください。仕様の正本は同リポジトリのHARNESS_SPEC.md、実装先は C:/Users/rinta/Documents/1_projects/okf-devkit です。
両リポジトリのAGENTS.mdと対象の関連規約を読み、T-0004〜T-0006の成果物、現在のHEADと既存差分を確認して開始SHAを記録してください。確定済みの方針は再質問せず、タスクの実装契約に従って進めてください。
OKFのindex.link_styleを追加し、通常/backlog索引の相対リンク生成、既定形式の互換性、HTML変換を検証してください。対象で設定を有効化し、生成indexと主要文書の導線、Obsidian利用案内、.obsidianのGit除外を整備してください。
タスクの検証表、既存テスト、変更宣言検査、仕様/標準reviewを実施し、対象のT-0007 worklogへ対象版と証拠を記録してください。Obsidian実機が使えなければ静的検証で成功扱いせず、完了した実装と未確認の操作を具体的に残してください。先行台帳が未設置なら、その導線は未完として残してください。
全ノート移行、専用コピー・community plugin・同期や公開、上流スキルや製品権限の変更、後続タスクの詳細化は範囲外です。必須証拠と成果物コミットが揃った場合だけ設計側T-0007を完了へ更新し、不足があれば中断理由と次の一手を記録してください。
```
