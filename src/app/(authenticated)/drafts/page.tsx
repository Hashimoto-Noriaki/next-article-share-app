import { DraftsPageTemplate } from '@/features/drafts/components/server/DraftsPageTemplate';

type Props = {
  searchParams: Promise<{ id?: string }>;
};

export default async function DraftsPage({ searchParams }: Props) {
  const { id } = await searchParams;
  return <DraftsPageTemplate selectedId={id} />;
}
