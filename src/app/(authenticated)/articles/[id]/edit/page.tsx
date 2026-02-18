'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { MarkdownEditor } from '@/features/articles/components/MarkdownEditor';
import { UserDropdown } from '@/features/articles/components/UserDropdown';
import { useCurrentUser } from '@/shared/hooks';
import Link from 'next/link';

type FieldErrors = {
  title?: string;
  content?: string;
  tags?: string;
};

export default function ArticleEditPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [title, setTitle] = useState('');
  const [tags, setTags] = useState('');
  const [body, setBody] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [errors, setErrors] = useState<FieldErrors>({});

  // ユーザー情報（TanStack Query）
  const { data: user, isLoading: isUserLoading, isError } = useCurrentUser();

  // 認証エラー時はログインページへ
  useEffect(() => {
    if (isError) {
      router.push('/login');
    }
  }, [isError, router]);

  // 記事を取得
  useEffect(() => {
    const fetchArticle = async () => {
      const res = await fetch(`/api/articles/${id}`);
      if (!res.ok) {
        setErrors({ title: '記事が見つかりません' });
        setIsLoading(false);
        return;
      }
      const article = await res.json();
      setTitle(article.title);
      setTags(article.tags.join(' '));
      setBody(article.content);
      setIsLoading(false);
    };

    fetchArticle();
  }, [id]);

  const handleUpdate = async () => {
    setErrors({});
    setIsSubmitting(true);

    const tagArray = tags
      .trim()
      .split(/\s+/)
      .filter((tag) => tag.length > 0);

    const res = await fetch(`/api/articles/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title,
        content: body,
        tags: tagArray,
      }),
    });

    const data = await res.json();
    setIsSubmitting(false);

    if (!res.ok) {
      if (data.errors && Array.isArray(data.errors)) {
        const fieldErrors: FieldErrors = {};
        data.errors.forEach((err: { path: string[]; message: string }) => {
          const field = err.path[0] as keyof FieldErrors;
          if (field && !fieldErrors[field]) {
            fieldErrors[field] = err.message;
          }
        });
        setErrors(fieldErrors);
      }
      return;
    }

    router.push(`/articles/${id}`);
    router.refresh();
  };

  if (isLoading || isUserLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p>読み込み中...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <header className="bg-linear-to-r from-cyan-500 to-cyan-600 px-5 py-4 flex justify-between items-center">
        <Link
          href={`/articles/${id}`}
          className="text-white font-bold text-xl hover:underline"
        >
          ← 戻る
        </Link>
        <h1 className="text-2xl font-bold text-white">記事を編集</h1>
        <div className="flex items-center gap-3 text-white">
          <button
            onClick={handleUpdate}
            disabled={isSubmitting}
            className="bg-emerald-500 hover:bg-emerald-400 disabled:bg-gray-400 text-white font-semibold px-6 py-2 rounded-md"
          >
            {isSubmitting ? '更新中...' : '更新する'}
          </button>
          <UserDropdown
            userId={user?.id || ''}
            userName={user?.name || ''}
            userImage={user?.image || null}
          />
        </div>
      </header>
      <main className="grow container mx-auto px-5 py-5">
        <MarkdownEditor
          title={title}
          onTitleChange={setTitle}
          tags={tags}
          onTagsChange={setTags}
          body={body}
          onBodyChange={setBody}
          errors={errors}
        />
      </main>
    </div>
  );
}
