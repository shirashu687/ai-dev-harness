# 共通ハーネス構築 — エージェント向け入口

このリポジトリは**共通ハーネスの設計・仕様・バックログを置く場所**であり、ハーネスの適用対象ではない。
実際にハーネスを導入する対象プロジェクトは `okf-devkit`（段階1）→ `ScheLiveApp`（段階3）。
したがって仕様書の R8（入口は1枚）・第11節（作らないもの）は、このリポジトリには適用しない。

## 文書の役割と編集可否

| ファイル | 役割 | 扱い |
| --- | --- | --- |
| `HARNESS_SPEC.md` | 「何を作るか」の**正本** | 生きた文書。**変更はここにだけ反映する** |
| `HARNESS_DESIGN.md` | 「なぜ」の根拠集 | **凍結。編集しない** |
| `HARNESS_REVIEW.html` | 第0.2版までの審査記録 | **凍結。編集しない** |
| `HARNESS_SPEC.html` | 第0.2版の旧スナップショット | **凍結。現行判断には使わない** |
| `HARNESS_SKILLS_OVERVIEW.html` | 現行方針の人間向け図解 | 説明資料。判断が食い違う場合は `HARNESS_SPEC.md` を正とする |

## バックログ

- 作業単位は `docs/backlog/T-NNNN-<kebab>.md`（1タスク1ファイル）。書式の正は `docs/CONVENTIONS.md`
- `docs/` で作業する前に `docs/AGENTS.md` を読む
- CLI は `python -m okf_devkit.cli <command>` で呼ぶ（`okf.exe` は PATH に無い）
- 進め方: 薄く起こし、**着手直前の1本だけ**詳細を詰める

## 決定を書く場所（同じ文を二箇所に書かない）

| 決めたこと | 行き先 |
| --- | --- |
| 他のタスクでも将来のプロジェクトでも成り立つ規定 | `HARNESS_SPEC.md`。タスクからは `→ SPEC §x.y` で参照する |
| そのタスクを終わらせるためだけの情報 | タスクファイルの「決定と根拠」 |
| 根拠が1件しかない観測 | 改善台帳（対象プロジェクト側の `harness/ledger.md`） |

## エージェント向け詳細ルール

### 作業項目

作業項目は `docs/backlog/T-NNNN-<kebab>.md` で管理し、作成には `python -m okf_devkit.cli` を使う。詳細は `docs/agents/issue-tracker.md` を読む。

### Triageラベル

`tags:` にカテゴリ1つと状態ラベル1つを記録する。詳細は `docs/agents/triage-labels.md` を読む。

### ドメイン文書

対象プロジェクトでは single-context 構成を使い、ルートの `CONTEXT.md` と `docs/project/decisions/` を参照する。本リポジトリの共通判断は `HARNESS_SPEC.md` に書く。詳細は `docs/agents/domain.md` を読む。
