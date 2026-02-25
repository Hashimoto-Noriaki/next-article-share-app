import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { auth } from '@/external/auth';
import { getUserProfileHandler } from '@/external/handler/user/query.server';
import { ArticleCard } from '@/features/articles/components/ArticleCard';
import { NavigationHeader } from '@/shared/components/molecules/NavigationHeader';
import { Footer } from '@/shared/components/organisms/Footer';

type Props = {
  userId: string;
};

export async function UserProfilePageTemplate({ userId }: Props) {
  const session = await auth();
  const currentUserId = session?.user?.id || '';
  const currentUserName = session?.user?.name || '';
  const currentUserImage = session?.user?.image || null;

  const user = await getUserProfileHandler({ userId });

  if (!user) notFound();

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <header className="bg-linear-to-r from-cyan-500 to-cyan-600 px-5 py-4 flex justify-between items-center">
        <Link
          href="/articles"
          className="text-white text-xl font-bold hover:underline"
        >
          ← 記事一覧に戻る
        </Link>
        {currentUserId && (
          <NavigationHeader
            userId={currentUserId}
            userName={currentUserName}
            userImage={currentUserImage}
          />
        )}
      </header>
      <main className="container mx-auto px-5 py-8 max-w-4xl grow">
        <section className="bg-white rounded-lg shadow-md p-8 mb-8">
          <div className="flex items-center gap-4 mb-4">
            {user.image ? (
              <div className="relative w-20 h-20 rounded-full overflow-hidden">
                <Image
                  src={user.image}
                  alt={user.displayName}
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="w-20 h-20 rounded-full bg-gray-300 flex items-center justify-center text-gray-500">
                未設定
              </div>
            )}
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                {user.displayName}
              </h1>
              <p className="text-gray-500 font-bold">{user.email}</p>
            </div>
          </div>
          <p className="text-gray-500 font-bold text-xl">
            投稿記事数: {user.articleCount}
          </p>
        </section>
        <h2 className="text-2xl font-bold mb-4">投稿した記事</h2>
        <div className="flex flex-wrap gap-5">
          {user.articles.length === 0 ? (
            <p className="text-gray-500">まだ記事がありません</p>
          ) : (
            user.articles.map(
              (article: {
                id: string;
                title: string;
                tags: string[];
                createdAt: Date;
                likeCount: number;
              }) => (
                <ArticleCard
                  key={article.id}
                  id={article.id}
                  title={article.title}
                  tags={article.tags}
                  authorName={user.displayName}
                  authorImage={user.image}
                  createdAt={article.createdAt}
                  likeCount={article.likeCount}
                />
              ),
            )
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
