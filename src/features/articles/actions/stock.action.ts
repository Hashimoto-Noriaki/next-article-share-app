'use server';

import { auth } from '@/external/auth';
import {
  stockHandler,
  unstockHandler,
} from '@/external/handler/article/mutation.server';

export async function stockArticleAction({ articleId }: { articleId: string }) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return { success: false, error: '認証が必要です' };

  return stockHandler({ articleId, userId });
}

export async function unstockArticleAction({
  articleId,
}: {
  articleId: string;
}) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return { success: false, error: '認証が必要です' };

  return unstockHandler({ articleId, userId });
}
