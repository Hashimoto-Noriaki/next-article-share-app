
import Footer from '../../../../shared/components/footer'

export default function ArticleList() {
    return (
        <div className="flex flex-col min-h-screen">
            <main className="flex-grow flex flex-col items-center justify-start mt-5">
                <div className="bg-gradient-to-r from-rose-300 to-cyan-600 px-8 py-12 font-bold text-white w-full max-w-5xl text-center rounded-lg shadow-lg">
                <h1 className="text-5xl">テックブログ共有アプリ</h1>
                <p className="text-3xl mt-5">
                    ×エンジニア同士で有益な記事を共有しよう
                </p>
                </div>
            </main>
            <Footer/>
        </div>
    )
}
