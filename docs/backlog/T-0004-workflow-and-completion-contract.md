---
type: Backlog Item
title: 規模別フローと完了契約を設置する
description: 小・通常・大の開発フロー、4値の検証報告、作業記録、セッション引継ぎをokf-devkitへ設置する。
tags: [shared, enhancement, ready-for-agent]
status: stable
layer: shared
generated:
  by: "codex/gpt-6"
  at: "2026-09-06"
state: done
priority: high
effort: M
feasibility: B
ai: assisted
cost: false
created: "2026-09-05"
done_at: "2026-09-06"
accepts: ["⑦", "⑧", "⑨"]
spec: ["§2.2", "§2.3", "§4", "§8.1"]
target: okf-devkit
evidence:
  - "okf-devkit: T-0004成果物commit 4a00b50, b0db5ff, c68a0b3, b8e6e3d, db057a5, 21aef73, 5267934, c6b91e7, 4cb39dc, 89e8c56。T-0005外部commit 456c8b5 / 8acec25は対象外。"
  - "okf-devkit: harness/state/journal/T-0004-workflow-and-completion-contract.md と T-0004-workflow-and-completion-contract.changes.json"
  - "検証: T-0004境界の既存テスト144件成功、現HEADの最新155件成功、OKF index/lint/index-check成功、参照/scope/変更宣言検査成功。"
  - "演習: small-flow、normal-flow、large-flow、report-four-state、review-working-tree、handover-resume、references-and-scope成功。"
  - "review: 固定比較点2ae7c426から初回実装列、456c8b5から最終修正列を仕様軸・標準軸で確認。"
related: ["/backlog/T-0003-japanese-entry-and-guide.md", "/backlog/T-0005-requirements-and-enforcement.md", "/backlog/T-0006-retro-and-ledger.md"]
---

# 規模別フローと完了契約を設置する

## やりたいこと

計画、grilling、仕様化、実装、review、検証、報告、引継ぎを一律の重い工程にせず、作業規模に応じて選べる共通契約を置く。

## 背景・現状

mattpocock/skillsは実装までの能力を広く提供するが、対象プロジェクトの必須コマンド、結果表現、完了報告、再開可能な状態は対象側で定義する必要がある。

### 詳細化の事前調査（2026-09-06）

- 対象は `C:/Users/rinta/Documents/1_projects/okf-devkit`。HEADは `2ae7c4261bce9d31324c35d6eaeb244c67794c22`、作業ツリーはcleanだった。実装時には再確認する。
- T-0003の入口、`harness/core/guide.md`、`harness/core/policy/requirements.md`、`harness/project/config.md`、`skill-profile.md` が存在する。検証報告・引継ぎ手順、worklog、journal、ledgerは未設置。guide/configには未設置の説明があり、今回設置する役割だけ更新が必要。
- 上流 `handoff` はOS一時ディレクトリへの会話引継ぎ文書を作る。上流 `code-review` は `git diff <fixed-point>...HEAD` を使うため未コミット変更が含まれない。上流 `implement` はreview後のcommitを指示する。この差は上流改変ではなくローカル契約で接続する。
- 対象の既存 `.venv/Scripts/python.exe` と `tests/run_all.py`、CIを確認した。venv設定はPython 3.14.3、CI testはWindows/Ubuntu × Python 3.11/3.13、独立smokeはUbuntu/Python 3.11。今回の調査ではテストを実行しておらず、過去の成功を今回の結果へ転記しない。
- `harness/` とルート入口はOKFバンドル外。OKF lintだけでは今回の手順の参照・内容を検証できない。単独のPython lint・型検査コマンドは定義されていない。

## 進め方

### 着手前提と範囲

T-0003の上記コミットを含む対象作業ツリーで実装する。利用者合意（2026-09-06）により、Claude Code確認を待たず先行し、今回の着手・完了条件には含めない。未実施は「未実行（利用者指定で省略）」と記録し、両製品で確認済みとは書かない。先行タスクの状態や検証記録を本タスクの実装から変更しない。

