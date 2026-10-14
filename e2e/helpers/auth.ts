import { Page } from '@playwright/test';

/**
 * テストユーザーの型定義
 */
export interface TestUser {
  email: string;
  password: string;
  name?: string;
}

/**
 * デフォルトのテストユーザー
 */
export const testUsers = {
  valid: {
    email: 'test@example.com',
    password: 'Test1234!',
    name: 'テストユーザー',
  },
  newUser: {
    email: `test-${Date.now()}@example.com`,
    password: 'Test1234!',
    name: 'New Test User',
  },
} as const;

/**
 * ユニークなテストユーザーを生成する
 */
export function createTestUser(baseName = 'テストユーザー'): TestUser {
  return {
    name: baseName,
    email: `test-${Date.now()}-${Math.random().toString(36).substring(7)}@example.com`,
    password: 'Test1234!',
  };
}

/**
 * ログインする
 */
export async function login(page: Page, user: TestUser) {
  await page.goto('/login');
  await page.getByPlaceholder('メールアドレス').fill(user.email);
  await page.getByPlaceholder('パスワード').fill(user.password);

  // 「ログイン」ボタンをtype="submit"で特定
  await page
    .locator('button[type="submit"]')
    .filter({ hasText: 'ログイン' })
    .click();

  // ログイン成功を待つ（URLが変わるまで待機）
  await page.waitForURL((url) => url.pathname !== '/login');
}

/**
 * ログアウトする
 * ログアウトボタンは記事一覧ページのヘッダーにしかないため、先に /articles へ移動する
 * ログアウト後は /login にリダイレクトされる
 */
export async function logout(page: Page) {
  await page.goto('/articles');
  await page.getByRole('button', { name: 'ログアウト', exact: true }).click();
  await page.waitForURL('/login', { timeout: 10000 });
}

/**
 * 新規ユーザーを登録する
 */
export async function signup(page: Page, user: TestUser) {
  await page.goto('/signup');
  if (user.name) {
    await page.getByPlaceholder('例)山田太郎(ニックネーム可)').fill(user.name);
  }
  await page.getByPlaceholder('メールアドレス').fill(user.email);
  await page.getByPlaceholder('パスワード').fill(user.password);

  // 「新規登録」ボタンをtype="submit"で特定
  await page
    .locator('button[type="submit"]')
    .filter({ hasText: '新規登録' })
    .click();

  // 登録成功を待つ（URLが変わるまで待機）
  await page.waitForURL((url) => url.pathname !== '/signup');
}

/**
 * バリデーションエラーメッセージを取得する
 */
export async function getValidationError(
  page: Page,
  fieldName: string,
): Promise<string | null> {
  const errorSelector = `[data-testid="error-${fieldName}"]`;
  try {
    await page.waitForSelector(errorSelector, { timeout: 3000 });
    return await page.textContent(errorSelector);
  } catch {
    return null;
  }
}

/**
 * トーストメッセージを取得する
 */
export async function getToastMessage(page: Page): Promise<string | null> {
  try {
    const toast = await page.waitForSelector(
      '[role="alert"], [data-testid="toast"]',
      {
        timeout: 5000,
      },
    );
    return await toast.textContent();
  } catch {
    return null;
  }
}
