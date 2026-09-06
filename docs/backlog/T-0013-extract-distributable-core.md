---
type: Backlog Item
title: 共通コアを本リポジトリへ抽出し最小配布物を確立する
description: okf-devkitで実証した共通コアをharnessへ抽出し、二つ目の導入前にGitで版管理する最小配布物と管理手順を確立する。
tags: [shared, enhancement, ready-for-agent]
status: stable
layer: shared
generated:
  by: "codex/gpt-6"
  at: "2026-09-06"
state: doing
priority: high
effort: M
feasibility: B
ai: assisted
cost: false
created: "2026-09-06"
done_at: null
accepts: ["⑲"]
spec: ["§2.3", "§9.1.1", "§9.1.2", "§9.1.3", "§9.2", "§9.2.1", "§10"]
target: harness
evidence: ["45cad3ffeb17bfb01e8978d1afeca57ccf0a2efc"]
related: ["/backlog/T-0008-pilot-two-products.md", "/backlog/T-0009-second-repository-rollout.md"]
---

# 共通コアを本リポジトリへ抽出し最小配布物を確立する

## やりたいこと

実証済みの土台を別リポジトリへ配れる形にする。→ SPEC §9.1.1

## 背景・現状

現在の実装先はokf-devkitであり、従来の計画には実証から配布元確立への工程が明示されていなかった。配布の製品化を待たずに再利用可能な成果物を確立する工程として起票する。

詳細化時点の調査先は `C:/Users/rinta/Documents/1_projects/okf-devkit`、調査時HEADは `8c72c05274bf6880778c9a89a98221b189b57943`。`harness/core/` の6ファイルが抽出候補で、`policy/requirements.md` には対象固有の検証コマンド・CI・変更検査の仕様が混在している。`harness/install.json` は未設置。実証記録は同リポジトリの `harness/state/journal/T-0008-pilot-two-products.md` にある。これらは調査時点の所在・観測であり、実装時にパスと版を再確認する。

## 進め方

詳細化は先行して行い、実装は別セッションで、進行中のCodexによる条件を揃えた比較再試行が終了してから開始する（「決定と根拠」の着手条件を参照）。T-0009着手前に完了する。

### 作成する成果物

| 配置（harnessリポジトリ基準） | 内容・実装上の扱い |
| --- | --- |
| `distribution/core/guide.md` | 用途カタログと基本フローを共通化。実採用・配置・製品別の確認状態はprojectのprofileへ分離（→ SPEC §2.3） |
| `distribution/core/policy/requirements.md` | 共通制約を残し、okf-devkit固有の強制点と検査仕様をproject側へ分離 |
| `distribution/core/procedures/verify-report.md` | 4値検証と完了報告の共通手順 |
| `distribution/core/procedures/handover.md` | 中断・再開の共通手順 |
| `distribution/core/procedures/retrospective.md` | retroゲートと台帳の共通手順 |
| `distribution/core/templates/worklog.md` | 空の作業記録雛形 |
| `distribution/templates/config.md` | `harness/project/config.md` の初回雛形 |
| `distribution/templates/skill-profile.md` | `harness/project/skill-profile.md` の初回雛形 |
| `distribution/templates/ledger.md` | `harness/ledger.md` の空の雛形 |
| `distribution/templates/agents-entry.md` | 既存 `AGENTS.md` へ必要な参照を加える断片 |
| `distribution/templates/claude-entry.md` | 必要な場合だけ `CLAUDE.md` からAGENTSへ接続する断片。実機対応の保証とはしない |
| `distribution/manifest.json` | 上記11ファイルの明示一覧。コア6本は `core`、設定・profile・台帳は `seed`、入口2本は `manual`。形式は → SPEC §9.1.3 |
| `docs/project/harness-distribution.md` | `How-To`。5操作の手順、記録の生成・照合、復旧、演習方法。`code_globs` は `distribution/**` と `tests/test_distribution.py` |
| `tests/test_distribution.py` | Python標準ライブラリのunittestによる配布境界・記録・内容一致の検証。実プロジェクトを書き換えず、一時fixtureと配布物を対象にする |

