---
type: Convention
title: Issue tracker 運用
description: docs/backlog を作業項目の管理場所として使うための規約。
tags: [agents, backlog]
status: stable
layer: shared
generated:
  by: "codex/setup-matt-pocock-skills"
  at: "2026-09-04"
related:
  - /CONVENTIONS.md
  - /agents/triage-labels.md
---

# Issue tracker: docs/backlog

このリポジトリでは、作業項目を `docs/backlog/` の Markdown ファイルで管理する。

## Conventions

- 1タスク1ファイルとし、`docs/backlog/T-NNNN-<kebab>.md` に置く。
- 書式は `docs/CONVENTIONS.md` に従う。
- 新規作成には `python -m okf_devkit.cli new backlog --title "..." --layer shared` を使う。
- `okf.exe` は使用せず、`python -m okf_devkit.cli` で実行する。
- `state:` は backlog の進捗（`todo` / `doing` / `done` / `dropped`）であり、triage 状態とは別物とする。
- `.scratch/` や外部 Issue tracker は使用しない。
- PR は triage の受付対象にしない。

## When a skill says “publish to the issue tracker”

`python -m okf_devkit.cli new backlog` で backlog item を作成し、必要な内容をそのファイルに記入する。

## When a skill says “fetch the relevant ticket”

指定された `docs/backlog/` 内のファイルを読む。

## Triage

triage のラベルは backlog item の frontmatter の `tags:` に記録する。既存のタグは保持し、triage 済みの項目にはカテゴリ1つと状態ラベル1つを追加する。
