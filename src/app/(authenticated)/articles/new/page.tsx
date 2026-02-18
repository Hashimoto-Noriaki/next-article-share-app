'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MarkdownEditor } from '@/features/articles/components/MarkdownEditor';
import { NewArticleHeader } from '@/features/articles/components/NewArticleHeader';
import { useCurrentUser } from '@/shared/hooks';

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
  const [isDraftSubmitting, setIsDraftSubmitting] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});

  // ユーザー情報（TanStack Query）
  const { data: user, isLoading: isUserLoading, isError } = useCurrentUser();

  // 認証エラー時はログインページへ
  useEffect(() => {
    if (isError) {
      router.push('/login');
    }
  }, [isError, router]);

  const handleSubmit = async (isDraft: boolean) => {
    setErrors({});

    if (isDraft) {
      setIsDraftSubmitting(true);
    } else {
      setIsSubmitting(true);
    }

    const tagArray = tags
      .trim()
      .split(/\s+/)
      .filter((tag) => tag.length > 0);

    const res = await fetch('/api/articles', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title,
        content: body,
        tags: tagArray,
        isDraft,
      }),
    });

    const data = await res.json();
    setIsSubmitting(false);
    setIsDraftSubmitting(false);

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

    if (isDraft) {
      router.push('/drafts');
    } else {
      router.push('/articles');
    }
    router.refresh();
  };

  const handlePublish = () => handleSubmit(false);
  const handleSaveDraft = () => handleSubmit(true);

  if (isUserLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p>読み込み中...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <NewArticleHeader
        onPublish={handlePublish}
        onSaveDraft={handleSaveDraft}
        isSubmitting={isSubmitting}
        isDraftSubmitting={isDraftSubmitting}
        userId={user?.id || ''}
        userName={user?.name || ''}
        userImage={user?.image || null}
      />
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
