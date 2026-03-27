'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MarkdownEditor } from '@/features/articles/components/MarkdownEditor';
import { NewArticleHeader } from '@/features/articles/components/NewArticleHeader';
import { useCurrentUser } from '@/shared/hooks';
import { createArticleAction } from '@/features/articles/actions/article.action';

type FieldErrors = {
  title?: string;
  content?: string;
  tags?: string;
};

export function NewArticleForm() {
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

    try {
      const result = await createArticleAction({
        title,
        content: body,
        tags: tagArray,
        isDraft,
      });

      if (!result.success) {
        if ('errors' in result && Array.isArray(result.errors)) {
          const fieldErrors: FieldErrors = {};
          result.errors.forEach(
            (err: { path: PropertyKey[]; message: string }) => {
              const field = String(err.path[0]) as keyof FieldErrors;
              if (field && !fieldErrors[field])
                fieldErrors[field] = err.message;
            },
          );
          setErrors(fieldErrors);
        }
        return;
      }

      router.push(isDraft ? '/drafts' : '/articles');
      router.refresh();
    } finally {
      setIsSubmitting(false);
      setIsDraftSubmitting(false);
    }
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
