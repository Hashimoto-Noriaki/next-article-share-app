import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { AiOutlineHeart } from 'react-icons/ai';

type Props = {
  params: { id: string };
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

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-linear-to-r from-cyan-500 to-cyan-600 px-5 py-4">
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

          <div className="flex items-center gap-4 text-gray-500 text-sm mb-8">
            <span>投稿者: {article.author.name || '名無し'}</span>
            <span>{article.createdAt.toLocaleDateString('ja-JP')}</span>
            <span className="flex items-center gap-1">
              <AiOutlineHeart className="w-5 h-5 text-red-500 transition hover:scale-120" />
              <span className="text-gray-500 text-sm">{article.likeCount}</span>
            </span>
          </div>
          <div className="prose max-w-none">{article.content}</div>
        </article>
      </main>
    </div>
  );
}
