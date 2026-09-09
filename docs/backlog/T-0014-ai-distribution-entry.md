---
type: Backlog Item
title: AIへのURL付き依頼で導入・更新できる入口を整備する
description: Git配布のREADME入口と推奨固定版の記録を整え、URL付きの依頼から既存の導入・更新手順へ接続する。
tags: [shared, enhancement, ready-for-agent]
status: stable
layer: shared
generated:
  by: "codex/gpt-6"
  at: "2026-09-07T14:05:39Z"
state: done
priority: medium
effort: S
feasibility: B
ai: assisted
cost: false
created: "2026-09-07"
done_at: "2026-09-07"
accepts: ["④"]
spec: ["§9.1.3", "§9.1.4", "§9.2.1", "§9.3"]
target: harness
evidence: ["5cd28d6806d1d030bf321e464116a9e810c18a1e"]
related: ["/backlog/T-0011-distribution-strategy.md", "/backlog/T-0013-extract-distributable-core.md", "/backlog/T-0009-second-repository-rollout.md", "/project/harness-distribution.md"]
---

# AIへのURL付き依頼で導入・更新できる入口を整備する
## やりたいこと

配布元URLを含む依頼をAIへ渡すだけで、事前設定のないリポジトリでも既存の導入・更新手順へ進める文書の入口を作る。

## 背景・現状

T-0011でGit配布を継続する利用方針を検討し、プラグイン化はT-0010へ分けた。現行How-Toには操作手順があるが、AI向けの依頼文と継続的な推奨版の案内がない。契約は → SPEC §9.1.4。

## 進め方

2026-09-07に着手。READMEは未設置であり、既存配布版から配布物・manifest・検証コード・How-Toに差分がないことを確認した。ルートREADMEに推奨版と検証記録を示し、既存How-Toへ導入・更新用の依頼文と現在版・目的版の解決例を追加する。GitHubの独立cloneで固定版を確認し、文書入口と固定版の操作手順を分けて検証する。

文書からの導入体験はT-0009の実証へ接続し、人の追加回答回数・概算作業時間・再試行を記録する。T-0009の実導入が先行した場合は、その結果と後から行う入口の検証を区別する。

## 決定と根拠

- 依頼の入口・推奨版・版解決の失敗時の扱いは → SPEC §9.1.4。
- 対象はREADMEと既存How-Toを中心とする文書作業。専用CLI、プラグイン、公開レジストリへの登録を実装範囲に含めない。→ T-0014
- 推奨版の記録だけを変えて新しい配布物の検証を済ませたことにしない。→ SPEC §9.1.3 / §9.1.4
- 今回はコア・manifest・検証コードを改訂せず、T-0013の確定版を再確認して推奨する。新しい依頼・版解決の説明は配布元の現行How-Toに置き、解決後は固定版のHow-To §1〜§9へ進む。→ T-0014
- 開始SHAは `e0ec92e3859250eccc4e5e550c25ca9276ec9caf`。開始時からT-0002・T-0003・T-0007〜T-0012、backlog/indexとlogに未コミット変更があり、本ファイルは未追跡だった。既存差分を保持し、今回の成果物コミットへ混ぜない。→ T-0014

## 完了条件

- [x] URL付きの導入・更新依頼から、README経由で既存How-Toへ進める
- [x] 推奨版の完全SHA・検証根拠と現在版の取得方法を確認できる
- [x] 推奨版なし・記録不正・版を解決できない場合の扱いが既存契約につながっている
- [x] 固定SHAの実在・手順参照・導入体験の実証範囲を区別して記録した
- [x] 必須検証を実行し、下の検証記録を4値で埋めた
- [x] `evidence` に成果物側のコミット SHA を記入した
- [x] 本ファイルの `state` を `done` にし `done_at` を記入した

## 検証記録

