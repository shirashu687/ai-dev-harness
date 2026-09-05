---
type: Backlog Item
title: 必須制約と強制点を接続する
description: okf-devkitの必須制約を既存CI・権限設定・差分レビューへ対応づけ、運用だけに依存する限界も明示する。
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
accepts: ["⑩"]
spec: ["§4.2", "§8.2", "§8.3"]
target: okf-devkit
evidence:
  - "okf-devkit: T-0005成果物commit 456c8b5d3b1004d94681a6d52d073215b5aaa412, 8acec25fff76a6f20c4d9d9aa97abf03b2ab57a4。worklog記録commit cfdbffe1a01e99432aa9d527c12192fb5a9e3669。"
  - "okf-devkit: harness/state/journal/T-0005-requirements-and-enforcement.md と T-0005-requirements-and-enforcement.changes.json"
  - "検証: 専用11件、現HEADの既存テスト155件、構文・静的CI/制約確認、分離差分の仕様/標準review成功。GitHub Actions test/smokeは未実行。"
related: ["/backlog/T-0004-workflow-and-completion-contract.md", "/backlog/T-0008-pilot-two-products.md"]
---

# 必須制約と強制点を接続する

## やりたいこと

既存の `harness/core/policy/requirements.md` を更新し、各制約に実在する強制点と確認方法を対応づける。保護対象と上流管理ファイルの変更を検知する小さな検査を既存CIへ接続する。

## 背景・現状

エージェント向け文書は文脈であって強制ではない。失敗の誤報、必須検証の緩和、無断の外部送信、機密混入、上流管理ファイルの無宣言変更は、可能な範囲で製品設定・実行環境・CIへ移す。

### 詳細化の事前調査（2026-09-06）

- 対象は `C:/Users/rinta/Documents/1_projects/okf-devkit`。HEADは `2ae7c4261bce9d31324c35d6eaeb244c67794c22`。T-0004に対応するguide/configの変更とprocedures/templatesの未追跡ファイルがあり、完成・検証済みとは判断していない。
- `requirements.md` は5制約の表として設置済み。報告照合、制約変更、権限確認、機密除去、上流差分確認は主に運用による。新設ではなく現物の更新を行う。
- `.github/workflows/ci.yml` はpush(main)とpull_requestで動く。testはWindows/Ubuntu × Python 3.11/3.13で `python tests/run_all.py`、smokeは独立job。testのcheckoutは `fetch-depth: 0`。既存の失敗を成功へ変える指定はない。
- `tests/run_all.py` は `test_*.py` をunittestで探索し、失敗時に非ゼロ終了する。追加検査は標準ライブラリとGitで実装できる。既存のscriptsディレクトリはない。
- `.claude/settings.json` は上流プラグインの重複利用を無効化する設定のみ。対象にCodexプロジェクト設定、CODEOWNERS、専用の変更ガードは見つからなかった。ユーザー全体の実効権限は未確認。
- GitHub APIでmainの従来型保護は `Branch not protected`、ruleset `21655324`（default）はactiveだった。全ブランチにcreation/update/deletion/non_fast_forwardとCopilot reviewを設定し、bypass actorは空、照会ユーザーのbypassはnever。required_status_checksはない。CIによる検知とマージ拒否を同一視しない。設定は調査時点の観測であり、実装時に読み取りで再確認する。
- 上流コピーは `.agents/skills/` と `.claude/skills/`、状態は `skills-lock.json`。コピー相互の一致は上流原文との一致の証明にならない。今回はGit比較点からの変更を検知し、上流ハッシュの独自再実装はしない。

## 進め方

### 着手前提と成果物

T-0004の実装・検証・引継ぎ記録が揃った時点で着手する。開始時にその成果物コミットと実ファイルを照合し、開始SHAと既存差分をworklogへ記録する。作業途中なら上書きせず、前提不足を記録する。今回の詳細化はT-0004の完了認定ではない。

