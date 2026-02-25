import Link from 'next/link';
import { auth } from '@/external/auth';
import { listStocksHandler } from '@/external/handler/stock/query.server';
import { ArticleCard } from '@/features/articles/components/ArticleCard';
import { NavigationHeader } from '@/shared/components/molecules/NavigationHeader';
import { Footer } from '@/shared/components/organisms/Footer';

export async function StocksPageTemplate() {
  const session = await auth();
  const userId = session?.user?.id || '';
  const userName = session?.user?.name || '';
  const userImage = session?.user?.image || null;

  const { stocks } = await listStocksHandler({ userId });

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <header className="bg-linear-to-r from-cyan-500 to-cyan-600 px-5 py-4 flex justify-between items-center">
        <Link
          href="/articles"
          className="text-white font-bold text-xl hover:underline"
        >
          ← 記事一覧に戻る
        </Link>
        <NavigationHeader
          userId={userId}
          userName={userName}
          userImage={userImage}
        />
      </header>
      <main className="container mx-auto px-5 py-8 max-w-2xl grow">
        <h1 className="text-2xl font-bold mb-8">ストックした記事</h1>
        <div className="flex flex-col gap-5">
          {stocks.length === 0 ? (
            <p className="text-gray-500">ストックした記事はありません</p>
          ) : (
            stocks.map((stock) => (
              <ArticleCard
                key={stock.id}
                id={stock.id}
                title={stock.title}
                tags={stock.tags}
                authorName={stock.authorName}
                createdAt={stock.createdAt}
                likeCount={stock.likeCount}
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
