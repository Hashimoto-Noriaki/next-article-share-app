export default function LoginPage() {
    return (
        <div className="flex items-center justify-center p-10 max-h-screen">
            <div className="bg-gradient-to-r from-cyan-400 to-cyan-600 px-16 py-24 text-center w-full  max-w-md rounded-md">
                <h1 className="text-3xl text-white font-bold">テックブログ共有アプリ</h1>
                <h2 className="text-2xl text-white font-bold mt-3">ログイン</h2>
                <form className="flex flex-col gap-5 text-left">
                    <div>
                        <p className="font-bold mb-3">メールアドレス</p>
                        <input
                            name="email"
                            className="w-full p-3 border border-cyan-900 bg-white rounded-lg focus:outline-none focus:ring-cyan-900"
                            placeholder="メールアドレス"
                        />
                    </div>
                    <div>
                        <p className="font-bold mb-3">パスワード</p>
                        <input
                            type="password"
                            className="w-full p-3 border border-cyan-800 bg-white rounded-lg focus:outline-none qfocus:ring-cyan-800"
                            placeholder="パスワード"
                        />
                    </div>
                </form>
            </div>
        </div>
    )
}