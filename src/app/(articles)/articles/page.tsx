import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/jwt';
import { ArticleListHeader, ArticleCard } from '@/features/articles/components';
import Footer from '@/shared/components/footer';

export default async function ArticleListPage() {
  // ログインユーザーのID・名前取得
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  let userId = '';
  let userName = '';

  if (token) {
    const payload = await verifyToken(token);
    if (payload) {
      userId = payload.userId;

      // ユーザー名を取得
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
    },
  });

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
        <div className="flex flex-wrap justify-center gap-5 mt-5 pb-10">
          {articles.length === 0 ? (
            <p className="text-gray-500">まだ記事がありません</p>
          ) : (
            articles.map((article) => (
              <ArticleCard
                key={article.id}
                id={article.id}
                title={article.title}
                tags={article.tags}
                authorName={article.author.name || '名無し'}
                createdAt={article.createdAt}
                updatedAt={article.updatedAt}
                likeCount={article.likeCount}
              />
            ))
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
