import { draftRepository } from '@/external/repository/draft';

export async function deleteDraftHandler({
  draftId,
  userId,
}: {
  draftId: string;
  userId: string;
}) {
  const draft = await draftRepository.findById(draftId);
  if (!draft) {
    return { success: false as const, error: '下書きが見つかりません' };
  }
  if (draft.authorId !== userId) {
    return { success: false as const, error: '権限がありません' };
  }
  if (!draft.isDraft) {
    return { success: false as const, error: '公開済みの記事は削除できません' };
  }

  await draftRepository.delete(draftId);
  return { success: true as const };
}
