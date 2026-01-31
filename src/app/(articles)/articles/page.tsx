import { prisma } from '@/lib/prisma';
import { auth } from '@/external/auth';
import { ArticleListHeader } from '@/features/articles/components/ArticleListHeader';
import { SearchableArticleList } from '@/features/articles/components/SearchableArticleList';
import { Footer } from '@/shared/components/organisms/Footer';

const PER_PAGE = 12;

export default async function ArticleListPage() {
  /**
   * NextAuth.js でセッションを取得
   *
   * auth() は Server Component で使用可能
   * session.user には id, name, email, image が含まれる
   */
  const session = await auth();

  const userId = session?.user?.id || '';
  const userName = session?.user?.name || '';

  const [articles, total] = await Promise.all([
    prisma.article.findMany({
      where: { isDraft: false },
      orderBy: { createdAt: 'desc' },
      include: {
        author: {
          select: { name: true },
        },
        ...(userId && {
          likes: {
            where: { userId },
            select: { id: true },
          },
        }),
      },
      take: PER_PAGE,
    }),
    prisma.article.count({
      where: { isDraft: false },
    }),
  ]);

  const serializedArticles = articles.map((article) => ({
    ...article,
    createdAt: article.createdAt.toISOString(),
    updatedAt: article.updatedAt.toISOString(),
    isLiked: 'likes' in article && article.likes.length > 0,
  }));

  const totalPages = Math.ceil(total / PER_PAGE);

  return (
    <div className="flex flex-col min-h-screen">
      <ArticleListHeader userId={userId} userName={userName} />
      <main className="grow flex flex-col items-center justify-start mt-5">
        <div className="bg-linear-to-r from-rose-300 to-cyan-600 px-8 py-12 font-bold text-white w-full max-w-5xl text-center rounded-lg shadow-lg">
          <h1 className="text-5xl">テックブログ共有アプリ</h1>
          <p className="text-3xl mt-5">
            エンジニア同士で有益な記事を共有しよう
          </p>
        </div>
        <div className="w-full max-w-8xl mt-8 px-8">
          <SearchableArticleList
            initialArticles={serializedArticles}
            userId={userId}
            initialTotalPages={totalPages}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
}
