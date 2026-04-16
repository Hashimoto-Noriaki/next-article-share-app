# Frontend Rules

## コンポーネント設計

- `shared/components/` は atoms / molecules / organisms の3層構造
- `features/` 配下は機能ごとに components / hooks / actions / types を持つ
- コンポーネントは **named export**（default export 禁止）
- Props の型は `type Props = { ... }` で定義する

```tsx
// Good
type Props = {
  title: string;
  onClick: () => void;
};

export function MyComponent({ title, onClick }: Props) { ... }
```

## ディレクティブ

- `'use client'` はインタラクション・状態・ブラウザ API が必要な場合のみ付ける
- `'use server'` は Server Actions ファイルに必ず付ける
- 不要な `'use client'` は Server Component の恩恵を失うので Critical

## スタイリング

- スタイルは Tailwind CSS のみ（インラインスタイル禁止）
- クラスの合成には `cn()` ユーティリティを使う（`clsx` + `tailwind-merge`）

```tsx
import { cn } from '@/shared/lib/utils';

className={cn('base-class', condition && 'conditional-class', className)}
```

## Server Actions

- 認証が必要な Action は必ず冒頭で `auth()` を呼びセッションを検証する
- 戻り値は `{ success: true, data }` または `{ success: false as const, error: string }` の判別可能な型にする

```ts
'use server';

export async function myAction(...) {
  const session = await auth();
  if (!session?.user?.id) return { success: false as const, error: '認証が必要です' };
  ...
}
```

## パス エイリアス

- `@/` は `src/` のエイリアス
- 相対パスより `@/` を優先する
