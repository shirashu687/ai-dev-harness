---
type: Backlog Item
title: ScheLiveAppへ独立した二依存として導入する
description: ScheLiveAppへ上流スキルと自前ハーネスを別々の依存として導入し、更新・巻戻し・撤去で固有領域が保たれるか確認する。
tags: [shared, enhancement]
status: stable
layer: shared
generated:
  by: "process:codex"
  at: "2026-09-08"
state: done
priority: medium
effort: XL
feasibility: B
ai: assisted
cost: false
created: "2026-09-05"
done_at: "2026-09-08"
accepts: ["⑱", "⑲"]
spec: ["§2.2", "§5.1", "§5.2", "§5.5", "§6.3", "§8.1", "§8.3", "§9", "§10"]
target: ScheLiveApp
evidence: ["0a893db55a4588958127288cf5b25378b4bef65c", "5dc7133c20b476af0d695962fbcf51b675dd84e2", "af43950d4ed5ea1aa1d0d14ae3be9a111a2f7a86", "073222a8ef1e8f52bfc9551720f5d0dc35d703a3", "8dee3d85b537b4c71b1f53d024c440943530ea4b", "897e90ddf3535c0adea47bfddcc3d69fc4f54d80"]
related: ["/backlog/T-0002-upstream-skills-dependency.md", "/backlog/T-0008-pilot-two-products.md", "/backlog/T-0013-extract-distributable-core.md", "/project/harness-distribution.md", "/backlog/T-0011-distribution-strategy.md", "/backlog/T-0010-plugin-and-bootstrap.md"]
---

# ScheLiveAppへ独立した二依存として導入する

## やりたいこと

mattpocock/skillsはScheLiveApp自身から上流へ直接接続し、本ハーネス固有部分は別の導入元・版・管理範囲として入れる。

## 背景・現状

二つ目のリポジトリでは、既存入口、OKF、CI、フック、プロジェクト固有設定との衝突が実際の移植性試験になる。上流スキルを本ハーネスへ同梱すると、更新責任と差分が混ざるため行わない。

### 現状調査（2026-09-07、読み取りのみ）

- 対象は `C:/Users/rinta/Documents/0_ReactApp/ScheLiveApp`。調査時は `main`、HEAD `b9bcfb5d01c17d9ff4cc01e1d45d2231c4893ce8`。実装開始時に対象版・既存差分・並行作業を再確認する。
- 既存差分は `docs/backlog/index.md`、未追跡は `.claude/settings.local.json` と `docs/backlog/B-0015-token-auth-package.md`。複数の製品worktreeも登録済みであり、既存差分を導入成果へ混ぜない。Gitのglobal ignore・pytest cacheに読取り警告があり、環境全体の完全な監査を済ませたとは扱わない。
- `.agents/`、`skills-lock.json`、`harness/`、`CONTEXT.md`、`THIRD_PARTY_NOTICES.md` は存在せず、`.claude/skills/` は空。プロジェクト内の上流依存・自前コアは新規導入に該当する。製品が発見するグローバルスキルとの重複は実装時に確認する。
- 正式配布元・固定版・取得証拠の正は [T-0013の結果](/backlog/T-0013-extract-distributable-core.md)。その固定SHAがローカルGitに実在し、現在HEADの配布物・手順・照合器と差分がないことを確認した。配布内容は実質1版であり、SHAだけ違う同じ内容を更新の実証には使わない。GitHubからの再取得は今回未実行。

以下のパスはScheLiveAppルートからの相対パス。表の接続方針は調査に基づく案であり、既存ファイルは変更していない。

