'use client';

import { useState } from 'react';
import { ArticleCard } from '../ArticleCard';
import { Pagination } from '../../../../shared/components/molecules/Pagination';

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
    image: string | null;
  };
  isLiked?: boolean;
};

type Props = {
  initialArticles: Article[];
  userId: string;
  initialTotalPages: number;
};

export function SearchableArticleList({
  initialArticles,
  userId,
  initialTotalPages,
}: Props) {
  const [query, setQuery] = useState('');
  const [articles, setArticles] = useState<Article[]>(initialArticles);
  const [isSearching, setIsSearching] = useState(false);
  const [isSearched, setIsSearched] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(initialTotalPages);

  const fetchArticles = async (page: number, searchQuery: string = '') => {
    setIsSearching(true);

    try {
      const endpoint = searchQuery
        ? `/api/articles/search?q=${encodeURIComponent(searchQuery)}&page=${page}`
        : `/api/articles?page=${page}`;

      const res = await fetch(endpoint);
      const data = await res.json();

      const formattedArticles = (data.articles || data).map(
        (article: Article) => ({
          ...article,
          createdAt: article.createdAt,
          updatedAt: article.updatedAt,
        }),
      );

      setArticles(formattedArticles);
      setTotalPages(data.totalPages || initialTotalPages);
      setCurrentPage(page);
    } catch (error) {
      console.error('取得エラー:', error);
      alert('記事の取得に失敗しました');
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!query.trim()) {
      setArticles(initialArticles);
      setIsSearched(false);
      setCurrentPage(1);
      setTotalPages(initialTotalPages);
      return;
    }

    setIsSearched(true);
    await fetchArticles(1, query);
  };

  const handleClear = () => {
    setQuery('');
    setArticles(initialArticles);
    setIsSearched(false);
    setCurrentPage(1);
    setTotalPages(initialTotalPages);
  };

  const handlePageChange = (page: number) => {
    if (isSearched) {
      fetchArticles(page, query);
    } else {
      fetchArticles(page);
    }
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {articles.length === 0 ? (
          <p className="text-gray-500 col-span-full text-center">
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
              authorImage={article.author.image}
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

      {/* ページネーション */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
}
