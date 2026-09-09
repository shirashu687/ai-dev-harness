---
type: Backlog Item
title: 上流スキルを直接依存として導入する
description: 上流25スキルの直接導入・Codex検証と利用者によるClaude Code確認を終え、導入を完了した。
tags: [shared, enhancement, ready-for-human]
status: stable
layer: shared
generated:
  by: "process:codex"
  at: "2026-09-07"
state: done
priority: high
effort: M
feasibility: B
ai: assisted
cost: false
created: "2026-09-05"
done_at: "2026-09-07"
accepts: ["①", "②", "③", "④"]
spec: ["§5.1", "§5.2", "§5.4", "§5.5"]
target: okf-devkit
evidence: ["427f726d756620006a4f1765810d7887c7a319ff", "585f9dfcfb398adc9edba70044eccd3d503a4a8a", "c14025aea7e7f5e5c40bbe8ee25b37e00cf5d35c"]
related: ["/backlog/T-0003-japanese-entry-and-guide.md"]
---

# 上流スキルを直接依存として導入する

## やりたいこと

`okf-devkit` が mattpocock/skills を本ハーネス経由ではなく上流から直接導入する。`ask-matt` の案内先が欠けない初期プロファイルを選び、更新可能な依存として記録する。

## 背景・現状

この設計リポジトリには調査用として全37スキルがあるが、適用先の既定ではない。多数のスキルは初期description一覧の文脈負担になり、同名スキルを複数の場所へ入れるとCodexでは統合されない。上流の `in-progress` は既定から外す。

### 詳細化の事前調査（2026-09-05）

- 調査対象は本リポジトリの `.agents/skills/` と `skills-lock.json`（関連ファイルの最新コミット: `9b75c2b76668098111c0cdca69054c6abc22c8c4`）。導入時に取得する上流版の検証ではない。
- SPEC §5.2 の候補25個は、ローカル版ではスキル参照と補助ファイル参照が閉じている。`ask-matt` が残り24個をすべて案内するため、原文の全案内先を維持する場合の最小構成は25個。lock上、この25個に `in-progress` 由来のものはない。導入版について再検査する。
- 候補のうち14個は明示呼出用（`ask-matt`、`setup-matt-pocock-skills`、`grill-with-docs`、`grill-me`、`handoff`、`to-spec`、`to-tickets`、`implement`、`improve-codebase-architecture`、`triage`、`wayfinder`、`to-questionnaire`、`wait-what`、`teach`）。`SKILL.md` と `agents/openai.yaml` の暗黙起動抑制指定が一致する。自然文から自動起動しないことを失敗扱いせず、明示呼出とルート到達を検査する。残り11個は暗黙の肯定・否定トリガーを検査する。
- `C:/Users/rinta/Documents/1_projects/okf-devkit` のルートには `AGENTS.md`、`CLAUDE.md`、`skills-lock.json` がなく、プロジェクトのスキル導入も未実施。`ask-matt` が初回利用の前提とする `setup-matt-pocock-skills` の最小設定を今回に含めることは合意済み。
- 調査環境では Claude Code の user scope に `mattpocock-skills@claude-plugins-official` v1.2.3 が導入・有効化済み。repo scopeへの追加時には二重発見を検査する。ユーザースキルの確認範囲では候補25個と同名のものは見つからなかった。これは導入後の重複検査成功を意味しない。
- 対象プロジェクトの `.github/workflows/ci.yml` は `python tests/run_all.py` と別のsmoke検証を実行する。ハーネス導入後の検証では既存CIを維持し、スキル固有の検査と区別して記録する。

直接導入、最小設定の包含、OKFの `docs/backlog` による課題管理は合意済み。後続タスクは詳細化しない。

## 進め方

### 範囲と成果物

対象は `okf-devkit`。本タスクの詳細化と実際の導入は別であり、詳細化だけでは `state: done` にしない。

