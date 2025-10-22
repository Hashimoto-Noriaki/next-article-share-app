// import { Button } from '@/shared/components/ui/button'
// import { Input } from '@/shared/components/ui/input'
import Footer from '@/shared/components/footer'

export default function NewArticlePage() {
    return (
        <div className="flex flex-col min-h-screen">
            <main className="flex-grow container mx-auto px-4 py-8 max-w-4xl">
            <h1 className="text-3xl font-bold mb-8">記事を投稿</h1>

            <form className="space-y-6">
                {/* タイトル */}
                <div>
                <label className="block text-lg font-medium mb-2">
                    タイトル
                </label>
                <input
                    placeholder="記事のタイトルを入力"
                    className="text-lg"
                />
                </div>

                {/* タグ */}
                <div>
                <label className="block text-lg font-medium mb-2">
                    タグ
                </label>
                <input
                    placeholder="Next.js, React, TypeScript（カンマ区切り）"
                />
                <p className="text-sm text-gray-500 mt-1">
                    カンマ（,）で区切って複数のタグを入力できます
                </p>
                </div>

                {/* 本文 */}
                <div>
                <label className="block text-lg font-medium mb-2">
                    本文（Markdown記法）
                </label>
                <textarea
                    placeholder="# 見出し&#10;&#10;本文を入力してください..."
                    className="w-full min-h-[400px] p-3 border rounded-md font-mono"
                />
                </div>

                {/* ボタン */}
                <div className="flex gap-4">
                <button
                    type="submit"
                    className="flex-1 bg-green-600 hover:bg-green-700"
                >
                    投稿する
                </button>
                <button
                    type="button"
                    variant="outline"
                    className="flex-1"
                >
                    キャンセル
                </button>
                </div>
            </form>
            </main>
            <Footer />
        </div>
    )
}