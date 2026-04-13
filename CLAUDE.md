# CLAUDE.md

このファイルはClaude Codeがこのリポジトリで作業する際のコンテキストです。

## 技術スタック

- **フレームワーク**: Next.js 15 (App Router) + React 19
- **言語**: TypeScript
- **DB**: PostgreSQL + Prisma 7
- **認証**: NextAuth v5 (beta)
- **状態管理**: TanStack Query v5
- **スタイル**: Tailwind CSS v4
- **バリデーション**: Zod v4
- **フォーム**: React Hook Form
- **画像**: Cloudinary
- **テスト**: Jest（ユニット）/ Playwright（E2E）

## ディレクトリ構成

```bash
src/
  app/
    (authenticated)/   # ログイン必須ページ
    (guest)/           # 未ログイン専用ページ
    (neutral)/         # どちらでもアクセス可能なページ
    (public)/          # 公開ページ
    api/               # Route Handlers
  features/            # 機能ごとのモジュール（articles, auth, drafts, stocks など）
  shared/              # 共通コンポーネント・hooks・utils
  external/            # 外部サービス連携
prisma/                # スキーマ・マイグレーション
```

## コードレビュー時の注意点

### セキュリティ

- Route Handlers でセッション検証が抜けていないか（`(authenticated)` 配下でも API は別途確認が必要）
- Prisma クエリで生 SQL (`$queryRawUnsafe`) を使っていないか
- ユーザー入力は Zod でバリデーションしているか
- Cloudinary への画像アップロード時に認証チェックがあるか

### 型安全性

- `any` を使っていないか
- Prisma の返却値に不要な型キャストをしていないか
- Server Actions / Route Handlers の引数に Zod スキーマがあるか

### パフォーマンス

- Server Component で不要な `use client` をつけていないか
- TanStack Query のキーが適切か（過度な再フェッチ、キャッシュ漏れ）
- N+1 クエリになっていないか（`include` の使い方）

### 認証・認可

- NextAuth のセッション取得は `auth()` を使っているか
- 他ユーザーのリソースを操作できるような認可漏れがないか

## 開発コマンド

```bash
npm run lint          # ESLint
npm run type-check    # TypeScript型チェック
npm run test          # Jest
npm run test:e2e      # Playwright E2E
```

@.claude/rules/frontend.md
@.claude/rules/testing.md

## Rules

- レビューコメントは**必ず日本語**で書く
- Critical が 0 件なら `--approve`、1件以上なら `--request-changes`、それ以外は `--comment`
- 推測でレビューしない。不明な点はコードを `Read` / `Grep` で確認してから判断する
- セキュリティ・認証・認可の問題は必ず Critical として扱う
- CI（lint / type-check / test）が1つでも失敗していたら必ず Critical として扱い `--request-changes` にする
- `any` の使用・型キャストは Warning として扱う

## Skills

- `/review_pr` — PRのdiffを取得し、GitHubにレビューを投稿する（`.claude/commands/review_pr.md`）
