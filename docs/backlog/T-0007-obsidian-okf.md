---
type: Backlog Item
title: ObsidianとOKFの知識導線を接続する
description: okf-devkitの同じMarkdownをObsidianで閲覧し、OKFの索引・検査と共存させながら別の正本や無制限な記録を作らない運用を確認する。
tags: [shared, enhancement, ready-for-agent]
status: stable
layer: shared
generated:
  by: "codex/gpt-5"
  at: "2026-09-05T01:19:11+09:00"
state: todo
priority: medium
effort: S
feasibility: B
ai: assisted
cost: false
created: "2026-09-05"
done_at: null
accepts: ["⑬", "⑭"]
spec: ["§6"]
target: okf-devkit
evidence: []
related: ["/backlog/T-0006-retro-and-ledger.md", "/backlog/T-0008-pilot-two-products.md"]
---

# ObsidianとOKFの知識導線を接続する

## やりたいこと

`okf-devkit` のリポジトリルートをObsidian Vaultとして開き、既存のMarkdown、frontmatter、リンク、index、台帳をそのまま人間向けUIで扱う。

## 背景・現状

Obsidianは新しい知識庫ではなく、Markdown + Gitという正本を読む画面にする。OKF固有の規約はプロジェクトアダプターへ置き、共通ハーネスはOKF未採用リポジトリでも動けるようにする。

## 進め方

標準MarkdownとYAMLで主要文書間の導線を確認し、`.obsidian/` はまずローカル専用にする。個人画面状態、機密、チャット全文、巨大ログを共有しない規則を入口またはプロジェクト設定から参照する。

## 決定と根拠

- Obsidian、OKF、Gitの役割を分離する。→ SPEC §6.1
- 同じ文書のObsidian専用コピーを作らない。→ SPEC §6.2
- OKFはアダプターであり、共通コアの必須依存にしない。→ SPEC §6.3

## 完了条件

- [ ] リポジトリの同じMarkdownをVaultから閲覧・検索できる（受け入れ⑬）
- [ ] 仕様、ADR、バックログ、worklog、台帳の導線を辿れる
- [ ] `.obsidian/` の個人状態がGit管理外である
- [ ] `okf index`、`okf lint`、`okf stale` が成立する（受け入れ⑭）
- [ ] OKF未使用時の代替がMarkdown + Gitとして説明されている
- [ ] 重複ノート・チャット全文・巨大ログを作っていない
- [ ] 必須検証を4値で記録した
- [ ] 成果物コミットを `evidence` に記入し、タスクを完了状態にした

## 検証記録

| 識別子 | 結果 | 対象 | 証拠 |
| --- | --- | --- | --- |
| obsidian-same-source | | | |
| markdown-navigation | | | |
| okf-index-lint-stale | | | |
| private-settings-ignore | | | |

## 結果

未着手。T-0004完了後に詳細化する。
