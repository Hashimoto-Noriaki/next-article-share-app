import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { AiOutlineHeart } from 'react-icons/ai';
import { verifyToken } from '@/lib/jwt';
import { ArticleDeleteButton } from '@/features/articles/components/ArticleDeleteButton';
import { LikeButton } from '@/features/articles/components/LikeButton';
import { StockButton } from '@/features/articles/components/StockButton';
import { CommentList } from '@/features/articles/components/Comment/CommentList';
import { CommentForm } from '@/features/articles/components/Comment/CommentForm';
import { Footer } from '../../../../shared/components/organisms/Footer';
import { NavigationHeader } from '../../../../shared/components/molecules/NavigationHeader';

type Props = {
  params: Promise<{ id: string }>;
};

export default async function ArticleDetailPage({ params }: Props) {
  const { id } = await params;

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

  const article = await prisma.article.findUnique({
    where: { id },
    include: {
      author: {
        select: { id: true, name: true },
      },
      comments: {
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: { id: true, name: true },
          },
        },
      },
      ...(userId && {
        likes: {
          where: { userId },
          select: { id: true },
        },
        stocks: {
          where: { userId },
          select: { id: true },
        },
      }),
    },
  });

  if (!article) {
    notFound();
  }

  const isAuthor = userId === article.author.id;
  const isLiked = 'likes' in article && article.likes.length > 0;
  const isStocked = 'stocks' in article && article.stocks.length > 0;
  const isLoggedIn = !!userId;

  const comments = article.comments.map((comment) => ({
    ...comment,
    createdAt: comment.createdAt.toISOString(),
  }));

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <header className="bg-linear-to-r from-cyan-500 to-cyan-600 px-5 py-4 flex justify-between items-center h-[10vh]">
        <Link
          href="/articles"
          className="text-white font-bold text-xl hover:underline"
        >
          ← 記事一覧に戻る
        </Link>
        {userId && <NavigationHeader userId={userId} userName={userName} />}
      </header>
      <main className="container mx-auto max-w-4xl px-6 py-10 grow">
        <article className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
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
              <span>
                投稿日:{article.createdAt.toLocaleDateString('ja-JP')}
              </span>
              {article.updatedAt > article.createdAt && (
                <span>
                  更新日: {article.updatedAt.toLocaleDateString('ja-JP')}
                </span>
              )}
              {isLoggedIn ? (
                <LikeButton
                  articleId={id}
                  initialLiked={isLiked}
                  initialCount={article.likeCount}
                  isAuthor={isAuthor}
                />
              ) : (
                <span className="flex items-center gap-1">
                  <AiOutlineHeart className="w-5 h-5 text-red-500" />
                  <span>{article.likeCount}</span>
                </span>
              )}
              {isLoggedIn && (
                <StockButton articleId={id} initialStocked={isStocked} />
              )}
            </div>

            {isAuthor && (
              <div className="flex items-center gap-5">
                <Link
                  href={`/articles/${id}/edit`}
                  className="inline-flex items-center border border-cyan-900 text-cyan-800 text-sm font-semibold px-5 py-3 rounded-lg hover:bg-cyan-100 transition"
                >
                  編集
                </Link>
                <ArticleDeleteButton articleId={id} />
              </div>
            )}
          </div>

          <div className="prose max-w-none">{article.content}</div>
        </article>

        {/* コメントセクション */}
        <section className="bg-white rounded-lg shadow-md p-8 mt-8">
          <h2 className="text-xl font-bold text-gray-800 mb-6">
            コメント ({comments.length})
          </h2>

          {isLoggedIn && <CommentForm articleId={id} />}

          <CommentList
            comments={comments}
            articleId={id}
            currentUserId={userId}
          />
        </section>
      </main>
      <Footer />
    </div>
  );
}
