import { auth } from '@/external/auth';
import { listDraftsHandler } from '@/external/handler/draft/query.server';
import { DraftSidebar } from '@/features/drafts/components/DraftSidebar';

type Props = {
  selectedId?: string;
};

export async function DraftsPageTemplate({ selectedId }: Props) {
  const session = await auth();
  const userId = session?.user?.id || '';

  const { drafts } = await listDraftsHandler({ userId });

  const mappedDrafts = drafts.map((draft) => ({
    id: draft.id,
    title: draft.title || '',
    content: draft.content,
    tags: draft.tags,
    updatedAt: draft.updatedAt.toISOString(),
  }));

  return (
    <div className="flex h-screen">
      <DraftSidebar drafts={mappedDrafts} selectedId={selectedId} />
    </div>
  );
}
