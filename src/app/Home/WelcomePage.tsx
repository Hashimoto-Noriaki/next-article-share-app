export default function WelcomePage(){
    return (
        <div>
            <header>
                <div className="flex justify-between">
                    <div>
                        <h1>テックブログ共有アプリ</h1>
                        <p>エンジニア同士で有益な記事を共有しよう</p>
                    </div>
                    <nav>
                        <ul className="flex gap-5">
                            <li>利用説明</li>
                            <li>新規登録</li>
                            <li>ログイン</li>
                        </ul>
                    </nav>
                </div>
            </header>
        </div>
    )
}
