type Props = {
  onPublish: () => void;
  isSubmitting?: boolean;
};

export function NewArticleHeader({ onPublish,isSubmitting }: Props) {
  return (
    <header className="bg-linear-to-r from-cyan-500 to-cyan-600 border-slate-200 px-5 py-4 flex justify-between shadow-sm">
      <h1 className="text-2xl font-bold text-white">記事を投稿</h1>
      <button
        onClick={onPublish}
        disabled={isSubmitting}
        className="bg-emerald-500 hover:bg-emerald-400 text-white font-semibold px-6 py-2.5 rounded-md shadow transition"
      >
        {isSubmitting ? '投稿中...' : '公開設定へ'}
      </button>
    </header>
  );
}
