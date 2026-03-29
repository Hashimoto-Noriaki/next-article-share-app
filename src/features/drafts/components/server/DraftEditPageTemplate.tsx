import { notFound } from 'next/navigation';
import { getDraftForEditHandler } from '@/external/handler/draft/query.server';
import { DraftEditForm } from '@/features/drafts/components/client/DraftEditForm';

export async function DraftEditPageTemplate({ draftId }: { draftId: string }) {
  const draft = await getDraftForEditHandler(draftId);
  if (!draft) notFound();

  return (
    <DraftEditForm
      draftId={draftId}
      initialTitle={draft.title || ''}
      initialTags={draft.tags.join(' ')}
      initialBody={draft.content || ''}
    />
  );
}
