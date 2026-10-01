// spec: specs/notification.md
// seed: e2e/seed.spec.ts

import { test, expect, Browser, Page } from '@playwright/test';
import { createTestUser, signup } from './helpers/auth';
import {
  createTestArticle,
  createArticle,
  navigateToArticle,
} from './helpers/article';

// 送信者用の別コンテキストでログインし、記事にいいね／コメントしてコンテキストを閉じる
async function actAsSender(
  browser: Browser,
  articleTitle: string,
  actions: { like?: boolean; comment?: string },
) {
  const senderContext = await browser.newContext();
  const senderPage = await senderContext.newPage();
  await signup(senderPage, createTestUser('送信者'));
  await navigateToArticle(senderPage, articleTitle);

  if (actions.like) {
    const likeButton = senderPage.getByRole('button', { name: /^\d+$/ });
    await likeButton.click();
    await expect(likeButton).toHaveText('1');
  }

  if (actions.comment) {
    const input = senderPage.getByPlaceholder('コメントを入力...');
    await input.fill(actions.comment);
    await senderPage.getByRole('button', { name: 'コメントする' }).click();
    // getByText は送信中のテキストエリアの値にも当たるため、投稿成功で入力欄が空に戻るまで待つ。
    // 待たずにコンテキストを閉じるとリクエストが中断され、通知が作られない
    await expect(input).toHaveValue('');
    await expect(
      senderPage.getByRole('paragraph').filter({ hasText: actions.comment }),
    ).toBeVisible();
  }

  await senderContext.close();
}

// 受信者としてログインし、記事を公開する
async function setupReceiverWithArticle(page: Page) {
  await signup(page, createTestUser('受信者'));
  const article = createTestArticle();
  await createArticle(page, article);
  return article;
}