`distribution/core/<path>` は導入先の `harness/core/<path>` へ配置する。配布用Markdownは導入後の配置を基準にリンクを書く。配布元ツリーだけではproject側参照が解決しないため、検証時は導入後のfixtureで辿る。配布ファイルにOKFを必須とするfrontmatterや固有コマンドを追加しない。手順書はこのリポジトリのOKF規約に従う。

### 雛形と抽出の具体条件

| 対象 | 必須内容・照合点 |
| --- | --- |
| config | 入口、仕様・課題、ドメイン文書、検証、review、worklog、ledger、profileの役割対応。検証ごとの実行場所・コマンド・前提・期待結果・適用条件。制約ごとの実在強制点・確認方法・限界。OKF採否と検査対象範囲 |
| skill-profile | 候補と採用済みを分離。採用理由、導入状態の正本への参照、実効配置、用途・起動条件・依存、製品ごとの確認状態、更新・巻戻し・撤去方法。上流lockの状態や25スキル導入済みという値を雛形に複製しない |
| ledger | SPEC §7.3の列を持つ空表と共通手順への参照。観測・試行・採用済みの実データを入れず、日時・ID・改善効果を捏造しない |
| 入口断片 | guide/config/policy/profileを読む条件と参照。AGENTS全文を置き換えず、CLAUDEは必要な場合の接続のみ |
| requirements | 既存の制約を弱めず、具体的な強制点、保護一覧、宣言、終了値、CIのPR/push差をokf-devkitのconfigへ移す。共通の制約から固有の確認方法へ到達できるようにする |
| 共通手順・worklog | 4値、対象版、二軸review、retro、再開情報を保持。OKF・特定製品・未導入スキルを日常手順の必須依存にしない。SPEC参照は根拠と日常の必読を分ける（→ SPEC §9.1.2） |

雛形の未設定欄には何を調べて埋めるかを書く。導入時には必須の役割参照・検証コマンド・制約の確認方法を埋め、存在しないコマンドや文書へのリンクを完成扱いにしない。採用しない任意機能は理由つきで明示できる。上流スキルの呼出候補は採用プロファイルから解決し、未導入への直接リンクを有効な実行導線として残さない。

### 手順書に実装する操作

手順書はPowerShell＋Git＋Pythonで実行できる明示手順とする。利用可能なPython実体を開始時に確認し、コマンド中の変数は配布元・版・導入先を実在値に置き換える。専用の公開インストーラーや一括導入CLIを作らない。記録の形式・ハッシュ・事前停止・復旧の契約は → SPEC §9.1.3 / §9.2.1。

| 操作 | 本タスクで手順化する流れ |
| --- | --- |
| 新規導入 | 固定コミットのmanifestを読み、管理配置先に既存物がないことを確認する。seedが既存なら上書きせず役割と不足を確認する。コアを設置し、不足するseedだけを作成・記入し、入口を接続する。参照・必須検証後に導入記録を作り、再照合する |
| 既存pilot移行 | install.jsonがないokf-devkitだけの明示的な移行。開始SHAと現物を記録し、コアの抽出差分とconfig/profileへの移設差分を列挙する。宣言とworklogを用意して既存機能を保持しながら配布版へ一致させ、記録を新設する。不明な既存物を新規導入の処理で黙って採用しない |
| 更新 | 現行記録とコアの照合後、現行版・目的版の和集合で変更計画を作る。目的版の追加・変更・削除だけを反映し、seedは再適用しない。必要検証後に目的版の記録へ置換する |
| 巻戻し | 以前の配布コミットを目的版として同じ照合を行う。新しい版だけにある管理ファイルを削除し、旧版だけにあるものを戻す。旧版を使えるproject設定・参照であることも確認する |
| 撤去 | AGENTS/CLAUDE/config/profile等のコア参照を列挙し、該当参照だけを手動編集する（→ SPEC §9.2）。本来の指示・検証導線と参照解消を確認後、記録・配布元と一致する管理ファイルだけを削除し、記録を撤去する。project・state・ledger・上流・既存文書は保持する |

再導入は、同じ版の有効なinstall.jsonがある場合は全照合して変更なしで終える。記録のない既存コアは新規導入として続行しない。更新・巻戻しの記録には目的版のコアだけを含める。未解決の必須設定や不適合を「運用のみ」と書き換えて完了させない。

