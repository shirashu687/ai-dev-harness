---
type: Convention
title: Triage labels
description: GitHub Issues で使う triage カテゴリと状態ラベルの対応表。
tags: [agents, triage]
status: stable
layer: shared
generated:
  by: "devin/swe-2-max"
  at: "2026-09-15"
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

triage 済みの Issue には、カテゴリを1つ、状態を1つだけ GitHub ラベルとして付ける。進捗（open / `doing` ラベル / closed）は Issue の状態で表し、これらのラベルとは別に扱う。

例:

```shell
gh issue edit <N> --add-label enhancement --add-label needs-triage
```
