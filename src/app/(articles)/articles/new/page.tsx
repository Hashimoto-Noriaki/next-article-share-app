'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  NewArticleHeader,
  MarkdownEditor,
} from '@/features/articles/components';

type FieldErrors = {
  title?: string;
  content?: string;
  tags?: string;
};

export default function NewArticlePage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [tags, setTags] = useState('');
  const [body, setBody] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});

  const handlePublish = async () => {
    setErrors({});
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

      const res = await fetch('/api/articles', {
        method: 'POST',
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
    } catch (err) {
      console.error('投稿エラー:', err);
      setErrors({ title: '投稿に失敗しました' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <NewArticleHeader onPublish={handlePublish} isSubmitting={isSubmitting} />
      {/* {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 mx-5 mt-2 rounded">
          {error}
        </div>
      )} */}
      <main className="grow container mx-auto px-5 py-5 pt-1">
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
