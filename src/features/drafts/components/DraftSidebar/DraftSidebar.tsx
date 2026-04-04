'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { deleteDraftAction } from '@/features/drafts/actions/draft.action';

type Draft = {
  id: string;
  title: string;
  content: string | null;
  tags: string[];
  updatedAt: string;
};

type Props = {
  drafts: Draft[];
  selectedId?: string;
};

export function DraftSidebar({ drafts, selectedId }: Props) {
  const router = useRouter();

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return '今日';
    if (days === 1) return '1 day ago';
    return `${days} days ago`;
  };

  const handleEdit = (id: string) => {
    router.push(`/drafts/${id}/edit`);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('この下書きを削除しますか？')) return;

    const result = await deleteDraftAction({ draftId: id });

    if (result.success) {
      router.push('/drafts');
      router.refresh();
    } else {
      alert(result.error || '削除に失敗しました');
    }
  };

  return (
    <aside className="w-[480px] bg-white border-r border-gray-200 shrink-0 flex flex-col h-full">
      <div className="p-5 flex-1 overflow-hidden flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold">下書き一覧</h1>
        </div>
        <div className="flex-1 overflow-y-auto space-y-4 pr-2">
          {drafts.length === 0 ? (
            <p className="text-gray-500 text-center py-8">下書きはありません</p>
          ) : (
            drafts.map((draft) => (
              <div
                key={draft.id}
                className={`p-4 rounded-lg border transition-colors ${
                  selectedId === draft.id
                    ? 'border-cyan-500 bg-cyan-50'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <Link href={`/drafts?id=${draft.id}`} className="block">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs bg-gray-700 text-white px-2 py-0.5 rounded">
                      記事
                    </span>
                    <span className="text-xs text-gray-500">
                      {formatDate(draft.updatedAt)}
                    </span>
                  </div>

                  <h3 className="font-bold mb-2 line-clamp-1">
                    {draft.title ? (
                      <span className="text-gray-900">{draft.title}</span>
                    ) : (
                      <span className="text-gray-400">タイトル未設定</span>
                    )}
                  </h3>

                  <p className="text-sm line-clamp-2 mb-3">
                    {draft.content ? (
                      <span className="text-gray-600">
                        {draft.content.slice(0, 100)}
                      </span>
                    ) : (
                      <span className="text-gray-400">本文未入力</span>
                    )}
                  </p>
                </Link>

                <div className="flex gap-3">
                  <button
                    onClick={() => handleEdit(draft.id)}
                    className="flex items-center gap-1.5 px-4 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                  >
                    編集する ✏️
                  </button>
                  <button
                    onClick={() => handleDelete(draft.id)}
                    className="flex items-center gap-1.5 px-4 py-2 text-sm border border-red-300 text-red-600 rounded hover:bg-red-50 transition-colors"
                  >
                    下書きを削除する 🗑️
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </aside>
  );
}
