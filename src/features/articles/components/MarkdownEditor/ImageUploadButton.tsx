'use client';

import { useRef } from 'react';
import { FaImage, FaSpinner } from 'react-icons/fa';

type Props = {
  isUploading: boolean;
  onFileSelect: (file: File) => void;
  disabled?: boolean;
};

export function ImageUploadButton({
  isUploading,
  onFileSelect,
  disabled = false,
}: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelect(file);
      // 同じファイルを再度選択できるようにリセット
      e.target.value = '';
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        disabled={disabled || isUploading}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded-md hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        title="画像をアップロード"
      >
        {isUploading ? (
          <>
            <FaSpinner className="w-4 h-4 animate-spin" />
            <span>アップロード中...</span>
          </>
        ) : (
          <>
            <FaImage className="w-4 h-4" />
            <span>画像</span>
          </>
        )}
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/gif,image/webp"
        onChange={handleFileChange}
        className="hidden"
        aria-label="画像ファイルを選択"
      />
    </>
  );
}
