import { articleRepository } from '@/external/repository/article';

export async function listArticleHandler(userId: string) {
  const { articles, total, perPage } =
    await articleRepository.findPublished(userId);

  const serializedArticles = articles.map((article) => ({
    ...article,
    createdAt: article.createdAt.toISOString(),
    updatedAt: article.updatedAt.toISOString(),
    isLiked: 'likes' in article && article.likes.length > 0,
    authorImage: article.author.image,
  }));

  const totalPages = Math.ceil(total / perPage);

  return { articles: serializedArticles, totalPages };
}

export async function getArticleDetailHandler({
  articleId,
  userId,
}: {
  articleId: string;
  userId: string;
}) {
  const article = await articleRepository.findById({ articleId, userId });
  if (!article) return null;

  return {
    ...article,
    createdAtLabel: article.createdAt.toLocaleDateString('ja-JP'),
    updatedAtLabel: article.updatedAt.toLocaleDateString('ja-JP'),
    isUpdated: article.updatedAt > article.createdAt,
    isLiked: 'likes' in article && article.likes.length > 0,
    isStocked: 'stocks' in article && article.stocks.length > 0,
    isAuthor: userId === article.author.id,
    isLoggedIn: !!userId,
    comments: article.comments.map((c) => ({
      ...c,
      createdAt: c.createdAt.toISOString(),
    })),
  };
}
