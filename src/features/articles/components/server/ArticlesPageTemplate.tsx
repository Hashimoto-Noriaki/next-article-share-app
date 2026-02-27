import { auth } from '@/external/auth';
import { listArticleHandler } from '@/external/handler/article/query.server';
import { ArticleListHeader } from '@/features/articles/components/ArticleListHeader';
import { SearchableArticleList } from '@/features/articles/components/SearchableArticleList';
import { Footer } from '@/shared/components/organisms/Footer';

export async function ArticlesPageTemplate() {
  const session = await auth();

  const userId = session?.user?.id || '';
  const userName = session?.user?.name || '';
  const userImage = session?.user?.image || null;

  const { articles, totalPages } = await listArticleHandler(userId);

  return (
    <div className="flex flex-col min-h-screen">
      <ArticleListHeader
        userId={userId}
        userName={userName}
        userImage={userImage}
      />
      <main className="grow flex flex-col items-center justify-start mt-5">
        <div className="bg-linear-to-r from-rose-300 to-cyan-600 px-8 py-12 font-bold text-white w-full max-w-5xl text-center rounded-lg shadow-lg">
          <h1 className="text-5xl">テックブログ共有アプリ</h1>
          <p className="text-3xl mt-5">
            エンジニア同士で有益な記事を共有しよう
          </p>
        </div>
        <div className="w-full max-w-8xl mt-8 px-8 mb-5">
          <SearchableArticleList
            initialArticles={articles}
            userId={userId}
            initialTotalPages={totalPages}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
}
