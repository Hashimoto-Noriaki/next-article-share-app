import ArticleReturnButton from '../../shared/components/atoms/ArticleReturnButton';

export default function TutorialPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen p-6">
      <div className="p-5 font-bold text-white rounded-md shadow-md max-w-5xl w-full bg-linear-to-r from-rose-300 to-cyan-400">
        <h1 className="text-3xl font-bold mb-8 text-center">
          テックブログ共有アプリの使い方ガイド
        </h1>

        <p className="text-lg mb-6">
          このアプリは、QiitaやZennのようにエンジニア同士で技術記事を投稿・共有できるプラットフォームです。
          あなたの知識や経験を発信し、他のエンジニアと学びを共有しましょう。
        </p>
        <h2 className="text-2xl font-semibold mb-3">✍️ Step 1. 記事を投稿しよう</h2>
        <p className="text-lg mb-6">
          ナビゲーションの「新規投稿」から記事投稿画面を開きます。
          タイトル・タグ・本文を入力して、自分の知識をMarkdown形式で投稿しましょう。
          プレビュー機能もあるので、見た目を確認できます。
        </p>

        <h2 className="text-2xl font-semibold mb-3">🔖 Step 2. 気になる記事をストック</h2>
        <p className="text-lg mb-6">
          他のエンジニアが投稿した記事は、一覧画面から自由に閲覧できます。
          役立つ記事を見つけたら、「ストック」ボタンでお気に入りに保存しましょう。
          ストックした記事はマイページからいつでも確認できます。
        </p>

        <h2 className="text-2xl font-semibold mb-3">👤 Step 3. マイページを活用しよう</h2>
        <p className="text-lg mb-6">
          マイページでは、自分が投稿した記事・ストックした記事・下書きがまとめて確認できます。
          プロフィールや設定の変更もここから行えます。
        </p>

        <h2 className="text-2xl font-semibold mb-3">🚀 Step 4. スキルを共有して成長しよう</h2>
        <p className="text-lg mb-6">
          投稿を通じて知識を整理したり、他のエンジニアの記事から新しい学びを得ましょう。
          このアプリは完全無料で利用でき、誰でも気軽に技術を発信できます。
        </p>

        <div className="text-center mt-8">
          <p className="font-semibold text-lg">
            🎉 あなたの知識が、誰かの成長につながります！
          </p>
        </div>
      </div>
      <ArticleReturnButton>戻る</ArticleReturnButton>
    </div>
  );
}
