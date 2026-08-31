---
type: Backlog Item
title: 強制点を設置する
description: deny ルールと CI を REQ-1・REQ-2 の強制点として設置・確認する。
tags: [shared]
status: stable
layer: shared
generated:
  by: "process:okf-cli"
  at: "2026-08-31T15:13:57Z"
state: todo
priority: high
effort: S
feasibility: B
ai: assisted
cost: false
created: "2026-09-01"
done_at: null
accepts: ["④"]
spec: ["§7"]
target: okf-devkit
evidence: []
related: ["/backlog/T-0004-procedures-and-records.md"]
---

# 強制点を設置する

## やりたいこと

`.claude/settings.json` を新設して `harness/core/policy/**` への編集を deny し、既存 CI を REQ-1 の強制点として使えることを確認する。

## 背景・現状

`okf-devkit` に `.claude/settings.json` は無く、`.claude/` には `worktrees/` があるだけ（2026-09-01 確認）。新規作成になるので既存設定とのマージは不要。

CI は ubuntu / windows × Python 3.11・3.13 のマトリクスで `tests/run_all.py` を実行し、別ジョブで e2e smoke（`okf init` → `index` → `lint` → `render` → `log`）を回している。これにより REQ-1（検証の失敗・未実行を成功として報告しない）の強制点を、運用◇ではなく **CI** に置ける（§12 の保留事項がここで解消する）。

既知の限界も記録する: deny は任意のサブプロセス経由の書込には及ばない（V10）。

## 進め方

<着手直前に詰める（Q17: 薄く起こし、着手直前の1本だけ詰める）。>

## 決定と根拠

着手直前に詰める（Q17）。ここで決めたことは末尾に行き先（→ SPEC §x.y / → T-000N / → K-00N）を書く。

## 完了条件

- [ ] `.claude/settings.json` の deny で `harness/core/policy/**` の編集が拒否される
- [ ] deny が実際に効くことを1回試して確認した
- [ ] `requirements.md` の REQ-1 の強制点が「CI」になっている
- [ ] CI が失敗したとき、失敗のまま報告されることを1回確認した（受け入れ④）
- [ ] 必須検証を実行し、下の検証記録を4値で埋めた
- [ ] `evidence` に成果物側のコミット SHA を記入した
- [ ] 本ファイルの `state` を `done` にし `done_at` を記入した

## 検証記録

| 識別子 | 結果 | 対象（コミット・版） | 証拠（要約・ログ所在） |
|---|---|---|---|
| build | | | |
| test | | | |

※結果は **成功 / 失敗 / 未実行 / 実行不能** のいずれか。失敗・未実行を成功と書かない。

## 結果

<完了時に記入する。実際に変更したファイル、想定と違った点、台帳に回した観測。>
