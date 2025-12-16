import Link from 'next/link'

type Props = {
    id: string
    title: string
    tags: string[]
    authorName: string
    createdAt: Date
    likeCount: number
}

export function ArticleCard({
    id,
    title,
    tags,
    authorName,
    createdAt,
    likeCount,
}: Props) {
    return(
        <Link href={`/articles/${id}`}>
            <article className="w-72 bg-white rounded-xl shadow-md hover:shadow-lg transition p-5">
                <h2 className="text-lg font-bold text-gray-800 line-clamp-2">
                    {title}
                </h2>
                <div className="flex flex-wrap gap-2 mt-3">
                    {tags.slice(0, 3).map((tag) => (
                        <span
                            key={tag}
                            className="text-xs bg-cyan-100 text-cyan-700 px-2 py-1 rounded"
                            >
                            {tag}
                        </span>
                    ))}
                </div>
                <div className="flex justify-between items-center mt-4 text-sm text-gray-500">
                    <span>{authorName}</span>
                    <span>♥ {likeCount}</span>
                </div>
                <p className="text-xs text-gray-400 mt-2">
                    {createdAt.toLocaleDateString('ja-JP')}
                </p>
            </article>
        </Link>
    )
}