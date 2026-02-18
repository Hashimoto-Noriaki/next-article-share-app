# テスト戦略

## 概要

本プロジェクトでは、Jest と Playwright を使用してテストを実施する。

- **Jest**: 単体テスト・統合テスト
- **Playwright**: E2Eテスト
- **Storybook**: コンポーネントの視覚的確認

## テスト対象

### 1. バリデーション（Jest）

Zodスキーマの単体テスト。

- `src/shared/lib/validations/article.ts`
- `src/shared/lib/validations/auth.ts`
- `src/shared/lib/validations/draft.ts`
- `src/shared/lib/validations/user.ts`

### 2. 認証（Jest）

認証関連のユーティリティとAPIのテスト。(NextAuth.jsを導入するなら不要)

- `src/app/api/auth/[...nextauth]/route.ts`
- `src/app/api/auth/forgot-password/route.ts`
- `src/app/api/auth/reset-password/route.ts`
- `src/app/api/auth/signup/route.ts`

※ NextAuth.js導入後はE2Eに移行

### 3. E2E（Playwright）

主要なユーザーフローのテスト。

- 認証フロー（新規登録 → ログイン → ログアウト）
- 記事CRUD（作成 → 編集 → 削除）
- プロフィール編集

### 4. コンポーネント（Storybook）

視覚的な確認はStorybookで行う。Jestでのテストは基本不要。

- `src/shared/components/atoms/Button`
- `src/shared/components/atoms/InputForm`
- `src/features/articles/components/ArticleCard`

## テスト不要なもの

- ロジックを持たないシンプルなコンポーネント（atoms）
- 外部ライブラリの機能（Zod, React Hook Formなど）
- UIの変更が頻繁に発生する箇所

## カバレッジ目標

- 単体テスト: C1カバレッジ（分岐網羅）
- E2E: 主要フローをカバー

## 将来的な拡張

機能追加時に以下のテストを追加する。

| 機能             | 追加するテスト |
| ---------------- | -------------- |
| いいね・ストック | APIテスト、E2E |
| コメント機能     | APIテスト、E2E |
| 通知機能         | APIテスト、E2E |
| 検索・フィルター | APIテスト、E2E |

## 実行コマンド

```bash
# 単体テスト
npm run test

# E2Eテスト
npm run test:e2e

# E2Eテスト（UIモード）
npm run test:e2e:ui

# Storybook
npm run storybook
```
