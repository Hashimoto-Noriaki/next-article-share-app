import ReturnButton from '../../shared/components/atoms/ReturnButton';

export default function GuidePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <div className="p-12 font-bold text-white rounded-lg shadow-md max-w-5xl w-full bg-linear-to-r from-rose-300 to-cyan-400">
        <h1 className="text-3xl font-bold mb-6 text-center">
          テックブログ共有アプリ について
        </h1>

        <p className="text-lg mb-4">
          このアプリは、QiitaやZennのように技術ブログをエンジニア同士で共有できるプラットフォームです。
        </p>

        <p className="text-lg mb-4">
          自分の学びや経験を記事として投稿し、他のエンジニアと共有してみましょう。
          アウトプットは、自分自身の成長にもつながります。
          投稿された記事は、誰でも検索して見つけることができます。
        </p>

        <p className="text-lg mb-4">
          現在は、お気に入りの記事をシェアする場として無料でご利用いただけます。
          将来的には、より多くのエンジニアが活用できるように機能を拡張していく予定です。
        </p>

        <p className="text-lg mb-6">
          有益な記事を共有し合い、エンジニア同士でスキルアップしていきましょう！
        </p>

        <div className="text-center mt-8">
          <p className="font-semibold">
            🎉 料金は一切不要です。安心してご利用ください。
          </p>
        </div>
      </div>
      <ReturnButton>戻る</ReturnButton>
    </div>
  );
}
