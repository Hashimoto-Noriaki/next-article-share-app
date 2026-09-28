---
paths:
  - 'e2e/**'
  - 'specs/**'
---

# E2E Test Rules（Playwright）

Unit（Jest）のルールは `testing-unit.md` を参照。

## ファイル命名

- `*.spec.ts`（`e2e/` ディレクトリ配下）
- 共通処理は `e2e/helpers/` に置く

## テストユーザー

- 新規ユーザーは `createTestUser()` + `signup()`（`e2e/helpers/auth.ts`）で作る
- メールは `test-` 始まりにする（`e2e/global-teardown.ts` がテスト後に削除する）
- `testUsers.valid`（`test@example.com`）は削除対象外の既存ユーザーなので、状態を変える操作には使わない

## 複数ユーザー

- 2人目のユーザーが必要なときは `browser.newContext()` で別コンテキストを作る（ログアウトして切り替えない）
- `browser` フィクスチャの `newContext()` は config の `baseURL` を引き継ぐので、URL を明示しない

## Playwright Agents

- seed は `e2e/seed.spec.ts`（新規登録してログイン済みの状態にする）
- seed のログイン状態は後続のテストに引き継がれない。ログインが必要なテストは、各テストの冒頭で `createTestUser()` + `signup()` を行う
- テスト計画は `specs/`、生成したテストは `e2e/` に置く
