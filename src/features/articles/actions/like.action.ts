'use server';

import { fail } from '@/shared/lib/action-result';
import { auth } from '@/external/auth';
import {
  likeHandler,
  unlikeHandler,
} from '@/external/handler/article/mutation.server';

export async function likeArticleAction({ articleId }: { articleId: string }) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return fail('認証が必要です');

  return likeHandler({ articleId, userId });
}

export async function unlikeArticleAction({
  articleId,
}: {
  articleId: string;
}) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return fail('認証が必要です');

  return unlikeHandler({ articleId, userId });
}
