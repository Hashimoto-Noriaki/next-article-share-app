import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { AiOutlineHeart } from 'react-icons/ai';
import { verifyToken } from '@/lib/jwt';
import { DeleteButton } from '@/features/articles/components';

type Props = {
  params: Promise<{ id: string }>; // sync-dynamic-apis 対策
};

export default async function ArticleDetailPage({ params }: Props) {
  const { id } = await params;

  const article = await prisma.article.findUnique({
    where: { id },
    include: {
      author: {
        select: { id: true, name: true },
      },
    },
  });

  if (!article) {
    notFound();
  }

  // ログインユーザーが著者かチェック
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  let isAuthor = false;
  if (token) {
    const payload = await verifyToken(token);
    if (payload && payload.userId === article.author.id) {
      isAuthor = true;
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-linear-to-r from-cyan-500 to-cyan-600 px-5 py-4 flex justify-start">
        <Link
          href="/articles"
          className="text-white font-bold text-xl hover:underline"
        >
          ← 記事一覧に戻る
        </Link>
      </header>
      <main className="mx-auto max-w-4xl px-6 py-10">
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

          {/* メタ情報 + 操作（編集/削除） */}
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
              <span className="flex items-center gap-1">
                <AiOutlineHeart className="w-5 h-5 text-red-500 transition-transform hover:scale-110" />
                <span className="text-gray-500 text-sm">
                  {article.likeCount}
                </span>
              </span>
            </div>

            {isAuthor && (
              <div className="flex items-center gap-5">
                {/* 編集 */}
                <Link
                  href={`/articles/${id}/edit`}
                  className="inline-flex items-center border border-cyan-900 text-cyan-800 text-sm font-semibold px-5 py-3 rounded-lg hover:bg-cyan-100 transition"
                >
                  編集
                </Link>
                <DeleteButton articleId={id} />
              </div>
            )}
          </div>

          <div className="prose max-w-none">{article.content}</div>
        </article>
      </main>
    </div>
  );
}
