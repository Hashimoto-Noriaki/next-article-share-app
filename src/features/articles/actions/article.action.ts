'use server';

import { auth } from '@/external/auth';
import {
  createArticleHandler,
  updateArticleHandler,
  deleteArticleHandler,
} from '@/external/handler/article/mutation.server';
import { searchArticlesHandler } from '@/external/handler/article/query.server';

export async function createArticleAction({
  title,
  content,
  tags,
  isDraft,
}: {
  title: string;
  content: string;
  tags: string[];
  isDraft: boolean;
}) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return { success: false as const, error: '認証が必要です' };

  return createArticleHandler({ title, content, tags, isDraft, userId });
}

export async function updateArticleAction({
  articleId,
  title,
  content,
  tags,
  isDraft,
}: {
  articleId: string;
  title: string;
  content: string;
  tags: string[];
  isDraft?: boolean;
}) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return { success: false as const, error: '認証が必要です' };

  return updateArticleHandler({
    articleId,
    title,
    content,
    tags,
    isDraft,
    userId,
  });
}

export async function deleteArticleAction({
  articleId,
}: {
  articleId: string;
}) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return { success: false as const, error: '認証が必要です' };

  return deleteArticleHandler({ articleId, userId });
}

// 検索はServer Actionとして公開（クライアントから呼ぶ）
export async function searchArticlesAction({
  query,
  page = 1,
}: {
  query: string;
  page?: number;
}) {
  return searchArticlesHandler({ query, page });
}
