// spec: specs/stock.md
// seed: e2e/seed.spec.ts

import { test, expect } from '@playwright/test';
import { createTestUser, signup } from './helpers/auth';
import {
  createTestArticle,
  createArticle,
  navigateToArticle,
} from './helpers/article';

test.describe('ストック機能', () => {
  test('記事詳細ページでストックする', async ({ page }) => {
    // 1. createTestUser() でユーザーを作成し、signup() で新規登録・ログインする
    const user = createTestUser();
    await signup(page, user);

    // 2. createTestArticle() でテスト記事データを作成し、createArticle() で記事を公開する
    const article = createTestArticle();
    await createArticle(page, article);

    // 3. navigateToArticle() で記事一覧から投稿した記事の詳細ページへ遷移する
    await navigateToArticle(page, article.title);

    // ストックボタンは「ストック」⇔「ストック済み」でラベルが変わる同じボタン。
    // 「ストック」は「ストック済み」に部分一致するため、両方の状態にマッチする
    // ^...$ の正規表現で完全一致させてボタンを特定し、ラベルはtoHaveText()の
    // 完全一致で確認する
    const stockButton = page.getByRole('button', { name: /^ストック(済み)?$/ });

    // 4. 記事詳細ページのストックボタンの表示が「ストック」であることを確認する
    await expect(stockButton).toHaveText('ストック');

    // 5. ストックボタンをクリックする
    await stockButton.click();

    // 6. ストックボタンの表示が「ストック済み」に変わったことを確認する
    await expect(stockButton).toHaveText('ストック済み');

    // 7. /stocks に遷移する
    await page.goto('/stocks');

    // 8. /stocks の一覧に手順2で投稿した記事タイトルが表示されていることを確認する
    await expect(page.getByText(article.title)).toBeVisible();
  });

  test('ストックを解除する', async ({ page }) => {
    // 1. createTestUser() でユーザーを作成し、signup() で新規登録・ログインする
    const user = createTestUser();
    await signup(page, user);

    // 2. createTestArticle() でテスト記事データを作成し、createArticle() で記事を公開する
    const article = createTestArticle();
    await createArticle(page, article);

    // 3. navigateToArticle() で記事一覧から投稿した記事の詳細ページへ遷移する
    await navigateToArticle(page, article.title);

    // ストックボタンは「ストック」⇔「ストック済み」でラベルが変わる同じボタン。
    // ^...$ の正規表現で完全一致させて特定する
    const stockButton = page.getByRole('button', { name: /^ストック(済み)?$/ });

    // 4. ストックボタンをクリックし、表示が「ストック済み」になったことを確認する（前提状態の作成）
    await stockButton.click();
    await expect(stockButton).toHaveText('ストック済み');

    // 5. /stocks に遷移し、一覧に対象記事のタイトルが表示されていることを確認する（前提状態の確認）
    await page.goto('/stocks');
    await expect(page.getByText(article.title)).toBeVisible();

    // 6. 対象記事の詳細ページに戻る（navigateToArticle() で再度遷移する）
    await navigateToArticle(page, article.title);

    // 7. 「ストック済み」になっているストックボタンを再度クリックする
    await stockButton.click();

    // 8. ストックボタンの表示が「ストック」に戻ったことを確認する
    await expect(stockButton).toHaveText('ストック');

    // 9. /stocks に遷移する
    await page.goto('/stocks');

    // /stocks の一覧から対象記事のタイトルが消え、「ストックした記事はありません」と表示される
    await expect(page.getByText('ストックした記事はありません')).toBeVisible();
    await expect(page.getByText(article.title)).not.toBeVisible();
  });

  test('ストック状態はページ再読み込み後も保たれる', async ({ page }) => {
    // 1. createTestUser() でユーザーを作成し、signup() で新規登録・ログインする
    const user = createTestUser();
    await signup(page, user);

    // 2. createTestArticle() でテスト記事データを作成し、createArticle() で記事を公開する
    const article = createTestArticle();
    await createArticle(page, article);

    // 3. navigateToArticle() で記事一覧から投稿した記事の詳細ページへ遷移する
    await navigateToArticle(page, article.title);

    // ストックボタンは「ストック」⇔「ストック済み」でラベルが変わる同じボタン。
    // ^...$ の正規表現で完全一致させて特定する
    const stockButton = page.getByRole('button', { name: /^ストック(済み)?$/ });

    // 4. ストックボタンをクリックし、表示が「ストック済み」になったことを確認する
    await stockButton.click();
    await expect(stockButton).toHaveText('ストック済み');

    // 5. ページを再読み込みする（page.reload()）
    await page.reload();

    // 6. ストックボタンの表示を確認する
    // 再読み込み後もストックボタンの表示は「ストック済み」のままである
    await expect(stockButton).toHaveText('ストック済み');
  });
});