途中失敗の演習では変更済みファイルと退避を照合し、操作前へ戻して再試行できることを確認する。手順は作業記録と対象限定の退避で復旧し、自動トランザクション機構を製品として追加しない。

### 実装の順序

1. Codex比較再試行の結果を確認し、抽出元と本リポジトリの開始SHA・作業ツリー状態を記録する。
2. コア6ファイルを抽出し、固有の強制点をokf-devkitのproject側へ移す。対象専用の `harness/project/check_changes.py` と `tests/test_harness_changes.py` は抽出しない。
3. 雛形、配布対象一覧、配布手順書と導入記録の形式を作る。所有・版の契約は → SPEC §9.1.2。
4. 一時的な検証用Gitリポジトリで4操作を演習し、配布境界と参照を検査する。演習の必須性は → SPEC §9.2。
5. GitHubの配布先を確認・接続し、検証済み配布物コミットを置く。GitHub URLから独立した一時cloneを作り、完全SHA、manifest、配布ファイル、手順書の取得・照合を行って正式な配布版を確定する（→ SPEC §9.1.2）。
6. okf-devkitの共通部分をその版へ移行し、GitHub URLを出所とする `harness/install.json` を作る。固有領域と既存検証の保持を照合する。
7. 成果物の版・検証記録・実装差分のレビューを揃えて本タスクを完了し、後続には配布元・版・手順の所在だけを渡す。

GitHubの接続・取得確認はこの詳細化では実行せず、上記の実装セッションで行う。開始時に配布先の所有者・リポジトリ名・公開範囲・利用権限を確認し、既存設定から確定できない値だけ利用者に確認する。準備・演習にはローカルGitを使えるが、GitHubからの取得確認をローカルcloneで代用して完了にしない。リモート操作を行う前に対象コミットと送信する履歴・差分を確認する。

### okf-devkit移行の保全と検証

- 移設先は既存の `harness/project/config.md` と `skill-profile.md` を使い、雛形で置き換えない。変更可能な差分を事前に列挙し、既存の役割対応、検証要件、制約、25スキルの採用状態と製品差を保持する。
- 上流スキルの両製品コピー、lock、通知、製品設定、既存検査スクリプト・テスト・CI、既存journal・ledger実データは比較前後で保持を確認する。今回追加するworklogと宣言は既存データの変更と分ける。既存入口は役割を維持し、接続変更が必要な場合だけ差分を列挙する。
- 対象のAGENTS/configが指定する `.venv/Scripts/python.exe tests/run_all.py` と `.venv/Scripts/python.exe harness/project/check_changes.py --base <移行開始の完全SHA>` を対象ルートで実行する。保護対象・profile等の変更は `harness/state/journal/T-0013-extract-distributable-core.changes.json` に列挙し、同名のworklogと結びつける。正確な宣言書式は対象configを読む。
- 対象のOKF文書を変更した場合は対象configに従い index生成・lint・index確認を追加し、コード変更ならaffectedの結果を扱う。検査を通すために保護対象や必須検証を外さない。
- 調査時は対象venvの起動ができなかったため、実装開始時に実行環境を再確認する。別Pythonでの代替確認を対象venvの検証成功と扱わない。ローカルテスト、CI、Claude Code実機の結果を区別する。

### 配布用の検証ケース

実配布物を使った新規fixtureと、移行前状態を模したpilot fixtureを分ける。v1/v2は演習用コミットとし、追加・変更・削除を含むv2を検証用リポジトリだけで作る。疑似v2を正式配布版と混同しない。操作手順の実演と、終了後のファイル一覧・内容・参照・保全の判定を分け、コピー処理自身の成功表示だけを証拠にしない。

