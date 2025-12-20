'use client';

import { useState } from 'react';
import { Tab } from '@/shared/components/atoms/Tab';
import { MarkdownPreview } from '@/shared/components/molecules/MarkdownPreview';

type TabType = 'edit' | 'preview' | 'split';

type Props = {
  title: string;
  onTitleChange: (value: string) => void;
  tags: string;
  onTagsChange: (value: string) => void;
  body: string;
  onBodyChange: (value: string) => void;
};

const TABS: { key: TabType; label: string }[] = [
  { key: 'edit', label: '本文' },
  { key: 'preview', label: 'プレビュー' },
  { key: 'split', label: '2ペイン' },
];

export function MarkdownEditor({
  title,
  onTitleChange,
  tags,
  onTagsChange,
  body,
  onBodyChange,
}: Props) {
  const [activeTab, setActiveTab] = useState<TabType>('edit');

  return (
    <>
      <input
        value={title}
        onChange={(e) => onTitleChange(e.target.value)}
        placeholder="タイトルを入力してください"
        className="w-full text-2xl font-semibold border border-slate-200 rounded-md p-3 mb-3 focus:outline-none bg-white"
      />
      <input
        value={tags}
        onChange={(e) => onTagsChange(e.target.value)}
        placeholder="タグを入力してください。スペース区切りで5つまで入力できます。"
        className="w-full border border-slate-200 rounded-md p-2 text-base focus:outline-none bg-white"
      />

      {/* タブナビゲーション */}
      <div className="flex items-center gap-2 mb-2 border-b border-slate-200 pb-2">
        {TABS.map((tab) => (
          <Tab
            key={tab.key}
            label={tab.label}
            isActive={activeTab === tab.key}
            onClick={() => setActiveTab(tab.key)}
          />
        ))}
        <span className="ml-auto text-xs text-slate-400">
          {body.length} 文字
        </span>
      </div>

      {/* 編集モード */}
      {activeTab === 'edit' && (
        <textarea
          value={body}
          onChange={(e) => onBodyChange(e.target.value)}
          placeholder="エンジニアに関わる知識をMarkdown記法で書いて共有しよう"
          className="w-full min-h-[600px] p-4 border border-slate-200 rounded-md text-base leading-7 bg-white focus:outline-none"
        />
      )}

      {/* プレビューモード */}
      {activeTab === 'preview' && (
        <div className="w-full min-h-[600px] p-6 border border-slate-200 rounded-md bg-white overflow-auto">
          <MarkdownPreview content={body} />
        </div>
      )}

      {/* 2ペインモード */}
      {activeTab === 'split' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <textarea
            value={body}
            onChange={(e) => onBodyChange(e.target.value)}
            aria-label="エディター"
            className="min-h-[600px] p-4 border border-slate-200 rounded-md font-mono leading-7 bg-white focus:outline-none"
          />
          <div className="min-h-[600px] p-6 border border-slate-200 rounded-md bg-white overflow-auto">
            <MarkdownPreview content={body} />
          </div>
        </div>
      )}
    </>
  );
}