成果物は対象 `okf-devkit` に置く。本リポジトリへ導入しない。以下は既定パスであり、実装時に既存の同等役割が見つかれば → SPEC §2.2 に従う。

| 成果物 | 実装する内容 |
| --- | --- |
| `harness/core/procedures/verify-report.md` | 検証選択、対象版の固定、仕様/標準review、4値の記録、完了/中断の報告手順。実コマンドはconfigを参照 |
| `harness/core/procedures/handover.md` | 中断時に残す状態、別セッションの読込順、現物との照合、次の一手と記録更新 |
| `harness/core/templates/worklog.md` | 下記の最小項目を持つ1作業1枚のテンプレート |
| `harness/project/config.md` | 上記の役割対応、journalの命名・配置、上流handoff/reviewとの接続、検証の実行条件 |
| `harness/core/guide.md`、必要な場合の `AGENTS.md` | 小・通常・大から検証/引継ぎ手順への読む条件付き参照。規模の判断表は既存ガイドを使う |

上流スキル・lock・プロファイル、製品の生成テンプレート、新しいCI/hook/強制機構、retro手順・台帳、Obsidian設定、配布CLI、後続タスク本文は今回の変更範囲に含めない。`requirements.md` の既存制約を参照する。`retrospective.md` は未設置のまま区別し、検証報告にretro要否と理由を残すための接続だけ用意する。→ SPEC §4.2、§7.1。後続手順を実装済みとは報告しない。

### 手順と記録の内容

**検証・報告**

1. guideで規模を選び、依頼・完了条件・対象外を確認する。小作業の省略範囲、通常/大のreview要件は → SPEC §4。小作業でも対象の既存テストは必須。
2. configから適用される検証を選び、実行場所・前提・期待条件を確認する。条件に該当しない検査は適用外の理由として記し、結果の第5値を作らない。
3. 固定比較点とレビュー対象を記録する。→ SPEC §4.1。コミット範囲は上流code-reviewを使い、未コミット変更は `git diff <開始SHA>`、未追跡は `git ls-files --others --exclude-standard` と対象ファイル本文で補完する。既存変更がある場合は開始時の差分も記録し、今回分と区別する。仕様軸には本タスクとHARNESS_SPEC、標準軸には対象の入口・関連規約を渡す。空のコミット差分を「レビュー成功」とせず、作業ツリーを同じ二軸で確認する。
4. 必須検証を実行し、各行に識別子、結果、対象版・範囲、コマンド/確認方法、期待条件、証拠、理由・限界を記録する。4値と再試行の扱いは → SPEC §8.1。対象版はHEADだけでなく未コミット対象ファイル一覧と差分の保存先等で特定する。
5. 完了条件ごとの結果と残存リスクを照合し、成果・検証要約・未完了項目を報告する。必須条件が満たせない場合は中断として次の一手を残す。対象が変わった後の検証やreviewを、変更前の成功で代用しない。

**worklogと引継ぎ**

- worklogは目的、対象外、完了条件への参照、作業場所/ブランチ、開始SHA、最新HEADと未コミット変更、今回の判断と根拠への参照、検証表、仕様/標準review結果、残作業、妨げ、再開前提、具体的な次の一手、最終更新日、完了/中断要約を持つ。仕様やバックログ本文は複製しない。
- 対象では `harness/state/journal/<task-id-or-slug>.md` を使い、課題IDがあればそれを名前に使う。この命名をconfigへ置き、コアには固定のプロジェクトパスを埋め込まない。通常/大は作成し、小は省略可能。ただし中断して別セッションへ渡す場合は再開記録を残す。→ SPEC §2.3、§4.2。
- 引継ぎ先は入口 → config/制約 → worklog → そこから参照された仕様・対象差分の順に読む。作業場所、HEAD、差分、証拠の所在を現物と照合してから次の一手を実行する。記録後の変更や一時証拠の消失があれば、影響する検証を再実行するか確認不能の限界を記録する。
- 上流handoffを明示的に使う場合の一時文書はworklogへの参照と次セッションの用途を中心とし、別の状態正本にしない。自前handoverの利用に上流handoffの毎回実行を要求しない。
- 長いログや会話全文はコピーせず所在と要約を残す。完了記録の寿命は → SPEC §7.4。今回、保存期間の自動化や台帳は作らない。