| ケース | 期待する観測 |
| --- | --- |
| GitHubからの独立取得 | 正式URLから新しいcloneを作り、配布SHAを解決してmanifest・配布ファイル・手順書を取得できる。ローカルの未送信コミットに依存せず、内容が配布版と一致する |
| 新規導入→同版再導入 | コアと記録が配布元に一致。2回目は入口・設定・台帳を含め変更なし |
| pilotの明示移行 | 記録なし既存物は通常導入では停止。移行手順では列挙した差分だけで導入記録が成立し、既存機能・実データが残る |
| v1→v2→v1 | 変更が反映・復元され、v2で追加した管理ファイルは巻戻しで消え、v2で削除したものは戻る。固有領域と未知ファイルを巻き込まない |
| 手修正・欠落・未知の配置先 | 全対象の検査で停止し、他の管理ファイルや記録も操作前から変わらない |
| 記録破損・未知schema・偽ハッシュ | 配布元のmanifest・内容と照合して停止。改変された管理一覧だけを信じない |
| パス逸脱・重複・大小文字衝突 | 対象外パスに書き込まず停止。manifestの明示一覧にない配布物も不適合 |
| LF/CRLF/CR・末尾改行 | 改行表現だけの差は一致。文字・空白・末尾改行の有無が変われば不一致。BOM・不正UTF-8は停止 |
| 途中失敗→復旧→再試行 | 一部だけ変更した状態を成功としない。対象限定で復旧し、並行した別変更があれば上書きせず止まる |
| 撤去→再導入 | コアと記録の撤去、入口参照の解消、固有領域保持を確認。再導入して入口・台帳が重複しない |
| profile・非OKF構成 | 採用済み呼出先は実在し、候補を導入済みと誤認しない。SPECコピー・OKF CLIなしでも日常手順を辿れる |

配布元リポジトリで `python -m unittest discover -s tests -p test_distribution.py` を実行する。公開用の変更コマンドを増やさず、検証用fixture内だけで故障状態を作る。手順書の5操作の演習結果も別途記録し、unittest成功だけで手順演習済みとしない。

### 実装セッションが残す証拠

- 抽出元okf-devkitの完全SHA、Codex再試行の結果所在、今回の差分に取り込んだ内容と残した課題。
- harnessのGitHub配布元URL、配布物コミット、manifestの所在・ハッシュ、独立cloneでの取得確認とその版での演習結果。自己SHAを配布物へ追記するためにコミットを作り直さない。
- okf-devkitの移行コミット、導入記録、コア6本の正規化内容一致、固有領域の保全差分、対象必須検証とreviewの結果。
- `evidence` には配布物コミットと移行コミットを入れ、「結果」欄でリポジトリとの対応を明示する。タスク完了の記録コミットを配布版と取り違えない。
- 後続へ渡すものは配布元・完全SHA・`docs/project/harness-distribution.md` の所在と未確認範囲。後続タスクの設計や実装計画を書き足さない。

## 決定と根拠

- 2026-09-06 今回の利用者指定：配布物の確立・検証・GitHub取得確認まで実施し、okf-devkitへの移行は次セッションへ送る。T-0013はdoing、done_atはnullを維持し、後続タスクを詳細化しない。GitHubは `shirashu687/harness` をpublicで新規作成する承認を取得した。

