# 共通AI開発ハーネス

既存プロジェクトに、作業の進め方・検証と報告・引継ぎ・改善記録の共通手順を加えるハーネスです。このリポジトリは仕様とGit配布物の管理場所です。

## AIに導入・更新を依頼する

操作したいリポジトリをAIの作業場所として開き、次の依頼文を渡してください。配布元URLを含むため、対象プロジェクトの事前登録は不要です。

- **初めて導入する:** [導入の依頼文](docs/project/harness-distribution.md#ai-install)
- **導入済みのものを更新する:** [更新の依頼文](docs/project/harness-distribution.md#ai-update)

AIは[版の解決手順](docs/project/harness-distribution.md#resolve-versions)から、対象の既存構成・入口・必要検証を確認して固定版の操作手順へ進みます。巻戻し・撤去も[導入・保守手順](docs/project/harness-distribution.md)から辿れます。

## 推奨配布版

版指定のない依頼では、次の記録を使います。

| 項目 | 記録 |
| --- | --- |
| 提供状態 | 提供中（2026-09-07確認） |
| 推奨する完全GitコミットSHA | `898d514f0594ff09f6c19292ef4df56f6cc4ac50` |
| 検証根拠 | [T-0013の確定記録](https://github.com/shirashu687/ai-dev-harness/blob/e04e3dae2ab6f797def69a3a6c541ca0b5a643c6/docs/backlog/T-0013-extract-distributable-core.md): 正式GitHubからの独立取得、11ファイルの配布境界、5操作と復旧の演習、okf-devkitへの移行・保持検証 |
| 今回の再確認 | [T-0014の検証記録](docs/backlog/T-0014-ai-distribution-entry.md): 固定版の取得・内容・手順参照と文書入口の確認 |
| 推奨を取り下げた版・問題 | 記録なし（2026-09-07時点） |

これは導入・更新先の推奨です。導入済みの現在版は対象リポジトリの `harness/install.json` から確認します。取得方法と同版時の扱いは[版の解決手順](docs/project/harness-distribution.md#resolve-versions)を参照してください。

推奨版の変更・取り下げ・保守休止・提供終了は、管理者が必要時に [HARNESS_SPEC.md](HARNESS_SPEC.md) §9.1.4に従ってこの欄へ反映します。版指定のない依頼はこの欄が「推奨版なし」または「提供終了」の場合、版の解決で止まります。既存導入への自動更新はありません。

## 配布と検証の範囲

配布対象は、選んだ固定版の `distribution/manifest.json` に列挙した共通コアと初回用の雛形です。上流スキルは各プロジェクトから直接導入します。README・仕様書・リポジトリ全体を導入先へコピーする必要はありません。

固定SHAの取得確認、操作のfixture演習、実プロジェクトでの導入は、それぞれ検証記録で区別しています。今回追加したURL付き依頼からの実導入体験は [T-0009](docs/backlog/T-0009-second-repository-rollout.md) で確認する範囲です。

仕様の正本は [HARNESS_SPEC.md](HARNESS_SPEC.md)、実装・実証の進捗は [バックログ](docs/backlog/index.md) にあります。
