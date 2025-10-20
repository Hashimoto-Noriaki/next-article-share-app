export default function LoginPage() {
    return (
        <div className="flex items-center justify-center p-20 max-h-screen">
            <div className="bg-gradient-to-r from-cyan-500 to-cyan-600 px-16 py-24 text-center w-full  max-w-md rounded-md">
                <h1 className="text-2xl text-white font-bold">テックブログ共有アプリ</h1>
                <h2 className="text-xl text-white font-bold mt-3">ログイン</h2>
                <form>
                    <div>
                        <p className="">メールアドレス</p>
                        <input
                            name="email"
                            className=""
                            placeholder="メールアドレス"
                        />
                    </div>
                    <div>
                        <p className="">パスワード</p>
                        <input
                            name="password"
                            className=""
                            placeholder="パスワード"
                        />
                    </div>
                </form>
            </div>
        </div>
    )
}