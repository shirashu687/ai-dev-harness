---
type: Backlog Item
title: <やりたいことの名前>
description: <一文で何をするかを書く。>
tags: [harness]
status: stable
layer: shared
generated:
  by: process:okf-cli
  at: <YYYY-MM-DDTHH:MM:SSZ>
state: todo
priority: medium
effort: M
feasibility: B
ai: assisted
cost: false
created: <YYYY-MM-DD>
done_at: null
accepts: []
spec: []
target: null
evidence: []
related: []
---

# <タイトル>

## やりたいこと

<★ユーザーが書くのはここだけ。1〜3行でよい。>

## 背景・現状

<LLM が調査して記入する。いま何がどうなっているか、なぜ必要か。>

## 進め方

<LLM が記入する。手順・影響範囲・変更するファイル。>

## 決定と根拠

<着手直前の詰め（grilling）で決めたことを1行ずつ。**各行末に行き先を書く。**

- 他のタスクでも将来のプロジェクトでも成り立つ規定 → `HARNESS_SPEC.md` に書き、ここには `→ SPEC §x.y` とだけ残す
- このタスクを終わらせるためだけの情報 → ここに書く（`→ T-000N`）
- 仕様の欠陥かもしれないが根拠が1件しかない観測 → 台帳へ（`→ K-00N`）

同じ文を二箇所に書かない。>

## 完了条件

- [ ] <満たすべき条件>
- [ ] 必須検証を実行し、下の検証記録を4値で埋めた
- [ ] `evidence` に成果物側のコミット SHA を記入した
- [ ] 本ファイルの `state` を `done` にし `done_at` を記入した

## 検証記録

| 識別子 | 結果 | 対象（コミット・版） | 証拠（要約・ログ所在） |
|---|---|---|---|
| | | | |

※結果は **成功 / 失敗 / 未実行 / 実行不能** のいずれか。失敗・未実行を成功と書かない。

## 結果

<完了時に記入する。実際に変更したファイル、想定と違った点、台帳に回した観測。>
