---
type: Backlog Item
title: 旧版資料と未使用ファイルを整理する
description: 旧版資料の内容を保持してアーカイブへ移し、未使用フックと空の重複ログを削除してPRにまとめる。
tags: [shared, enhancement, ready-for-agent]
status: stable
layer: shared
generated:
  by: "codex/gpt-6"
  at: "2026-09-07T14:21:23Z"
state: doing
priority: medium
effort: S
feasibility: A
ai: full
cost: false
created: "2026-09-07"
done_at: null
accepts: []
spec: ["§1.1"]
target: harness
evidence: []
related: []
---

# 旧版資料と未使用ファイルを整理する

## やりたいこと

リポジトリ内の不要なファイルを整理し、変更を検証してPRを作成する。

## 背景・現状

ルートに現行仕様と第0.2版までの資料が並んでいる。`.okf/hooks/` の2本はリポジトリ内に呼出設定がなく、`docs/project/log.md` は見出しと生成案内だけで記録がない。`okf.yml` の shared 層の出力先は `docs/log.md` である。

## 進め方

1. 旧版の設計書・審査記録・レビュー依頼文・仕様HTMLを `docs/_archive/v0.2/` へ移し、入口と仕様の参照先を更新する。
2. 未使用フック2本と空の重複ログを削除し、アーカイブHTMLだけを生成HTMLのGit除外から外す。
3. 移動前後の内容一致、参照、配布テスト、OKF lintとrenderを確認し、索引・変更履歴・完了状態を更新してPRを作成する。

## 決定と根拠

- 文書の役割と凍結の扱いは → SPEC §1.1。
- アーカイブ4本はバイト単位で保持する。既存の審査・完了記録中の旧パスは当時の配置として残し、現在の所在はSPECの一覧から辿れるようにする。→ T-0015
- `_archive/` はOKFの既存の除外規則に従うため、資料へのfrontmatter追加や閲覧HTMLの再生成を行わない。→ T-0015
- 配布物、導入済み上流スキル・lock・ライセンス、現行図解、完了済みバックログ、OKFテンプレートは利用先・保存目的があるため保持する。→ T-0015
- 比較元は `origin/main` の `c184175a962a6f3004d924001732b8b0184538a5`。ローカルmainの未公開コミットと別作業のブランチを保持する。T-0014は既存の別ブランチで使用済みのため、CLIで生成した雛形の番号をT-0015へ変更する。→ T-0015

## 完了条件

- [x] 旧版資料4本を内容を変えずに移し、現在の所在を入口と仕様から辿れる
- [x] 未使用フック2本と空の重複ログを削除し、現行配布物・スキル・記録を保持した
- [x] アーカイブを保持し、通常の生成HTMLをGit管理外にする規則を確認した
- [x] 必須検証を実行し、下の検証記録を4値で埋めた
- [ ] `evidence` に成果物側のコミット SHA を記入した
- [ ] 本ファイルの `state` を `done` にし `done_at` を記入した
- [ ] 索引・変更履歴を更新し、整理用ブランチのPRを作成した

## 検証記録

| 識別子 | 結果 | 対象（コミット・版） | 証拠（要約・ログ所在） |
|---|---|---|---|
| archive-integrity | 成功 | 比較元SHAと整理作業ツリー | 移動前後のSHA-256と比較元のGit blobを照合し、4本がバイト単位で一致 |
| references-and-scope | 成功 | 整理作業ツリー | SPECの4リンクの実在、3本の削除、配布物・スキル・テンプレート等124本の保持を確認。`git check-ignore --no-index -v` でアーカイブHTMLの保持と生成HTML・資産の除外を確認 |
| distribution-tests | 成功 | 整理作業ツリー | `python -B -m unittest discover -s tests -v`: 11件成功 |
| okf-checks | 成功 | 整理作業ツリー | affected: 更新対象なし。index: 再生成済み。lint --strict: error 0 / warn 0。render --check: 25ページ、書込み・削除・warn 0 |
| stale-report | 成功 | 整理作業ツリー | stale実行完了。既存の配布手順書の更新日時に関するoutdated警告2件が残る。対象文書・distribution・testsは比較元と同一で、今回の整理による新規警告ではない |
| diff-check | 成功 | 整理作業ツリー | `git diff --check`: 指摘なし |

## 結果

整理差分と検証を完了した。OKF CLIは利用可能なPythonに既存のokf-devkitソースと依存パッケージを読み込ませて実行した。成果物コミット、変更履歴、PRの記録を残す。