利用者合意（2026-09-06）により、今回はリポジトリ内の変更検知と既存CIへの接続まで実装する。GitHubの設定変更、製品権限の変更、専用の秘密情報検出の導入は含めず、現状・確認方法・限界を記録する。Claude Codeのモデル実行は今回の必須完了条件に含めない。後続タスクを詳細化しない。

| 成果物 | 内容 |
| --- | --- |
| `harness/core/policy/requirements.md` | 5制約それぞれの強制点の種別、実在する参照、確認方法、既知の限界。対象固有のコマンドはconfigへ参照 |
| `harness/project/config.md` | 検査コマンド、保護対象、変更宣言と人の確認手順、既存権限・rulesetの観測と再確認方法 |
| `harness/project/check_changes.py` | 対象専用の変更検知。パッケージの公開CLIや配布テンプレートへ組み込まない |
| `tests/test_harness_changes.py` | 一時Gitリポジトリを使う振る舞いテスト。既存test runnerから実行 |
| `.github/workflows/ci.yml` | 既存test jobへ変更検査stepを追加。既存test・smokeを維持 |
| T-0005のworklogと変更宣言 | 対象版、初回導入の保護対象変更、検証・review・残存限界の証拠 |

既存と同等の役割が見つかれば → SPEC §2.2。入口・guideは新たな検査への到達に必要な場合だけ変更する。上流本文・lockを本タスクで変更しない。

### 変更検査の契約

対象ルートで `.venv/Scripts/python.exe harness/project/check_changes.py --base <SHA> [--head <SHA>]` を実行する。`--base` は必須で、Gitコミットに解決して完全SHAを出力する。`--head` 指定時は2コミット間、未指定時はbaseから現在の作業ツリー全体（staged・unstaged・未追跡の非ignore対象を含む）を検査する。CIは必ず両方指定する。変更ファイルの本文は出力せず、パス・分類・宣言状態・診断だけを出力する。

| 分類 | 初期の対象（リポジトリ相対） |
| --- | --- |
| 保護対象 | `AGENTS.md`、`CLAUDE.md`、`harness/core/policy/**`、`harness/core/procedures/verify-report.md`、`harness/project/config.md`、`harness/project/check_changes.py`、`.github/workflows/**`、`tests/**`、`pyproject.toml`、`okf.yml`、`.claude/settings*.json`、`.codex/**` |
| 上流管理 | `.agents/skills/**`、`.claude/skills/**`、`skills-lock.json`、`THIRD_PARTY_NOTICES.md`、`harness/project/skill-profile.md` |

対象一覧の機械判定は検査スクリプトを正とし、configから参照する。全テストの変更を検知するのは、検証削除・緩和の意味判定を自動化しないため。追加や正当な修正も宣言して通す。未列挙ファイル経由の迂回や意味上の弱体化を網羅するものではない。

- 追加・変更・削除・rename・型変更を扱う。renameの旧名から保護対象を外して逃れられないよう、旧名と新名をともに判定する（renameを削除＋追加として扱ってもよい）。GitのNUL区切りを使い、空白・日本語パスで壊れないようにする。
- 終了コードは0＝検査成立かつ宣言漏れなし、1＝未宣言または不正な宣言、2＝比較点不明・Git失敗など検査不能。宣言済みの変更も一覧へ出し、0を「人が承認済み」「弱体化なし」と表現しない。
- 未解決のbase/head、競合、比較履歴不足を空差分や成功へ読み替えない。外部通信・書込み・自動修正・自動宣言は行わない。

### 正当な変更の宣言と確認

今回の対象では `harness/state/journal/<task-id-or-slug>.changes.json` をworklogに対応する機械可読の添付とする。仕様や作業状態の別正本にはせず、目的・検証・人の確認の根拠はworklogを参照する。最低限の形式は次のとおり。

```json
{
  "version": 1,
  "base": "<比較元の完全SHA>",
  "worklog": "harness/state/journal/T-0005.md",
  "changes": [
    {"path": "harness/project/check_changes.py", "reason": "T-0005の変更検知を追加する"}
  ]
}
```

