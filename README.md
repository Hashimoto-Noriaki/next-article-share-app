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

### テスト

```bash
npm run test
```

### StoryBook起動

```bash
npm run story book
```

![スクリーンショット 2026-01-28 5 02 04](https://github.com/user-attachments/assets/861bf7fd-17a0-4280-80dc-96743b7acc24)

![スクリーンショット 2026-01-28 5 02 59](https://github.com/user-attachments/assets/14971429-0f75-47da-bb14-b66409dc84d2)

![スクリーンショット 2026-01-28 5 03 41](https://github.com/user-attachments/assets/a04df616-fd57-4c17-b1fd-4b1c6591b624)

![スクリーンショット 2026-01-28 5 03 56](https://github.com/user-attachments/assets/5c83c076-7aa7-429f-bd1d-0304b917e807)

![スクリーンショット 2026-01-28 5 04 13](https://github.com/user-attachments/assets/13f3f614-40fd-4c18-a909-280c0e78ca5c)

![スクリーンショット 2026-01-28 5 04 26](https://github.com/user-attachments/assets/6cbcb0ae-dce2-4a1d-a82e-238d489853ef)

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
