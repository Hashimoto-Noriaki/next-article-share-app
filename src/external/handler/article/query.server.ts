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
