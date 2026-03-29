import { draftRepository } from '@/external/repository/draft';
import { DRAFT_LIMIT } from '@/shared/lib/validations/draft';

export async function listDraftsHandler({ userId }: { userId: string }) {
  const drafts = await draftRepository.findManyByUserId(userId);
  return {
    drafts,
    isAtLimit: drafts.length >= DRAFT_LIMIT,
  };
}

export async function getDraftForEditHandler(draftId: string) {
  const draft = await draftRepository.findById(draftId);
  if (!draft) return null;
  return draft;
}