- 2026-09-06 利用者判断：Claude Codeは現状利用できないため、その実証はスキップ予定とする。T-0013の詳細化は先行し、実装は並行中のCodex比較再試行終了後に別セッションで行う。これは本タスクの着手順序についての例外であり、受け入れ⑰の達成や2製品での実証成功を意味しない。
- 実装開始時に比較再試行の結果・証拠所在・抽出元コミットを確認し、判明した不適合と残存課題を引き継ぐ。現在調査済みの旧比較結果やHEADを、再試行後の確定結果・抽出元として代用しない。Claude Codeの未確認範囲を消さず、T-0008の状態更新は並行作業側に委ねる。
- 配布元、所有境界、還元、最小配布と製品化の区別は → SPEC §9.1.1。
- 固有領域を保護する更新・巻戻し・撤去は → SPEC §9.2。
- 2026-09-06 Q2〜Q5合意：配布境界と版管理は → SPEC §9.1.2、4操作の演習は → SPEC §9.2。具体配置は本タスクの成果物表に従う。配布ファイルを `distribution/` に分け、本リポジトリ自身へのハーネス適用と混同しない。
- okf-devkitとの照合だけでなく実移行を実装範囲に含めるため、成果物はharnessとokf-devkitの2リポジトリにまたがる。`target: harness` は主成果物を示す。
- ScheLiveAppの導入・実環境演習、後続タスクの詳細化は本タスクの対象外。
- 2026-09-06 Q6・Q7合意：ファイル単位の管理、改行差を除いたハッシュ照合と事前停止は → SPEC §9.1.3 / §9.2.1。用途カタログと実採用の分離は → SPEC §2.3。日常手順と固定版SPECへの根拠参照は → SPEC §9.1.2。
- 2026-09-06 Q8合意：比較再試行で改善効果が確認できなくても、結果と限界を記録して抽出を進められる。ただし、共通手順の成立・固有領域の保持・検証の正確さを妨げる欠陥は修正・再検証してから配布版を確定する。実証中の未採用改善案を自動で共通ルールへ昇格させない。
- 2026-09-06 Q9合意：GitHubで管理する方針を採用し、正式配布元の契約は → SPEC §9.1.2。接続・配布コミットの送信・独立cloneでの取得確認を本タスクの実装範囲に含め、今回の詳細化では実施しない。
- 2026-09-06 Q10合意：入口の自動除去用マーカーを作らず、該当参照を確認して手動編集する。共通契約は → SPEC §9.2。
- 2026-09-06 GPT-5.5による批判的レビュー：SHAの取得元と自己参照、記録なしpilot移行、SPECとの順序整合、改行ハッシュ、故障注入、固有領域保持の判定、候補/採用済み区別を指摘。出所の到達性はQ9の利用者判断で確定し、それ以外は上記手順と参照先SPECへ具体化した。これは設計レビューであり、実装差分のreviewや動作検証を済ませたという意味ではない。
- 同モデルの再レビューでは、当時回答待ちだったQ9を除く主要指摘の解消と、実装開始を妨げる設計抜けが見つからないことを確認した。Pythonの実体は環境ごとに解決し、PATH上の `python` が利用可能だと仮定しない。

## 完了条件

- [ ] Codex比較再試行が終了し、結果・抽出元SHA・残存課題を確認した。Claude Code未確認を実証成功と扱っていない
- [ ] 成果物表のコア6本・雛形5本・manifest・手順書・検証があり、配布版を完全SHAで特定できる
- [ ] manifestの明示一覧と配布ファイルが一致し、固有設定・作業記録・台帳実データ・上流本体・対象専用検査が混入していない
- [ ] SPEC §9.1.3の記録・ハッシュが実配布物で成立し、出所の固定版から再取得・再照合できる
- [ ] GitHubの正式配布元URLから独立したcloneを作り、配布SHA・manifest・配布ファイル・手順書を取得して内容一致を確認した
- [ ] 新規導入・pilot移行・更新・巻戻し・撤去の手順があり、再導入・故障注入・復旧を含む全検証ケースを確認した
- [ ] 導入後のリンクと採用プロファイルが成立し、非OKF構成でもSPECコピーなしで日常手順を辿れる
- [ ] okf-devkitを配布版へ実移行し、install.jsonとコアの一致、事前列挙した移設差分だけでの固有機能・実データ保持を確認した
- [ ] 対象の必須既存テスト・変更宣言検査、適用する文書検査が成立し、CI/製品実機の未確認範囲を分けて記録した
- [ ] T-0009で使う配布元・版・手順が特定されている
- [ ] 固定比較点からの仕様軸・標準軸reviewと必要な再検証が済み、必須検証を4値で記録し、2リポジトリの成果物コミットをevidenceと結果へ対応づけた
- [ ] stateをdoneにし、done_atを記入した

## 検証記録

