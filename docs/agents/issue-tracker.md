---
type: Convention
title: Issue tracker 運用
description: GitHub Issues を作業項目の管理場所として使うための規約。
tags: [agents, issues]
status: stable
layer: shared
generated:
  by: "devin/swe-2-max"
  at: "2026-09-15"
related:
  - /CONVENTIONS.md
  - /agents/triage-labels.md
---

# Issue tracker: GitHub Issues

このリポジトリでは、作業項目を GitHub Issues（`shirashu687/ai-dev-harness`）で管理する。
2026-09-15 に `docs/backlog/` の Markdown 管理から移行した。旧タスクは `T-NNNN: <タイトル>` という Issue として残り、T-0001〜T-0018 が Issue #7〜#24 に対応する（#1〜#6 は PR）。

## Conventions

- 1タスク1 Issue。起票は `gh issue create`、参照は `gh issue view <N>` で行う。
- 進捗は Issue の状態で表す: open=`todo`、open+`doing` ラベル=`doing`、closed=`done`、「not planned」でのクローズ=`dropped`。
- 従来 frontmatter に持たせた管理情報は、Issue 本文先頭のメタデータ表に書く。書式は移行済み Issue（例: #18）を参照。
- `.scratch/` や他の外部 tracker は使用しない。PR は triage の受付対象にしない。

## メタデータ表の項目

| フィールド | 値 | 意味 |
|---|---|---|
| `state` | `todo` / `doing` / `done` / `dropped` | 移行時点の進捗（現在の進捗は Issue の状態が正） |
| `priority` | `high` / `medium` / `low` | 優先度 |
| `effort` | `S`(数時間) / `M`(1〜3日) / `L`(1週間〜) / `XL`(数週間〜) | 工数 |
| `feasibility` | `A`(◎すぐできる) / `B`(○やればできる) / `C`(△要調査) / `D`(×現状困難) | 実現可能性 |
| `ai` | `full` / `assisted` / `manual` | AI 活用度 |
| `cost` | `true` / `false` | コスト発生の有無 |
| `created` | `YYYY-MM-DD` | 起票日 |
| `done_at` | `YYYY-MM-DD` / `—` | 完了日。完了で閉じるとき記入する |
| `accepts` | 丸数字のリスト | このタスクが動かす受け入れ条件（`HARNESS_SPEC.md` §3 の①〜⑳） |
| `spec` | 節番号のリスト | 根拠となる `HARNESS_SPEC.md` の節 |
| `target` | リポジトリ名 / `—` | 成果物が入るリポジトリ（例: `okf-devkit`） |
| `evidence` | コミット SHA のリスト | 成果物側のコミット。完了で閉じるとき記入する |

新規 Issue でも同じ項目名を使う。`accepts` と `spec` がタスクと仕様のトレースになり、`evidence` が「done なのに成果物側に何も入っていない」状態を防ぐ。

## When a skill says "publish to the issue tracker"

`gh issue create --repo shirashu687/ai-dev-harness` で Issue を作成し、やりたいこと・背景・完了条件を本文に記入する。

## When a skill says "fetch the relevant ticket"

`gh issue view <N> --repo shirashu687/ai-dev-harness` で Issue を読む。旧タスクは `T-NNNN` をタイトル検索すれば見つかる。

## Triage

triage の結果は Issue のラベルに記録する。カテゴリ1つと状態ラベル1つを付ける。対応表は `docs/agents/triage-labels.md` を参照。