| 役割 | 現状と根拠 | 接続案・注意点 |
| --- | --- | --- |
| 入口 | `AGENTS.md:3` が `CLAUDE.md` を入口と指定。CLAUDE.mdは289行 | プロジェクト情報の参照先を保持してハーネスの導線を追加する。配布のCLAUDE→AGENTS断片をそのまま加えると循環するため、参照方向を整理する |
| 用語・ADR | `docs/project/glossary.md`、`docs/project/decisions/` が存在 | 既存配置を役割対応表へ写像する（→ SPEC §2.2）。同じ用語や決定をCONTEXT.mdへ複製しない |
| OKF・バックログ | `docs/AGENTS.md:78`、`scripts/docs/config.yml:73`。CLIは `python scripts/docs/okf.py`、採番はB-NNNN | 既存CLIと完了契約をconfigから参照する。harness設計repoのCLIやT-NNNN採番を持ち込まない |
| 作業記録 | `CLAUDE.md:286` は外部workingFolderへ作業メモ等を置く指定。`docs/AGENTS.md:100` は恒久文書のdocs外配置を禁止 | 一時メモ、Gitに残す引継ぎ・改善記録、恒久文書の境界とハーネス配置の扱いを接続時に明記する |
| フック | `.claude/settings.json:3`、`.codex/hooks.json:4`。両製品のStopは `render --hook` | 既存HTML生成を保持する。`sync --gate` は存在するが現行Stopには未接続であり、フックを検証完了の強制点として記録しない |
| 必須検証 | `.github/workflows/ci.yml` のOKF Docs、Frontend、Batch、PHP Syntax、API Auth Boundaryの5ジョブ | 実コマンド・適用範囲・強制点をconfigへ対応づける。ローカル実行結果、CI実行結果、ブランチ保護の必須指定はそれぞれ確認する |

PATH照会ではnode/npmを確認し、python/php/bash/shは見つからなかった。既存venvとclientのnode_modulesはあるが、対象の依存充足・起動・ビルド・テスト・CIは今回未検証。

## 進め方

T-0013完了を着手条件とし、そこで確立した配布物を使う（→ SPEC §9.1.1）。既存役割を写像して不足だけを導入し、上流更新と自前コア更新を別コミットで一回ずつ演習する。その後、巻戻しと撤去を行い、固有領域と本来の検証が保たれるか確認する。

2026-09-07に `grill-with-docs` で検討を開始した。現状調査と利用者の判断を本タスクへ記録し、演習方法・既存構成への接続・検証条件を具体化する。現時点では対象プロジェクトへの導入は開始していない。

### 実装計画（別セッションへ引継ぎ）

1. **開始条件を固定する。** 対象の最新HEAD・既存差分・並行作業を再照合し、固定HEADから隔離したScheLiveAppの作業コピーを用意する。既存未コミット変更は元の場所に保持する。配布元、採用する上流版、CLIと実行環境を照合し、導入前の検証結果と保護対象を記録する。
2. **上流を直接導入する。** okf-devkitで採用したengineering-flowの25件を初期候補とし、固定した上流版で参照閉包・補助ファイル・Codexの発見範囲を確認して採用集合を確定する（→ SPEC §5.2）。Codex向けにプロジェクトスコープのコピー導入を行い、lock・出所・通知・プロファイルを上流側の変更としてまとめる。
3. **正式コアとプロジェクト接続を導入する。** T-0013の配布手順を使い、上の役割対応表とQ4をconfig・入口・文書規約へ反映する。短いAGENTS.mdから既存CLAUDE.mdの技術情報とコアへ到達できるようにし、CLAUDE.mdからAGENTS.mdへ戻す配布断片は加えない。既存OKFの完了契約、用語・ADR・バックログ、CI、HTML生成フックを保持し、強制点と運用上の限界をconfigへ記録する。
4. **二依存の更新・巻戻し・撤去を別々に演習する。** 上流は下記の公式履歴の2版、自前コアはQ3の演習版を使う。操作ごとに対象依存・対象版・変更予定・復旧方法を固定し、もう一方の依存と固有領域が保たれることを確認する（→ SPEC §9.2.1）。コアに手修正・未知ファイルがある場合の停止と、同版再導入・撤去後再導入で重複しないことも確認する。
5. **導入先として検証する。** 下表の本来の検証を導入前後で照合する。Codexでは小さな実在作業または導入内容の確認作業を使い、入口、日本語案内、採用スキルの肯定・否定トリガー、既存制約、4値の検証報告を確認する（→ SPEC §8.3）。不要な製品機能や架空の不具合を作らず、T-0008の比較評価を繰り返す条件にも置かない。
6. **継続利用する状態を反映する。** 演習記録と継続導入差分を分け、上流・コアそれぞれの成果物コミットを固定する。正式コアと確認済みの採用上流版が残る導入差分をレビューし、既存差分との再照合後にScheLiveAppへ反映する。対象worklogに実行証拠・失敗履歴・未確認範囲を残し、本タスクには成果物コミットと要点を記録する。

