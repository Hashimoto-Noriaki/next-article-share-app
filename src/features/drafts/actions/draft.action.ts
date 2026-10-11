'use server';

import { fail } from '@/shared/lib/action-result';
import { auth } from '@/external/auth';
import { deleteDraftHandler } from '@/external/handler/draft/mutation.server';

export async function deleteDraftAction({ draftId }: { draftId: string }) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return fail('認証が必要です');

  return deleteDraftHandler({ draftId, userId });
}
