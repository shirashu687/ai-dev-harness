---
type: Reference
title: 配布方式の一次資料比較メモ
description: T-0011の要件整理に使うGit・npm・Python CLI・製品プラグインの配布と保守に関する事実比較。
tags: [harness, distribution, research]
status: draft
layer: shared
generated:
  by: codex/gpt-6
  at: "2026-09-07T13:22:14Z"
code_globs:
  - distribution/manifest.json
  - distribution/core/**
  - distribution/templates/**
  - tests/test_distribution.py
related:
  - /backlog/T-0011-distribution-strategy.md
  - /backlog/T-0010-plugin-and-bootstrap.md
  - /project/harness-distribution.md
sources:
  - resource: https://docs.npmjs.com/cli/v11/commands/npm-install/
  - resource: https://docs.npmjs.com/cli/v11/commands/npm-exec/
  - resource: https://docs.npmjs.com/cli/v11/commands/npm-uninstall/
  - resource: https://docs.npmjs.com/cli/v11/using-npm/scripts/
  - resource: https://docs.npmjs.com/creating-and-publishing-private-packages/
  - resource: https://docs.npmjs.com/downloading-and-installing-node-js-and-npm/
  - resource: https://pip.pypa.io/en/stable/cli/pip_install/
  - resource: https://pip.pypa.io/en/stable/topics/secure-installs/
  - resource: https://pipx.pypa.io/latest/how-to/manage-installed-apps.html
  - resource: https://pipx.pypa.io/latest/how-to/run-scripts.html
  - resource: https://pipx.pypa.io/latest/how-to/install-pipx.html
  - resource: https://pipx.pypa.io/latest/reference/examples.html
  - resource: https://learn.chatgpt.com/docs/plugins
  - resource: https://learn.chatgpt.com/docs/build-plugins
  - resource: https://developers.openai.com/plugins/build/plugins
  - resource: https://developers.openai.com/plugins/deploy/submission
  - resource: https://code.claude.com/docs/en/discover-plugins
  - resource: https://code.claude.com/docs/en/plugin-marketplaces
  - resource: https://code.claude.com/docs/en/plugins-reference
  - resource: https://code.claude.com/docs/en/setup
---

# 配布方式の一次資料比較メモ

確認日: **2026-09-07**。対象は [T-0011](/backlog/T-0011-distribution-strategy.md) の方式比較用の事実であり、利用者条件・採用判断・保守枠は同タスクに置く。共通規定は `HARNESS_SPEC.md` を参照する。本書で方式を採用せず、インストール・実装・公開も行っていない。

外部資料は公式ページを実際に開いて確認した。npmはv11資料、pip/pipxと製品資料は確認日の公開文書に基づく。対象環境の導入済み版で同じ機能が使えることを実証した記録ではない。Codexはローカルの同梱プラグインmanifestと作成支援資料を限定的に確認した後、不足する配布仕様をOpenAI公式資料で補った。

ローカル確認先は `C:/Users/rinta/.codex/plugins/cache/openai-bundled/visualize/1.0.29/.codex-plugin/plugin.json` と `C:/Users/rinta/.codex/skills/.system/plugin-creator/SKILL.md`。導入物の存在やローカル作成手順を確認する根拠に留め、公式の配布仕様と区別する。

## 1. 比較する二つの操作

現行manifestは11ファイルを `core`・`seed`・`manual` に分けている。既存の設置・更新・巻戻し・撤去の具体手順は [共通ハーネス配布物の導入と保守](/project/harness-distribution.md) を参照する。

以下の表でnpm/Pythonの「導入」はCLIパッケージの導入、プラグインの「導入」は製品への登録を指す。**導入先リポジトリのharnessを設置・更新・巻戻し・撤去する操作とは別である。** npmは配布・パッケージ管理の仕組み、npxはそのパッケージのコマンドを実行する入口であり、独立した配布形式ではない。Python CLIも、パッケージの取得方法と実行方法を組み合わせる。[npm exec](https://docs.npmjs.com/cli/v11/commands/npm-exec/)、[pip install](https://pip.pypa.io/en/stable/cli/pip_install/)、[pipxの実行](https://pipx.pypa.io/latest/how-to/run-scripts.html)

## 2. 導入から撤去まで

| 候補 | 導入・更新 | 版固定・巻戻し | 撤去と残る作業 |
|---|---|---|---|
| 現行Git固定SHA＋明示手順 | 完全SHAを取得し、manifest照合・計画・退避後に列挙ファイルを反映する。 | 現行版・目的版を完全SHAで扱い、以前のSHAへも更新と同じ照合手順を使う。 | 管理コアと記録を照合して個別削除し、入口の参照を手動解消する。固有領域を保持する。全5操作の根拠は[現行手順](/project/harness-distribution.md)。 |
| npm配布＋npx/npm exec | `npm install`で常設、または`npm exec`/npxでローカル依存か取得したキャッシュから実行する。更新は目的版を取得する。[install](https://docs.npmjs.com/cli/v11/commands/npm-install/)、[exec](https://docs.npmjs.com/cli/v11/commands/npm-exec/) | `pkg@1.2.3`のような具体版を指定できる。旧版を指定して取得する経路はある。依存全体の固定はトップレベルの版指定とは別で、ローカル導入はlockfileも関わる。[install](https://docs.npmjs.com/cli/v11/commands/npm-install/) | `npm uninstall`はnpmが導入したパッケージを除く。harnessの撤去処理は未実装。npm v7以降にuninstall lifecycle scriptはない。[uninstall](https://docs.npmjs.com/cli/v11/commands/npm-uninstall/)、[scripts](https://docs.npmjs.com/cli/v11/using-npm/scripts/) |
| Python CLI | pipによる環境への導入、pipxによる専用環境への導入、`pipx run`による一時環境での実行を選べる。pipxにはupgradeがある。[pip](https://pip.pypa.io/en/stable/cli/pip_install/)、[pipx管理](https://pipx.pypa.io/latest/how-to/manage-installed-apps.html)、[run](https://pipx.pypa.io/latest/how-to/run-scripts.html) | `pkg==1.2.3`、Gitの版、ローカル配布物を指定できる。旧版を指定して実行する経路はある。推論: CLIの旧版化だけでは設置済みharnessの巻戻しは完結しない。[pipx例](https://pipx.pypa.io/latest/reference/examples.html) | `pipx uninstall`は専用環境とコマンドのリンク等を除く。harnessの撤去処理は未実装。[pipx管理](https://pipx.pypa.io/latest/how-to/manage-installed-apps.html) |
| Codexプラグイン | marketplaceを登録し、Desktop/CLIのプラグイン画面から導入する。marketplace refreshと、ローカル内容変更後の再起動・新規セッションが文書化されている。[package](https://developers.openai.com/plugins/build/plugins)、[利用](https://learn.chatgpt.com/docs/plugins) | Git由来の個別plugin sourceに`ref`/`sha`、npm sourceに版指定がある。marketplace取得元にも`--ref`がある。旧版復帰のキャッシュ挙動とharnessの巻戻しは未検証。[package](https://developers.openai.com/plugins/build/plugins) | 画面から無効化・アンインストールできる。harness内の既存入口や固有ファイルを保った撤去手順は、この仕組みだけでは確認できない。[利用](https://learn.chatgpt.com/docs/plugins) |
| Claude Codeプラグイン | marketplace追加後に`plugin install`。更新と自動更新設定があり、変更は`/reload-plugins`で取り込める。[導入・管理](https://code.claude.com/docs/en/discover-plugins) | 個別plugin sourceは完全SHA固定可。marketplace取得元のrefとは別指定。明示versionを変えずにコミットだけ変えると更新検出されない。旧版再導入によるharnessの巻戻しは未検証。[marketplace](https://code.claude.com/docs/en/plugin-marketplaces)、[version](https://code.claude.com/docs/en/plugins-reference) | `plugin uninstall`。最後のscopeから除くとpluginの永続データも原則削除し、`--keep-data`で保持できる。harness撤去とは別。[reference](https://code.claude.com/docs/en/plugins-reference) |

## 3. 対象環境・依存・公開範囲

| 候補 | 製品・OS・配置 | 追加ランタイムと実行契機 | 自分用・限定配布と公開配布 |
|---|---|---|---|
| 現行Git固定SHA＋明示手順 | 現行手順はPowerShell・Git・Python標準ライブラリを使う。製品の発見・入口接続は別途確認する。 | 明示したPython照合・書込み片を実行する。専用インストーラーなし。 | Gitの出所・SHAを共有する経路が既にある。新たなパッケージレジストリ登録を必要としない。[現行手順](/project/harness-distribution.md) |
| npm配布＋npx/npm exec | Node.js/npmにはWindows/macOS/Linuxの導入案内がある。推論: 利用エージェントを固定しないCLI構成は可能だが、対象OSの動作は実装次第。 | Node.js/npmが必要。npxはコマンドを実行し、導入時にもパッケージ内容・npm設定に応じたlifecycle scriptの実行点がある。[環境](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm/)、[scripts](https://docs.npmjs.com/cli/v11/using-npm/scripts/) | ローカルtarball・Gitから取得でき、npmへの公開は必須でない。npm公式レジストリのprivate packageは有料アカウント/組織が必要。[install](https://docs.npmjs.com/cli/v11/commands/npm-install/)、[private](https://docs.npmjs.com/creating-and-publishing-private-packages/) |
| Python CLI | pipxはWindows/macOS/Linuxに対応。専用仮想環境を使う構成と、対象プロジェクトのPython環境へ入れる構成を区別する。 | Pythonと選んだ管理ツールが必要。確認日のpipx導入要件はPython 3.10以上。source distributionのビルドはコード実行を伴い、CLI呼出しも別の実行点。[pipx導入](https://pipx.pypa.io/latest/how-to/install-pipx.html)、[pip security](https://pip.pypa.io/en/stable/topics/secure-installs/) | ローカルwheel等、Git、独自indexを使えるためPyPI公開は必須でない。private indexと公開indexの混用には依存取り違えの論点がある。[pip install](https://pip.pypa.io/en/stable/cli/pip_install/) |
| Codexプラグイン | CodexのDesktop/CLIで利用可能、公式資料ではIDE拡張は非対応。OS別のharness接続成功は未検証。[利用](https://learn.chatgpt.com/docs/plugins) | スキルだけの最小構成が文書化されている。MCP・hooks・スクリプトを含めると各実行環境が加わる。npm sourceはnpm CLIを必要とし、取得時lifecycle scriptは実行しない。[最小構成](https://learn.chatgpt.com/docs/build-plugins)、[package](https://developers.openai.com/plugins/build/plugins) | repo/personal marketplaceで私的配布が可能。公開directoryは別経路で、提出・OpenAI審査・承認後の公開を要する。[package](https://developers.openai.com/plugins/build/plugins)、[公開](https://developers.openai.com/plugins/deploy/submission) |
| Claude Codeプラグイン | user/project/local scopeを選べる。ホストはWindows/macOS/Linux対応だが、梱包スクリプトのOS対応は別。[scope](https://code.claude.com/docs/en/discover-plugins)、[環境](https://code.claude.com/docs/en/setup) | スキル・hooks・MCP等を梱包でき、含むコマンドやサーバーに応じて実行環境が必要。導入物はcacheへコピーされ、プラグイン外参照に制約がある。[reference](https://code.claude.com/docs/en/plugins-reference) | ローカルmarketplace、private Git、公開Git等を選べる。private Gitの手動取得とバックグラウンド更新では認証経路に差がある。[marketplace](https://code.claude.com/docs/en/plugin-marketplaces) |

## 4. 保守を比較するときに残る論点

以下は上の事実をT-0011へ当てはめるための**推論・未決定事項**であり、新しい義務や採用規定ではない。

| 候補 | 継続して面倒を見る対象 | 最小検証で解消する点 |
|---|---|---|
| 現行Git | 配布ファイル・manifest・手順・照合器と、導入先の版記録。 | AIへの一度の依頼で既存手順を進めたとき、何分・何回の人の判断が残るか。 |
| npm | CLI本体、依存・lock、Node/npm版、取得経路、harness操作の実装。公開するなら発行・告知経路も加わる。 | 常設と都度実行のどちらが導入先を汚さず、同じ目的版と依存で再実行できるか。 |
| Python CLI | CLI本体、Python/管理ツール版、build/runtime依存、harness操作の実装。公開するなら発行・告知経路も加わる。 | 現行の標準ライブラリ照合器を使うだけで足りるか。新しい環境管理を負担として許容できるか。 |
| Codexプラグイン | manifest・marketplace・キャッシュ反映・製品仕様、含める実行部品、harness操作との接続。 | SHA固定・更新・旧版再導入・撤去を対象Desktop/CLIで通せるか。入口だけの配布で期待する手間が減るか。 |
| Claude Codeプラグイン | manifest・marketplace・scope・version/cache・認証・製品仕様、含める実行部品、harness操作との接続。 | 固定SHAと自動更新設定が意図通り働くか。撤去時の永続データと導入先固有領域を混同しないか。 |

共通して、トップレベルの固定版は「取得した内容が安全」「依存全体が不変」「導入先の変更を巻き戻せる」という保証とは異なる。例えばpipのhash検査は全依存の固定とhashを要求する。方式ごとの実行コードと外部依存を列挙し、修正受付・修正版配布・更新停止時の扱いをどこまで持つかはT-0011で決める。[pip security](https://pip.pypa.io/en/stable/topics/secure-installs/)

## 5. 未検証の境界

- npm/Python/プラグインでこのharnessを包んだ実物は作っておらず、導入時間・更新工数・撤去成功率は未測定。
- 両製品のプラグインで同じmanifestをそのまま使えることや、同じスキルの動作が一致することは未検証。
- Codexの公開資料とこの環境のローカル作成支援資料には更新・再読込み案内の差がある。候補に残った場合に、実際の製品版と取得経路を固定して確認する。
- 自分の複数repoへの利用を、公開サービスの保守義務を引き受けたことへ読み替えない。利用者条件と判断は [T-0011](/backlog/T-0011-distribution-strategy.md) を参照する。
