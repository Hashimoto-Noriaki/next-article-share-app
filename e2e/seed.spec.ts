import { test } from '@playwright/test';
import { createTestUser, signup } from './helpers/auth';

test.describe('Test group', () => {
  test('seed', async ({ page }) => {
    // 新規ユーザーを登録してログイン済みの状態にする
    const user = createTestUser();
    await signup(page, user);
  });
});
