import { test, expect } from '@playwright/test';
import { createTestUser, signup } from './helpers/auth';
import {
  createTestArticle,
  createArticle,
  navigateToArticle,
} from './helpers/article';

test.describe('記事CRUD', () => {
  test('記事を投稿できる', async ({ page }) => {
    const user = createTestUser();
    await signup(page, user);

    const article = createTestArticle();
    await createArticle(page, article);

    // /articles にリダイレクトされている
    await expect(page).toHaveURL('/articles');

    // 投稿した記事がリストに表示される
    await expect(page.getByText(article.title).first()).toBeVisible();
  });

  test('タイトル未入力で投稿するとエラーが表示される', async ({ page }) => {
    const user = createTestUser();
    await signup(page, user);

    await page.goto('/articles/new');

    // タイトルを空のまま投稿
    await page
      .getByPlaceholder(
        'エンジニアに関わる知識をMarkdown記法で書いて共有しよう',
      )
      .fill('本文だけ入力');

    await page.locator('button').filter({ hasText: '公開設定へ' }).click();

    // バリデーションエラーが表示される
    await expect(page.getByText(/タイトル/).first()).toBeVisible();
  });

  test('記事を編集できる', async ({ page }) => {
    const user = createTestUser();
    await signup(page, user);

    // 記事を投稿
    const article = createTestArticle('編集前');
    await createArticle(page, article);

    // 記事詳細に移動
    await navigateToArticle(page, article.title);

    // 編集ページへ
    await page.getByRole('link', { name: '編集' }).click();
    await page.waitForURL(/\/articles\/[^/]+\/edit/, { timeout: 10000 });

    // タイトルを変更
    const updatedTitle = `${article.title} (編集済み)`;
    const titleInput = page.getByPlaceholder('タイトルを入力してください');
    await titleInput.clear();
    await titleInput.fill(updatedTitle);

    await page.locator('button').filter({ hasText: '更新する' }).click();

    // 記事詳細にリダイレクトされる
    await page.waitForURL(/\/articles\/[^/]+$/, { timeout: 10000 });

    // 更新されたタイトルが表示される
    await expect(
      page.getByRole('heading', { name: updatedTitle }),
    ).toBeVisible();
  });

  test('記事を削除できる', async ({ page }) => {
    const user = createTestUser();
    await signup(page, user);

    // 記事を投稿
    const article = createTestArticle('削除対象');
    await createArticle(page, article);

    // 記事詳細に移動
    await navigateToArticle(page, article.title);

    // confirm ダイアログを承認する
    page.on('dialog', (dialog) => dialog.accept());

    await page.locator('button').filter({ hasText: '削除' }).click();

    // /articles にリダイレクトされる
    await page.waitForURL('/articles', { timeout: 10000 });

    // 削除した記事がリストに表示されない
    await expect(page.getByText(article.title)).not.toBeVisible();
  });
});
