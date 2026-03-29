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
  draftId: string;
  initialTitle: string;
  initialTags: string;
  initialBody: string;
};

export function DraftEditForm({
  draftId,
  initialTitle,
  initialTags,
  initialBody,
}: Props) {
  const router = useRouter();
  const [title, setTitle] = useState(initialTitle);
  const [tags, setTags] = useState(initialTags);
  const [body, setBody] = useState(initialBody);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});

  const { data: user } = useCurrentUser();

  const handleResult = (
    result:
      | {
          success: false;
          errors?: { path: PropertyKey[]; message: string }[];
          error?: string;
        }
      | { success: true },
    onSuccess: () => void,
  ) => {
    if (!result.success) {
      if ('errors' in result && Array.isArray(result.errors)) {
        const fieldErrors: FieldErrors = {};
        result.errors.forEach((err) => {
          const field = String(err.path[0]) as keyof FieldErrors;
          if (field && !fieldErrors[field]) fieldErrors[field] = err.message;
        });
        setErrors(fieldErrors);
      }
      return;
    }
    onSuccess();
  };

  const handleSaveDraft = async () => {
    setErrors({});
    setIsSubmitting(true);
    const tagArray = tags
      .trim()
      .split(/\s+/)
      .filter((tag) => tag.length > 0);

    try {
      const result = await updateArticleAction({
        articleId: draftId,
        title,
        content: body,
        tags: tagArray,
        isDraft: true,
      });
      handleResult(result, () => {
        router.push('/drafts');
        router.refresh();
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePublish = async () => {
    setErrors({});
    setIsPublishing(true);
    const tagArray = tags
      .trim()
      .split(/\s+/)
      .filter((tag) => tag.length > 0);

    try {
      const result = await updateArticleAction({
        articleId: draftId,
        title,
        content: body,
        tags: tagArray,
        isDraft: false,
      });
      handleResult(result, () => {
        router.push('/articles');
        router.refresh();
      });
    } finally {
      setIsPublishing(false);
    }
  };

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
        <div className="flex items-center gap-3 text-white">
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
