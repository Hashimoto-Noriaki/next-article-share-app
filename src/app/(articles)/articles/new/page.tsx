export default function NewArticlePage() {
  return (
    <div className="flex flex-col min-h-screen">
        {/* ヘッダー */}
        <header className="bg-gradient-to-r from-cyan-300 to-cyan-400 p-4">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-white">記事を投稿</h1>
                <button
                    type="submit"
                    className="rounded-md px-6 py-2.5 font-semibold text-white bg-emerald-600 hover:bg-emerald-500 shadow-sm transition"
                >
                    投稿する
                </button>
            </div>
        </header>
    <main className="w-full max-x-10xl px-6 py-3">
        <form className="space-y-3">
          {/* タイトル */}
          <input
            name="title"
            placeholder="タイトルを入力してください"
            className="w-full text-xl p-2 border border-slate-100 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-200"
          />

          {/* タグ */}
          <input
            name="tags"
            placeholder="タグを入力してください。スペース区切りで複数入力できます"
            className="w-full text-base p-1 border border-slate-100 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-200"
          />

          {/* 本文（Markdown） */}
          <div className="flex flex-col lg:flex-row gap-4">
            <textarea
              name="body"
              placeholder="エンジニアに関わる知識をMarkdown記法で書いて共有しよう"
              className="w-full min-h-[600px] p-4 border border-slate-200 rounded-md font-mono text-base leading-7 focus:outline-none focus:ring-2 focus:ring-slate-200"
            />
          </div>
        </form>
      </main>
    </div>
  )
}
