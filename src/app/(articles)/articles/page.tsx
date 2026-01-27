import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/jwt';
import { ArticleListHeader } from '@/features/articles/components/ArticleListHeader';
import { SearchableArticleList } from '@/features/articles/components/SearchableArticleList';
import { Footer } from '@/shared/components/organisms/Footer';

export default async function ArticleListPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  let userId = '';
  let userName = '';

  if (token) {
    const payload = await verifyToken(token);
    if (payload) {
      userId = payload.userId;

      const user = await prisma.user.findUnique({
        where: { id: payload.userId },
        select: { name: true },
      });
      userName = user?.name || '';
    }
  }

  const articles = await prisma.article.findMany({
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
  });

  // Client Componentに渡すためにシリアライズ
  const serializedArticles = articles.map((article) => ({
    ...article,
    createdAt: article.createdAt.toISOString(),
    updatedAt: article.updatedAt.toISOString(),
    isLiked: 'likes' in article && article.likes.length > 0,
  }));

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

        <div className="w-full max-w-10xl mt-8 px-10">
          <SearchableArticleList
            initialArticles={serializedArticles}
            userId={userId}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
}