この計画の実装対象は上流直接依存、自前コア、ScheLiveApp固有の接続と検証である。アプリ機能の改修、OKF CLIの置換、フックへの新しい停止ゲート追加、T-0008の効果改善認定、後続の配布製品化は含めない。

### 上流の版指定と実装時の確認

- 更新演習の候補は、旧 `885e2ca4d842d139e9aef4e48d366c63cb1b8013` → 新 `0ab1b63a410a03d3627979a109c8695de27af954`。[公式変更履歴](https://github.com/mattpocock/skills/commit/0ab1b63a410a03d3627979a109c8695de27af954) では新の第1親が旧で、採用対象の `skills/productivity/grilling/SKILL.md` に質問区切りの変更がある。実装時に両版を直接取得して、採用集合・参照閉包・実際の内容差を確認する。
- CLI候補は `skills@1.5.24`。[公開metadata](https://registry.npmjs.org/skills/1.5.24) はNode `>=22.20.0` を要求する。[公式README](https://github.com/vercel-labs/skills#options) と現行ソースで、プロジェクトスコープ・`-a codex`・`--copy`・`--skill`・GitHubの `tree/<ref>` を確認した。公開パッケージの同梱実装・help・起動とCodex限定配置は実装開始時に確認する。調査時点のmainソースを公開版の実行証拠にはしない。
- 固定SHAから目的SHAへ進める演習では、公式CLIの `add https://github.com/mattpocock/skills/tree/<目的の完全SHA> -a codex --copy --skill <採用名...> -y` による明示再適用を候補とする。[現行update実装](https://github.com/vercel-labs/skills/blob/main/src/update.ts) と [更新元の解決](https://github.com/vercel-labs/skills/blob/main/src/update-source.ts) はlockのrefを保持するため、固定SHAに対する `update` の終了0だけでは新版への更新を示せない、という調査上の判断に基づく。SPEC §5.5の通常更新との違いをプロファイルへ記録し、lockを手編集せず目的版を確認する。
- 上記はコマンド候補と演習用の版であり、実行済みではない。継続利用する上流版は導入時に取得・検証した版として完全SHAと更新方法をプロファイルへ記録する。T-0002の既存更新記録は内容差のある2版を特定していないため、今回の更新証拠に代用しない。

### 本来の検証への接続

| 系統 | 既存CIで定義された検証 | 今回の確認方法 |
| --- | --- | --- |
| OKF Docs | CLI全テスト、lint、render --check、POSIX hook出力 | 対象独自CLIと必要な実行環境を使う。harness側の照合器の単純リンク検査だけでOKFを検証したと扱わない |
| Frontend | npm run lint、npm run build、npm run test -- --run | client側の作業ディレクトリ・lock・依存を確認して実行する |
| Batch | tests/run_all_tests.py | CI用のダミー設定と必要依存を確認し、本番APIや実データを使わず実行する |
| PHP Syntax | 全PHPのphp -l | ローカルPHP環境または対象成果物SHAのCI結果で確認する |
| API Auth Boundary | bash scheLive.server/tests/auth_boundary_test.sh | PHP・bash等の依存を確認し、ローカルまたは対象成果物SHAのCI結果で確認する |

各コマンドの正確な作業場所・依存・適用範囲は対象のCIと設定から実装直前に確定する。検証結果は4値で残し、実行不能を成功にしない。導入が原因の失敗は修正し、既存失敗と区別する。必要な検証証拠が得られなければ、その不足を残して導入全体を完了扱いしない。Q2によるClaude Codeの除外は、この検証条件を緩める判断ではない。

## 決定と根拠

- 上流と自前コアを別依存・別コミットとして扱う。→ SPEC §9.1
- `project/`、`state/`、台帳、既存文書を共通更新で上書きしない。→ SPEC §9.2

### 今回の利用者判断（2026-09-07）

- Q1：更新・巻戻し・撤去の演習後、ScheLiveAppで継続利用する導入まで仕上げる。隔離した作業コピーで演習し、確認した導入差分を実プロジェクトへ反映するための手順を詰める。
- Q2：Claude Codeは現在利用できないため、T-0009はCodexの実利用確認で完了可能とする。ScheLiveAppでのClaude Code実利用は今回の完了条件に含めず、未実行として残す。先行タスクの過去の確認結果や、共通方針の両製品対応を変更する判断ではない。
- Q3：自前コアの内容更新・巻戻しは、隔離したScheLiveAppで演習専用の改訂版を使って確認する。継続導入にはT-0013の正式版を残す。演習版の出所・固定SHA・差分・使用場所を記録し、正式な次版の公開・更新実績と区別する。
- Q4：設定・引継ぎ・改善記録は標準の `harness/` 配下に置く。ScheLiveAppの文書配置規約へ用途を限定した例外を明記し、用語集・ADR・仕様・バックログは既存 `docs/` に残す。外部workingFolderの一時メモを、Gitに残す引継ぎ・改善記録の正本にはしない。

演習専用版は実用の入口・ガイド・報告導線を保つ差分として準備する。T-0013のunittest用v2はguide置換とworklog雛形削除を含む境界検査用fixtureであり、そのまま流用しない。実対象のコピーでの操作は [配布手順](/project/harness-distribution.md) に従い、テストの演習用書込み関数を導入ツールとして使わない。

## 完了条件

- [x] ScheLiveAppがmattpocock/skillsを直接導入している（受け入れ⑱）
- [x] `skills-lock.json` と `harness/install.json` が別の管理範囲を示す
- [x] 上流更新と自前コア更新を別々に適用・確認できる
- [x] 巻戻し・撤去後もプロジェクト固有領域が残る（受け入れ⑲）
- [x] 既存入口・OKF・CI・フックとの衝突処理が記録されている
- [x] 同じ導入を再実行して重複が増えない
- [x] 本来のビルド・テストが4値で記録されている
- [x] Codexで入口・採用スキル・検証報告の実利用を確認し、Claude Codeの未実行範囲を明記している
- [x] 演習後に正式版のコアと採用した上流スキルが導入された継続利用状態を確認している
- [x] 成果物コミットを `evidence` に記入し、タスクを完了状態にした

## 検証記録

| 識別子 | 結果 | 対象 | 証拠 |
| --- | --- | --- | --- |
| upstream-direct-install | 成功 | 直接GitHub / skills@1.5.24 / 25件74本 | 旧885e→継続0ab1。lockと全Git blob照合。上流初回0a893db、更新af43950 |
| harness-core-install | 成功 | 正式898d514f0594ff09f6c19292ef4df56f6cc4ac50 | 6本とmanifest/record一致。初回5dc7133、既存seedはproject所有 |
| update-separation | 成功 | 隔離コピーの独立2依存 | 上流c754413、コア17181d4。実内容差を別コミットで確認 |
| rollback-remove | 成功 | 巻戻し・個別撤去・再導入 | コアffd8346/bb69715/e802e81、上流57b6b5c/48ae512/0c66ef0。固有データを保持 |
| conflict-and-reinstall | 成功 | 改変/未知/欠落/記録破損、同版、撤去後 | 4拒否で書込み0。再適用変更0、実ledger/journal・入口の重複なし |
| codex-use | 成功 | 新規Codex CLIによる実確認 | 2スキルの適用・4候補の非該当判断・日本語4値・所定journal保存。初回600秒は実行不能、残工程再実行135.65秒exit0 |
| project-required | 成功 | 最終ca24706 + 実反映後の生成索引差分を含む作業ツリー | ローカル全25検証成功。Frontend411、Batch134＋2subtests、PHP13本、認証境界、OKF/両hook、配布11。元dirty索引のL13失敗を再現・保持し、公式再生成後docs6件成功。実ページ4件は未実行 |
| final-installed-state | 成功 | 実作業先main 897e90ddf3535c0adea47bfddcc3d69fc4f54d80 | 正式コア＋継続上流0ab1。導入候補をFFし既存stage2件・私有設定を保持 |

この表はScheLiveAppへの導入・演習の結果を記録する。今回の読み取り調査やharness側の文書lintを導入成功として転記しない。各演習の詳細と初回失敗・再試行は対象のworklogへ記録する。

T-0014で整備した [URL付きの導入依頼](/project/harness-distribution.md#ai-install) を入口に使い、導入体験の計測項目は同How-To §10に従ってworklogへ残す。実導入が先行した場合は、後日の入口確認と先行する導入結果を区別する。入口側の検証範囲は [T-0014](/backlog/T-0014-ai-distribution-entry.md) を参照する。

## 結果

合意済みの導入を完了した（完了日: 2026-09-08）。実作業先 `C:/Users/rinta/Documents/0_ReactApp/ScheLiveApp` のmainへ反映し、最終HEADは `897e90ddf3535c0adea47bfddcc3d69fc4f54d80`。開始時のstage済みB-0015とbacklog/index、私有設定を保持した。導入候補の最終差分は仕様・規約の独立reviewを通過し、既存CI・HTMLフック・製品コード・テストの弱体化や置換はない。

継続版は上流 `0ab1b63a410a03d3627979a109c8695de27af954`、正式コア `898d514f0594ff09f6c19292ef4df56f6cc4ac50`。演習専用コア `606d10abaebe86dd9910fac28d1e2a000c3d6a87` は隔離場所だけで適用し、正式な次版公開とは扱わない。演習履歴は小さな増分Git bundleとして証拠保存し、継続の実行領域には導入していない。

実装時の最新HEADは計画時のb9bcではなく `58bb9d49644f6772484d858c8c58001e270573de`。現行CIは6系統で、OKFは外部okf-devkit固定d6f623214e8bf97b128ac1d36180a8cef0926599、Batchはpytestへ変わっていた。候補コマンドを現物に合わせてconfigへ接続し、導入前後で必要検証を実行した。

詳細の正本は対象の `harness/state/journal/T-0009-second-repository-rollout.md`、実Codex記録は同階層の `T-0009-codex-smoke.md`、4値と実コマンド・ログhash・演習コミットは `T-0009-evidence/verification.json`。upstream removeの成功表示でも残存した初回失敗、共有配置19名限定の再試行、Codex初回600秒停止と残工程再実行、独立reviewで修正した依存・出力写像・記録整合性を保持した。最終ローカル検証は成功。staleは隔離候補warn86/info38、既存B-0015-token-auth-package.mdを含む実作業ツリーではwarn87/info39。差分は当該既存課題のoutdated/unverified各1件であり、未解消候補や人の検証未確認をreview成功へ変換しない。

反映演習の初回はclone間の改行差を元ファイルの生バイトと比較した検証スクリプトの誤りで失敗。同じコピー自身の操作前後を比較するよう直し、新しい演習コピーで成功してから実反映した。実反映後に元stageのbacklog/indexでL13が発生し、開始58bbと同じdirty状態で同一ログを再現した。公式 `index --write` で生成領域のtodo件数12→13と書式を更新し、作業ツリーのdocs6検証は成功。元stageの2本・patch・B-0015本文・私有設定は保持し、indexの生成差分だけを未stageで残した。元stageのスナップショット自体が検証成功したとは扱わない。利用者がB-0015の作業を続ける際、最新の生成indexを一緒にstageできる状態であり、この既存課題をT-0009の成果物コミットに含めない。

### 記録確定後の設計側検証

成果物 `897e90ddf3535c0adea47bfddcc3d69fc4f54d80` の完全SHAを本文・evidence・節目logへ反映した後、設計側HEAD `78ce29255239fe8f1589c3ea8e72d82af3467c41` と既存差分を含む作業ツリーで以下を実行した。対象の導入検証とは分けた設計文書の検証である。

| コマンド | 結果 | 終了値 | 出力ログSHA-256 |
| --- | --- | --- | --- |
| `python -B -m okf_devkit.cli lint` | 成功 | 0 | `55ce5529ae9e9812fc71396332395c1bc8df16d3841f382d4836ac12bd487921` |
| `python -B -m okf_devkit.cli index --check` | 成功 | 0 | `ad5b61d340ed5ac6a2b4fb0092a035aa275de0b102d64ef89d3c5a1cabd73cf8` |
| `python -B -m okf_devkit.cli render --check` | 成功 | 0 | `7fc1f6d07a079621beb1216e2f2b444795b2101f644c3445d012eb74560ba1da` |

元stageの2件と生成indexの未stage差分、私有設定のhash、アプリ側の別worktreeが不変であることも最終監査で確認した。

### 未確認範囲と後続

| 識別子 | 結果 | 理由・次の一手 |
| --- | --- | --- |
| claude-code-use | 未実行 | Q2により今回の完了条件から除外。利用可能になった時にScheLiveAppで確認する |
| hosted-final-ci | 未実行 | ローカル導入のみ。公開/PRを行う工程で成果物SHAの6ジョブを確認する |
| real-page-tests | 未実行 | 既存ENABLE_REAL_PAGE_TESTで無効な4件。今回のCI相当検証と区別 |
| product-stop-event | 未実行 | アダプターの両shell検証は成功。Codex/Claude内Stopイベントの発動観測は別途 |
| rulesets-query | 実行不能 | private repoのplan制約によるHTTP403。protected:falseは取得済み、rulesetsなしとは断定しない |
| url-entry-after-rollout | 実行不能 | 後追いfetchしたremote main 579db5400230b61a6a1d658c282b3f570f3419cdにREADME未公開。T-0014公開後にREADMEの完全SHA・推奨版・根拠を取得し、現在installを別解決して同版verifyを記録する |

URL入口条項は着手後の並行T-0014で追加された。開始時に固定した本文・完了条件10件に含まれないことを独立reviewで確認し、How-Toの先行実証条項に従って上記の後日検証として残す。元の合意済み導入完了をURL入口の実導入体験成功と読み替えない。上流全25件の個別実行やT-0008の改善効果は未確認・未認定のまま。

本タスクの導入・演習としての残作業はない。T-0011にはGit直接依存での実運用結果、共有配置撤去の注意点と実測負担、未公開README入口の残作業を引き継ぐ。追加の配布製品化・自動ゲート・pluginを先取りしない。設計側は並行T-0014ブランチの既存未コミット変更を保護して本文・索引・節目logだけを更新し、無関係な変更をコミットへ取り込まない。

### 着手前の引継ぎ（履歴）

詳細化済み・導入未着手。2026-09-07にScheLiveAppの現状調査とQ1〜Q4の回答を記録し、実装計画を提示した。利用者から別セッションで進めるための実行プロンプト作成を依頼されたため、この計画を引き継ぐ実装開始待ちとして `ready-for-agent` に更新した。`state: todo` は実装未着手を示す。次の担当は合意済みの方針を再質問せず、現物と実行環境の照合から開始する。T-0013は完了し、配布元・固定版・導入手順を引き継げる。

配布元・版・手順の正は [T-0013の結果](/backlog/T-0013-extract-distributable-core.md)。先行タスクのClaude Code確認は2026-09-07の利用者確認で完了したが、ScheLiveAppでの確認結果ではない。今回の製品範囲は上記Q2に従う。T-0008からは評価指標の不足・改善効果未実証・報告の残作業を引き継ぐ。T-0012とは異なる実証であり、Remote試行の成功を移植性の証拠にしない。
