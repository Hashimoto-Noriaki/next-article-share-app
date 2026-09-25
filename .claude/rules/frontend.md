---
paths:
  - 'src/**/*.{ts,tsx}'
---

# Frontend Rules

フォーマット（Prettier）と `any` 禁止などの静的チェック（ESLint）はツールに任せ、ここにはツールで検出できない規約だけを書く。
レイヤー構成・依存方向は `architecture.md` を参照。

## コンポーネント設計

- `shared/components/` は atoms / molecules / organisms の3層 + `layout/`
- `features/<機能>/` 配下は components / hooks / actions / types のうち**必要なものだけ**置く
- コンポーネントは `ComponentName/` ディレクトリにまとめ、`index.ts(x)` で re-export する
  - Storybook（`ComponentName.stories.tsx`）は同じディレクトリに置く（推奨）
  - そのコンポーネント専用の hook は同じディレクトリに置いてよい
- コンポーネントは **named export**（default export 禁止）
  - 例外: Next.js の特殊ファイル（`page.tsx` / `layout.tsx` / `loading.tsx` / `error.tsx` / `not-found.tsx` など）、`middleware.ts`、`*.stories.tsx`
- Props の型は `type Props = { ... }` で定義する

```tsx
// Good
type Props = {
  title: string;
  onClick: () => void;
};

export function MyComponent({ title, onClick }: Props) { ... }
```

## 命名

- コンポーネント: PascalCase（ファイル名・ディレクトリ名も同じ）
- hooks: `useXxx`（ファイル名も同じ）
- TanStack Query のキーは `xxxKeys` オブジェクトにまとめる（例: `notificationKeys.list()`）。文字列配列の直書きは避ける

## `'use client'`

- 付けるのはファイル自身が state・effect・イベントハンドラ・ブラウザ API を使う場合のみ
- Client Component から import されるだけのコンポーネントには付けない（親が Client なら自動で Client として扱われる）
- インタラクションが必要な部分だけを小さな Client Component に切り出し、ページ全体を Client にしない
- `'use server'` は Server Actions ファイルに必ず付ける

## スタイリング

- スタイルは Tailwind CSS のみ（インラインスタイル禁止）
- クラスの合成には `cn()` ユーティリティを使う（`clsx` + `tailwind-merge`）

```tsx
import { cn } from '@/shared/lib/utils';

className={cn('base-class', condition && 'conditional-class', className)}
```

## Server Actions の書き方

- 認証が必要な Action は必ず冒頭で `auth()` を呼びセッションを検証する
- 失敗時の戻り値には `as const` を付ける（判別可能な型にするため）

```ts
'use server';

export async function myAction({ articleId }: { articleId: string }) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return { success: false as const, error: '認証が必要です' };

  return myHandler({ articleId, userId });
}
```

## import

- 別の feature・`shared/`・`external/` を参照するときは `@/` を使う（`@/` は `src/` のエイリアス）
- 同じコンポーネント・同じ feature 内は相対パス（`./`）でよい。`../` で feature の外に出る参照はしない
