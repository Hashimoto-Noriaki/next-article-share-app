'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { MarkdownEditor } from '@/features/articles/components';
import Link from 'next/link';

export default function ArticleEditPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [title, setTitle] = useState('');
  const [tags, setTags] = useState('');
  const [body, setBody] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // 記事データを取得
  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const res = await fetch(`/api/articles/${id}`);
        if (!res.ok) {
          setError('記事が見つかりません');
          return;
        }

        const article = await res.json();
        setTitle(article.title);
        setTags(article.tags.join(' '));
        setBody(article.content);
      } catch (err) {
        console.error('記事取得エラー:', err);
        setError('記事の取得に失敗しました');
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

  const handleUpdate = async () => {
    setError('');
    setIsSubmitting(true);

    try {
      /**
       * タグ文字列を配列に変換
       * trim(): 前後の空白を削除
       * split(/\s+/): 1つ以上の空白で分割
       * filter(): 空文字を除去
       */
      const tagArray = tags
        .trim()
        .split(/\s+/)
        .filter((tag) => tag.length > 0);

      const res = await fetch(`/api/articles/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          content: body,
          tags: tagArray,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.message || '更新に失敗しました');
        return;
      }

      router.push(`/articles/${id}`);
      router.refresh();
    } catch (err) {
      console.error('更新エラー:', err);
      setError('更新に失敗しました');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p>読み込み中...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <header className="bg-linear-to-r from-cyan-500 to-cyan-600 px-5 py-4 flex justify-between items-center">
        <Link href={`/articles/${id}`} className="text-white hover:underline">
          ← 戻る
        </Link>
        <h1 className="text-2xl font-bold text-white">記事を編集</h1>
        <button
          onClick={handleUpdate}
          disabled={isSubmitting}
          className="bg-emerald-500 hover:bg-emerald-400 disabled:bg-gray-400 text-white font-semibold px-6 py-2 rounded-md"
        >
          {isSubmitting ? '更新中...' : '更新する'}
        </button>
      </header>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 mx-5 mt-2 rounded">
          {error}
        </div>
      )}

      <main className="grow container mx-auto px-5 py-5">
        <MarkdownEditor
          title={title}
          onTitleChange={setTitle}
          tags={tags}
          onTagsChange={setTags}
          body={body}
          onBodyChange={setBody}
        />
      </main>
    </div>
  );
}
