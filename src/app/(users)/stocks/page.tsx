import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { auth } from '@/external/auth';
import { ArticleCard } from '@/features/articles/components/ArticleCard';
import Link from 'next/link';
import { NavigationHeader } from '@/shared/components/molecules/NavigationHeader';
import { Footer } from '@/shared/components/organisms/Footer';

export default async function StocksPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/login');
  }

  const userId = session.user.id;
  const userName = session.user.name || '';

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