- 検査する差分内で追加・変更された宣言だけを読む。head指定時はそのGit版、作業ツリー検査時は現ファイルを読む。過去の宣言を残すだけで新しい変更を許可しない。
- `base` は今回の比較点と一致させる。CIとローカルの比較点が違う場合は、同じ作業の差分を再確認して宣言を更新する。baseの自動差替えはしない。
- `path` は実際に変更した保護対象・上流管理のファイルを明示列挙し、glob・絶対パス・`..` は認めない。renameは旧新両パス。理由は空文字を認めない。複数宣言は合算可能だが、重複パス・対象外パス・今回変更のないパスは不正として扱う。
- version、base、worklog、changesの型と必須値を検査する。worklogはリポジトリ内の実在するMarkdownへの参照とする。宣言ファイルが壊れている、参照がない、漏れがある場合は非ゼロ終了する。
- 宣言は利用者の許可の証明ではない。review担当は、利用者の依頼・正確な差分・理由・検証結果を照合する。通常実装の都合による検査削除や制約緩和なら戻し、別の判断が必要なら未完了として記録する。既存許可の再質問を毎回要求しない。→ SPEC §4.2。
- 上流変更の宣言がある場合は採用プロファイルの更新手順と出所・対象・理由を照合する。検査は上流原文との同一性を保証しない。→ SPEC §5.5。
- 初回導入自身の検査・テスト・CI・config等の変更も宣言する。検査コード・CIを同時に改変すれば回避可能であり、独立した改ざん防止ではないと明記する。

### CIへの接続と失敗の報告

既存test jobのPython設定後に、pull_requestイベントで動く検査stepを置く。イベントのbase SHAとPR head SHAを比較し、checkoutの合成merge SHAをheadと混同しない。GitHub式の値は環境変数経由で渡し、シェルの実行文に外部文字列を直接展開しない。push時は既存test/smokeを維持するが、この変更検査は動かさない。PRとpushでは比較範囲が異なり、一つの宣言を両方へ流用できないためである。直接pushの保護対象変更は本検査では検知しないという限界をconfigへ明記する。

`fetch-depth: 0` を維持し、両コミットを解決できることを確認する。全ゼロのSHA、履歴不足などの場合は検査不能として失敗させ、HEADの親へ暗黙に置き換えない。手動で適切な比較点を確認し再検証する手順をconfigへ記す。PRのbase更新時は差分を再確認して宣言を更新する。`continue-on-error`、`|| true`、成功への終了コード変換は使わない。

CI検知はコミット後であり、ローカル変更を拒否しない。現在のrulesetには必須CIチェックの指定がなく、CI失敗がマージ拒否を保証するとは書かない。既存ruleset自体の作成・更新禁止も観測結果として記録し、実装者が緩和しない。

失敗報告の演習では一時Gitリポジトリで未宣言変更を起こし、非ゼロ終了と対象パスを実行証拠にしてT-0004の4値表へ「失敗」を記録する。修正後の成功も別の試行として残す。ローカルの演習をGitHub上のCI実行済みと呼ばない。実CI結果は対象SHA・run URL・job結果で別に記録し、外部push等の許可がなければ未実行として残す。今回の実装完了はローカル演習とCI接続のreviewを必須とし、実CI実行は必須としない。

### 実装・検査の順序

1. T-0004の前提、対象の入口・ネスト指示、作業ツリー、設定の現物を確認し、worklogと開始SHAを記録する。
2. 一時Gitリポジトリで下表のケースを固定し、検査を実装する。Python 3.11以上・Windows/Ubuntuで動く標準ライブラリとGitを使う。
3. 宣言とworklogを作り、CIへ接続する。requirements/configに5制約の実在する確認手段と限界を反映する。
4. 対象で `.venv/Scripts/python.exe tests/run_all.py` と開始SHAからの変更検査を実行する。OKF文書を変更した場合は同Pythonで `-m okf_devkit.cli affected --base <開始SHA>`、必要文書更新、`index --write`、`lint`、`index --check` を行う。対象のconfigを実コマンドの正とする。
5. 開始SHAから未コミット・未追跡を含め仕様/標準の二軸reviewを行う。修正後は影響する検証を再実行し、宣言のファイル一覧も照合する。
6. 成果物コミットがあり必須条件が揃った場合だけ、本タスクのevidence・state・done_at・結果を更新する。commit権限は → SPEC §4.2。未コミットなら実装・検証済みでも証拠不足として引継ぎを残す。

