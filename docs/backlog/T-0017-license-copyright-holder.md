---
type: Backlog Item
title: ライセンスの著作権者をGitHubアカウント名へ変更する
description: LICENSEとREADMEの著作権者表記をGitHubアカウント名へ揃える。
tags: [shared, enhancement, ready-for-agent]
status: stable
layer: shared
generated:
  by: codex/gpt-6
  at: "2026-09-09T12:54:51Z"
state: doing
priority: medium
effort: S
feasibility: A
ai: full
cost: false
created: "2026-09-09"
done_at: null
accepts: []
spec: ["§5.4"]
target: harness
evidence: []
related: ["/backlog/T-0016-getting-started-and-license.md", "/project/harness-distribution.md"]
---

# ライセンスの著作権者をGitHubアカウント名へ変更する

## やりたいこと

著作権者表記をGitHubアカウント名へ変更する。

## 背景・現状

T-0016で追加したLICENSEの表記について利用者から変更依頼を受けた。開始HEADは `99c3b466979012e9885ba813af41724a08693cea`、既存差分なし。

## 進め方

LICENSE・READMEを修正し、通知保持手順を読み合わせる。文書検査後に成果物SHAを記録する。

## 決定と根拠

- `gh api user --jq .login` と配布元の所有者が一致する `shirashu687` を採用する。→ T-0017
- 過去の意思決定記録は当時の記録として保持し、通常の追加コミットで変更する。→ T-0017
- 許諾と通知保持の契約 → SPEC §5.4

## 完了条件

- [x] LICENSEとREADMEの著作権者表記が一致する
- [x] MIT本文・第三者通知・配布物が変更されていない
- [x] 文書検査と差分検査が成功する
- [ ] 成果物SHAと完了状態を記録する

## 検証記録

| 識別子 | 結果 | 証拠 |
| --- | --- | --- |
| 表記・保持照合 | 成功 | HEADのLICENSEとの差分が著作権者1行のみであることを照合。README一致、配布物・テスト・第三者通知の差分なし |
| 文書検査 | 成功 | OKF lint error 0 / warn 0、index --check、git diff --check 成功 |

## 結果

LICENSEとREADMEを修正し、導入手順に取得したLICENSEの著作権者表記を保持する旨を補足した。成果物確定後に完了記録を追記する。
