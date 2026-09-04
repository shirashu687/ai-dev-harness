---
type: Convention
title: Triage labels
description: docs/backlog で使う triage カテゴリと状態ラベルの対応表。
tags: [agents, triage]
status: stable
layer: shared
generated:
  by: "codex/setup-matt-pocock-skills"
  at: "2026-09-04"
related:
  - /agents/issue-tracker.md
  - /CONVENTIONS.md
---

# Triage Labels

## Category roles

| Role | Meaning |
|---|---|
| `bug` | 何かが壊れている |
| `enhancement` | 新機能または改善 |

## State roles

| Canonical role | Label in this tracker | Meaning |
|---|---|---|
| `needs-triage` | `needs-triage` | maintainer の確認待ち |
| `needs-info` | `needs-info` | 起票者から追加情報が必要 |
| `ready-for-agent` | `ready-for-agent` | エージェントが作業可能 |
| `ready-for-human` | `ready-for-human` | 人間の判断・作業が必要 |
| `wontfix` | `wontfix` | 対応しない |

triage 済みの backlog item には、カテゴリを1つ、状態を1つだけ `tags:` に記録する。`state:` は backlog の進捗であり、これらのラベルとは別に扱う。

例:

```yaml
tags: [shared, enhancement, needs-triage]
```
