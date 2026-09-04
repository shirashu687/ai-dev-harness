---
type: Backlog Item
title: 規模別フローと完了契約を設置する
description: 小・通常・大の開発フロー、4値の検証報告、作業記録、セッション引継ぎをokf-devkitへ設置する。
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
accepts: ["⑦", "⑧", "⑨"]
spec: ["§2.2", "§2.3", "§4", "§8.1"]
target: okf-devkit
evidence: []
related: ["/backlog/T-0003-japanese-entry-and-guide.md", "/backlog/T-0005-requirements-and-enforcement.md", "/backlog/T-0006-retro-and-ledger.md"]
---

# 規模別フローと完了契約を設置する

## やりたいこと

計画、grilling、仕様化、実装、review、検証、報告、引継ぎを一律の重い工程にせず、作業規模に応じて選べる共通契約を置く。

## 背景・現状

mattpocock/skillsは実装までの能力を広く提供するが、対象プロジェクトの必須コマンド、結果表現、完了報告、再開可能な状態は対象側で定義する必要がある。

## 進め方

`harness/core/procedures/verify-report.md`、`handover.md`、`templates/worklog.md` と `harness/project/config.md` を、既存の役割があればそれを使う形で設置する。

## 決定と根拠

- 小作業は計画書とfull retroを必須にしない。→ SPEC §4.1
- 検証結果は成功・失敗・未実行・実行不能の4値に固定する。→ SPEC §8.1
- 報告と引継ぎは同じworklogで表現する。→ SPEC §2.3

## 完了条件

- [ ] 小・通常・大の入口と工程が区別されている（受け入れ⑦）
- [ ] 必須検証の対象、コマンド、4値、証拠欄がある（受け入れ⑧）
- [ ] 中断時の次の一手・妨げ・前提・最新検証を記録できる
- [ ] 別セッションから一回再開できた（受け入れ⑨）
- [ ] 通常・大のreviewが仕様軸と標準軸を区別する
- [ ] upstreamのcommit等の手順より利用者権限・ローカル契約を優先すると明記した
- [ ] 必須検証を4値で記録した
- [ ] 成果物コミットを `evidence` に記入し、タスクを完了状態にした

## 検証記録

| 識別子 | 結果 | 対象 | 証拠 |
| --- | --- | --- | --- |
| small-flow | | | |
| normal-flow | | | |
| handover-resume | | | |
| report-four-state | | | |
| project-required | | | |

## 結果

未着手。T-0003完了後に詳細化する。
