---
type: Backlog Item
title: 代表作業3件と2製品で実証する
description: okf-devkitの実作業3件をClaude CodeとCodexで進め、品質・手戻り・検証・スキル起動・文脈負担を比較する。
tags: [shared, enhancement, ready-for-agent]
status: stable
layer: shared
generated:
  by: "codex/gpt-5"
  at: "2026-09-05T01:19:11+09:00"
state: todo
priority: high
effort: L
feasibility: B
ai: assisted
cost: false
created: "2026-09-05"
done_at: null
accepts: ["⑮", "⑯", "⑰"]
spec: ["§3", "§4", "§8.3", "§10.1"]
target: okf-devkit
evidence: []
related: ["/backlog/T-0005-requirements-and-enforcement.md", "/backlog/T-0007-obsidian-okf.md", "/backlog/T-0009-second-repository-rollout.md"]
---

# 代表作業3件と2製品で実証する

## やりたいこと

小さな不具合修正、通常の機能追加、中断を伴う作業を一件ずつ行い、Claude CodeとCodexで同じ完了契約が機能するか確認する。

## 背景・現状

ファイルを置いただけではハーネスの有効性は分からない。実作業で、導入前または部品なしの基準と比較し、品質を落とさず手戻りが減るかを測る。

## 進め方

三件の代表作業を着手時に一件ずつ選び、同じ開始条件で可能な比較を行う。完了適合、人の修正、探索反復、検証誤報、スキル起動、所要、文脈負担を記録する。

## 決定と根拠

- AIの自己採点だけで品質を判定しない。→ SPEC §10.1
- 小作業には重い工程を強制しない。→ SPEC §4.1
- 文書上の対応と実機で確認した対応を区別する。→ SPEC §3

## 完了条件

- [ ] 三種類の代表作業が入口から完了報告まで終わった（受け入れ⑮）
- [ ] 導入前または部品なしの基準との比較が一回以上ある
- [ ] 品質を落とさず手戻りまたは探索負担が改善した、または不採用理由が残っている（受け入れ⑯）
- [ ] Claude CodeとCodexの双方で成果物契約が実機確認された（受け入れ⑰）
- [ ] スキルの未発動・誤発動・重複と文脈負担を記録した
- [ ] 中断→再開を一回含む
- [ ] 結果を第0.4版の仕様改訂候補として整理した
- [ ] 成果物コミットを `evidence` に記入し、タスクを完了状態にした

## 検証記録

| 代表作業 | 製品 | 完了適合 | 人の修正 | 探索反復 | スキル起動 | 所要・文脈 | 証拠 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 小さな不具合修正 | | | | | | | |
| 通常の機能追加 | | | | | | | |
| 中断を伴う作業 | | | | | | | |

## 結果

未着手。T-0002〜T-0007完了後に詳細化する。
