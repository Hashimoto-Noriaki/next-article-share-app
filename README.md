# Next Article Share App

<!-- markdownlint-disable MD033 -->

<img
  width="1437"
  height="787"
  alt="スクリーンショット 2025-10-29 14 47 02"
  src="https://github.com/user-attachments/assets/0fa79583-cfab-4d44-a4e7-d3deac320715"
/>

<!-- markdownlint-enable MD033 -->

## 詳しい詳細はこちら

- [Next.jsのApp Routerを用いてテックブログの共有アプリを作成(現場での運用を見据えた技術構成と設計)](https://qiita.com/Hashimoto-Noriaki/items/caac04a808c8ec4b2a0d)

## 設計

- [AI駆動開発においてNext.jsのAppRouterの最適な設計方針](https://qiita.com/Hashimoto-Noriaki/private/b2ada6ca9e3c98c512ef)

### app/ — 薄く保つ

ルーティングの定義だけ（薄くする）

```bash
src/
├─ app/           # App Router: ルート・レイアウト・メタデータ（薄く保つ）
├─ features/      # 専属ロジック、ドメインごとの機能群
├─ shared/        # 共通UI・レイアウト・providerなど(アプリ全体で使うもの)
└─ external/      # 外部接続（dto, handler, service, repository, client）
```

詳細: [docs/architecture/architecture.md](docs/architecture/architecture.md)

## トランクベース開発を採用

## 技術構成

- TypeScript
- React
- Next.js(AppRouter)
- Tailwind
- CSS Modules
- Shadcn/ui
- React-Hook-Form
- Zod
- NextAuth.js
- OAuth(GoogleとGitHub)
- TanstackQuery
- StoryBook
- Jest
- Testing Library
- PlayWright
- Docker(マルチステージビルド)
- GitHubActions
- Prisma
- Swagger
- Supabase
- ESLint Prettier
- cloudinary
- nodemailer
- Gmail SMTP
- GCP(予定)

## 使用したAI

- Claude Code
- ChatGPT
- PlayWright MCP

### ハーネスエンジニアリング（AI自動コードレビュー）

Claude Code による自動コードレビューを採用しています。PRコメントで `@claude /review_pr` を投稿するか、ターミナルで `/review_pr` を実行するだけでCI確認・diff分析・GitHubへのレビュー投稿を自動処理します。

詳細: [docs/ai/ai-review.md](docs/ai/ai-review.md)

## 機能一覧

- ユーザーの新規登録
- ログイン
- ログイン(GoogleとGitHub)
- ログアウト
- パスワードリセット
- ユーザー詳細
- ユーザー編集
- ユーザー退会
- 記事の新規作成
- 記事の詳細
- 記事の編集
- 記事の削除
- 下書き作成
- 下書き詳細
- 下書き編集
- 下書き削除
- いいね
- コメント
- ストック
- 検索
- 通知
- 画像アップロード

## サーバー起動

```bash
npm run dev
```

### Prisma Studio

```bash
npx prisma studio
```

### ESLintとPrettier

- ESLint

```bash
npm run lint
```

- Prettier

```bash
npm run format
```

### 型チェック

```bash
npm run type-check
```

### テスト

```bash
npm run test
```

```bash
npx playwright test
```

### StoryBook起動

```bash
npm run storybook
```

![スクリーンショット 2026-01-28 5 02 59](https://github.com/user-attachments/assets/14971429-0f75-47da-bb14-b66409dc84d2)

詳細: [docs/ui/storybook.md](docs/ui/storybook.md)

## このプロジェクトを Next.js App Router へリプレイス

- [元プロジェクト（Article Share App）](https://github.com/Hashimoto-Noriaki/Article-Share-App)

## NextAuth.js

- [公式ドキュメント](https://next-auth.js.org/getting-started/example)

## Docker

```bash
# 1. DB だけ起動
docker compose up db -d

# 2. アプリはローカルで起動
npm run dev

# 3. 終わるとき
docker compose down
```

## Swagger起動

```bash
http://localhost:3000/api-docs
```

詳細: [docs/api/swagger.md](docs/api/swagger.md)

## 各画面構成

詳細: [docs/ui/screens.md](docs/ui/screens.md)

- トップ画面

![スクリーンショット 2026-01-20 10.43.57.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/1748789/c68853d2-d274-471f-bc35-829fdd9f9456.png)

- 記事一覧画面

![スクリーンショット 2026-02-02 0.57.53.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/1748789/1361aa7b-eee8-4416-bbfd-1a0c8ba788f9.png)
