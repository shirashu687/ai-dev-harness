---
type: Backlog Item
title: retroゲートと改善台帳を設置する
description: full retrospectiveの実行条件と、観測から試行・採用・却下・廃止へ進む上限付き改善台帳をokf-devkitへ設置する。
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
accepts: ["⑪", "⑫"]
spec: ["§6.4", "§7"]
target: okf-devkit
evidence: []
related: ["/backlog/T-0004-workflow-and-completion-contract.md", "/backlog/T-0007-obsidian-okf.md"]
---

# retroゲートと改善台帳を設置する

## やりたいこと

毎回の儀式ではなく、摩擦が観測された時だけfull retrospectiveを行い、その候補を即ルール化せず改善台帳で評価する。

## 背景・現状

上流 `retro` は `in-progress` 配下で、改善候補の抽出はできるが、実行ゲート、件数上限、試行、採否、撤去までは対象プロジェクト側の責務になる。

## 進め方

`harness/core/procedures/retrospective.md` と `harness/ledger.md` を設置し、トリガーあり・なしの実例を一件ずつ流す。上流 `retro` を試す場合も、出力は台帳候補に止める。

## 決定と根拠

- トリガーのない回は完了報告だけで終える。→ SPEC §7.1
- 振り返りから恒久ルールへ直接反映しない。→ SPEC §7.2
- 有効項目10件、通常は再発3回を昇格検討の既定値とする。→ SPEC §7.3

## 完了条件

- [ ] トリガーありの回だけfull retrospectiveが行われる（受け入れ⑪）
- [ ] トリガーなしの回で追加の振り返り文書が作られない
- [ ] 台帳が観測→候補→試行→採用/却下/廃止を表現できる（受け入れ⑫）
- [ ] 同一症状の回数加算、有効10件上限、見直し日、撤去条件がある
- [ ] 安全上の例外と通常改善の扱いが区別されている
- [ ] 必須検証を4値で記録した
- [ ] 成果物コミットを `evidence` に記入し、タスクを完了状態にした

## 検証記録

| 識別子 | 結果 | 対象 | 証拠 |
| --- | --- | --- | --- |
| retro-trigger-positive | | | |
| retro-trigger-negative | | | |
| ledger-transition | | | |
| promotion-gate | | | |

## 結果

未着手。T-0004完了後に詳細化する。
