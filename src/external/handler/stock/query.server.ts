import { stockRepository } from '@/external/repository/stock';

export async function listStocksHandler({ userId }: { userId: string }) {
  const stocks = await stockRepository.findByUser(userId);

  return {
    stocks: stocks.map((stock) => ({
      id: stock.article.id,
      title: stock.article.title,
      tags: stock.article.tags,
      authorName: stock.article.author.name || '名無し',
      createdAt: stock.article.createdAt,
      likeCount: stock.article.likeCount,
    })),
  };
}
