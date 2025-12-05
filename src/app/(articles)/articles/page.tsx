'use client'

import { ArticleListHeader } from '@/features/articles/components'
import Footer from '@/shared/components/footer'

export default function ArticleList() {
  return (
    <div className="flex flex-col min-h-screen">
      <ArticleListHeader />
      <main className="grow flex flex-col items-center justify-start mt-5">
        <div className="bg-leaner-to-r from-rose-300 to-cyan-600 px-8 py-12 font-bold text-white w-full max-w-5xl text-center rounded-lg shadow-lg">
          <h1 className="text-5xl">テックブログ共有アプリ</h1>
          <p className="text-3xl mt-5">
            エンジニア同士で有益な記事を共有しよう
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-5 mt-5">
          {/* TODO: ArticleCard コンポーネントに置き換え */}
          <p className="w-64 h-40 bg-rose-200 rounded-xl flex items-center justify-center">
            記事カード1
          </p>
          <p className="w-64 h-40 bg-cyan-200 rounded-xl flex items-center justify-center">
            記事カード2
          </p>
          <p className="w-64 h-40 bg-emerald-200 rounded-xl flex items-center justify-center">
            記事カード3
          </p>
        </div>
      </main>
      <Footer />
    </div>
  )
}