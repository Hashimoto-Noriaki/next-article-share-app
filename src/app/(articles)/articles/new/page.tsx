export default function NewArticlePage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <main className="w-full max-x-10xl px-6 py-8">
        {/* ヘッダー */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">記事を投稿</h1>
          <button
            type="submit"
            className="rounded-md px-6 py-2.5 font-semibold text-white bg-emerald-600 hover:bg-emerald-500 shadow-sm transition"
          >
            投稿する
          </button>
        </div>

        <form className="space-y-6">
          {/* タイトル */}
          <input
            name="title"
            placeholder="タイトルを入力してください"
            className="w-full text-xl p-3 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-400"
          />

          {/* タグ */}
          <input
            name="tags"
            placeholder="タグを入力してください。スペース区切りで複数入力できます"
            className="w-full text-base p-3 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-400"
          />

          {/* 本文（Markdown） */}
          <div className="flex flex-col lg:flex-row gap-4">
            <textarea
              name="body"
              placeholder="エンジニアに関わる知識をMarkdown記法で書いて共有しよう"
              className="w-full min-h-[600px] p-4 border border-slate-200 rounded-md font-mono text-base leading-7 focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-slate-50"
            />
            {/* プレビューエリア（後で追加する用） */}
            {/* <div className="hidden lg:block w-1/2 border border-slate-200 rounded-md p-4 bg-white overflow-auto">
              <MarkdownPreview content={watch("body")} />
            </div> */}
          </div>
        </form>
      </main>
    </div>
  )
}
