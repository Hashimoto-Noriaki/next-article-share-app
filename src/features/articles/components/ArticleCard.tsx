import Link from 'next/link';
import { AiOutlineHeart } from 'react-icons/ai';

type Props = {
  id: string;
  title: string;
  tags: string[];
  authorName: string;
  createdAt: Date;
  updatedAt?: Date;
  likeCount: number;
};

export function ArticleCard({
  id,
  title,
  tags,
  authorName,
  createdAt,
  updatedAt,
  likeCount,
}: Props) {
  const isUpdated = updatedAt && updatedAt > createdAt;
  return (
    <Link href={`/articles/${id}`}>
      <article className="w-90 bg-white rounded-xl shadow-md hover:shadow-lg transition p-5">
        <h2 className="text-lg font-bold text-gray-800 line-clamp-2">
          {title}
        </h2>
        <div className="flex flex-wrap gap-3 mt-3">
          {tags.slice(0, 5).map((tag) => (
            <span
              key={tag}
              className="text-xs bg-cyan-100 text-cyan-700 px-2 py-1 rounded"
            >
              {tag}
            </span>
          ))}
        </div>
        <div className="flex justify-between items-center mt-4 text-sm text-gray-500">
          <span>{authorName}</span>
          <span className="flex items-center gap-1">
            <AiOutlineHeart className="w-5 h-5 text-red-500 transition hover:scale-120" />
            <span className="text-gray-500 text-sm">{likeCount}</span>
          </span>
          <p className="text-xs text-gray-400 mt-2">
            {isUpdated
              ? `更新: ${updatedAt.toLocaleDateString('ja-JP')}`
              : createdAt.toLocaleDateString('ja-JP')}
          </p>
        </div>
        <p className="text-xs text-gray-400 mt-2">
          {createdAt.toLocaleDateString('ja-JP')}
        </p>
      </article>
    </Link>
  );
}
