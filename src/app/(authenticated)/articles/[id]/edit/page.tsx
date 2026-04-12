import { ArticleEditPageTemplate } from '@/features/articles/components/server/ArticleEditPageTemplate';
import type { PageProps } from '@/shared/types/next';

export default async function ArticleEditPage(props: PageProps) {
  const { id } = await props.params;
  return <ArticleEditPageTemplate articleId={id} />;
}