| 成果物 | 今回含める内容 |
| --- | --- |
| `.agents/skills/`、`.claude/skills/` | 上流インストーラーによるCodex用・Claude Code用のコピー。補助ファイルと製品メタデータを含む |
| `skills-lock.json` | インストーラーが生成する導入状態。手編集しない |
| `harness/project/skill-profile.md` | 採用理由、参照関係、導入・更新・撤去手順、検証結果。lockのハッシュ一覧を複製しない |
| `THIRD_PARTY_NOTICES.md` | 取得版の上流LICENSE全文と出所 |
| `.claude/settings.json` | 対象プロジェクトで上流プラグインを無効化。既存キーがあれば維持 |
| `AGENTS.md` | 課題管理、triage、ドメイン文書への短い参照と既存テストコマンド |
| `CLAUDE.md` | Claude Codeから同じ `AGENTS.md` を読むためだけの接続 |
| `docs/agents/issue-tracker.md`、`triage-labels.md`、`domain.md` | 下記の最小設定 |
| `okf.yml`、`docs/AGENTS.md`、`docs/CONVENTIONS.md`、テンプレート、生成index | `docs/backlog` を運用するための初期OKFバンドル |

日本語スキルガイド、作業サイズ別フロー、自前の検証・引継ぎ手順、retro、Obsidian設定は今回の成果物に含めない。後続タスクの本文は変更しない。

### 導入手順

1. 対象の作業ツリー、既存指示、repo/user/pluginのスキル名と実体パスを再確認し、開始コミットを記録する。別作業の変更があれば混ぜない。
2. 上流版とCLI版を記録し、SPEC §5.2 の25候補の呼出先、補助Markdown、`agents/openai.yaml` を検査する。名称変更・候補外依存・`in-progress`依存があれば黙って追加せず、差分と判断点を示す。製品コマンドや例示パスはスキル依存に数えない。
3. `okf-devkit` ルートで `claude plugin disable mattpocock-skills@claude-plugins-official --scope project` を実行し、対象プロジェクトで無効になったことを確認する。他のプロジェクトのuser設定は変更しない。
4. `npx skills@latest add mattpocock/skills -a codex -a claude-code --copy --skill <確定した25名>` を実行する。名前はSPEC候補と取得版の検査から展開し、全スキル指定やglobal導入を使わない。リンク・特権を前提にせず、コピー配置を確認する。
5. 取得版のMIT通知を保存する。プロフィールには上流URL、取得時点、確認可能な上流commit/ref、CLI版、実際のコマンドを記録する。lockにない版情報を推定で埋めない。
6. 合意した課題管理先と下記の最小設定を設置する。`setup-matt-pocock-skills` を使う場合も、この合意内容を渡し、既決事項を再質問させない。
7. 両製品の新しいセッションで下記の検査を実行し、結果を `skill-profile.md` に記録する。ファイル一覧だけで実際の発見・起動成功を代用しない。
8. 上流コピー・lock・ライセンス通知と、プロジェクト設定を区別してレビュー可能なコミットにする。上流変更に自前コアを混ぜない。導入成果物のコミットを本タスクの `evidence` に記入する。

### 最小設定

- 課題管理先: 対象プロジェクトの `docs/backlog/T-NNNN-<kebab>.md`。作成には仮想環境のPythonで `python -m okf_devkit.cli new backlog --title "..." --layer shared` を使い、書式は対象の `docs/CONVENTIONS.md` に定義する。GitHub Issuesと `.scratch/` は使わない。この設計リポジトリのT-0002自体は移動・複製せず、導入成果物コミットをここから参照する。
- triage: `tags` にカテゴリ `bug` / `enhancement` の一つと、`needs-triage` / `needs-info` / `ready-for-agent` / `ready-for-human` / `wontfix` の一つを記録する。`state` は進捗として別管理し、PRは受付対象にしない。
- ドメイン文書: single-context、ルート `CONTEXT.md` と `docs/project/decisions/`。空の用語集やADRは作らず、配置と利用規約だけを記す。
- 入口: `AGENTS.md` を正本にし、`CLAUDE.md` は参照だけにする。設定の本文を両方に複製しない。
- OKFの初期バンドルを既存CLIの雛形生成で作り、`shared` 層、必要な規約、backlogテンプレート、indexを整える。既存ファイルは再確認して維持する。hook登録や閲覧環境の整備まで広げない。

