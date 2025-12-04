import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkBreaks from 'remark-breaks'
import 'github-markdown-css/github-markdown.css'

type Props = {
  content: string
  className?: string
}

export function MarkdownPreview({ content, className }: Props) {
  return (
    <div
      className={`
        markdown-body
        [&_ul]:list-disc [&_ul]:pl-6
        [&_ol]:list-decimal [&_ol]:pl-6
        ${className ?? ''}
      `}
    >
      <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]}>
        {content || '_まだ本文が入力されていません_'}
      </ReactMarkdown>
    </div>
  )
}