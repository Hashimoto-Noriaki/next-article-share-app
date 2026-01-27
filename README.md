# 画面構成

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

## 技術構成

- TypeScript
- React
- Next.js(AppRouter)
- Tailwind
- CSS Modules
- Shadcn/ui
- React-Hook-Form
- Zod
- TanstackQuery
- StoryBook
- Jest
- Testing Library
- PlayWright
- Docker(マルチステージビルド)
- GitHubActions
- Swagger
- Prisma
- Supabase
- ESLint Prettier
- Vercel

### 使用したAI

- Claude Code
- ChatGPT

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

### StoryBook起動

```bash
npm run story book
```

### テスト

```bash
npm run test
```

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

**ファイル構成：**
project-root/
├── .docs/
│   └── api/
│       └── openapi.yaml      ← API仕様（YAML）
├── src/
│   ├── app/
│   │   └── api-docs/
│   │       ├── page.tsx      ← ページ
│   │       └── SwaggerUI.tsx ← Client Component
│   └── lib/
│       └── swagger.ts        ← YAML読み込み
```

```bash
http://localhost:3000/api-docs
```

![スクリーンショット 2026-01-27 19 11 36](https://github.com/user-attachments/assets/82e65954-b81f-4d1a-9ac2-b6b4eaf9b2be)