### 実装・検査の順序

1. 対象の入口・ネスト指示、前提コミット、作業ツリー、configの現物を確認する。実装開始SHAを記録し、調査後の変更があれば今回の範囲へ写像する。
2. テンプレートと二つの手順を作り、configへ配置と上流接続を記す。guideの「未設置」を今回設置した役割だけ更新し、読む条件付き参照を接続する。
3. 下表の静的確認と隔離した演習を行う。演習用の失敗・未実行・実行不能を製品の実検証結果に混ぜない。巨大ログをリポジトリへ追加しない。
4. 対象ルートで `.venv/Scripts/python.exe tests/run_all.py` を実行する。OKF文書を変更した場合は同Pythonで `-m okf_devkit.cli index --write`、`lint`、`index --check` も行う。CI testと独立smokeの結果は別行にし、ローカル成功をCI成功と呼ばない。実行条件・最新コマンドの正本は対象configとCI。
5. 開始比較点から仕様/標準の二軸reviewを行い、修正に応じて影響する検証を再実行する。未コミット分も確認対象に含める。commit等は → SPEC §4.2 の権限規則に従う。
6. 成果物コミットを本タスクの `evidence` に記録し、各完了条件の証拠が揃った場合だけ `state: done` と `done_at` を設定する。実装や必須演習が残れば中断理由・次の一手を記録する。

| 検査 | 手順・成功条件 |
| --- | --- |
| small-flow | 明確な文言修正の依頼を使い、計画書・grilling・worklogを強制せず、必須検証と短い報告へ到達する |
| normal-flow | 単一課題の振る舞い変更を想定し、目的/完了条件、二軸review、検証表、報告へ到達する。小との工程差が分かる |
| large-flow | 判断済み仕様と複数チケットがある例で、既決事項を再質問せずチケット単位の実装/reviewと統合検証を選べる。新たな後続チケットを詳細化する演習にはしない |
| report-four-state | 隔離した演習で成功、非ゼロ終了、意図した未実行、存在しない実行環境を与え、4値と理由が正しく残る。失敗後の再実行成功も、両方の履歴を保持する |
| review-working-tree | 隔離したGit演習でコミット済み・未コミット・未追跡の対象を用意し、同じ比較点から全対象が二軸reviewへ渡ることを確認する。利用者の開始時変更と今回分を区別する |
| handover-resume | Codexの新規セッションを使う。元の会話全文やセッションforkを渡さず、作業場所・入口・worklogパスだけを渡す。残作業、妨げ、前提、最新検証を読み取り、隔離した演習の残りの検証1件を実行して同じworklogを更新する。読めたという自己申告だけでは合格にしない |
| references-and-scope | 入口から各手順へ到達でき、全ローカル参照が実在する。コアにプロジェクト固有コマンドがなく、上流本文・既存規約の複製や後続機能の先取りがない |

再開演習の証拠には、使用製品・モデル、開始/再開セッションの識別情報、worklogの所在、依頼、実行した次の一手と結果を残す。モデルは実行環境で利用できるものを記録し、特定モデルの利用を合格条件にしない。新規セッションを起動できなければ机上確認で代替せず「実行不能」として残す。

## 決定と根拠

- 小作業は計画書とfull retroを必須にしない。→ SPEC §4.1
- 検証結果は成功・失敗・未実行・実行不能の4値に固定する。→ SPEC §8.1
- 報告と引継ぎは同じworklogで表現する。→ SPEC §2.3
- 未コミット変更を自前手順でレビュー対象へ補完する。→ SPEC §4.1。利用者合意（2026-09-06）。上流ファイルは改変しない。
- T-0003のコミット済み成果物を基準に先行し、Claude Code確認は今回省略する。利用者合意（2026-09-06）。省略を成功と読み替えない。
- T-0004の再開実証はCodexの新規セッション1回で合格とする。利用者合意（2026-09-06）。製品間の実証範囲は既存のT-0008に委ね、今回その本文は変更しない。

