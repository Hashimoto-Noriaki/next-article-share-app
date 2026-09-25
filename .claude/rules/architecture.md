---
paths:
  - 'src/**/*.{ts,tsx}'
---

# Architecture Rules

設計の背景は `docs/architecture/architecture.md` を参照。

## レイヤーと責務

| レイヤー                        | 責務                                                                                                  |
| ------------------------------- | ----------------------------------------------------------------------------------------------------- |
| `app/`                          | ルーティング定義のみ（下記「app/ を薄く保つ」参照）                                                   |
| `features/*/components/server/` | ページ単位のテンプレート（`XxxPageTemplate`）。`auth()` / query handler でデータを取得し props で渡す |
| `features/*/components/client/` | server テンプレートまたは `page.tsx` から呼ばれるページ専用の Client コンテナ（フォームなど）         |
| `features/*/components/` 直下   | 再利用可能な UI 部品。データ取得はしない                                                              |
| `features/*/hooks/`             | TanStack Query・状態管理。Server Actions を呼ぶ                                                       |
| `features/*/actions/`           | Server Actions。`auth()` でセッション検証し handler を呼ぶだけの薄いラッパー                          |
| `external/handler/`             | features 層からの入口。入力検証・認可・ビジネスロジック                                               |
| `external/service/`             | 複数 handler で共有するビジネスロジック                                                               |
| `external/repository/`          | DB アクセス（Prisma）                                                                                 |
| `external/dto/`                 | Zod スキーマと入力型。クライアントのフォームとサーバーで共有する                                      |

## 依存の方向

```text
app/(page.tsx)           → components/server, components/client
components/client, hooks → features/*/actions → external/handler → external/service → external/repository
components/server        → external/handler（query）
```

- `external/handler` / `@/external/auth` を import してよいのは `components/server/`（`shared/components/layout/server/` を含む）・`actions/`・`app/api/`・`middleware.ts`・`external/` 内のみ
- `external/repository` を import してよいのは `external/` 内のみ
- `external/dto` はどの層からも import してよい
- Server Actions を import してよいのは `hooks/`・`components/client/`・`'use client'` ファイルのみ

上記の一部は ESLint（`src/eslint-local-rules/`）で強制している。ESLint は `components/` 直下の Client Component から handler への import を検出しないので、レビューで確認する。

### ディレクトリ間の依存

```text
app/ → features/ → shared/
```

- `shared/` は `features/` に依存しない。features の部品が必要な共通コンポーネントは props（slot）で受け取る
- 他の feature を参照するときは、コンポーネントのディレクトリ（`@/features/<機能>/components/Xxx`）や `types/` など公開された入口から import し、内部ファイルを直接 import しない
- 特定の機能に属さず複数の feature で使う部品は `shared/` に置く（例: ユーザーメニュー、ヘッダー部品）。記事カードのようにドメインに属する部品は元の feature に残してよい

### 読み取り

- クライアントからの読み取り（TanStack Query の `queryFn`）で Server Actions を呼んでよい。初期表示のデータは server テンプレートで取得する

## app/ を薄く保つ

- `page.tsx` / `layout.tsx` は features の server テンプレートか client コンテナを呼ぶだけにする
- `page.tsx` に `'use client'` を付けない。フォームや状態を持つ UI は `features/*/components/client/` に置く
- `page.tsx` で行ってよいのは `params` / `searchParams` の受け取り、`metadata` / `generateMetadata` の定義、テンプレートへの受け渡しのみ
- `app/api/` の Route Handler は認証と入力の受け取りだけ行い、処理は `external/handler` に委ねる

## 入力検証と認可（handler の責務）

- ユーザーが自由入力する値は `external/dto/` の Zod スキーマで `safeParse` する
- ID を受け取る操作は、対象リソースの所有者チェックを handler で行う（ID だけで他人のリソースを操作させない）
- 戻り値は `{ success: true, data? }` / `{ success: false, error: string }` の判別可能な型にする

## 命名

| 対象          | ファイル名                                           | export 名                          |
| ------------- | ---------------------------------------------------- | ---------------------------------- |
| Server Action | `features/*/actions/<対象>.action.ts`                | `xxxAction`                        |
| handler       | `external/handler/<対象>/{query,mutation}.server.ts` | `xxxHandler`                       |
| repository    | `external/repository/<対象>/<対象>.repository.ts`    | `<対象>Repository`（オブジェクト） |
| dto           | `external/dto/<対象>/<対象>.dto.ts`                  | `xxxSchema` / `XxxInput`           |
| PageTemplate  | `features/*/components/server/XxxPageTemplate.tsx`   | `XxxPageTemplate`                  |
