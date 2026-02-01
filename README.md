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

![スクリーンショット 2026-02-02 1.34.47.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/1748789/2bd7cc0c-656f-4ab7-a403-1d4a80306361.png)

![スクリーンショット 2026-02-02 1.35.02.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/1748789/cc38beb9-a5d5-4f72-8c31-497df8cbf1d4.png)

![スクリーンショット 2026-02-02 1.35.17.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/1748789/0ec95660-c6b1-4107-9368-07348acbbfc0.png)

![スクリーンショット 2026-02-02 1.35.32.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/1748789/eebc5c5d-e89b-4cc7-9fa6-6496b1258980.png)

### 各画面構成

- トップ画面

![スクリーンショット 2026-01-20 10.43.57.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/1748789/c68853d2-d274-471f-bc35-829fdd9f9456.png)

- ログイン画面

![スクリーンショット 2026-02-02 1.13.31.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/1748789/8d18d494-8c22-439f-968c-b2597c8ebdd3.png)

- 新規登録画面

![スクリーンショット 2026-02-02 1.14.02.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/1748789/a82419e8-26a0-4c70-9f60-5e4dd9a45b30.png)

- 記事一覧画面

![スクリーンショット 2026-02-02 0.57.53.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/1748789/1361aa7b-eee8-4416-bbfd-1a0c8ba788f9.png)

- 記事作成画面

![スクリーンショット 2026-02-02 0.59.13.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/1748789/ca5fc8f1-f4a9-4820-8ad1-0af18ce80019.png)

![スクリーンショット 2026-02-02 0.59.49.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/1748789/d42354af-6838-455e-8b20-c1df2e5b73af.png)

![スクリーンショット 2026-02-02 1.00.08.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/1748789/b2484ee7-3546-4181-974d-bd6772e6b4df.png)

- 記事詳細画面

  1.他人の記事
  ![スクリーンショット 2026-02-02 1.02.12.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/1748789/fc361c1b-29dc-48b5-83ae-178a05c808eb.png)

  2.自分の記事
  ![スクリーンショット 2026-02-02 1.03.41.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/1748789/9b722a7d-e76c-4641-89df-7554134427fa.png)

- 記事編集画面

![スクリーンショット 2026-02-02 1.04.59.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/1748789/372127a2-5b03-4438-868f-a3cdafa2a8c7.png)

- 下書き一覧画面

![スクリーンショット 2026-02-02 1.05.57.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/1748789/b8278327-d2b0-421f-b9a9-5e02b30a170f.png)

- 下書き編集画面

![スクリーンショット 2026-02-02 1.06.17.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/1748789/5f1dbc4a-670d-4e26-9269-1587e2414b93.png)

- プロフィール

![スクリーンショット 2026-02-02 1.11.46.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/1748789/df3a3633-5963-4ccc-8911-ca47441a4303.png)

- ドロップダウン

![スクリーンショット 2026-02-02 1.10.12.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/1748789/9460f487-b8e3-4071-af22-9f8d65087df2.png)

- 設定

![スクリーンショット 2026-02-02 1.07.52.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/1748789/e117ffba-30b2-4b93-9094-f7b6a0babff7.png)

- ストックリスト

![スクリーンショット 2026-02-02 1.09.25.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/1748789/d523a399-a2d7-4286-954a-78beae9734c6.png)

![スクリーンショット 2026-02-02 1.09.54.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/1748789/35aa4c15-d703-4ddc-85ec-37b857223568.png)

- 退会
  ![スクリーンショット 2026-02-02 1.11.07.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/1748789/089010a2-7034-450c-ab5b-235973deb7c6.png)

- パスワードを忘れた時の画面

![スクリーンショット 2026-02-02 0 34 05](https://github.com/user-attachments/assets/829d34fc-4e60-456a-b291-a3fe40adce10)

- メールで送られてきてからのメールの画面

![スクリーンショット 2026-02-01 23 49 15](https://github.com/user-attachments/assets/bba02b83-a991-48bd-ae37-ce51161430fa)

![スクリーンショット 2026-02-01 23 50 40](https://github.com/user-attachments/assets/1cf36a6a-3997-430f-9a61-6a3b871c01b2)

![スクリーンショット 2026-02-01 23 49 26](https://github.com/user-attachments/assets/582fcc4b-16b6-4a1a-8b84-2c2bb2a97807)