| 識別子 | 結果 | 対象（コミット・版） | 証拠（要約・ログ所在） |
|---|---|---|---|
| distribution-boundary | 成功 | `45cad3ffeb17bfb01e8978d1afeca57ccf0a2efc` | 11ファイル、core6本、混入・schema・パス境界をunittestで確認 |
| source-version-and-install-record | 成功 | `45cad3ffeb17bfb01e8978d1afeca57ccf0a2efc` | 固定Git blobと現物全11本一致。manifest正規化SHA-256は結果欄。fixture導入記録を再計算照合 |
| github-source-retrieval | 実行不能 | `45cad3ffeb17bfb01e8978d1afeca57ccf0a2efc` | 自動承認レビューが作成＋pushを拒否。既存履歴を含む公開範囲の追加回答待ち。リモートは未作成・未接続 |
| installed-links-and-profile | 成功 | `45cad3ffeb17bfb01e8978d1afeca57ccf0a2efc` | 非OKF fixtureの役割と実コマンドを記入し、journal複製後を含むリンク・候補/採用区別を確認 |
| lifecycle-procedures | 成功 | `45cad3ffeb17bfb01e8978d1afeca57ccf0a2efc` | unittestとは別の一時Gitで5操作・同版再導入・追加変更削除を含む巻戻し・撤去時参照を演習 |
| conflict-and-recovery | 成功 | `45cad3ffeb17bfb01e8978d1afeca57ccf0a2efc` | 手修正・欠落・未知ファイル・不正記録は操作前不変。故障注入、限定復旧、再試行、競合停止 |
| pilot-reconciliation | 未実行 | `45cad3ffeb17bfb01e8978d1afeca57ccf0a2efc` | 利用者指定で実移行は次セッション。pilot fixtureの成功とは区別 |
| pilot-required-checks | 未実行 | `45cad3ffeb17bfb01e8978d1afeca57ccf0a2efc` | 今回okf-devkitは変更しないため、移行後の対象venv・変更宣言検査は次セッション |
| harness-docs | 成功 | `45cad3ffeb17bfb01e8978d1afeca57ccf0a2efc` | affectedで手順書を特定、index生成・lint error 0/warn 0・index check・diff check成功 |
| implementation-review | 成功 | `45cad3ffeb17bfb01e8978d1afeca57ccf0a2efc` | 今回範囲の二軸review。仕様1件修正後0、標準0。okf-devkit移行のreviewは未実行 |

結果は成功 / 失敗 / 未実行 / 実行不能のいずれか。ここは実装成果物の検証表であり、詳細化中の文書検査を実装成功として転記しない。現在の未実行理由は実装を別セッションで行うため。必須条件の未達が残る場合はstateをdoneにしない。

## 結果

配布物の実装中。移行は利用者指定で次セッションへ分け、stateはdoingを維持する。

### 着手確認

- harness開始SHA：`b6c378b6435cf7e0bf2989523843a80306f5594d`、開始時作業ツリー変更なし。別作業場所 `C:/@git_repogitories/72c0/harness` の合意済みSPECとT-0013を今回の開始版へ取り込んだ。後続タスクは変更していない。
- 抽出元：`C:/Users/rinta/Documents/1_projects/okf-devkit`、完全SHA `9724d5dc1095a433d654d41444c7fe450b3c7443`、開始時変更なし。今回のセッションでは読み取りのみ。
- 比較再試行終了：Codex task `01a075cd-14f0-7351-aa07-397ff0546df3` の比較実施turnはcompleted。証拠は抽出元の `harness/state/journal/T-0008-r2.md` と `T-0008-r2-evidence/`。
- R2は元版 `8c72c05274bf6880778c9a89a98221b189b57943`、同モデル設定・Python 3.12.14。A成果 `d49f3256b696b271a91d14d31bcabf5ffb989b0a`、B成果 `885dbb71f6d0f34fb723858a065771d5441eb9a9`。両側164件・独立出力7件成功、両軸要修正0件。改善差は未確認、読込量・token・未発動の網羅測定は欠測、CI/Claude Codeは未実行。⑯⑰達成とはしない。
- R2の製品修正・未採用改善候補は抽出しない。小作業の省略方針を保持する。policyの固有checker/CI仕様とguideの実採用索引は配布から分離し、実移設は次セッション。worklogはjournal複製後に相対参照が壊れないようconfigの役割対応から辿る形へ修正した。

### 配布前検証とレビュー

