# backlog ドキュメント

実行順はID順の `T-0002` → `T-0010`。後続タスクは着手直前にだけ詳細化する。`T-0010` は導入先3件以上かつ手作業負担が実測された場合だけ着手する。

<!-- okf:auto:start -->
| state | 件数 |
|---|---|
| doing | 0 |
| todo | 9 |
| done | 1 |
| dropped | 0 |

## todo
* [retroゲートと改善台帳を設置する](/backlog/T-0006-retro-and-ledger.md) - `high` `M` - full retrospectiveの実行条件と、観測から試行・採用・却下・廃止へ進む上限付き改善台帳をokf-devkitへ設置する。
* [上流スキルを直接依存として導入する](/backlog/T-0002-upstream-skills-dependency.md) - `high` `M` - okf-devkitへ依存関係が閉じたmattpocock/skillsプロファイルを直接導入し、出所・重複・ライセンス・更新方法を確認する。
* [代表作業3件と2製品で実証する](/backlog/T-0008-pilot-two-products.md) - `high` `L` - okf-devkitの実作業3件をClaude CodeとCodexで進め、品質・手戻り・検証・スキル起動・文脈負担を比較する。
* [必須制約と強制点を接続する](/backlog/T-0005-requirements-and-enforcement.md) - `high` `M` - okf-devkitの必須制約を既存CI・権限設定・差分レビューへ対応づけ、運用だけに依存する限界も明示する。
* [日本語の入口とスキル案内を設置する](/backlog/T-0003-japanese-entry-and-guide.md) - `high` `M` - okf-devkitの既存入口を保ちながら、作業分類・プロジェクト制約・上流スキルの呼出関係へ到達できる日本語ガイドを設置する。
* [規模別フローと完了契約を設置する](/backlog/T-0004-workflow-and-completion-contract.md) - `high` `M` - 小・通常・大の開発フロー、4値の検証報告、作業記録、セッション引継ぎをokf-devkitへ設置する。
* [ObsidianとOKFの知識導線を接続する](/backlog/T-0007-obsidian-okf.md) - `medium` `S` - okf-devkitの同じMarkdownをObsidianで閲覧し、OKFの索引・検査と共存させながら別の正本や無制限な記録を作らない運用を確認する。
* [ScheLiveAppへ独立した二依存として導入する](/backlog/T-0009-second-repository-rollout.md) - `medium` `XL` - ScheLiveAppへ上流スキルと自前ハーネスを別々の依存として導入し、更新・巻戻し・撤去で固有領域が保たれるか確認する。
* [自前ハーネスをプラグイン化して導入を統合する](/backlog/T-0010-plugin-and-bootstrap.md) - `low` `XL` - 導入先3件以上と実測された手作業負担を条件に、自前ハーネスだけをプラグイン化し上流公式導入を呼ぶ一括コマンドを検討する。

## done
* [仕様を0.2版へ改訂する](/backlog/T-0001-spec-revision.md) - 2026-09-01 完了 - 設計詰めで決まった内容を HARNESS_SPEC.md に反映し、第0.2版とする。
<!-- okf:auto:end -->
