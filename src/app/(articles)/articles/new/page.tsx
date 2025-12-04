'use client';

import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import 'github-markdown-css/github-markdown.css';
import { ArticleHeader } from '@/features/articles/components/ArticleHeader'
import { MarkdownEditor } from '@/features/articles/components/MarkdownEditor'

export default function NewArticlePage() {
  const [title, setTitle] = useState('');
  const [tags, setTags] = useState('');
  const [body, setBody] = useState('');
  const [activeTab, setActiveTab] = useState<'edit' | 'preview' | 'split'>(
    'edit',
  );

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <ArticleHeader onPublish={()=> {}} />
        {/* TODO: 公開設定の実装は後ほど追加する */}
      <main className="flex-grow container mx-auto px-5 py-5 pt-1 w-[100%]">
        <MarkdownEditor
          title={title}
          onTitleChange={setTitle}
          tags={tags}
          onTagsChange={setTags}
          body={body}
          onBodyChange={setBody}
        />
      </main>
    </div>
  );
}