| 識別子 | 結果 | 対象（コミット・版） | 証拠（要約・ログ所在） |
|---|---|---|---|
| entry-and-version-reference | 成功 | 成果物 `5cd28d6` のREADME・How-Toと固定配布版 | ローカル文書14リンクのファイル・明示アンカー、固定版How-To §1〜§9の実在を確認。版選択・停止の分岐は下記。新規AIセッションでの実導入は含まない |
| fixed-source-check | 成功 | `898d514f0594ff09f6c19292ef4df56f6cc4ac50` | 正式GitHubから独立clone、origin・完全SHA・clean状態を確認。配布11本＋manifest＋How-To＋検証コード＋SPECの15本を固定Git blobと正規化ハッシュ照合。READMEが参照するT-0013の記録コミットも取得 |
| fixed-distribution-tests | 成功 | 上記固定版のGitHub clone | Python 3.12.14で `python -B -m unittest discover -s tests -p test_distribution.py`、11件成功・24.537秒・exit 0。既存suiteの再実行であり、別手順による5操作の再演習ではない |
| current-version-example | 成功 | okf-devkitの現物と上記固定版 | `harness/install.json` から現在版を取得し、固定版の `Distribution` / `verify` / `preflight` で管理6本一致・現在版＝目的版・内容変更0件を確認。対象への書込みなし |
| docs-lint | 成功 | 今回の文書を含む作業ツリー | `python -m okf_devkit.cli affected --paths README.md` がHow-Toを特定。index生成・lint error 0 / warn 0・index check・`git diff --check` 成功。staleはwarn 0 / info 21 |
| url-request-install-experience | 未実行 | T-0009でのScheLiveApp実導入 | How-To §10の計測項目とT-0009への参照を追加。人の追加回答回数・概算作業時間・再試行は未測定。今回の文書参照確認を実導入成功へ読み替えない |

※結果は **成功 / 失敗 / 未実行 / 実行不能** のいずれか。失敗・未実行を成功と書かない。

## 結果

README、How-Toの依頼文・版解決手順、T-0009への実証接続を実装した。成果物コミットは `5cd28d6806d1d030bf321e464116a9e810c18a1e`。検証・履歴・完了証拠を揃え、`state: done`、`done_at: 2026-09-07` とした。配布コアの改訂は不要であり、推奨配布SHAと文書成果物SHAを分けて記録した。

### 入口と版の確認範囲

- READMEの推奨記録から、T-0013の確定記録 `e04e3dae2ab6f797def69a3a6c541ca0b5a643c6` と同じ配布SHAを解決した。manifestの正規化SHA-256は `46d193e267973b8d3b3808f5d0c2fea3f953aff5b234ab3e97b8d2a4d8004a03`。
- 文書の分岐を読み合わせ、導入記録・既存コアともになければ新規導入、同版なら照合して変更なし、異版なら両版を解決して更新へ接続することを確認した。推奨なし・不正記録・出所/SHA/根拠の取得不能は書込み前に停止し、既存コアだけある場合は明示移行へ送る。これは文書レビューであり、新規AIセッションでの振る舞いの実証ではない。
- 同版の例だけはokf-devkitの現物を読み取り照合した。異なる正式配布版への実更新、ScheLiveAppへの導入、URL付きの一度の依頼で進めた場合の手間削減は今回未実証。コア・manifest・検証コードは既存配布版から変更していない。
- 新しい入口はローカル成果物であり、GitHubへのpushは未実施。正式固定SHAのGitHub取得確認と、新しいREADMEの公開・URLからの実利用確認を区別する。

### 実行環境・再試行

- 使用Pythonは `C:/Users/rinta/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/python.exe`（3.12.14）。OKF CLIには `PYTHONPATH=C:/Users/rinta/Documents/1_projects/okf-devkit/src` を設定した。
- 独立cloneは `C:/Users/rinta/AppData/Local/Temp/t0014-github-d5d350f608dc43f5883672316835d457`。補助照合のスクリプトと15ファイル・参照・同版例の結果は `C:/Users/rinta/AppData/Local/Temp/t0014-entry-20260907-1352/verify.py` と同ディレクトリの `verification.json`。一時ファイルが失われても上記Git SHAと検証コマンドで固定版を再照合できる。
- 初回のネットワーク照会はsandbox内で接続失敗。その後、読取り用cloneの権限付き実行で取得に成功した。補助照合は初回にcloneの所有者差で停止し、既知のcloneだけにプロセス内のGit例外を設定して再試行した。続くリンク抽出のコードブロック誤検出を補助スクリプトで訂正し、最終照合は成功。配布コード・必須検証・永続Git設定は変更していない。
