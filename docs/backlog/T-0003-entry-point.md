---
type: Backlog Item
title: 入口を設置する
description: okf-devkit に AGENTS.md を新設し、CLAUDE.md から取り込んで入口を1枚にする。
tags: [shared]
status: stable
layer: shared
generated:
  by: "process:okf-cli"
  at: "2026-08-31T15:13:56Z"
state: todo
priority: high
effort: S
feasibility: B
ai: assisted
cost: false
created: "2026-09-01"
done_at: null
accepts: ["①", "②", "③"]
spec: ["§5.1", "§8.1"]
target: okf-devkit
evidence: []
related: ["/backlog/T-0004-procedures-and-records.md"]
---

# 入口を設置する

## やりたいこと

`okf-devkit` のルートに `AGENTS.md` を新設し、`CLAUDE.md` に `@AGENTS.md` の取込を書く。入口から必要な手順へ到達できることを確認する。

## 背景・現状

`okf-devkit` のルートは `LICENSE` / `README.md` / `pyproject.toml` / `src` / `tests` のみで、`AGENTS.md` も `CLAUDE.md` も存在しない（2026-09-01 確認）。既存の入口と衝突しないため、§5.1 の雛形をそのまま置ける。

受け入れ②（個人のグローバル設定に必須要件が隠れていない）と③（特権なしで導入できている）も、このタスクの中で同時に確認する。Windows のためシンボリックリンクは使わない（V1）。

## 進め方

<着手直前に詰める（Q17: 薄く起こし、着手直前の1本だけ詰める）。>

## 決定と根拠

着手直前に詰める（Q17）。ここで決めたことは末尾に行き先（→ SPEC §x.y / → T-000N / → K-00N）を書く。

## 完了条件

- [ ] ルートに `AGENTS.md` があり、60行以内である
- [ ] `CLAUDE.md` から `@AGENTS.md` で取り込まれている
- [ ] 入口から `harness/core/procedures/` の手順へ到達できる（受け入れ①）
- [ ] `~/.claude` 等の個人設定に必須要件が無いことを確認した（受け入れ②）
- [ ] 特権昇格・シンボリックリンクなしで導入できた（受け入れ③）
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
