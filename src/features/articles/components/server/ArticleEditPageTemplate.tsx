import { notFound } from 'next/navigation';
import { getArticleForEditHandler } from '@/external/handler/article/query.server';
import { ArticleEditForm } from '@/features/articles/components/client/ArticleEditForm';

export async function ArticleEditPageTemplate({
  articleId,
}: {
  articleId: string;
}) {
  const article = await getArticleForEditHandler(articleId);
  if (!article) notFound();

  return (
    <ArticleEditForm
      articleId={articleId}
      initialTitle={article.title}
      initialTags={article.tags.join(' ')}
      initialBody={article.content}
    />
  );
}
