---
type: Backlog Item
title: 必須制約と強制点を接続する
description: okf-devkitの必須制約を既存CI・権限設定・差分レビューへ対応づけ、運用だけに依存する限界も明示する。
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
accepts: ["⑩"]
spec: ["§4.2", "§8.2", "§8.3"]
target: okf-devkit
evidence: []
related: ["/backlog/T-0004-workflow-and-completion-contract.md", "/backlog/T-0008-pilot-two-products.md"]
---

# 必須制約と強制点を接続する

## やりたいこと

`harness/core/policy/requirements.md` を設置し、各制約に実在する強制点と確認方法を対応づける。

## 背景・現状

エージェント向け文書は文脈であって強制ではない。失敗の誤報、必須検証の緩和、無断の外部送信、機密混入、上流管理ファイルの無宣言変更は、可能な範囲で製品設定・実行環境・CIへ移す。

## 進め方

既存CIと製品設定を先に確認し、制約ごとに「製品設定 / 実行環境 / CI / 運用」のどこで守るか、実機確認方法、既知の限界を書く。新しい仕組みは欠けた強制点にだけ追加する。

## 決定と根拠

- 運用しかない規則は必須と同じ強さで表現しない。→ SPEC §8.2
- 既存CI・保護設定を優先し、同じ強制機構を二重化しない。→ SPEC §1.3

## 完了条件

- [ ] 最低5制約のすべてに強制点・確認方法・既知の限界がある（受け入れ⑩）
- [ ] CIが失敗した場合に失敗のまま報告される
- [ ] 必須検証・必須制約の通常実装からの書換えが検知または拒否される
- [ ] 上流管理ファイルのローカル改変が差分で検知される
- [ ] 運用のみの制約が明示されている
- [ ] 必須検証を4値で記録した
- [ ] 成果物コミットを `evidence` に記入し、タスクを完了状態にした

## 検証記録

| 識別子 | 結果 | 対象 | 証拠 |
| --- | --- | --- | --- |
| requirements-map | | | |
| ci-failure-surface | | | |
| protected-policy | | | |
| upstream-drift | | | |

## 結果

未着手。T-0004完了後に詳細化する。
