# backlog ドキュメント

<!-- okf:auto:start -->
| state | 件数 |
|---|---|
| doing | 1 |
| todo | 9 |
| done | 0 |
| dropped | 0 |

## doing
* [仕様を0.2版へ改訂する](/backlog/T-0001-spec-revision.md) - `high` `M` - 設計詰めで決まった内容を HARNESS_SPEC.md に反映し、第0.2版とする。

## todo
* [代表作業3件で実証する](/backlog/T-0006-representative-tasks.md) - `high` `L` - 代表作業3件をハーネス上で実施し、検証・報告・引継ぎが機能するか実測する。
* [入口を設置する](/backlog/T-0003-entry-point.md) - `high` `S` - okf-devkit に AGENTS.md を新設し、CLAUDE.md から取り込んで入口を1枚にする。
* [強制点を設置する](/backlog/T-0005-enforcement-points.md) - `high` `S` - deny ルールと CI を REQ-1・REQ-2 の強制点として設置・確認する。
* [手順・記録・設定を設置する](/backlog/T-0004-procedures-and-records.md) - `high` `M` - harness/ 配下に共通手順2本・作業記録テンプレート・必須制約・プロジェクト設定・改善台帳を設置する。
* [段階1の計測と締め](/backlog/T-0007-measurement-and-closeout.md) - `high` `M` - H2・H3・H5 の初回計測と部品なし比較を行い、仕様を0.3版へ改訂して段階1を締める。
* [着手前チェックリストを記入する](/backlog/T-0002-pre-start-checklist.md) - `high` `S` - HARNESS_SPEC.md 第2節の【着手時に記入】欄を埋め、実証を開始できる状態にする。
* [段階2: 製品間の確認](/backlog/T-0008-stage2-cross-product.md) - `low` `L` - Codex CLI と Copilot で同じ入口・手順・記録が成立するかを実機で確認し、対応表を埋める。
* [段階3: 別プロジェクトへの配布](/backlog/T-0009-stage3-distribution.md) - `low` `XL` - コアを版付けで抽出し、ScheLiveApp へ導入して更新・巻戻し・撤去を演習する。
* [段階4: 自動化の追加](/backlog/T-0010-stage4-automation.md) - `low` `M` - 第11節のトリガーを実測で満たした処理だけを自動化する。
<!-- okf:auto:end -->
