import { notFound } from 'next/navigation';
import Link from 'next/link';
import { AiOutlineHeart } from 'react-icons/ai';
import { auth } from '@/external/auth';
import { getArticleDetailHandler } from '@/external/handler/article/query.server';
import { ArticleDeleteButton } from '@/features/articles/components/ArticleDeleteButton';
import { LikeButton } from '@/features/articles/components/LikeButton';
import { StockButton } from '@/features/articles/components/StockButton';
import { CommentList } from '@/features/articles/components/Comment/CommentList';
import { CommentForm } from '@/features/articles/components/Comment/CommentForm';
import { Footer } from '@/shared/components/organisms/Footer';
import { NavigationHeader } from '@/shared/components/molecules/NavigationHeader';
import { MarkdownPreview } from '@/shared/components/molecules/MarkdownPreview';

type Props = {
  articleId: string;
};

export async function ArticleDetailPageTemplate({ articleId }: Props) {
  const session = await auth();
  const userId = session?.user?.id || '';
  const userName = session?.user?.name || '';
  const userImage = session?.user?.image || null;

  const article = await getArticleDetailHandler({ articleId, userId });

  if (!article) notFound();

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <header className="bg-linear-to-r from-cyan-500 to-cyan-600 px-5 py-4 flex justify-between items-center h-[10vh]">
        <Link
          href="/articles"
          className="text-white font-bold text-xl hover:underline"
        >
          ← 記事一覧に戻る
        </Link>
        {userId && (
          <NavigationHeader
            userId={userId}
            userName={userName}
            userImage={userImage}
          />
        )}
      </header>
      <main className="container mx-auto max-w-7xl px-6 py-10 grow">
        <article className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            {article.title}
          </h1>
          <div className="flex flex-wrap gap-2 mb-4">
            {article.tags.map((tag) => (
              <span
                key={tag}
                className="text-sm bg-cyan-100 text-cyan-700 px-3 py-1 rounded"
              >
                {tag}
              </span>
            ))}
          </div>
          <div className="flex flex-wrap items-center justify-between gap-4 text-gray-500 text-sm mb-8">
            <div className="flex flex-wrap items-center gap-4">
              <span>投稿者: {article.author.name || '名無し'}</span>
              <span>投稿日: {article.createdAtLabel}</span>
              {article.isUpdated && (
                <span>更新日: {article.updatedAtLabel}</span>
              )}
              {article.isLoggedIn ? (
                <LikeButton
                  articleId={articleId}
                  initialLiked={article.isLiked}
                  initialCount={article.likeCount}
                  isAuthor={article.isAuthor}
                />
              ) : (
                <span className="flex items-center gap-1">
                  <AiOutlineHeart className="w-5 h-5 text-red-500" />
                  <span>{article.likeCount}</span>
                </span>
              )}
              {article.isLoggedIn && (
                <StockButton
                  articleId={articleId}
                  initialStocked={article.isStocked}
                />
              )}
            </div>
            {article.isAuthor && (
              <div className="flex items-center gap-5">
                <Link
                  href={`/articles/${articleId}/edit`}
                  className="inline-flex items-center border border-cyan-900 text-cyan-800 text-sm font-semibold px-5 py-3 rounded-lg hover:bg-cyan-100 transition"
                >
                  編集
                </Link>
                <ArticleDeleteButton articleId={articleId} />
              </div>
            )}
          </div>
          <MarkdownPreview content={article.content} />
        </article>
        <section className="bg-white rounded-lg shadow-md p-8 mt-8">
          <h2 className="text-xl font-bold text-gray-800 mb-6">
            コメント ({article.comments.length})
          </h2>
          {article.isLoggedIn && <CommentForm articleId={articleId} />}
          <CommentList comments={article.comments} currentUserId={userId} />
        </section>
      </main>
      <Footer />
    </div>
  );
}
