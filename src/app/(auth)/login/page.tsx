import Link from 'next/link';
import { FaLaptopCode } from 'react-icons/fa';

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center p-20 max-h-screen">
      <div className="bg-gradient-to-r from-cyan-400 to-cyan-500 px-16 py-24 text-center w-full  max-w-md rounded-md">
        <h1 className="text-2xl flex items-center text-white font-bold">
          <FaLaptopCode />
          テックブログ共有アプリ
        </h1>
        <h2 className="text-xl text-white font-bold mt-3">ログイン</h2>
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
          <button className="bg-emerald-600 text-white  font-bold rounded-lg p-5 mt-5 hover:bg-emerald-500">
            ログイン
          </button>
          <Link
            href="/signup"
            className="text-center underline mt-5 hover:text-cyan-800"
          >
            新規登録はこちら
          </Link>
        </form>
      </div>
    </div>
  );
}