test.describe('通知機能', () => {
  // 2ユーザーの新規登録・記事投稿・いいね・コメントを行うため、既定の30秒では足りないことがある
  test.describe.configure({ timeout: 60000 });

  test('他ユーザーのいいねで通知が届き、ベルに未読数が出る', async ({
    page,
    browser,
  }) => {
    // 1. テストの page で createTestUser('受信者') を作成し、signup() で新規登録・ログインする
    // 2. createTestArticle() でテスト記事データを作成し、createArticle() で記事を公開する
    const article = await setupReceiverWithArticle(page);

    // 3. browser.newContext() で送信者用のコンテキストとページを作る
    // 4. 送信者用ページで createTestUser('送信者') を作成し、signup() で新規登録・ログインする
    // 5. 送信者用ページで navigateToArticle() し、いいねして toHaveText('1') を待つ
    // 6. 送信者用のコンテキストを閉じる
    await actAsSender(browser, article.title, { like: true });

    // 7. 受信者の page で page.goto('/articles') を行う
    await page.goto('/articles');

    // 8. ベルボタンに未読数バッジ「1」が表示されるのを待つ
    const bell = page.getByRole('button', { name: '通知' });
    await expect(bell).toHaveText('1');

    // 9. ベルボタンをクリックしてドロップダウンを開く
    await bell.click();

    await expect(
      page.getByRole('heading', { name: '通知', level: 3 }),
    ).toBeVisible();
    await expect(
      page.getByRole('button', { name: '全て既読にする' }),
    ).toBeVisible();
    const likeNotification = page.getByRole('link', {
      name: '送信者さんがあなたの記事にいいねしました',
    });
    await expect(likeNotification).toHaveCount(1);
    await expect(likeNotification).toHaveAttribute('href', /^\/articles\//);
    await expect(likeNotification).toHaveClass(/bg-cyan-50/);
    await expect(page.getByText('通知はありません')).toHaveCount(0);
  });

  test('他ユーザーのコメントで通知が届く', async ({ page, browser }) => {
    // 1. テストの page で createTestUser('受信者') + signup() でログインし、記事を公開する
    const article = await setupReceiverWithArticle(page);

    // 2. 送信者用のコンテキストとページを作り、createTestUser('送信者') + signup() でログインする
    // 3. 送信者用ページで navigateToArticle() し、ユニークなコメントを投稿して本文が表示されるまで待つ
    // 4. 送信者用のコンテキストを閉じる
    const commentText = `通知テストコメント ${Date.now()}`;
    await actAsSender(browser, article.title, { comment: commentText });

    // 5. 受信者の page で page.goto('/articles') を行い、ベルボタンのバッジが「1」になるのを待つ
    await page.goto('/articles');
    const bell = page.getByRole('button', { name: '通知' });
    await expect(bell).toHaveText('1');

    // 6. ベルボタンをクリックしてドロップダウンを開く
    await bell.click();

    const commentNotification = page.getByRole('link', {
      name: '送信者さんがあなたの記事にコメントしました',
    });
    await expect(commentNotification).toHaveCount(1);
    await expect(commentNotification).toHaveClass(/bg-cyan-50/);
    await expect(page.getByText(commentText)).toHaveCount(0);
    await expect(
      page.getByRole('link', {
        name: '送信者さんがあなたの記事にいいねしました',
      }),
    ).toHaveCount(0);
  });

  test('通知一覧を開ける（0件のとき「通知はありません」）', async ({
    page,
  }) => {
    // 1. テストの page で createTestUser('受信者') + signup() で新規登録・ログインする
    await signup(page, createTestUser('受信者'));

    // 2. ヘッダーのベルボタンにバッジが表示されていないことを確認する
    const bell = page.getByRole('button', { name: '通知' });
    await expect(bell).toHaveText('');

    // 3. ベルボタンをクリックしてドロップダウンを開く
    await bell.click();

    // 4. 見出し「通知」（level 3）と「通知はありません」が表示されていることを確認する
    const heading = page.getByRole('heading', { name: '通知', level: 3 });
    await expect(heading).toBeVisible();
    await expect(page.getByText('通知はありません')).toBeVisible();
    await expect(
      page.getByRole('button', { name: '全て既読にする' }),
    ).toHaveCount(0);
    await expect(
      page.getByRole('link', { name: /さんがあなたの記事に/ }),
    ).toHaveCount(0);

    // 5. 再度ベルボタンをクリックしてドロップダウンを閉じる
    await bell.click();
    await expect(heading).toHaveCount(0);
  });

  test('通知を1件ずつ既読にできる（クリックで記事詳細へ遷移し未読数が減る）', async ({
    page,
    browser,
  }) => {
    // 1. テストの page で createTestUser('受信者') + signup() でログインし、記事を公開する
    const article = await setupReceiverWithArticle(page);

    // 2. 送信者用のコンテキストとページを作り、createTestUser('送信者') + signup() でログインする
    // 3. 送信者用ページでいいねとコメントを行う（通知が2件になる）
    // 4. 送信者用のコンテキストを閉じる
    await actAsSender(browser, article.title, {
      like: true,
      comment: `既読テストコメント ${Date.now()}`,
    });

    // 5. 受信者の page で page.goto('/articles') を行い、ベルボタンのバッジが「2」になるのを待つ
    await page.goto('/articles');
    const bell = page.getByRole('button', { name: '通知' });
    await expect(bell).toHaveText('2');

    // 6. ベルボタンをクリックしてドロップダウンを開き、2件とも未読スタイルであることを確認する
    await bell.click();
    const likeNotification = page.getByRole('link', {
      name: '送信者さんがあなたの記事にいいねしました',
    });
    const commentNotification = page.getByRole('link', {
      name: '送信者さんがあなたの記事にコメントしました',
    });
    await expect(likeNotification).toHaveClass(/bg-cyan-50/);
    await expect(commentNotification).toHaveClass(/bg-cyan-50/);

    // 7. 「送信者さんがあなたの記事にいいねしました」のリンクをクリックする
    await likeNotification.click();

    // 8. 遷移先の URL と、ベルのバッジを確認する
    await expect(page).toHaveURL(/\/articles\/[^/]+$/);
    await expect(page.getByText(article.title).first()).toBeVisible();
    await expect(
      page.getByRole('heading', { name: '通知', level: 3 }),
    ).toHaveCount(0);
    await expect(bell).toHaveText('1');

    // 9. ベルボタンを再度クリックして開き、各通知の未読スタイルと「全て既読にする」ボタンの有無を確認する
    await bell.click();
    await expect(likeNotification).not.toHaveClass(/bg-cyan-50/);
    await expect(commentNotification).toHaveClass(/bg-cyan-50/);
    await expect(
      page.getByRole('button', { name: '全て既読にする' }),
    ).toBeVisible();
  });

  test('通知をまとめて既読にできる', async ({ page, browser }) => {
    // 1. 受信者が記事を公開し、送信者がいいねとコメントを行い、受信者の page でバッジが「2」になるところまで進める
    const article = await setupReceiverWithArticle(page);
    await actAsSender(browser, article.title, {
      like: true,
      comment: `まとめて既読コメント ${Date.now()}`,
    });
    await page.goto('/articles');
    const bell = page.getByRole('button', { name: '通知' });
    await expect(bell).toHaveText('2');

    // 2. ベルボタンをクリックしてドロップダウンを開く
    await bell.click();
    const markAllRead = page.getByRole('button', { name: '全て既読にする' });
    await expect(markAllRead).toBeVisible();
    const notifications = page.getByRole('link', {
      name: /さんがあなたの記事に/,
    });
    await expect(notifications).toHaveCount(2);

    // 3. 「全て既読にする」ボタンをクリックする
    await markAllRead.click();

    await expect(bell).toHaveText('');
    await expect(markAllRead).toHaveCount(0);
    await expect(notifications).toHaveCount(2);
    await expect(
      page.getByRole('link', {
        name: '送信者さんがあなたの記事にいいねしました',
      }),
    ).not.toHaveClass(/bg-cyan-50/);
    await expect(
      page.getByRole('link', {
        name: '送信者さんがあなたの記事にコメントしました',
      }),
    ).not.toHaveClass(/bg-cyan-50/);

    // 4. ページをリロードして再取得させ、状態が保持されているか確認する
    await page.reload();
    await expect(bell).toHaveText('');
    await bell.click();
    await expect(notifications).toHaveCount(2);
    await expect(
      page.getByRole('button', { name: '全て既読にする' }),
    ).toHaveCount(0);
    await expect(
      page.getByRole('link', {
        name: '送信者さんがあなたの記事にいいねしました',
      }),
    ).not.toHaveClass(/bg-cyan-50/);
    await expect(
      page.getByRole('link', {
        name: '送信者さんがあなたの記事にコメントしました',
      }),
    ).not.toHaveClass(/bg-cyan-50/);
  });

  test('自分の記事への自分のコメントでは通知が作られない', async ({ page }) => {
    // 1. テストの page で createTestUser('受信者') + signup() でログインし、記事を公開する
    const article = await setupReceiverWithArticle(page);

    // 2. navigateToArticle() で自分の記事の詳細ページへ遷移する
    await navigateToArticle(page, article.title);

    // 3. ユニークなコメント本文を投稿し、本文が表示されるまで待つ
    const content = `自分のコメント ${Date.now()}`;
    const input = page.getByPlaceholder('コメントを入力...');
    await input.fill(content);
    await page.getByRole('button', { name: 'コメントする' }).click();
    // 投稿完了前にベルを開くと通知0件を誤って確認してしまうため、見出しの件数で完了を待つ
    await expect(input).toHaveValue('');
    await expect(
      page.getByRole('heading', { name: 'コメント (1)' }),
    ).toBeVisible();

    // 4. ベルボタンをクリックしてドロップダウンを開く
    const bell = page.getByRole('button', { name: '通知' });
    await bell.click();
    await expect(page.getByText('通知はありません')).toBeVisible();
    await expect(
      page.getByRole('link', { name: /さんがあなたの記事に/ }),
    ).toHaveCount(0);

    // 5. page.reload() し、再度ベルにバッジが出ていないことを確認する
    await page.reload();
    await expect(bell).toHaveText('');
  });
});
