import Link from 'next/link';
import Footer from '../../../shared/components/footer';

export default function ArticleList() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-gradient-to-br from-cyan-500 to-cyan-600 h-[15vh] p-3">
        <div className="flex justify-between">
          <div className="font-bold">
            <h1 className="text-3xl text-amber-500 mb-5">
              テックブログ共有アプリ
            </h1>
            <p className="text-white text-2xl">
              ×エンジニア同士で有益な記事を共有しよう
            </p>
          </div>
          <nav>
            <ul className="flex gap-5 text-white text-lg font-bold p-10">
              <li>
                <Link href="/guide" className="hover:text-amber-400">
                  利用説明
                </Link>
              </li>
              <li>
                <Link href="/articles/new" className="hover:text-amber-400">
                  新規投稿
                </Link>
              </li>
              <li>
                <Link href="/" className="hover:text-amber-400">
                  マイページ
                </Link>
              </li>
              <li>
                <Link href="/" className="hover:text-amber-400">
                  ログアウト
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>
      <main className="flex-grow flex flex-col items-center justify-start mt-5">
        <div className="bg-gradient-to-r from-rose-300 to-cyan-600 px-8 py-12 font-bold text-white w-full max-w-5xl text-center rounded-lg shadow-lg">
          <h1 className="text-5xl">テックブログ共有アプリ</h1>
          <p className="text-3xl mt-5">
            ×エンジニア同士で有益な記事を共有しよう
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-5 mt-5">
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
  );
}
