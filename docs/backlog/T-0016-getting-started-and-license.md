---
type: Backlog Item
title: 初めての利用者向けにREADME・使用手順・ライセンスを整備する
description: 実装未読の利用者が導入と最初の作業を試せる文書とMITライセンスを整える。
tags: [shared, enhancement, ready-for-agent]
status: stable
layer: shared
generated:
  by: "codex/gpt-6"
  at: "2026-09-09T12:31:48Z"
state: done
priority: medium
effort: S
feasibility: A
ai: full
cost: false
created: "2026-09-09"
done_at: "2026-09-09"
accepts: []
spec: ["§5.4", "§9.1.4"]
target: harness
evidence: ["2a10f8d08be795a1343c786efd1ee2a60e38aec6"]
related: ["/project/harness-usage.md", "/project/harness-distribution.md"]
---

# 初めての利用者向けにREADME・使用手順・ライセンスを整備する
## やりたいこと

ai-dev-harnessの使用方法・LICENSE・READMEを整備する。何ができて何ができないか、実装を見ていない人の導入手順、最初に何を試すかを明示する。

## 背景・現状

開始時HEADは `510d132`、既存の作業差分なし。READMEはAIへの導入・更新と推奨SHAを中心にしており、製品概要・利用例・導入後の確認が不足していた。THIRD_PARTY_NOTICES.mdはあるが独自部分のLICENSEはなかった。実装はmanifestの11ファイル、読取り専用の照合器、11件の配布テストであり、専用インストーラーや常駐機構はない。

## 進め方

1. 配布実装・手順・実証記録とREADMEの説明を対応させる。
2. READMEに導入の準備・依頼文・完了確認・最初の小作業を置き、日常利用のHow-Toを追加する。
3. MIT LICENSEを追加し、仕様と導入手順に通知の保存を接続する。
4. 配布テスト、OKF検査、リンク・差分確認を実行し、結果を記録する。

## 決定と根拠

- 2026-09-09に利用者がMIT採用を選択。質問で提示した著作権者表記は `ai-dev-harness contributors`。→ T-0016
- 独自部分と第三者部分の許諾・通知の保存契約 → SPEC §5.4
- 推奨SHAは今回更新せず、既存の配布11ファイル・テストコードを変更しない。固定版に欠けるLICENSEは文書入口で別途取得・照合する。→ T-0016
- 新規プロジェクトへの実導入や製品操作の実証は今回の文書整備に含めず、既存記録と区別する。→ T-0016

## 完了条件

- [x] READMEだけで用途・制約・準備・導入依頼・導入後の確認・最初の作業が分かる
- [x] 日常作業・中断再開・振り返り・設定変更の使い方が辿れる
- [x] MIT全文と第三者通知の境界、導入先への通知保存が明記されている
- [x] 必須検証を実行し、下の検証記録を4値で埋めた
- [x] `evidence` に成果物側のコミット SHA を記入した
- [x] 本ファイルの `state` を `done` にし `done_at` を記入した

## 検証記録

| 識別子 | 結果 | 対象（コミット・版） | 証拠（要約・ログ所在） |
|---|---|---|---|
| 配布テスト | 成功 | 開始HEAD `510d132` に本タスク差分を加えた作業ツリー | `python -B -m unittest discover -s tests -p test_distribution.py`、11件成功、23.968秒、exit 0 |
| 文書lint・索引 | 成功 | 同上 | `python -B -m okf_devkit.cli lint` error 0 / warn 0、`index --check` 成功。`index --write`で2索引更新 |
| HTML検査（初回） | 実行不能 | 同上 | `render --check` はmarkdown-it-py不足で停止。依存を追加参照して再試行 |
| HTML検査（再試行） | 成功 | 同上 | `render --check`、29ページ、書込み・削除0、exit 0。バンドル外README/第三者通知への参照を保持する警告4件。リンク先の実在は別途確認 |
| 参照・LICENSE照合 | 成功 | 同上 | READMEと2つのHow-Toのローカルリンク・明示アンカー39件を照合。LICENSEは既存MIT通知の標準本文と一致し、著作権者だけ変更 |
| 固定版との一致 | 成功 | 推奨配布版 `898d514f0594ff09f6c19292ef4df56f6cc4ac50` と作業ツリー | `Distribution`でGit blobを読み、配布11ファイルすべてが現在の許諾対象と正規化テキスト一致。manifest・コア・テスト変更なし |
| affected・stale・差分 | 成功 | 今回の作業ツリー | `affected --paths README.md LICENSE`は配布How-Toを検出。`stale` warn 0 / info 24（人レビュー未記録）。`git diff --check` 成功 |
| 実導入・新規セッション利用 | 未実行 | 対象なし | 文書と既存配布物の検証のみ。依頼例による製品利用の新たな実証は含めない |

※結果は **成功 / 失敗 / 未実行 / 実行不能** のいずれか。失敗・未実行を成功と書かない。

## 結果

README、LICENSE、日常利用How-To、導入手順、SPEC §5.4を更新した。推奨配布版を変えず、独自LICENSEの出所と導入先での通知保持を接続した。実証範囲の記述はT-0008・T-0009・T-0013・T-0014と照合し、URL付き依頼の利用効果など未確認の項目を成功へ読み替えていない。

使用Pythonは `C:/Users/rinta/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/python.exe`。PATHの `python` は利用できず、隣接okf-devkitのvenv実体も起動不能だったため、既存のバンドル実体を使用した。OKFは `PYTHONPATH=C:/Users/rinta/Documents/1_projects/okf-devkit/src` で読み込み、HTML検査のみ既存の `okf-devkit/.venv/Lib/site-packages` を `sys.path` 末尾へ追加して純Pythonの描画依存を参照した。環境への新規インストールは行っていない。

`okf log --write` は設定上追記なしだったため、docs/log.mdへ本タスクの節目を手動追記した。成果物コミット `2a10f8d08be795a1343c786efd1ee2a60e38aec6` をevidenceへ記録し、完了状態を確定した。ローカルコミットまで実施し、GitHubへのpushは行っていない。
