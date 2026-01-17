import Link from 'next/link';

type Props = {
  id: string;
  title: string;
  tags: string[];
  updatedAt: Date;
};

export function DraftCard({ id, title, tags, updatedAt }: Props) {
  return (
    <Link href={`/drafts/${id}/edit`}>
      <article className="w-72 bg-white rounded-xl shadow-md hover:shadow-lg transition p-5 border-l-4 border-gray-400">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded">
            下書きよん
          </span>
        </div>
        <h2 className="text-lg font-bold text-gray-800 line-clamp-2">
          {title || 'タイトル未設定'}
        </h2>
        <div className="flex flex-wrap gap-2 mt-3">
          {tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="text-xs bg-cyan-100 text-cyan-700 px-2 py-1 rounded"
            >
              {tag}
            </span>
          ))}
        </div>
        <p className="text-xs text-gray-400 mt-4">
          更新日: {updatedAt.toLocaleDateString('ja-JP')}
        </p>
      </article>
    </Link>
  );
}
