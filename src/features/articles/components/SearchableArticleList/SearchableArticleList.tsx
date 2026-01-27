'use client';

import { useState } from 'react';
import { ArticleCard } from '../ArticleCard';

type Article = {
  id: string;
  title: string;
  tags: string[];
  authorId: string;
  likeCount: number;
  createdAt: string;
  updatedAt: string;
  author: {
    name: string | null;
  };
  isLiked?: boolean;
};

type Props = {
  initialArticles: Article[];
  userId: string;
};

export function SearchableArticleList({ initialArticles, userId }: Props) {
  const [query, setQuery] = useState('');
  const [articles, setArticles] = useState<Article[]>(initialArticles);
  const [isSearching, setIsSearching] = useState(false);
  const [isSearched, setIsSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!query.trim()) {
      setArticles(initialArticles);
      setIsSearched(false);
      return;
    }

    setIsSearching(true);

    try {
      const res = await fetch(`/api/articles/search?q=${encodeURIComponent(query)}`);
      const data = await res.json();

      // 日付をstringに変換
      const formattedData = data.map((article) => ({
        ...article,
        createdAt: article.createdAt,
        updatedAt: article.updatedAt,
      }));

      setArticles(formattedData);
      setIsSearched(true);
    } catch (error) {
      console.error('検索エラー:', error);
      alert('検索に失敗しました');
    } finally {
      setIsSearching(false);
    }
  };

  const handleClear = () => {
    setQuery('');
    setArticles(initialArticles);
    setIsSearched(false);
  };

  return (
    <div>
      {/* 検索バー */}
      <form onSubmit={handleSearch} className="flex justify-center gap-2 mb-8">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="タイトルやタグで検索..."
          className="w-full max-w-md border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
        />
        <button
          type="submit"
          disabled={isSearching}
          className="bg-cyan-500 hover:bg-cyan-600 text-white font-semibold px-4 py-2 rounded-md transition disabled:bg-gray-300"
        >
          {isSearching ? '検索中...' : '検索'}
        </button>
        {isSearched && (
          <button
            type="button"
            onClick={handleClear}
            className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-semibold px-4 py-2 rounded-md transition"
          >
            クリア
          </button>
        )}
      </form>

      {/* 検索結果表示 */}
      {isSearched && (
        <p className="text-center text-gray-600 mb-4">
          「{query}」の検索結果: {articles.length}件
        </p>
      )}

      {/* 記事一覧 */}
      <div className="flex flex-wrap justify-center gap-5">
        {articles.length === 0 ? (
          <p className="text-gray-500">
            {isSearched ? '検索結果がありません' : 'まだ記事がありません'}
          </p>
        ) : (
          articles.map((article) => (
            <ArticleCard
              key={article.id}
              id={article.id}
              title={article.title}
              tags={article.tags}
              authorName={article.author.name || '名無し'}
              createdAt={new Date(article.createdAt)}
              updatedAt={new Date(article.updatedAt)}
              likeCount={article.likeCount}
              isLiked={article.isLiked ?? false}
              isAuthor={article.authorId === userId}
              isLoggedIn={!!userId}
            />
          ))
        )}
      </div>
    </div>
  );
}