---
type: Backlog Item
title: Python不要のNode.js配布照合と保守手順
description: Node.js版の配布照合器と操作例を追加し、Pythonなしで導入・更新・巻戻し・撤去できるようにする。
tags: [shared, enhancement, ready-for-agent]
status: stable
layer: shared
generated:
  by: "codex/gpt-6"
  at: "2026-09-10T14:19:00Z"
state: doing
priority: medium
effort: M
feasibility: A
ai: full
cost: false
created: "2026-09-10"
done_at: null
accepts: []
spec: ["§9.1.3", "§9.1.4", "§9.2.1"]
target: harness
evidence: []
related: ["/project/harness-distribution-node.md", "/project/harness-distribution.md"]
---

# Python不要のNode.js配布照合と保守手順
## やりたいこと

Pythonがない環境でも、Node.jsまたはPowerShellで同じようにハーネスを導入・保守したい。

## 背景・現状

開始HEADは `9b60ae204880db11f99d36b50ba99dee1eed069c`、既存差分なし。配布本体はMarkdownだが、照合器と操作例がPythonに依存していた。この環境もPythonがPATHになく、Node.js v24.13.0が利用できる。

## 進め方

Node.js標準ライブラリで読取り専用の照合器を実装し、独立した一時Gitテストと操作例を追加する。READMEと仕様に経路を接続し、既存Python記録との互換性・推奨固定版・掲載コードを検証する。

## 決定と根拠

- Windows以外にも同じ実装を使えるNode.jsを選択し、追加パッケージ不要のCommonJSモジュールとする。PowerShellはシェル操作例に使用する。→ T-0018
- `tests/test_distribution.py` は既存経路と相互照合の基準として残す。通常のNode.jsテストはPython相互照合だけをskipし、Pythonを実行しない。→ T-0018
- 言語間の記録・ハッシュ互換性 → SPEC §9.1.3
- 旧配布版とNode.js照合器の版を分けて固定・検証する契約 → SPEC §9.1.4
- 退避・中断・所有境界 → SPEC §9.2.1
- 配布ファイルの内容と推奨SHAは変更しない。この変更自体のGitHub公開や、利用先の実アプリ導入は今回の検証範囲に含めない。→ T-0018

## 完了条件

- [x] Pythonなしで実行できるNode.js照合器と導入・保守・復旧の操作例がある
- [x] 既存のmanifest・ハッシュ・導入記録と互換性がある
- [x] 同版確認、更新、巻戻し、撤去、再導入、途中失敗、競合停止を一時Gitで確認した
- [x] 必須検証を実行し、下の検証記録を4値で埋めた
- [ ] `evidence` に成果物側のコミット SHA を記入した
- [ ] 本ファイルの `state` を `done` にし `done_at` を記入した

## 検証記録

| 識別子 | 結果 | 対象（コミット・版） | 証拠（要約・ログ所在） |
|---|---|---|---|
| Node.js単独 | 成功 | Node.js v24.13.0、作業差分 | `node --test tests/test_distribution.cjs` 初回13成功・Python相互照合1skip |
| 推奨固定版と相互照合 | 成功 | `898d514f0594ff09f6c19292ef4df56f6cc4ac50` | `HARNESS_TEST_SOURCE` / `HARNESS_TEST_COMMIT` / `HARNESS_TEST_PYTHON` を指定し最終15件成功。Node記録をPythonで照合し、Python記録をNodeでも照合 |
| Python既存テスト | 成功 | 作業差分 | 同梱Pythonの `-B -m unittest discover -s tests -p test_distribution.py`、11件成功 |
| 掲載JavaScript | 成功 | 作業差分 | 文書の6コード片を実行し、導入・更新中断・復旧・復旧競合で書込み停止を確認 |
| 文書検査 | 成功 | 作業差分 | `index --write`、lint error 0 / warn 0、`git diff --check`、PowerShell例の構文検査成功 |
| 実プロジェクト導入・他OS | 未実行 | — | 一時Gitでの検証とは区別する |

## 結果

実装と手順を追加し、検証を実施した。配布利用側にPythonは不要。配布元のOKF文書管理には従来のCLIを使い、この環境では同梱Pythonと既存okf-devkitソースを明示して実行した。成果物SHAと最終文書検査は確定後に記録する。
