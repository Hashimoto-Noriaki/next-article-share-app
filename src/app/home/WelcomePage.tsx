import Link from 'next/link';
import { FaLaptopCode } from 'react-icons/fa';
import { Footer } from '../../shared/components/organisms/Footer';
import { Button } from '../../shared/components/atoms/Button';
import { WelcomeHeader } from '../../features/home/WelcomeHeader';

export default function WelcomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <WelcomeHeader />
      <main className="grow flex flex-col items-center justify-center">
        <div className="bg-linear-to-r from-rose-300 to-cyan-600 px-16 py-24 font-bold text-white w-full max-w-5xl text-center rounded-lg shadow-lg">
          <h1 className="text-5xl flex items-center justify-center gap-3">
            <FaLaptopCode className="text-white" />
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
            <Button variant="primary">ログインはこちら</Button>
          </Link>
          <Link href="/signup" className="w-64">
            <Button variant="secondary">新規登録はこちら</Button>
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
