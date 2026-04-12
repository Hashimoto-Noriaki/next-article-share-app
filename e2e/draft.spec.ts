import { test, expect } from '@playwright/test';
import { createTestUser, signup } from './helpers/auth';
import { createTestArticle } from './helpers/article';
import { saveDraft, navigateToDraftEdit } from './helpers/draft';

test.describe('下書き機能', () => {
  test('下書きを保存できる', async ({ page }) => {
    const user = createTestUser();
    await signup(page, user);

    const draft = createTestArticle('下書き');
    await saveDraft(page, draft);

    // /drafts にリダイレクトされている
    await expect(page).toHaveURL('/drafts');

    // 保存した下書きがサイドバーに表示される
    await expect(page.getByText(draft.title).first()).toBeVisible();
  });

  test('下書きを編集して保存できる', async ({ page }) => {
    const user = createTestUser();
    await signup(page, user);

    const draft = createTestArticle('編集前下書き');
    await saveDraft(page, draft);

    // 編集ページへ移動
    await navigateToDraftEdit(page, draft.title);

    // タイトルを変更
    const updatedTitle = `${draft.title} (編集済み)`;
    const titleInput = page.getByPlaceholder('タイトルを入力してください');
    await titleInput.clear();
    await titleInput.fill(updatedTitle);

    // 下書き保存
    await page.locator('button').filter({ hasText: '下書き保存' }).click();

    // /drafts にリダイレクトされる
    await page.waitForURL('/drafts', { timeout: 10000 });

    // 更新されたタイトルが表示される
    await expect(page.getByText(updatedTitle).first()).toBeVisible();
  });

  test('下書きを公開できる', async ({ page }) => {
    const user = createTestUser();
    await signup(page, user);

    const draft = createTestArticle('公開予定下書き');
    await saveDraft(page, draft);

    // 編集ページへ移動
    await navigateToDraftEdit(page, draft.title);

    // 公開する
    await page.locator('button').filter({ hasText: '公開する' }).click();

    // /articles にリダイレクトされる
    await page.waitForURL('/articles', { timeout: 10000 });

    // 公開した記事がリストに表示される
    await expect(page.getByText(draft.title).first()).toBeVisible();
  });

  test('下書きを削除できる', async ({ page }) => {
    const user = createTestUser();
    await signup(page, user);

    const draft = createTestArticle('削除予定下書き');
    await saveDraft(page, draft);

    // confirm ダイアログを承認する
    page.on('dialog', (dialog) => dialog.accept());

    // 下書き一覧から削除
    await page
      .locator('button')
      .filter({ hasText: '下書きを削除する' })
      .click();

    // リロード後に下書きが消えている
    await page.waitForURL('/drafts', { timeout: 10000 });
    await expect(page.getByText(draft.title)).not.toBeVisible();
  });
});
