import type { ActionResult } from '@/shared/types/action';
import { ok, fail } from '@/shared/lib/action-result';
import { draftRepository } from '@/external/repository/draft';

export async function deleteDraftHandler({
  draftId,
  userId,
}: {
  draftId: string;
  userId: string;
}): Promise<ActionResult> {
  const draft = await draftRepository.findById(draftId);
  if (!draft) {
    return fail('下書きが見つかりません');
  }
  if (draft.authorId !== userId) {
    return fail('権限がありません');
  }
  if (!draft.isDraft) {
    return fail('公開済みの記事は削除できません');
  }

  await draftRepository.delete(draftId);
  return ok();
}
