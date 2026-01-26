'use client';

import { useState } from 'react';

type Props = {
  onSearch: (query: string) => void;
};

export function SearchBar({ onSearch }: Props) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  const handleClear = () => {
    setQuery('');
    onSearch('');
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 w-full max-w-md">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="タイトルやタグで検索..."
        className="flex-1 border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
      />
      <button
        type="submit"
        className="bg-cyan-500 hover:bg-cyan-400 text-white font-semibold px-4 py-2 rounded-md"
      >
        検索
      </button>
      {query && (
        <button
          type="button"
          onClick={handleClear}
          className="bg-gray-300 hover:bg-gray-200 text-gray-700 font-semibold px-4 py-2 rounded-md"
        >
          クリア
        </button>
      )}
    </form>
  );
}
