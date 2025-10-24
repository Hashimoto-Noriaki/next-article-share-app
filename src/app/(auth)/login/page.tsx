import Link from 'next/link';
import { FaLaptopCode } from 'react-icons/fa';
import LoginButton from '../../../shared/components/atoms/LoginButton'
import InputForm from '../../../shared/components/atoms/InputForm'

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
            <InputForm
              name="email"
              placeholder="メールアドレス"
            />
          </div>
          <div>
            <p className="font-bold mb-3">パスワード</p>
            <InputForm
              type="password"
              placeholder="パスワード"
            />
          </div>
          <LoginButton>ログイン</LoginButton>
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
