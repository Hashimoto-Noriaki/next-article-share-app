import Link from 'next/link';
import { FaLaptopCode } from 'react-icons/fa';
import InputForm from '../../../shared/components/atoms/InputForm';
import SignupButton from '../../../shared/components/atoms/SignupButton';

export default function SignUpPage() {
  return (
    <div className="flex items-center justify-center p-20 max-h-screen">
      <div className="bg-gradient-to-r from-cyan-400 to-cyan-500 px-16 py-24 text-center w-full  max-w-md rounded-md">
        <h1 className="text-2xl flex items-center text-white font-bold">
          <FaLaptopCode />
          テックブログ共有アプリ
        </h1>
        <h2 className="text-xl text-white font-bold mt-3">新規登録</h2>
        <form className="flex flex-col gap-5 text-left">
          <div>
            <p className="font-bold mb-3">名前</p>
            <InputForm name="name" placeholder="例)山田太郎(ニックネーム可)" />
          </div>
          <div>
            <p className="font-bold mb-3">メールアドレス</p>
            <InputForm name="email" placeholder="メールアドレス" />
          </div>
          <div>
            <p className="font-bold mb-3">パスワード</p>
            <InputForm type="password" placeholder="パスワード" />
          </div>
          <SignupButton>
            新規登録
          </SignupButton>
          <Link
            href="/login"
            className="text-center underline mt-5 hover:text-cyan-800"
          >
            ログインはこちら
          </Link>
        </form>
      </div>
    </div>
  );
}
