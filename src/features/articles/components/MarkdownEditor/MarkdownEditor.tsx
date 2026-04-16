'use client';

import { useState, useRef, useCallback } from 'react';
import { Tab } from '@/shared/components/atoms/Tab';
import { MarkdownPreview } from '@/shared/components/molecules/MarkdownPreview';
import { ImageUploadButton } from './ImageUploadButton';
import { useImageUpload } from './useImageUpload';

type TabType = 'edit' | 'preview' | 'split';

type FieldErrors = {
  title?: string;
  content?: string;
  tags?: string;
};

type Props = {
  title: string;
  onTitleChange: (value: string) => void;
  tags: string;
  onTagsChange: (value: string) => void;
  body: string;
  onBodyChange: (value: string) => void;
  errors?: FieldErrors;
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
  errors = {},
}: Props) {
  const [activeTab, setActiveTab] = useState<TabType>('edit');
  const [isDragOver, setIsDragOver] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const splitTextareaRef = useRef<HTMLTextAreaElement>(null);

  const { uploadState, uploadImage, resetError } = useImageUpload();

  const insertImageMarkdown = useCallback(
    (imageUrl: string, altText: string = '画像') => {
      const textarea =
        activeTab === 'split' ? splitTextareaRef.current : textareaRef.current;
      const markdownImage = `![${altText}](${imageUrl})`;

      if (textarea) {
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const newBody =
          body.substring(0, start) + markdownImage + body.substring(end);
        onBodyChange(newBody);

        setTimeout(() => {
          textarea.focus();
          const newPosition = start + markdownImage.length;
          textarea.setSelectionRange(newPosition, newPosition);
        }, 0);
      } else {
        onBodyChange(body + '\n' + markdownImage);
      }
    },
    [body, onBodyChange, activeTab],
  );

  const handleImageUpload = useCallback(
    async (file: File) => {
      const imageUrl = await uploadImage(file);
      if (imageUrl) {
        const altText = file.name.replace(/\.[^/.]+$/, '') || '画像';
        insertImageMarkdown(imageUrl, altText);
      }
    },
    [uploadImage, insertImageMarkdown],
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragOver(false);

      const files = Array.from(e.dataTransfer.files);
      const imageFile = files.find((file) => file.type.startsWith('image/'));

      if (imageFile) {
        await handleImageUpload(imageFile);
      }
    },
    [handleImageUpload],
  );

  const handlePaste = useCallback(
    async (e: React.ClipboardEvent) => {
      const items = Array.from(e.clipboardData.items);
      const imageItem = items.find((item) => item.type.startsWith('image/'));

      if (imageItem) {
        e.preventDefault();
        const file = imageItem.getAsFile();
        if (file) {
          await handleImageUpload(file);
        }
      }
    },
    [handleImageUpload],
  );

  const getTextareaClass = (isError: boolean) =>
    `w-full min-h-[600px] p-4 border rounded-md text-base leading-7 bg-white focus:outline-none transition-colors ${
      isError ? 'border-red-500' : 'border-slate-200'
    } ${isDragOver ? 'border-emerald-500 border-2 bg-emerald-50' : ''}`;

  return (
    <>
      <div className="mb-3">
        <input
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder="タイトルを入力してください"
          className={`w-full text-2xl font-semibold border rounded-md p-3 focus:outline-none bg-white ${
            errors.title ? 'border-red-500' : 'border-slate-200'
          }`}
        />
        {errors.title && (
          <p className="text-red-500 text-sm mt-1">{errors.title}</p>
        )}
      </div>

      <div className="mb-3">
        <input
          value={tags}
          onChange={(e) => onTagsChange(e.target.value)}
          placeholder="タグを入力してください。スペース区切りで5つまで入力できます。"
          className={`w-full border rounded-md p-2 text-base focus:outline-none bg-white ${
            errors.tags ? 'border-red-500' : 'border-slate-200'
          }`}
        />
        {errors.tags && (
          <p className="text-red-500 text-sm mt-1">{errors.tags}</p>
        )}
      </div>

      <div className="flex items-center gap-2 mb-2 border-b border-slate-200 pb-2">
        {TABS.map((tab) => (
          <Tab
            key={tab.key}
            label={tab.label}
            isActive={activeTab === tab.key}
            onClick={() => setActiveTab(tab.key)}
          />
        ))}

        <div className="w-px h-6 bg-slate-300 mx-2" />

        <ImageUploadButton
          isUploading={uploadState.isUploading}
          onFileSelect={handleImageUpload}
          disabled={activeTab === 'preview'}
        />

        <span className="ml-auto text-xs text-slate-400">
          {body.length} 文字
        </span>
      </div>

      {errors.content && (
        <p className="text-red-500 text-sm mb-2">{errors.content}</p>
      )}
      {uploadState.error && (
        <div className="flex items-center justify-between bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-md mb-2">
          <span className="text-sm">{uploadState.error}</span>
          <button
            type="button"
            onClick={resetError}
            className="text-red-500 hover:text-red-700 text-sm underline"
          >
            閉じる
          </button>
        </div>
      )}

      {activeTab !== 'preview' && (
        <p className="text-xs text-slate-400 mb-2">
          💡 画像はドラッグ&ドロップまたはペーストでも挿入できます
        </p>
      )}

      {activeTab === 'edit' && (
        <textarea
          ref={textareaRef}
          value={body}
          onChange={(e) => onBodyChange(e.target.value)}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onPaste={handlePaste}
          placeholder="エンジニアに関わる知識をMarkdown記法で書いて共有しよう"
          className={getTextareaClass(!!errors.content)}
        />
      )}

      {activeTab === 'preview' && (
        <div className="w-full min-h-[600px] p-6 border border-slate-200 rounded-md bg-white overflow-auto">
          <MarkdownPreview content={body} />
        </div>
      )}

      {activeTab === 'split' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <textarea
            ref={splitTextareaRef}
            value={body}
            onChange={(e) => onBodyChange(e.target.value)}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onPaste={handlePaste}
            aria-label="エディター"
            className={`min-h-[600px] p-4 border rounded-md font-mono leading-7 bg-white focus:outline-none transition-colors ${
              errors.content ? 'border-red-500' : 'border-slate-200'
            } ${isDragOver ? 'border-emerald-500 border-2 bg-emerald-50' : ''}`}
          />
          <div className="min-h-[600px] p-6 border border-slate-200 rounded-md bg-white overflow-auto">
            <MarkdownPreview content={body} />
          </div>
        </div>
      )}
    </>
  );
}
