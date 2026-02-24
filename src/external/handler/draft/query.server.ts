import { draftRepository } from '@/external/repository/draft';
import { DRAFT_LIMIT } from '@/shared/lib/validations/draft';

export async function listDraftsHandler({ userId }: { userId: string }) {
  const drafts = await draftRepository.findByUser(userId);

  const serializedDrafts = drafts.map((draft) => ({
    id: draft.id,
    title: draft.title,
    content: draft.content,
    tags: draft.tags,
    updatedAt: draft.updatedAt.toISOString(),
  }));

  return {
    drafts: serializedDrafts,
    isAtLimit: drafts.length >= DRAFT_LIMIT,
  };
}
