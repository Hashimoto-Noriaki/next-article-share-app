import { ArticleDetailPageTemplate } from '@/features/articles/components/server/ArticleDetailPageTemplate';

type Props = {
  params: Promise<{ id: string }>;
};

export default async function ArticleDetailPage({ params }: Props) {
  const { id } = await params;
  return <ArticleDetailPageTemplate articleId={id} />;
}
