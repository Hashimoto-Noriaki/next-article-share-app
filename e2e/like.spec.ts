// spec: specs/like.md
// seed: e2e/seed.spec.ts

import { test, expect } from '@playwright/test';
import { createTestUser, signup } from './helpers/auth';
import {
  createTestArticle,
  createArticle,
  navigateToArticle,
} from './helpers/article';

test.describe('いいね機能', () => {
  test('他人の記事にいいねする', async ({ page, browser }) => {
    // 1. browser.newContext() で投稿者用のコンテキストとページを作る
    const authorContext = await browser.newContext();
    const authorPage = await authorContext.newPage();

    // 2. 投稿者用のページで、createTestUser() で記事投稿者ユーザー（authorユーザー）を作成し、signup() で新規登録・ログインする
    const author = createTestUser();
    await signup(authorPage, author);

    // 3. 投稿者用のページで、createTestArticle() でテスト記事データを作成し、createArticle() で記事を公開する
    const article = createTestArticle();
    await createArticle(authorPage, article);

    // 4. 投稿者用のコンテキストを閉じる
    await authorContext.close();

    // 5. テストの page で、createTestUser() で2人目のユーザー（likerユーザー）を作成し、signup() で新規登録・ログインする
    const liker = createTestUser();
    await signup(page, liker);

    // 6. navigateToArticle() で記事一覧から手順3で投稿した記事の詳細ページへ遷移する
    await navigateToArticle(page, article.title);

    // いいねボタンはアクセシブルネームが件数の数字のみで、記事詳細ページ内で
    // 数字のみの名前を持つボタンは他に存在しないため一意に特定できる
    const likeButton = page.getByRole('button', { name: /^\d+$/ });

    // 7. 記事詳細ページのいいねボタンの件数が「0」であることを確認する
    await expect(likeButton).toHaveText('0');

    // 8. いいねボタンをクリックする
    await likeButton.click();

    // いいねボタンの件数表示が「0」から「1」に変わる
    await expect(likeButton).toHaveText('1');
    // いいねボタンはdisabledではなく、クリック可能なままである
    await expect(likeButton).toBeEnabled();
  });

  test('いいねを取り消す', async ({ page, browser }) => {
    // 1. 1.1 の手順1〜4と同じく、投稿者用のコンテキストで投稿者ユーザーを登録して記事を公開し、コンテキストを閉じる
    const authorContext = await browser.newContext();
    const authorPage = await authorContext.newPage();
    const author = createTestUser();
    await signup(authorPage, author);
    const article = createTestArticle();
    await createArticle(authorPage, article);
    await authorContext.close();

    // 2. テストの page で、createTestUser() で2人目のユーザー（likerユーザー）を作成し、signup() で新規登録・ログインする
    const liker = createTestUser();
    await signup(page, liker);

    // 3. navigateToArticle() で記事一覧から対象記事の詳細ページへ遷移する
    await navigateToArticle(page, article.title);

    const likeButton = page.getByRole('button', { name: /^\d+$/ });

    // 4. いいねボタンをクリックして件数が「1」になったことを確認する（前提状態の作成）
    await likeButton.click();
    await expect(likeButton).toHaveText('1');

    // 5. 再度同じいいねボタンをクリックする
    await likeButton.click();

    // いいねボタンの件数表示が「1」から「0」に戻る
    await expect(likeButton).toHaveText('0');
    // いいねボタンはクリック可能なままである（disabledにならない）
    await expect(likeButton).toBeEnabled();
  });

  test('自分の記事ではいいねボタンが押せない', async ({ page }) => {
    // 1. createTestUser() でユーザーを作成し、signup() で新規登録・ログインする
    const user = createTestUser();
    await signup(page, user);

    // 2. createTestArticle() でテスト記事データを作成し、createArticle() で記事を公開する
    const article = createTestArticle();
    await createArticle(page, article);

    // 3. navigateToArticle() で自分が投稿した記事の詳細ページへ遷移する
    await navigateToArticle(page, article.title);

    // 4. 記事詳細ページのいいねボタンの状態を確認する（disabledのボタンはクリックしない。Playwrightのclick()はenabledになるまで待ってタイムアウトするため）
    const likeButton = page.getByRole('button', { name: /^\d+$/ });

    // いいねボタンがdisabledである（toBeDisabled()）
    await expect(likeButton).toBeDisabled();
    // いいねボタンの件数表示は「0」のままである
    await expect(likeButton).toHaveText('0');
  });
});
