import { DraftEditPageTemplate } from '@/features/drafts/components/server/DraftEditPageTemplate';
import type { PageProps } from '@/shared/types/next';

export default async function DraftEditPage(props: PageProps) {
  const { id } = await props.params;
  return <DraftEditPageTemplate draftId={id} />;
}
