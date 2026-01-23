'use client';

import Link from 'next/link';
import { AiOutlineHeart } from 'react-icons/ai';
import { LikeButton } from '../LikeButton';

type Props = {
  id: string;
  title: string;
  tags: string[];
  authorName: string;
  createdAt: Date;
  updatedAt?: Date;
  likeCount: number;
  isLiked?: boolean;
  isAuthor?: boolean;
  isLoggedIn?: boolean;
  fullWidth?: boolean;
};

export function ArticleCard({
  id,
  title,
  tags,
  authorName,
  createdAt,
  updatedAt,
  likeCount,
  isLiked = false,
  isAuthor = false,
  isLoggedIn = false,
  fullWidth = false,
}: Props) {
  const isUpdated = updatedAt && updatedAt > createdAt;

  return (
    <Link href={`/articles/${id}`}>
      <article
        className={`bg-white rounded-xl shadow-md hover:shadow-lg transition p-5 ${
          fullWidth ? 'w-full' : 'w-90'
        }`}
      >
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

          <div
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
            }}
          >
            {isLoggedIn ? (
              <LikeButton
                articleId={id}
                initialLiked={isLiked}
                initialCount={likeCount}
                isAuthor={isAuthor}
              />
            ) : (
              <span className="flex items-center gap-1 text-gray-500">
                <AiOutlineHeart className="w-5 h-5 text-red-500" />
                <span>{likeCount}</span>
              </span>
            )}
          </div>

          <p className="text-xs text-gray-400">
            {isUpdated
              ? `更新: ${updatedAt.toLocaleDateString('ja-JP')}`
              : createdAt.toLocaleDateString('ja-JP')}
          </p>
        </div>
      </article>
    </Link>
  );
}