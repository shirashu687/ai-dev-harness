# backlog ドキュメント

基本の実行順は `T-0002`〜`T-0008` → `T-0013` → `T-0009`。その後は `T-0011` で配布方式と保守責任を判断し、採用が承認された場合だけ `T-0010` の実装へ進む。後続タスクは着手直前にだけ詳細化する。

<!-- okf:auto:start -->
| state | 件数 |
|---|---|
| doing | 3 |
| todo | 5 |
| done | 5 |
| dropped | 0 |

## doing
* [代表作業3件と2製品で実証する](/backlog/T-0008-pilot-two-products.md) - `high` `L` - okf-devkitの実作業3件をClaude CodeとCodexで進め、品質・手戻り・検証・スキル起動・文脈負担を比較する。
* [日本語の入口とスキル案内を設置する](/backlog/T-0003-japanese-entry-and-guide.md) - `high` `M` - okf-devkitの既存入口を保ちながら、作業分類・プロジェクト制約・上流スキルの呼出関係へ到達できる日本語ガイドを設置する。
* [ObsidianとOKFの知識導線を接続する](/backlog/T-0007-obsidian-okf.md) - `medium` `M` - okf-devkitの同じMarkdownをObsidianで閲覧し、OKFの索引・検査と共存させながら別の正本や無制限な記録を作らない運用を確認する。

## todo
* [上流スキルを直接依存として導入する](/backlog/T-0002-upstream-skills-dependency.md) - `high` `M` - okf-devkitへ依存関係が閉じたmattpocock/skillsプロファイルを直接導入し、出所・重複・ライセンス・更新方法を確認する。
* [Remoteから手動開始した1課題の自律実行を検証する](/backlog/T-0012-continuous-autonomous-operation.md) - `medium` `M` - 既存PCのCodexとハーネスを使い、モバイルからの手動開始、実装・検証・報告、標準通知、停止・再開をokf-devkitで実証する。
* [ScheLiveAppへ独立した二依存として導入する](/backlog/T-0009-second-repository-rollout.md) - `medium` `XL` - ScheLiveAppへ上流スキルと自前ハーネスを別々の依存として導入し、更新・巻戻し・撤去で固有領域が保たれるか確認する。
* [自前ハーネスをプラグイン化して導入を統合する](/backlog/T-0010-plugin-and-bootstrap.md) - `low` `XL` - 導入先3件以上と実測された手作業負担を条件に、自前ハーネスだけをプラグイン化し上流公式導入を呼ぶ一括コマンドを検討する。
* [配布方式と保守責任を比較検討する](/backlog/T-0011-distribution-strategy.md) - `low` `M` - npx・Python・Codex/Claude Codeプラグイン等を安全性・保守負担・導入体験で比較し、共通ハーネスの配布方針を決める。

## done
* [規模別フローと完了契約を設置する](/backlog/T-0004-workflow-and-completion-contract.md) - 2026-09-06 完了 - 小・通常・大の開発フロー、4値の検証報告、作業記録、セッション引継ぎをokf-devkitへ設置する。
* [必須制約と強制点を接続する](/backlog/T-0005-requirements-and-enforcement.md) - 2026-09-06 完了 - okf-devkitの必須制約を既存CI・権限設定・差分レビューへ対応づけ、運用だけに依存する限界も明示する。
* [共通コアを本リポジトリへ抽出し最小配布物を確立する](/backlog/T-0013-extract-distributable-core.md) - 2026-09-06 完了 - okf-devkitで実証した共通コアをharnessへ抽出し、二つ目の導入前にGitで版管理する最小配布物と管理手順を確立する。
* [retroゲートと改善台帳を設置する](/backlog/T-0006-retro-and-ledger.md) - 2026-09-06 完了 - full retrospectiveの実行条件と、観測から試行・採用・却下・廃止へ進む上限付き改善台帳をokf-devkitへ設置する。
* [仕様を0.2版へ改訂する](/backlog/T-0001-spec-revision.md) - 2026-09-01 完了 - 設計詰めで決まった内容を HARNESS_SPEC.md に反映し、第0.2版とする。
<!-- okf:auto:end -->
