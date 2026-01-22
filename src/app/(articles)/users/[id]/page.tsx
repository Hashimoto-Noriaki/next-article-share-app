import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { ArticleCard } from '@/features/articles/components/ArticleCard';
import { Footer } from '../../../../shared/components/organisms/Footer';
import Link from 'next/link';

type Props = {
  params: Promise<{ id: string }>;
};

export default async function UserProfilePage({ params }: Props) {
  const { id } = await params;

  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      articles: {
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  if (!user) {
    notFound();
  }

  const displayName = user.name || '名無し';

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <header className="bg-linear-to-r from-cyan-500 to-cyan-600 px-5 py-4">
        <Link
          href="/articles"
          className="text-white text-xl font-bold hover:underline"
        >
          ← 記事一覧に戻る
        </Link>
      </header>

      <main className="container mx-auto px-5 py-8 max-w-4xl grow">
        <section className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {displayName}
          </h1>
          <p className="text-gray-500 font-bold text-xl">{user.email}</p>
          <p className="text-gray-500 font-bold text-xl mt-2">
            投稿記事数: {user.articles.length}
          </p>
        </section>

        <h2 className="text-2xl font-bold mb-4">投稿した記事</h2>
        <div className="flex flex-wrap gap-5">
          {user.articles.length === 0 ? (
            <p className="text-gray-500">まだ記事がありません</p>
          ) : (
            user.articles.map((article) => (
              <ArticleCard
                key={article.id}
                id={article.id}
                title={article.title}
                tags={article.tags}
                authorName={displayName}
                createdAt={article.createdAt}
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
