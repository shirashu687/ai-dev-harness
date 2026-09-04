---
type: Backlog Item
title: 上流スキルを直接依存として導入する
description: okf-devkitへ依存関係が閉じたmattpocock/skillsプロファイルを直接導入し、出所・重複・ライセンス・更新方法を確認する。
tags: [shared, enhancement, ready-for-agent]
status: stable
layer: shared
generated:
  by: "codex/gpt-5"
  at: "2026-09-05T01:19:11+09:00"
state: todo
priority: high
effort: M
feasibility: B
ai: assisted
cost: false
created: "2026-09-05"
done_at: null
accepts: ["①", "②", "③", "④"]
spec: ["§5.1", "§5.2", "§5.4", "§5.5"]
target: okf-devkit
evidence: []
related: ["/backlog/T-0003-japanese-entry-and-guide.md"]
---

# 上流スキルを直接依存として導入する

## やりたいこと

`okf-devkit` が mattpocock/skills を本ハーネス経由ではなく上流から直接導入する。`ask-matt` の案内先が欠けない初期プロファイルを選び、更新可能な依存として記録する。

## 背景・現状

この設計リポジトリには調査用として全37スキルがあるが、適用先の既定ではない。多数のスキルは初期description一覧の文脈負担になり、同名スキルを複数の場所へ入れるとCodexでは統合されない。上流の `in-progress` は既定から外す。

## 進め方

1. SPEC §5.2 の engineering-flow 候補について、各 `SKILL.md` の呼出先を調べ、未導入参照がない最小閉包を確定する。
2. 対象リポジトリのルートで `npx skills@latest add mattpocock/skills` を実行し、確定プロファイルだけを選ぶ。
3. `skills-lock.json` と `harness/project/skill-profile.md` に、重複しない現在状態と更新方法を残す。
4. 上流MIT Licenseの通知を `THIRD_PARTY_NOTICES.md` 等へ保持する。
5. user scope、repo scope、Claude Code pluginを含め、同名スキルの二重発見がないことを確認する。
6. 肯定・否定トリガーと `ask-matt` の主要ルートを短いテスト表で確認する。

## 決定と根拠

- 上流スキルは対象リポジトリの直接依存とし、本ハーネスには同梱しない。→ SPEC §5.1 / §9.1
- 初期プロファイルはフォルダ数ではなく参照閉包で選ぶ。→ SPEC §5.2
- 英語原文はインストーラー管理のまま維持する。→ SPEC §5.3
- 上流更新と自前コア更新を同じコミットに混ぜない。→ SPEC §5.5

## 完了条件

- [ ] mattpocock/skills が `okf-devkit` から直接導入されている（受け入れ①）
- [ ] `skill-profile.md` の全参照先が導入済みである（受け入れ②）
- [ ] repo / user / plugin間に同名スキルの重複がない（受け入れ③）
- [ ] `skills-lock.json`、出所、更新コマンド、MIT通知を確認できる（受け入れ④）
- [ ] `in-progress` 配下が既定プロファイルに含まれていない
- [ ] 肯定・否定トリガーと主要ルートの結果が記録されている
- [ ] 必須検証を4値で記録した
- [ ] 成果物コミットを `evidence` に記入し、`state: done` と `done_at` を更新した

## 検証記録

| 識別子 | 結果 | 対象 | 証拠 |
| --- | --- | --- | --- |
| dependency-closure | | | |
| duplicate-scan | | | |
| trigger-positive | | | |
| trigger-negative | | | |
| license-provenance | | | |
| project-required | | | |

## 結果

未着手。最初に詳細化するタスク。
