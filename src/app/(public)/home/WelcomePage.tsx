import Link from 'next/link';
import { FaLaptopCode } from 'react-icons/fa';
import { Footer } from '../../../shared/components/organisms/Footer';
import { Button } from '../../../shared/components/atoms/Button';
import { WelcomeHeader } from '../../../features/home/WelcomeHeader';
import styles from './WelcomePage.module.css';

export default function WelcomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <WelcomeHeader />
      <main className={styles.main}>
        <div className={styles.hero}>
          <h1 className={styles.heading}>
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
        <div className={styles.buttonGroup}>
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
