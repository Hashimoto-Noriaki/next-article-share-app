type Props = {
  onPublish: () => void
}

export function ArticleHeader({ onPublish }: Props) {
  return (
    <header className="bg-gradient-to-r from-cyan-500 to-cyan-600 border-slate-200 px-5 py-4 flex justify-between shadow-sm">
      <h1 className="text-2xl font-bold text-white">記事を投稿</h1>
      <button
        onClick={onPublish}
        className="bg-emerald-500 hover:bg-emerald-400 text-white font-semibold px-6 py-2.5 rounded-md shadow transition"
      >
        公開設定へ
      </button>
    </header>
  )
}