### 更新・巻戻し・撤去の確認

SPEC §5.5 の更新を小さな作業単位で行う。調査した上流CLIでは `update` の内部再導入に `--copy` / `--agent` の明示がないため、両製品のコピー配置が維持されるとは未検証のまま断言しない。

導入時に一時作業場所で更新を確認し、lock、採用名、コピー方式、両製品の配置、上流原文の保持を検査する。崩れる場合は採用名を限定した同じ `add ... -a codex -a claude-code --copy --skill ...` での再適用を検証して実コマンドを記録し、共通の更新規定を変える必要があればSPECへ提案する。プロフィールだけで共通規定を上書きしない。

巻戻しは上流変更コミットを戻して検証する。撤去は導入した上流ファイルとlockエントリをインストーラーの対応コマンドで除く手順を確認し、プロジェクト文書を削除しない。プラグイン無効化を戻す場合もこのタスクで追加した設定だけを戻す。

### 検査方法

| 検査 | 対象・成功条件 |
| --- | --- |
| 参照閉包 | 導入版の全25個の呼出先・補助ファイルが存在し、候補外・実験版参照がない |
| 重複 | 製品ごとに実際の利用可能一覧を取得し、採用名が一つの有効な導入元だけから発見される。別製品向けのコピーがあること自体は二重発見と数えない |
| 明示呼出 | 明示用14個が選択可能。`ask-matt` から設計、実装、診断、レビューの各代表ルートに実在する案内先で到達する |
| 暗黙呼出 | 暗黙用11個それぞれに日本語の肯定・否定プロンプトを用意し、期待する選択と実際の選択を両製品で記録する |
| 抑制 | 明示用の代表 `ask-matt`、`implement` が、名前を指定しない類似依頼で不用意に起動しない |
| 文脈負担 | 両製品で採用名の欠落、descriptionの短縮、一覧の省略警告を記録する。取得不能のトークン量を0としない |
| 最小設定 | 入口から3設定へ到達でき、架空の試験依頼で課題・ADRの出力先を正しく決定できる。外部投稿やcommitは実行しない |
| 更新 | 上記の更新確認を通し、コマンドと配置維持の結果を残す |
| 既存検証 | 対象の仮想環境で `python tests/run_all.py`。既存CIのsmoke結果も別記し、未実行を成功にしない。OKF初期化時はindexとlintも検査 |

トリガー表には製品・モデル・開始版・プロンプト・期待選択・実際の選択・結果・証拠の所在を記録する。呼出検査は小さな試験依頼で行い、上流フロー全体の実装を繰り返す評価には広げない。誤起動・欠落があれば原文を即座に改変せず原因と対応判断を記録する。受け入れ条件に関わる未実行・実行不能が残る間は導入完了にしない。

## 決定と根拠

- 上流スキルは対象リポジトリの直接依存とし、本ハーネスには同梱しない。→ SPEC §5.1 / §9.1
- 初期プロファイルはフォルダ数ではなく参照閉包で選ぶ。→ SPEC §5.2
- 英語原文はインストーラー管理のまま維持する。→ SPEC §5.3
- 上流更新と自前コア更新を同じコミットに混ぜない。→ SPEC §5.5
- okf-devkitでは両製品ともリポジトリ直接導入へ統一し、既存Claudeプラグインはプロジェクト単位で無効化する。利用者合意（2026-09-05）。
- 上流フローを使うための最小設定まで本タスクに含める。利用者合意（2026-09-05）。

## 完了条件

