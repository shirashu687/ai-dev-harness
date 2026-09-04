---
type: Backlog Item
title: ScheLiveAppへ独立した二依存として導入する
description: ScheLiveAppへ上流スキルと自前ハーネスを別々の依存として導入し、更新・巻戻し・撤去で固有領域が保たれるか確認する。
tags: [shared, enhancement, ready-for-agent]
status: stable
layer: shared
generated:
  by: "codex/gpt-5"
  at: "2026-09-05T01:19:11+09:00"
state: todo
priority: medium
effort: XL
feasibility: B
ai: assisted
cost: false
created: "2026-09-05"
done_at: null
accepts: ["⑱", "⑲"]
spec: ["§5.1", "§5.5", "§9", "§10"]
target: ScheLiveApp
evidence: []
related: ["/backlog/T-0008-pilot-two-products.md", "/backlog/T-0010-plugin-and-bootstrap.md"]
---

# ScheLiveAppへ独立した二依存として導入する

## やりたいこと

mattpocock/skillsはScheLiveApp自身から上流へ直接接続し、本ハーネス固有部分は別の導入元・版・管理範囲として入れる。

## 背景・現状

二つ目のリポジトリでは、既存入口、OKF、CI、フック、プロジェクト固有設定との衝突が実際の移植性試験になる。上流スキルを本ハーネスへ同梱すると、更新責任と差分が混ざるため行わない。

## 進め方

既存役割を写像して不足だけを導入し、上流更新と自前コア更新を別コミットで一回ずつ演習する。その後、巻戻しと撤去を行い、固有領域と本来の検証が保たれるか確認する。

## 決定と根拠

- 上流と自前コアを別依存・別コミットとして扱う。→ SPEC §9.1
- `project/`、`state/`、台帳、既存文書を共通更新で上書きしない。→ SPEC §9.2

## 完了条件

- [ ] ScheLiveAppがmattpocock/skillsを直接導入している（受け入れ⑱）
- [ ] `skills-lock.json` と `harness/install.json` が別の管理範囲を示す
- [ ] 上流更新と自前コア更新を別々に適用・確認できる
- [ ] 巻戻し・撤去後もプロジェクト固有領域が残る（受け入れ⑲）
- [ ] 既存入口・OKF・CI・フックとの衝突処理が記録されている
- [ ] 同じ導入を再実行して重複が増えない
- [ ] 本来のビルド・テストが4値で記録されている
- [ ] 成果物コミットを `evidence` に記入し、タスクを完了状態にした

## 検証記録

| 識別子 | 結果 | 対象 | 証拠 |
| --- | --- | --- | --- |
| upstream-direct-install | | | |
| harness-core-install | | | |
| update-separation | | | |
| rollback-remove | | | |
| project-required | | | |

## 結果

未着手。T-0008完了後に詳細化する。
