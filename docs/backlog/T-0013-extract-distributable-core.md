---
type: Backlog Item
title: 共通コアを本リポジトリへ抽出し最小配布物を確立する
description: okf-devkitで実証した共通コアをharnessへ抽出し、二つ目の導入前にGitで版管理する最小配布物と管理手順を確立する。
tags: [shared, enhancement, ready-for-agent]
status: stable
layer: shared
generated:
  by: "process:okf-cli"
  at: "2026-09-05T15:28:53Z"
state: todo
priority: high
effort: M
feasibility: B
ai: assisted
cost: false
created: "2026-09-06"
done_at: null
accepts: ["⑲"]
spec: ["§9.1.1", "§9.2", "§10"]
target: harness
evidence: []
related: ["/backlog/T-0008-pilot-two-products.md", "/backlog/T-0009-second-repository-rollout.md"]
---

# 共通コアを本リポジトリへ抽出し最小配布物を確立する

## やりたいこと

実証済みの土台を別リポジトリへ配れる形にする。→ SPEC §9.1.1

## 背景・現状

現在の実装先はokf-devkitであり、従来の計画には実証から配布元確立への工程が明示されていなかった。配布の製品化を待たずに再利用可能な成果物を確立する工程として起票する。

## 進め方

T-0008完了後、T-0009着手前に実施する。実証結果から抽出対象を選び、配置・版の識別方法・導入手順の詳細は着手直前に詰める。

## 決定と根拠

- 配布元、所有境界、還元、最小配布と製品化の区別は → SPEC §9.1.1。
- 固有領域を保護する更新・巻戻し・撤去は → SPEC §9.2。

## 完了条件

- [ ] 本リポジトリに共通コアとテンプレートの配布用正本があり、Gitで版を特定できる
- [ ] 固有設定・作業記録・台帳の実データ・上流スキル本体が配布物に混入していない
- [ ] 導入・更新・巻戻し・撤去の明示手順とinstall.jsonの記録方法がある
- [ ] okf-devkitを配布物と照合し、共通部分の一致と固有領域の保持を確認した
- [ ] T-0009で使う配布元・版・手順が特定されている
- [ ] 必須検証を4値で記録し、成果物コミットをevidenceに記入した
- [ ] stateをdoneにし、done_atを記入した

## 検証記録

| 識別子 | 結果 | 対象（コミット・版） | 証拠（要約・ログ所在） |
|---|---|---|---|
| distribution-boundary | | | |
| source-version-and-install-record | | | |
| pilot-reconciliation | | | |
| lifecycle-procedures | | | |

結果は成功 / 失敗 / 未実行 / 実行不能のいずれか。

## 結果

未着手。T-0008の実証結果が揃ってから詳細化する。