## 完了条件

- [x] 小・通常・大の入口と工程が区別されている（受け入れ⑦）
- [x] 必須検証の対象、コマンド、4値、証拠欄がある（受け入れ⑧）
- [x] 中断時の次の一手・妨げ・前提・最新検証を記録できる
- [x] 別セッションから一回再開できた（受け入れ⑨）
- [x] 通常・大のreviewが仕様軸と標準軸を区別する
- [x] 未コミット・未追跡の対象変更もreviewへ渡り、対象版と開始時の既存変更を特定できる
- [x] 小・通常・大、4値と再試行、別セッション再開の演習証拠が残っている
- [x] guide/configの参照が実体へ到達し、未設置のretro手順と区別されている
- [x] upstreamのcommit等の手順より利用者権限・ローカル契約を優先すると明記した
- [x] 必須検証を4値で記録した
- [x] 成果物コミットを `evidence` に記入し、タスクを完了状態にした

## 検証記録

| 識別子 | 結果 | 対象 | 証拠 |
| --- | --- | --- | --- |
| small-flow | 成功 | okf-devkitのguide/verify-report | 隔離PowerShell演習。小作業で既存テスト必須、計画/grilling/worklog省略可を確認 |
| normal-flow | 成功 | okf-devkitのguide/verify-report | 隔離PowerShell演習。worklog、二軸review、検証・報告、retro判定を確認 |
| large-flow | 成功 | okf-devkitのguide/verify-report | 隔離PowerShell演習。チケット単位reviewと統合検証を確認 |
| handover-resume | 成功 | okf-devkit worklog | 新規Codexセッション `01a0722a-63bd-7f60-a303-6bba8ca508bf` が指定順に読み、status/HEAD照合後に同じworklogを更新 |
| report-four-state | 成功 | okf-devkit worklog / verify-report | 成功・失敗・未実行・実行不能と失敗→成功の再試行履歴を隔離演習で記録 |
| review-working-tree | 成功 | okf-devkit worklog | 隔離Git演習で開始時既存変更、tracked差分、未追跡補完を確認 |
| references-and-scope | 成功 | okf-devkit static check | 相対リンク到達性、コアscope、必須契約マーカーを確認 |
| project-required | 成功 | okf-devkit `.venv` | T-0004境界144件成功、現HEADの最新155件成功 |
| change-declaration | 成功 | okf-devkit `check_changes.py` | `456c8b5...b8e6e3d` で `result=ok`。保護対象宣言漏れなし |
| code-review-standards | 成功 | okf-devkit fixed-point review | 初回実装列と最終修正列を標準軸で確認。最終指摘なし |
| code-review-spec | 成功 | okf-devkit fixed-point review | 初回実装列と最終修正列を仕様軸で確認。最終指摘なし |
| ci-test | 未実行 | `.github/workflows/ci.yml` | CI未実行。ローカル成功から推定しない |
| ci-smoke | 未実行 | `.github/workflows/ci.yml` | CI未実行。ローカル成功から推定しない |
| claude-code | 未実行 | 今回の着手・完了条件の対象外 | 利用者指定（2026-09-06）で省略 |

## 結果

完了（2026-09-06）。対象 `okf-devkit` に `verify-report.md`、`handover.md`、`worklog.md`、guide/config接続、journal、変更宣言を設置した。小・通常・大、4値と再試行、作業ツリー補完、別セッション再開を隔離演習で確認し、固定比較点から仕様軸・標準軸reviewを実施した。CI test/smoke、Claude Code確認、full retrospectiveは未実行または範囲外として成功へ読み替えず、対象worklogに理由と残存リスクを記録した。T-0005の外部変更は別作業として保持した。
