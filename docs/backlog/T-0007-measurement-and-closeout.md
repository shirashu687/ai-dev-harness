---
type: Backlog Item
title: 段階1の計測と締め
description: H2・H3・H5 の初回計測と部品なし比較を行い、仕様を0.3版へ改訂して段階1を締める。
tags: [shared]
status: stable
layer: shared
generated:
  by: "process:okf-cli"
  at: "2026-08-31T15:13:57Z"
state: todo
priority: high
effort: M
feasibility: B
ai: assisted
cost: false
created: "2026-09-01"
done_at: null
accepts: ["⑥", "⑦", "⑧"]
spec: ["§3", "§10"]
target: harness
evidence: []
related: ["/backlog/T-0006-representative-tasks.md", "/backlog/T-0008-stage2-cross-product.md"]
---

# 段階1の計測と締め

## やりたいこと

H2（カナリア記録率）・H3（転記精度）・H5（再開）の初回計測と、部品を外した比較の基準線を取り、`HARNESS_SPEC.md` を0.3版へ改訂する。

## 背景・現状

段階1の出口確認は「受け入れ①〜⑧と、H2・H3・H5 の初回計測が済んでいること」。計測は専用基盤を作らず、台帳と作業記録で足りる（§10）。

部品なし比較（受け入れ⑧）は、手順を外した状態で代表作業を1件流し、品質と負担の差を記録する。初回導入時のみ「ハーネスなし」の基準線も1回取る。取得できない数値は「不明」と書き、ゼロとして集計しない。

## 進め方

<着手直前に詰める（Q17: 薄く起こし、着手直前の1本だけ詰める）。>

## 決定と根拠

着手直前に詰める（Q17）。ここで決めたことは末尾に行き先（→ SPEC §x.y / → T-000N / → K-00N）を書く。

## 完了条件

- [ ] H2・H3・H5 の初回計測値が台帳または作業記録にある
- [ ] 部品なし比較を1回実施し、記録が残っている（受け入れ⑧）
- [ ] 現状比較の記録がある（受け入れ⑥）
- [ ] `HARNESS_SPEC.md` が0.3版に改訂され、`HARNESS_SPEC.html` が再生成・再公開されている
- [ ] 受け入れ①〜⑧がすべて確認済みになっている
- [ ] 必須検証を実行し、下の検証記録を4値で埋めた
- [ ] `evidence` に成果物側のコミット SHA を記入した
- [ ] 本ファイルの `state` を `done` にし `done_at` を記入した

## 検証記録

| 識別子 | 結果 | 対象（コミット・版） | 証拠（要約・ログ所在） |
|---|---|---|---|
| spec-consistency | | | |
| artifact-publish | | | |

※結果は **成功 / 失敗 / 未実行 / 実行不能** のいずれか。失敗・未実行を成功と書かない。

## 結果

<完了時に記入する。実際に変更したファイル、想定と違った点、台帳に回した観測。>
