export default function WelcomePage(){
    return (
        <div>
            <header className="bg-gradient-to-br from-cyan-500 to-cyan-600 h-[15vh] p-3">
                <div className="flex justify-between">
                    <div className="font-bold">
                        <h1 className="text-3xl text-amber-500 mb-5">テックブログ共有アプリ</h1>
                        <p className="text-white text-2xl">×エンジニア同士で有益な記事を共有しよう</p>
                    </div>
                    <nav>
                        <ul className="flex gap-5 text-white font-bold p-10">
                            <li className="hover:text-amber-400">利用説明</li>
                            <li className="hover:text-amber-400">新規登録</li>
                            <li className="hover:text-amber-400">ログイン</li>
                        </ul>
                    </nav>
                </div>
            </header>
        </div>
    )
}
