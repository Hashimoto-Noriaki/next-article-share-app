import { test, expect } from '@playwright/test';
import { createTestUser, signup, login } from './helpers/auth';

test.describe('認証フロー', () => {
  test('新規登録できる', async ({ page }) => {
    const user = createTestUser();
    await signup(page, user);

    // サインアップページから離れたことを確認
    await expect(page).not.toHaveURL('/signup');
  });

  test('ログインできる', async ({ page }) => {
    // 1. まず登録
    const user = createTestUser();
    await signup(page, user);

    // 2. ログアウト（セッションクリア）
    await page.context().clearCookies();

    // 3. ログイン
    await login(page, user);

    // ログインページから離れた
    await expect(page).not.toHaveURL('/login');
  });

  test('不正な認証情報でエラーが表示される', async ({ page }) => {
    await page.goto('/login');

    await page.getByPlaceholder('メールアドレス').fill('notexist@example.com');
    await page.getByPlaceholder('パスワード').fill('wrongpassword');

    await page
      .locator('button[type="submit"]')
      .filter({ hasText: 'ログイン' })
      .click();

    await expect(
      page.getByText('メールアドレスまたはパスワードが間違っています'),
    ).toBeVisible();
  });
});
