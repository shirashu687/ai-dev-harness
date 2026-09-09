# backlog ドキュメント

## 残作業の見方（2026-09-07整理）

次の実行候補は、合意済み・詳細化済みの **T-0012**。T-0008には既存評価の報告と観測不足の対応が残る。T-0009は導入・演習・Codex確認を完了し、公開README入口の後追い確認を別記した。

| 区分 | タスク | 残作業・再開条件 |
| --- | --- | --- |
| 評価の仕上げ | [T-0008 代表作業と比較](/backlog/T-0008-pilot-two-products.md) | 最新評価のHTML反映・表示確認、介入と限界の整理、スキル未発動・文脈負担の観測 |
| 次の実行候補 | [T-0012 Remoteで1課題を実証](/backlog/T-0012-continuous-autonomous-operation.md) | 指定Python・固定依頼を準備し、スマホの標準通知・停止確認から始める。詳細化済み |
| 導入完了・後日確認あり | [T-0009 ScheLiveAppへ導入](/backlog/T-0009-second-repository-rollout.md) | 正式コア・上流の継続導入と隔離演習を完了。公開README入口・Claude・成果物SHAのCIは別の未確認範囲 |
| 方針確定済み | [T-0011 配布製品化の比較](/backlog/T-0011-distribution-strategy.md) | 比較・保守範囲の判断は完了。文書入口はT-0014で完了し、製品化はT-0010で条件待ち |
| 条件待ち | [T-0010 プラグイン・一括導入](/backlog/T-0010-plugin-and-bootstrap.md) | T-0009・T-0011の結果、導入先3件以上、実測負担と採用判断が揃った場合に着手 |

T-0001〜T-0007・T-0009・T-0011・T-0013〜T-0015は完了済み。段階1の導入確認と共通コアの抽出・配布・okf-devkit移行が揃った。配布の後続関係は `T-0013（完了）→ T-0009（導入完了）→ T-0011（完了）→ T-0014（完了）／T-0010（条件付き）`。T-0012はRemote運用の別実証であり、T-0009の技術的な前提には追加しない。

2026-09-07の利用者確認を受け、[T-0002](/backlog/T-0002-upstream-skills-dependency.md)・[T-0003](/backlog/T-0003-japanese-entry-and-guide.md) のClaude Code確認と [T-0007](/backlog/T-0007-obsidian-okf.md) のObsidian確認を完了に反映した。T-0008のClaude確認（⑰）も完了。改善効果（⑯）は未実証のまま保持し、評価・報告の仕上げへ進む。

照合した導入先はokf-devkitの本流 `c14025aea7e7f5e5c40bbe8ee25b37e00cf5d35c`。[PR #2](https://github.com/shirashu687/okf-devkit/pull/2) のマージと、同SHAの [CI全5ジョブ成功](https://github.com/shirashu687/okf-devkit/actions/runs/34121371457) を確認した。CIの対象と未確認範囲は [T-0007の検証記録](/backlog/T-0007-obsidian-okf.md) を参照する。比較試行の製品修正が本流へ統合されたことは意味しない。

## 状態別一覧（自動生成）

<!-- okf:auto:start -->
| state | 件数 |
|---|---|
| doing | 2 |
| todo | 2 |
| done | 12 |
| dropped | 0 |

## doing
* [代表作業3件と2製品で実証する](/backlog/T-0008-pilot-two-products.md) - `high` `L` - 代表3作業・比較再試行と利用者によるClaude Code確認は完了し、評価指標の補完とHTMLレポートの仕上げを残す。
* [初めての利用者向けにREADME・使用手順・ライセンスを整備する](/backlog/T-0016-getting-started-and-license.md) - `medium` `S` - 実装未読の利用者が導入と最初の作業を試せる文書とMITライセンスを整える。

## todo
* [Remoteから手動開始した1課題の自律実行を検証する](/backlog/T-0012-continuous-autonomous-operation.md) - `medium` `M` - 既存PCのCodexとハーネスを使い、モバイルからの手動開始、実装・検証・報告、標準通知、停止・再開をokf-devkitで実証する。
* [自前ハーネスをプラグイン化して導入を統合する](/backlog/T-0010-plugin-and-bootstrap.md) - `low` `XL` - 導入先3件以上と実測された手作業負担を条件に、自前ハーネスだけをプラグイン化し上流公式導入を呼ぶ一括コマンドを検討する。

## done
* [ScheLiveAppへ独立した二依存として導入する](/backlog/T-0009-second-repository-rollout.md) - 2026-09-08 完了 - ScheLiveAppへ上流スキルと自前ハーネスを別々の依存として導入し、更新・巻戻し・撤去で固有領域が保たれるか確認する。
* [配布方式と保守責任を比較検討する](/backlog/T-0011-distribution-strategy.md) - 2026-09-07 完了 - 確立済みのGit配布を基準に、自分の複数リポジトリ向けの配布方式と必要時保守の範囲を比較する。
* [旧版資料と未使用ファイルを整理する](/backlog/T-0015-repository-cleanup.md) - 2026-09-07 完了 - 旧版資料の内容を保持してアーカイブへ移し、未使用フックと空の重複ログを削除してPRにまとめる。
* [日本語の入口とスキル案内を設置する](/backlog/T-0003-japanese-entry-and-guide.md) - 2026-09-07 完了 - 日本語の入口・ガイド、Codex代表ルートと利用者によるClaude Code確認を終えた。
* [上流スキルを直接依存として導入する](/backlog/T-0002-upstream-skills-dependency.md) - 2026-09-07 完了 - 上流25スキルの直接導入・Codex検証と利用者によるClaude Code確認を終え、導入を完了した。
* [ObsidianとOKFの知識導線を接続する](/backlog/T-0007-obsidian-okf.md) - 2026-09-07 完了 - OKFの相対索引・静的導線・統合版CIと利用者によるObsidian実機確認を終えた。
* [AIへのURL付き依頼で導入・更新できる入口を整備する](/backlog/T-0014-ai-distribution-entry.md) - 2026-09-07 完了 - Git配布のREADME入口と推奨固定版の記録を整え、URL付きの依頼から既存の導入・更新手順へ接続する。
* [規模別フローと完了契約を設置する](/backlog/T-0004-workflow-and-completion-contract.md) - 2026-09-06 完了 - 小・通常・大の開発フロー、4値の検証報告、作業記録、セッション引継ぎをokf-devkitへ設置する。
* [必須制約と強制点を接続する](/backlog/T-0005-requirements-and-enforcement.md) - 2026-09-06 完了 - okf-devkitの必須制約を既存CI・権限設定・差分レビューへ対応づけ、運用だけに依存する限界も明示する。
* [共通コアを本リポジトリへ抽出し最小配布物を確立する](/backlog/T-0013-extract-distributable-core.md) - 2026-09-06 完了 - okf-devkitで実証した共通コアをharnessへ抽出し、二つ目の導入前にGitで版管理する最小配布物と管理手順を確立する。
* [retroゲートと改善台帳を設置する](/backlog/T-0006-retro-and-ledger.md) - 2026-09-06 完了 - full retrospectiveの実行条件と、観測から試行・採用・却下・廃止へ進む上限付き改善台帳をokf-devkitへ設置する。
* [仕様を0.2版へ改訂する](/backlog/T-0001-spec-revision.md) - 2026-09-01 完了 - 設計詰めで決まった内容を HARNESS_SPEC.md に反映し、第0.2版とする。
<!-- okf:auto:end -->
