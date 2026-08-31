---
type: Backlog Item
title: 手順・記録・設定を設置する
description: harness/ 配下に共通手順2本・作業記録テンプレート・必須制約・プロジェクト設定・改善台帳を設置する。
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
accepts: ["①", "④"]
spec: ["§4", "§5.2", "§5.3", "§5.4", "§5.5"]
target: okf-devkit
evidence: []
related: ["/backlog/T-0003-entry-point.md", "/backlog/T-0005-enforcement-points.md"]
---

# 手順・記録・設定を設置する

## やりたいこと

`okf-devkit` の `harness/` 配下に、共通手順2本（検証と報告 / 中断と引継ぎ）・作業記録テンプレート・必須制約・プロジェクト設定・改善台帳・`state/` を置く。

## 背景・現状

§4 の構成のうち、入口2枚（T-0003）と強制点（T-0005）を除いた6ファイルが対象。`core/` に置くのは別プロジェクトへそのままコピーしても嘘にならない文章だけで、コマンド・パス・固有事情は `project/config.md` に置く——この規律が段階3（`ScheLiveApp` への配布）の抽出コストを決める。

改善台帳の初期行には、T-0002 で決まる摩擦上位3件に加えて、**T-0001 の「決定と根拠」に置いてある観測3件**（Python 3.14 がテスト対象外 / `okf.exe` が PATH に無い / `okf new` が `tags` を上書きする）を移す。

## 進め方

<着手直前に詰める（Q17: 薄く起こし、着手直前の1本だけ詰める）。>

## 決定と根拠

着手直前に詰める（Q17）。ここで決めたことは末尾に行き先（→ SPEC §x.y / → T-000N / → K-00N）を書く。

## 完了条件

- [ ] `harness/core/procedures/verify-report.md` と `handover.md` がある
- [ ] `harness/core/templates/worklog.md` がある
- [ ] `harness/core/policy/requirements.md` がある
- [ ] `harness/project/config.md` に必須検証表（対象層の列を含む）がある
- [ ] `harness/ledger.md` があり、T-0002 の摩擦3件と T-0001 の観測3件が行になっている
- [ ] `harness/state/journal/` と `archive/` がある
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
