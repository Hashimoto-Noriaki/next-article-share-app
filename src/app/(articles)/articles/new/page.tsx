'use client';

import { useState } from 'react';
import { NewArticleHeader,MarkdownEditor } from '@/features/articles/components'

export default function NewArticlePage() {
  const [title, setTitle] = useState('');
  const [tags, setTags] = useState('');
  const [body, setBody] = useState('');

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <NewArticleHeader onPublish={()=> {}} />
        {/* TODO: 公開設定の実装は後ほど追加する */}
      <main className="grow container mx-auto px-5 py-5 pt-1">
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
