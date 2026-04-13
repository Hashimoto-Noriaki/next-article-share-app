# Testing Rules

## ファイル命名

- Jest（ユニット）: `*.spec.ts` / `*.spec.tsx`
- Playwright（E2E）: `*.spec.ts`（`e2e/` ディレクトリ配下）
- テストファイルはテスト対象と同じディレクトリに置く

## Jest の書き方

- `describe` / `it` の説明は**日本語**で書く
- `describe` でテスト対象を括り、`it` で振る舞いを記述する

```ts
describe('useLike', () => {
  it('初期状態が正しい', () => { ... });

  describe('toggleLike', () => {
    it('未いいね状態でtoggleするといいね済みになる', async () => { ... });
  });
});
```

## モック

- 外部モジュール（Server Actions など）は `jest.mock()` でモックする
- `beforeEach(() => { jest.clearAllMocks(); })` で各テスト前にモックをリセットする

```ts
jest.mock('@/features/articles/actions/like.action', () => ({
  likeArticleAction: jest.fn(),
}));
```

## hooks のテスト

- `@testing-library/react` の `renderHook` + `act` を使う
- 非同期処理は `await act(async () => { ... })` で囲む

## カバレッジ方針

- カバレッジは **C1（分岐カバレッジ）まで** を目標とする
- C2（条件カバレッジ）以上は求めない
- UI コンポーネントより hooks / utils のロジックを優先してテストする
