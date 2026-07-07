# SAST（静的アプリケーションセキュリティテスト）

## SASTとは

ソースコードを実行せずに解析し、SQLインジェクションやXSS、SSRFなどの脆弱性パターンを検出する手法。
依存パッケージの脆弱性を検知するSCA（Dependabot、Socket.dev）とは対象が異なり、自前で書いたコードそのものを対象にする。

## このプロジェクトの対策

| 対策                     | ツール・設定   | 内容                                            |
| ------------------------ | -------------- | ----------------------------------------------- |
| コードの静的解析         | Semgrep        | PR・push時に自動スキャン                        |
| ローカルでの手動スキャン | `semgrep` CLI  | `npm run scan:sast` でいつでも手元実行可能      |

## GitHub Actions

`.github/workflows/sast.yml` で `master` への push / PR時に自動実行。
公式の `semgrep/semgrep` コンテナイメージ上で `semgrep scan --config p/security-audit --config p/typescript --error` を実行し、検出があればジョブを失敗させる。

## ローカル実行

```bash
npm run scan:sast
```

実体は `semgrep --config p/security-audit --config p/typescript .`。ローカルで実行するには [Semgrep CLI](https://semgrep.dev/docs/getting-started/) のインストールが必要（`pip install semgrep` または `brew install semgrep`）。

`--config auto` ではなく `p/security-audit`（OWASP系の脆弱性パターン）と `p/typescript`（TypeScript向けルール）を明示指定している。ルールセットが固定されるため、Semgrep側の推奨ロジック変更によってコード変更なしにCIが突然失敗する事態を避けられる。