- `python -B -m unittest discover -s tests -p test_distribution.py`：成功、11件。実体は同梱Python 3.12.14。初回23.232秒、schema修正後23.412秒。テスト自身が注入する失敗は期待する拒否として判定する。
- 別の手順演習：成功。手順書の読取り照合器と明示反映・退避・復旧を一時Gitで実行し、5操作、同版再導入、途中失敗復旧、撤去後再導入を確認。新規fixtureは実在する `checks.py` と必須役割を記入し、SPECコピー・OKFなしで参照確認。pilot fixtureはpolicy→configだけの移設を許容し固有データを比較した。正式なokf-devkit移行ではない。
- 演習原本：`C:/Users/rinta/AppData/Local/Temp/t0013-exercise.py`、結果 `t0013-exercise-result.json`、fixture `t0013-manual-1nltq2mk`。演習用v1 `f6c4920595802db008e712993d9249939228ed7c` / v2 `252abcf0c7f5879cd798662da1ee0b99248f8504` は正式配布SHAではない。
- 仕様軸：初回に導入記録schemaがtrue/1.0を受理するP2指摘1件。整数型検査と操作前後不変の回帰ケースを追加し、再レビューは残存0件。seed/manual配置先の事前検査も補強した。
- 標準軸：要修正0件。比較点は開始SHA、未コミット・未追跡配布ファイルと手順書・検証コードを含む。証拠欄は後続の記録コミットで確定する。
- 文書：affectedは配布手順書を列挙。SPECはcode_globs未カバーだが正本として直接確認。index生成、lint error 0 / warn 0、diff check成功。
- 公開対象確認：現在の12コミット・174個の一意blob、ファイル一覧と履歴・差分を確認。秘密鍵・主要token形式の検査で一致なし（完全な秘密情報検出の保証ではない）。既存調査用 `.agents/skills` はMIT通知を保持し、配布manifest対象外。branch一つだけを送信し、他worktreeの作業・比較の隔離成果は送らない。

### 次セッションへ残す範囲

okf-devkitの実移行・install.json新設・固有強制点と採用索引の実移設・対象venv全件検証・変更宣言検査は未実行（今回の利用者指定）。CI・Claude Code実機も未実行。T-0008の状態更新と後続タスク詳細化は行っていない。

### 配布版の固定

- 配布物コミット：`45cad3ffeb17bfb01e8978d1afeca57ccf0a2efc`（harness）。このSHAの配布物は以後書き換えず、検証・引継ぎ記録は別コミットにする。
- manifest：`distribution/manifest.json`、`sha256-canonical-text-v1` によるSHA-256 `46d193e267973b8d3b3808f5d0c2fea3f953aff5b234ab3e97b8d2a4d8004a03`。コミット内blobと作業ツリーの配布全11本を同方式で照合済み。
- 公開待ち：publicリポジトリ作成＋pushは自動承認レビューが拒否（作成承認だけでは既存履歴・ファイル全体の公開承認を確認できないため）。履歴12コミットと既存設計・バックログ・MIT通知付き調査用スキル・今回成果の具体範囲を提示して追加確認中。GitHubからの取得はまだ成功としない。

### 中断時の次の一手

公開範囲の回答が承認なら、上記配布コミットを含む `codex/t-0013-distribution` だけを `https://github.com/shirashu687/harness` へ送信する。認証確認済み所有者はshirashu687、public作成自体は承認済み。作成＋pushのツール呼出しは実行前に拒否され、今回remoteはまだ存在しない。GitHubの存在を再確認してから作成・接続し、別の一時cloneで配布完全SHAをcheckout、manifestと11本・手順書を照合し、そのcloneでunittestと別手順演習を実行してgithub-source-retrievalを更新する。回答が拒否なら公開しない。

移行セッションは、このGitHub取得確認が済んだ配布SHAと手順書を読み、okf-devkitの現在HEAD・作業ツリーを再確認して、policy固有情報と採用索引の移設差分を列挙するところから開始する。現時点ではGitHub取得確認が未達のため、正式配布元確立済みとは扱わない。

retro：今回の差分・検証・review・引継ぎを照合。schema型の検査漏れは独立reviewで検出・回帰を追加、環境のGit管理領域/認証アクセスと公開承認境界は既存権限を保って対処した。原因は数値等価と形式型の区別不足、公開範囲の粒度不足であり、再発・改善効果の数値は未測定。新しい共通ルールや対象側ledgerの実データを追加せず、今回の修正と未解決の公開承認を本タスクに記録して引き継ぐ。
