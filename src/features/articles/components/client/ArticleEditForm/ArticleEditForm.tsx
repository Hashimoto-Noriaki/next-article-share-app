'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { MarkdownEditor } from '@/features/articles/components/MarkdownEditor';
import { UserDropdown } from '@/features/articles/components/UserDropdown';
import { useCurrentUser } from '@/shared/hooks';
import { updateArticleAction } from '@/features/articles/actions/article.action';

type FieldErrors = {
  title?: string;
  content?: string;
  tags?: string;
};

type Props = {
  articleId: string;
  initialTitle: string;
  initialTags: string;
  initialBody: string;
};

export function ArticleEditForm({
  articleId,
  initialTitle,
  initialTags,
  initialBody,
}: Props) {
  const router = useRouter();
  const [title, setTitle] = useState(initialTitle);
  const [tags, setTags] = useState(initialTags);
  const [body, setBody] = useState(initialBody);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});

  const { data: user } = useCurrentUser();

  const handleUpdate = async () => {
    setErrors({});
    setIsSubmitting(true);

    const tagArray = tags
      .trim()
      .split(/\s+/)
      .filter((tag) => tag.length > 0);

    try {
      const result = await updateArticleAction({
        articleId,
        title,
        content: body,
        tags: tagArray,
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

      router.push(`/articles/${articleId}`);
      router.refresh();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <header className="bg-linear-to-r from-cyan-500 to-cyan-600 px-5 py-4 flex justify-between items-center">
        <Link
          href={`/articles/${articleId}`}
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
