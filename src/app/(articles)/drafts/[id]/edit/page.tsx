'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { MarkdownEditor } from '@/features/articles/components/MarkdownEditor';
import Link from 'next/link';

type FieldErrors = {
  title?: string;
  content?: string;
  tags?: string;
};

export default function DraftEditPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [title, setTitle] = useState('');
  const [tags, setTags] = useState('');
  const [body, setBody] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [errors, setErrors] = useState<FieldErrors>({});

  useEffect(() => {
    const fetchDraft = async () => {
      const res = await fetch(`/api/articles/${id}`);
      if (!res.ok) {
        setErrors({ title: '下書きが見つかりません' });
        setIsLoading(false);
        return;
      }
      const draft = await res.json();
      setTitle(draft.title || '');
      setTags(draft.tags?.join(' ') || '');
      setBody(draft.content || '');
      setIsLoading(false);
    };

    fetchDraft();
  }, [id]);

  const handleSaveDraft = async () => {
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
        isDraft: true,
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

    router.push('/drafts');
    router.refresh();
  };

  const handlePublish = async () => {
    setErrors({});
    setIsPublishing(true);

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
        isDraft: false,
      }),
    });

    const data = await res.json();
    setIsPublishing(false);

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

    router.push('/articles');
    router.refresh();
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
        <Link
          href="/drafts"
          className="text-white font-bold text-xl hover:underline"
        >
          ← 下書き一覧に戻る
        </Link>
        <h1 className="text-2xl font-bold text-white">下書きを編集</h1>
        <div className="flex gap-3">
          <button
            onClick={handleSaveDraft}
            disabled={isSubmitting || isPublishing}
            className="bg-gray-500 hover:bg-gray-400 disabled:bg-gray-400 text-white font-semibold px-6 py-2 rounded-md"
          >
            {isSubmitting ? '保存中...' : '下書き保存'}
          </button>
          <button
            onClick={handlePublish}
            disabled={isSubmitting || isPublishing}
            className="bg-emerald-500 hover:bg-emerald-400 disabled:bg-gray-400 text-white font-semibold px-6 py-2 rounded-md"
          >
            {isPublishing ? '公開中...' : '公開する'}
          </button>
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
