import { test } from '@playwright/test';
import { createTestUser, signup } from './helpers/auth';

test.describe('Test group', () => {
  test('seed', async ({ page }) => {
    // Playwright Agents が作業を始める前に、ログイン済みの状態を用意する
    // このログイン状態は後続のテストには引き継がれないため、
    // 生成するテストでも各テストの冒頭で createTestUser() + signup() を行う
    const user = createTestUser();
    await signup(page, user);
  });
});
