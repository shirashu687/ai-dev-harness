---
type: Backlog Item
title: 日本語の入口とスキル案内を設置する
description: okf-devkitの既存入口を保ちながら、作業分類・プロジェクト制約・上流スキルの呼出関係へ到達できる日本語ガイドを設置する。
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
accepts: ["⑤", "⑥"]
spec: ["§1.3", "§2.2", "§2.3", "§5.3"]
target: okf-devkit
evidence: []
related: ["/backlog/T-0002-upstream-skills-dependency.md", "/backlog/T-0004-workflow-and-completion-contract.md"]
---

# 日本語の入口とスキル案内を設置する

## やりたいこと

`okf-devkit` の既存指示を置き換えず、ルートの短い入口から、プロジェクト設定、必須制約、日本語のスキル案内へ到達できるようにする。

## 背景・現状

上流スキルの実行文は英語のまま保つ。一方、人が「どれが何をし、何を呼ぶか」を毎回英語で再読する負担は、`harness/core/guide.md` の日本語ルート表で下げる。

## 進め方

既存の `AGENTS.md` / `CLAUDE.md` / ネストしたツール生成入口を先に写像し、重複を作らず必要な参照だけを追加する。ガイドには用途、対象外、明示呼出か自動呼出か、前後のスキルを一行ずつ記す。

## 決定と根拠

- 入口は詳細本文ではなく段階的開示のルーターにする。→ SPEC §1.3
- 上流原文を複製・翻訳せず、日本語の索引だけを所有する。→ SPEC §5.3

## 完了条件

- [ ] 一つの短い入口から `guide.md`、`config.md`、`requirements.md` へ到達できる（受け入れ⑤）
- [ ] 日本語ガイドに主要フロー、単独スキル、呼出関係、対象外がある（受け入れ⑥）
- [ ] 既存の入口やOKF生成入口を重複作成していない
- [ ] 上流 `SKILL.md` 本文を日本語ガイドへ複製していない
- [ ] ガイド中のスキル名が `skill-profile.md` と一致する
- [ ] 必須検証を4値で記録した
- [ ] 成果物コミットを `evidence` に記入し、タスクを完了状態にした

## 検証記録

| 識別子 | 結果 | 対象 | 証拠 |
| --- | --- | --- | --- |
| entry-navigation | | | |
| guide-profile-consistency | | | |
| duplicate-entry-scan | | | |
| project-required | | | |

## 結果

未着手。T-0002完了後に詳細化する。
