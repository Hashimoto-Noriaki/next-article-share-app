import Link from 'next/link';
import { FaLaptopCode } from 'react-icons/fa';
import Footer from '../../shared/components/footer';
import LoginButton from '../../shared/components/atoms/LoginButton';
import SignupLeadButton from '../../shared/components/atoms/SignupLeadButton';

export default function WelcomePage() {
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
            <FaLaptopCode />
            テックブログ共有アプリ
          </h1>
          <p className="text-3xl mt-5">
            ×エンジニア同士で有益な記事を共有しよう
          </p>
        </div>
        <p className="text-center text-xl p-5">
          お気に入りの技術記事があれば投稿しよう🎵
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4 mt-3">
          <Link href="/login" className="w-64">
            <LoginButton>ログインはこちら</LoginButton>
          </Link>
          <Link href="/signup" className="w-64">
            <SignupLeadButton>
              新規登録はこちら
            </SignupLeadButton>
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