| 検査 | 成功条件 |
| --- | --- |
| requirements-map | 5制約に種別・参照・確認方法・限界があり、報告や機密確認など運用だけの範囲が分かる |
| ordinary-change | 保護対象外のみの変更と無変更は宣言不要で0 |
| protected-policy | 保護対象の追加・変更・削除・renameを宣言なしで1、正しい宣言ありで0かつ変更一覧表示 |
| upstream-drift | 両コピー、片側だけの変更、lock変更を検知。コピー同士が同じ変更でも検知 |
| declaration-validation | 壊れたJSON、空理由、異なるbase、古い未変更の宣言、漏れ、余分なパス、重複、glob、越境、worklog不存在を拒否 |
| working-tree | staged・unstaged・未追跡・空白/日本語名を検査。2コミット検査は現在の作業ツリーに左右されない |
| unavailable-base | 不明SHA・全ゼロ・履歴不足・競合は2で検査不能。成功にしない |
| ci-failure-surface | 一時環境の意図した失敗と修正後の成功を区別して記録。CI接続の終了コードを握り潰さない |
| ci-wiring | PRのbase/headを使う配線を確認し、pushでは検査stepのみ対象外になる。既存test/smokeを維持。実CIの結果は別記 |
| scope-and-review | 検査自身の同時改変、人による宣言確認、マージ拒否の限界を記載し、仕様/標準のreviewを完了 |

## 決定と根拠

- 運用しかない規則は必須と同じ強さで表現しない。→ SPEC §8.2
- 既存CI・保護設定を優先し、同じ強制機構を二重化しない。→ SPEC §1.3
- 利用者合意（2026-09-06）：保護対象・上流管理ファイルの変更検知を既存CIへ追加し、正当な変更の宣言・確認手順まで整える。製品権限・機密検出は現状と限界を記録し、GitHub設定変更は含めない。
- 対象専用の最小実装としてPython＋GitとJSON宣言を使う。意味上の弱体化判定・人の許可の認証・上流ハッシュの再実装は行わず、差分reviewと既存プロファイルへ接続する。
- T-0004の成果物を前提にし、Claude Code実行・実GitHub CI実行を今回の必須合格条件にしない。ローカルの検査結果と未実施の確認を分ける。

## 完了条件

- [x] 最低5制約のすべてに強制点・確認方法・既知の限界がある（受け入れ⑩）
- [x] CIが失敗した場合に失敗のまま報告される
- [x] 必須検証・必須制約の通常実装からの書換えが検知または拒否される
- [x] 上流管理ファイルのローカル改変が差分で検知される
- [x] 運用のみの制約が明示されている
- [x] 正当な変更を明示宣言でき、不正・古い宣言・比較不能が非ゼロ終了になる
- [x] 作業ツリー全体とCIの2コミット比較を検査できる
- [x] 一時Gitリポジトリの上記ケースと既存テストが成功した
- [x] CI配線、検査自体の迂回可能性、GitHub設定の限界をreviewし記録した
- [x] 必須検証を4値で記録した
- [x] 成果物コミットを `evidence` に記入し、タスクを完了状態にした

## 検証記録

