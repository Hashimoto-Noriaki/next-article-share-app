import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { verifyToken } from '@/lib/jwt';
import { ArticleCard } from '@/features/articles/components/ArticleCard';
import Link from 'next/link';
import { NavigationHeader } from '@/shared/components/molecules/NavigationHeader';
import { Footer } from '@/shared/components/organisms/Footer';

export default async function StocksPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    redirect('/login');
  }

  const payload = await verifyToken(token);
  if (!payload) {
    redirect('/login');
  }

  // ユーザー情報を取得
  const userId = payload.userId;
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { name: true },
  });
  const userName = user?.name || '';

  const stocks = await prisma.stock.findMany({
    where: {
      userId: userId,
    },
    orderBy: { createdAt: 'desc' },
    include: {
      article: {
        include: {
          author: {
            select: { name: true },
          },
        },
      },
    },
  });

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <header className="bg-linear-to-r from-cyan-500 to-cyan-600 px-5 py-4 flex justify-between items-center">
        <Link
          href="/articles"
          className="text-white font-bold text-xl hover:underline"
        >
          ← 記事一覧に戻る
        </Link>
        <NavigationHeader userId={userId} userName={userName} />
      </header>

      <main className="container mx-auto px-5 py-8 max-w-2xl grow">
        <h1 className="text-2xl font-bold mb-8">ストックした記事</h1>

        <div className="flex flex-col gap-5">
          {stocks.length === 0 ? (
            <p className="text-gray-500">ストックした記事はありません</p>
          ) : (
            stocks.map((stock) => (
              <ArticleCard
                key={stock.article.id}
                id={stock.article.id}
                title={stock.article.title}
                tags={stock.article.tags}
                authorName={stock.article.author.name || '名無し'}
                createdAt={stock.article.createdAt}
                likeCount={stock.article.likeCount}
                fullWidth
              />
            ))
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