- [x] mattpocock/skills が `okf-devkit` から直接導入されている（受け入れ①）
- [x] `skill-profile.md` の全参照先が導入済みである（受け入れ②）
- [x] repo / user / plugin間に同名スキルの重複がない（受け入れ③。導入時の一覧・設定検査。Claudeモデル起動は下記で別判定）
- [x] `skills-lock.json`、出所、更新コマンド、MIT通知を確認できる（受け入れ④）
- [x] `in-progress` 配下が既定プロファイルに含まれていない
- [x] 肯定・否定トリガーと主要ルートの結果が記録されている（Claude側は2026-09-07の利用者確認で完了受理）
- [x] 両製品で発見と起動を確認し、文脈負担の観測を記録した（Claude側の残条件は同利用者確認で完了受理）
- [x] 最小設定と入口への接続があり、課題とドメイン文書の出力先が定まっている
- [x] 更新後も確定プロファイルと両製品のコピー配置を維持できる手順を確認した
- [x] 必須検証を4値で記録した
- [x] 成果物コミットを `evidence` に記入した
- [x] 残る製品検証を満たし、`state: done` と `done_at` を更新した

## 検証記録

| 識別子 | 結果 | 対象 | 証拠 |
| --- | --- | --- | --- |
| dependency-closure | 成功 | 導入版25スキル | 採用プロファイルの導入時記録。両製品のコピー、補助ファイル、ask-mattの24案内先を確認 |
| duplicate-scan | 成功 | 導入時のrepo / user / plugin一覧と設定 | 同記録で衝突0件、対象プロジェクトで上流プラグイン無効。モデル起動の結果とは区別 |
| trigger-positive-initial | 実行不能 | 初回検証のCodex / Claude Code | Codexの明示14・暗黙11は成功、当時のClaudeは未ログインで未観測 |
| trigger-negative-initial | 実行不能 | 初回検証のCodex / Claude Code | Codexの非該当11件・明示用抑制は成功、当時のClaudeは未ログインで未観測 |
| license-provenance | 成功 | 導入版のLICENSEと出所 | `THIRD_PARTY_NOTICES.md`、採用プロファイル、lockが存在 |
| minimal-setup | 成功 | 入口・課題管理・triage・ドメイン文書 | 同記録で一時場所のbacklog/ADR生成先と参照を確認 |
| context-load | 成功 | 導入時の一覧・Codex context probe | 採用名と明示/暗黙の扱いを記録。Claudeのモデル起動成功を意味しない |
| update-layout | 成功 | 導入時の一時作業場所 | `npx skills update -y` が終了0、両製品25コピーとlockを維持した記録 |
| project-required | 成功 | 導入時の対象venv / OKF | 既存144件成功、index check・lint error 0 / warn 0の記録 |
| claude-user-confirmation | 成功 | Claude Codeの確認 | 2026-09-07、利用者が「claudeの確認は大丈夫です」と報告し、該当部分の完了を指示 |

導入時の行は `okf-devkit` の設定コミット `585f9dfcfb398adc9edba70044eccd3d503a4a8a` にある `harness/project/skill-profile.md` の検証記録を照合したもの。Claude確認の最終行は今回の利用者報告による。エージェントによる再試験は行っていない。統合版のCI実結果は [T-0007の追補](/backlog/T-0007-obsidian-okf.md) を参照する。

## 結果

2026-09-07の整理で、導入未着手という旧記載を訂正した。上流導入 `427f726d756620006a4f1765810d7887c7a319ff` と最小設定 `585f9dfcfb398adc9edba70044eccd3d503a4a8a` は実在し、[okf-devkit PR #2](https://github.com/shirashu687/okf-devkit/pull/2) で本流 `c14025aea7e7f5e5c40bbe8ee25b37e00cf5d35c` へ統合済み。現物のプロファイル、lock、両製品の配置、通知を照合した。

2026-09-07、利用者のClaude Code確認済み報告と完了指示を受け、残っていた製品確認を完了として受理した。`state: done`、`done_at: 2026-09-07` に更新し、本タスクの残作業はない。過去の実行不能記録は初回検証の履歴として保持する。

詳細化文書の検証（2026-09-05）: 対象プロジェクトの `.venv/Scripts/python.exe -m okf_devkit.cli lint` は error 0 / warn 0。前回の仮想環境起動失敗は、許可された実行環境で同じPythonを起動して解消した。導入成果物の検証結果ではない。
