# Sentry（エラーモニタリング）

本ドキュメントでは、本プロジェクトへの Sentry 導入方針についてまとめる。

## ステータス

**未導入（導入予定）**

- 機能開発は大枠完了しているが、e2e（Playwright）テストの拡充を継続中
- e2e の整備が一区切りついたタイミングで、本番デプロイ前に `@sentry/nextjs` を導入する方針

## 導入予定パッケージ

```bash
npm install @sentry/nextjs
```

または Sentry のセットアップウィザードを使う場合：

```bash
npx @sentry/wizard@latest -i nextjs
```

ウィザードで自動生成される想定のファイル：

- `sentry.client.config.ts`
- `sentry.server.config.ts`
- `sentry.edge.config.ts`
- `instrumentation.ts`（Next.js 15 の instrumentation hook 経由で読み込み）

## 導入目的

- 本番環境で発生したランタイムエラーの検知・通知
- Route Handlers / Server Actions / クライアント側それぞれの例外を横断的に収集
- スタックトレース・ユーザー影響範囲の把握による障害対応の迅速化

## 導入時に決めること

| 項目                  | 内容                                                                         |
| --------------------- | ---------------------------------------------------------------------------- |
| DSN の管理            | `SENTRY_DSN` を Vercel の環境変数として登録（本番 / ステージングで分離）     |
| Source Map            | Sentry へのアップロードを CI もしくはビルド時に自動化するか検討              |
| サンプリングレート    | `tracesSampleRate` を本番でどの程度に設定するか（コスト・負荷とのバランス）  |
| アラート通知先        | Slack 通知など、既存の通知フロー（`docs/infra/ci-cd.md` 参照）と合わせて検討 |
| PII（個人情報）マスク | ユーザーメール等をエラーレポートに含めないよう `beforeSend` でフィルタする   |

## 導入タイミング

1. e2e テスト（Playwright）の拡充を継続
2. 導入の区切りが付いたら `@sentry/nextjs` をセットアップ
3. 本番（Vercel）デプロイ前に動作確認（テストエラーの送信確認など）
4. ステージング環境にも同様に導入するか検討（[docs/infra/deployment.md](./deployment.md) 参照）

## 関連ドキュメント

- [docs/infra/deployment.md](./deployment.md)（デプロイ・ステージング環境）
- [docs/infra/ci-cd.md](./ci-cd.md)
