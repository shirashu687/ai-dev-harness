---
type: Convention
title: Domain docs
description: このリポジトリのドメイン文書を読む場所と順序を定義する。
tags: [agents, domain]
status: stable
layer: shared
generated:
  by: "codex/setup-matt-pocock-skills"
  at: "2026-09-04"
related:
  - /CONVENTIONS.md
  - /AGENTS.md
---

# Domain Docs

このリポジトリは single-context 構成で扱う。

## 読む場所

- ルートの `CONTEXT.md`（存在する場合）
- `docs/project/decisions/` の Decision Record
- ルートの `AGENTS.md`
- `docs/AGENTS.md` と `docs/CONVENTIONS.md`

`CONTEXT.md` や Decision Record が存在しない場合は、先に作成を要求せず、そのまま進める。

## このリポジトリ固有の注意

`harness` は共通ハーネスの設計・仕様・バックログ置き場であり、ハーネスの適用対象プロジェクトではない。`HARNESS_SPEC.md` が仕様の正本であり、凍結文書は編集しない。

ドメイン用語や設計判断を新たに確定した場合は、既存の文書配置規約に従って `CONTEXT.md` または `docs/project/decisions/` を更新する。
