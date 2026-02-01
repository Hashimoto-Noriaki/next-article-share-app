import { UserDropdown } from '../UserDropdown';

type Props = {
  onPublish: () => void;
  onSaveDraft: () => void;
  isSubmitting?: boolean;
  isDraftSubmitting?: boolean;
  userId: string;
  userName: string;
  userImage?: string | null;
};

export function NewArticleHeader({
  onPublish,
  onSaveDraft,
  isSubmitting,
  isDraftSubmitting,
  userId,
  userName,
  userImage,
}: Props) {
  return (
    <header className="bg-linear-to-r from-cyan-500 to-cyan-600 border-slate-200 px-5 py-4 flex justify-between shadow-sm">
      <h1 className="text-2xl font-bold text-white">記事を投稿</h1>
      <div className="flex items-center gap-3 font-bold text-white">
        <button
          onClick={onSaveDraft}
          disabled={isSubmitting}
          className="bg-gray-500 hover:bg-gray-400 text-white font-semibold px-6 py-2.5 rounded-md shadow transition"
        >
          {isDraftSubmitting ? '保存中...' : '下書き保存'}
        </button>
        <button
          onClick={onPublish}
          disabled={isSubmitting}
          className="bg-emerald-500 hover:bg-emerald-400 disabled:bg-gray-400 text-white font-semibold px-6 py-2.5 rounded-md shadow transition"
        >
          {isSubmitting ? '投稿中...' : '公開設定へ'}
        </button>
        <UserDropdown
          userId={userId}
          userName={userName}
          userImage={userImage}
        />
      </div>
    </header>
  );
}