| 識別子 | 結果 | 対象 | 証拠 |
| --- | --- | --- | --- |
| requirements-map | 成功 | target T-0005変更 | `requirements-map-constraints` / `requirements-map-four-states`、5制約の参照・確認方法・限界を確認（456c8b5） |
| ci-failure-surface | 成功 | 一時Gitリポジトリ | `python -m unittest tests.test_harness_changes -v`、11 tests `OK`。未宣言1・宣言後0と終了コードを確認（456c8b5, 8acec25） |
| protected-policy | 成功 | 一時Gitリポジトリ | protectedの変更・削除・rename旧新、およびprotected↔ordinary renameの両名宣言を確認（8acec25） |
| upstream-drift | 成功 | 一時Gitリポジトリ | `.agents/skills/**`、`.claude/skills/**`、`skills-lock.json`を個別に検知（456c8b5） |
| ordinary-change | 成功 | 一時Gitリポジトリ | 無変更・ordinary変更が宣言なしで0（456c8b5） |
| declaration-validation | 成功 | 一時Gitリポジトリ | JSON、base、worklog、reason、重複、glob、越境、古い宣言、head内tree型worklogを拒否（8acec25） |
| working-tree | 成功 | 一時Gitリポジトリ | staged・unstaged・未追跡・空白/日本語名を検査し、`--head` が作業ツリーを無視することを確認（456c8b5） |
| unavailable-base | 成功 | 一時Gitリポジトリ | 不明SHA・全ゼロ・shallow・競合を2として扱い、成功へ読み替えないことを確認（456c8b5） |
| ci-wiring | 成功 | `.github/workflows/ci.yml` | PRのbase/head環境変数、`fetch-depth: 0`、既存test/smoke維持、失敗終了コード保持を静的確認（456c8b5） |
| scope-and-review | 成功 | T-0005分離差分 | 初回Spec review指摘を修正後、仕様/標準を手動再確認。T-0004混在の一括検査失敗は残存リスクとして記録（8acec25, cfdbffe） |
| project-required | 成功 | target HEAD `c6b91e7` | `.venv/Scripts/python.exe tests/run_all.py`、155 tests、failures/errors/skips 0（cfdbffe） |
| ci-test | 未実行 | GitHub Actions | Windows/Ubuntu × Python 3.11/3.13の実CIは未実行 |
| ci-smoke | 未実行 | GitHub Actions | Ubuntu/Python 3.11の実CI smokeは未実行 |

## 結果

T-0005は2026-09-06に完了した。target repositoryへ変更検査、JSON宣言、既存CIのPR配線、5制約の制約表/config更新、専用テストを実装し、成果物を `456c8b5` と `8acec25` にコミットした。worklogと検証結果は `cfdbffe` に記録した。

専用テスト11件、target既存テスト155件、構文検査、CI配線と制約表の静的確認、分離差分の仕様/標準reviewを実行し、実行結果を記録した。GitHub Actionsの `test` / `smoke` は未実行であり、成功とは扱っていない。GitHub settings/rulesetおよび製品権限は変更していない。

T-0004のコミットが同一ブランチへ挿入されたため、`a37649c..c6b91e7` の一括変更検査はT-0004宣言のbase不一致とconfig重複で失敗した。この結果は隠さず、T-0005固有の分離範囲を成功証拠とし、combined PRにする場合の宣言base統合を残存リスクとしてworklogへ記録した。

### lunaへの依頼プロンプト

```text
C:/Users/rinta/Documents/1_projects/harness/docs/backlog/T-0005-requirements-and-enforcement.md を読み、T-0005を実装してください。仕様の正本は同リポジトリのHARNESS_SPEC.md、実装先は C:/Users/rinta/Documents/1_projects/okf-devkit です。
両リポジトリのAGENTS.mdを読み、まずT-0004の完成した成果物と既存差分を確認してください。タスクに記載した変更検査・宣言・既存CI接続・制約表の更新を実装し、検証と仕様/標準reviewを行ってください。後続タスクは詳細化せず、GitHub設定や製品権限は変更しないでください。
実行していない検証を成功とせず、結果と残作業をworklogへ残してください。成果物コミットと必須証拠が揃った場合だけT-0005を完了へ更新してください。
```
