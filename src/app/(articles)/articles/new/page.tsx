'use client';

import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import 'github-markdown-css/github-markdown.css';

export default function NewArticlePage() {
  const [title, setTitle] = useState('');
  const [tags, setTags] = useState('');
  const [body, setBody] = useState('');
  const [activeTab, setActiveTab] = useState<'edit' | 'preview' | 'split'>('edit');

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <header className="bg-white border-b border-slate-200 px-6 py-3 flex justify-between items-center shadow-sm">
                <h1 className="text-2xl font-bold text-slate-700">記事を投稿</h1>
                <button className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-6 py-2.5 rounded-md shadow transition">
                    公開設定へ
                </button>
            </header>
            <main className="flex-grow container mx-auto px-6 py-6 max-w-[1400px]">
                <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="タイトルを入力してください"
                    className="w-full text-2xl font-semibold border border-slate-200 rounded-md p-3 mb-3 focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-white"
                />
                <input
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    placeholder="タグを入力してください。スペース区切りで5つまで入力できます。"
                    className="w-full border border-slate-200 rounded-md p-2 text-base focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-white"
                />
                <div className="flex items-center gap-2 mb-2 border-b border-slate-200 pb-2">
                    <button
                        onClick={() => setActiveTab('edit')}
                        className={`px-3 py-1.5 rounded-t-md font-medium text-sm ${
                            activeTab === 'edit'
                            ? 'text-emerald-600 border-b-2 border-emerald-500'
                            : 'text-slate-600 hover:text-slate-800'
                        }`}
                    >
                        本文
                    </button>
                    <button
                        onClick={() => setActiveTab('preview')}
                        className={`px-3 py-1.5 rounded-t-md font-medium text-sm ${
                        activeTab === 'preview'
                            ? 'text-emerald-600 border-b-2 border-emerald-500'
                            : 'text-slate-600 hover:text-slate-800'
                        }`}
                    >
                        プレビュー
                    </button>
                    <button
                        onClick={() => setActiveTab('split')}
                        className={`px-3 py-1.5 rounded-t-md font-medium text-sm ${
                        activeTab === 'split'
                            ? 'text-emerald-600 border-b-2 border-emerald-500'
                            : 'text-slate-600 hover:text-slate-800'
                        }`}
                    >
                        2ペイン
                    </button>
                    <span className="ml-auto text-xs text-slate-400">
                        {body.length} 文字
                    </span>
                </div>

                {activeTab === 'edit' && (
                <textarea
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    placeholder="エンジニアに関わる知識をMarkdown記法で書いて共有しよう"
                    className="w-full min-h-[600px] p-4 border border-slate-200 rounded-md font-mono text-base leading-7 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-400"
                />
                )}

                {activeTab === 'preview' && (
                    <div className="w-full min-h-[600px] p-6 border border-slate-200 rounded-md bg-white overflow-auto
                        [&_ul]:list-disc [&_ul]:pl-6
                        [&_ol]:list-decimal [&_ol]:pl-6
                    ">
                        <div className="markdown-body">
                        <ReactMarkdown
                            remarkPlugins={[remarkGfm, remarkBreaks]}
                        >
                            {body || '_まだ本文が入力されていません_'}
                        </ReactMarkdown>
                        </div>
                    </div>
                )}

                {activeTab === 'split' && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <textarea
                            value={body}
                            onChange={(e) => setBody(e.target.value)}
                            aria-label="ペイン2"
                            className="min-h-[600px] p-4 border border-slate-200 rounded-md font-mono leading-7 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-400"
                        />
                        <div className="min-h-[600px] p-6 border border-slate-200 rounded-md bg-white overflow-auto
                            [&_ul]:list-disc [&_ul]:pl-6
                            [&_ol]:list-decimal [&_ol]:pl-6
                        ">
                            <div className="markdown-body">
                                <ReactMarkdown
                                    remarkPlugins={[remarkGfm, remarkBreaks]}
                                >
                                    {body || '_まだ本文が入力されていません_'}
                                </ReactMarkdown>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}