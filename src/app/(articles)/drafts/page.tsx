import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { verifyToken } from '@/lib/jwt';
import Link from 'next/link';
import { DraftSidebar } from '@/features/drafts/components/DraftSidebar';
import { MarkdownPreview } from '@/shared/components/molecules/MarkdownPreview';

type Props = {
  searchParams: Promise<{ id?: string }>;
};

export default async function DraftsPage({ searchParams }: Props) {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    redirect('/login');
  }

  const payload = await verifyToken(token);
  if (!payload) {
    redirect('/login');
  }

  const drafts = await prisma.article.findMany({
    where: {
      authorId: payload.userId,
      isDraft: true,
    },
    orderBy: { updatedAt: 'desc' },
  });

  const { id: selectedId } = await searchParams;
  const selectedDraft = selectedId
    ? drafts.find((d) => d.id === selectedId)
    : drafts[0];

  const serializedDrafts = drafts.map((draft) => ({
    id: draft.id,
    title: draft.title,
    content: draft.content,
    tags: draft.tags,
    updatedAt: draft.updatedAt.toISOString(),
  }));

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-gradient-to-r from-cyan-500 to-cyan-600 px-5 py-4">
        <Link
          href="/articles"
          className="text-white font-bold text-xl hover:underline"
        >
          ← 記事一覧に戻る
        </Link>
      </header>

      <div className="flex h-[calc(100vh-56px)]">
        <DraftSidebar
          drafts={serializedDrafts}
          selectedId={selectedDraft?.id}
        />

        <main className="flex-1 overflow-y-auto">
          {selectedDraft && (
            <article className="h-full p-8">
              <div className="bg-white rounded-lg shadow p-8 h-full overflow-y-auto">
                <span className="inline-block text-xs bg-gray-700 text-white px-2 py-0.5 rounded mb-4">
                  記事
                </span>

                <h1 className="text-4xl font-bold mb-4">
                  {selectedDraft.title ? (
                    <span className="text-gray-900">{selectedDraft.title}</span>
                  ) : (
                    <span className="text-gray-400">タイトル未設定</span>
                  )}
                </h1>

                {selectedDraft.tags && selectedDraft.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-6">
                    {selectedDraft.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 text-sm border border-gray-300 rounded-full text-gray-600"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {selectedDraft.content && (
                  <>
                    <hr className="my-6" />
                    <MarkdownPreview content={selectedDraft.content} />
                  </>
                )}
              </div>
            </article>
          )}
        </main>
      </div>
    </div>
  );
}
