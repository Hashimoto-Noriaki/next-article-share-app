import Link from 'next/link'

export default function WelcomePage(){
    return (
        <div className="flex flex-col min-h-screen">
            <header className="bg-gradient-to-br from-cyan-500 to-cyan-600 h-[15vh] p-3">
                <div className="flex justify-between">
                    <div className="font-bold">
                        <h1 className="text-3xl text-amber-500 mb-5">テックブログ共有アプリ</h1>
                        <p className="text-white text-2xl">×エンジニア同士で有益な記事を共有しよう</p>
                    </div>
                    <nav>
                        <ul className="flex gap-5 text-white text-lg font-bold p-10">
                            <li>
                                <Link href="/guide" className="hover:text-amber-400">
                                    利用説明
                                </Link>
                            </li>
                            <li>
                                <Link href="/signup" className="hover:text-amber-400">
                                    新規登録
                                </Link>
                            </li>
                            <li>
                                <Link href="/login" className="hover:text-amber-400">
                                    ログイン
                                </Link>
                            </li>
                        </ul>
                    </nav>
                </div>
            </header>
            <main className="flex-grow flex flex-col items-center justify-center">
                <div className="bg-gradient-to-r from-rose-300 to-cyan-600 px-16 py-24 font-bold text-white w-full max-w-5xl text-center rounded-lg shadow-lg">
                    <h1 className="text-5xl">
                        テックブログ共有アプリ
                    </h1>
                    <p className="text-3xl mt-5">
                        ×エンジニア同士で有益な記事を共有しよう
                    </p>
                </div>
                <p className="text-center text-2xl p-5">お気に入りの技術記事があれば投稿しよう🎵</p>
            </main>
            <footer className="bg-gradient-to-r from-cyan-500 to-cyan-600 p-4">
                <p className="text-white text-center font-bold">© 2025 テックブログ共有アプリ</p>
            </footer>
        </div>
    )
}
