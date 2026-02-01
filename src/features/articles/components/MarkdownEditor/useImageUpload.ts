'use client';

import { useState, useCallback } from 'react';

type UploadState = {
  isUploading: boolean;
  error: string | null;
};

type UseImageUploadReturn = {
  uploadState: UploadState;
  uploadImage: (file: File) => Promise<string | null>;
  resetError: () => void;
};

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

export function useImageUpload(): UseImageUploadReturn {
  const [uploadState, setUploadState] = useState<UploadState>({
    isUploading: false,
    error: null,
  });

  const validateFile = (file: File): string | null => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      return 'JPEG、PNG、GIF、WebP形式のみアップロード可能です';
    }
    if (file.size > MAX_FILE_SIZE) {
      return 'ファイルサイズは5MB以下にしてください';
    }
    return null;
  };

  const uploadImage = useCallback(
    async (file: File): Promise<string | null> => {
      const validationError = validateFile(file);
      if (validationError) {
        setUploadState({ isUploading: false, error: validationError });
        return null;
      }

      setUploadState({ isUploading: true, error: null });

      try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('folder', 'articles');

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'アップロードに失敗しました');
        }

        setUploadState({ isUploading: false, error: null });
        return data.url;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'アップロードに失敗しました';
        setUploadState({ isUploading: false, error: errorMessage });
        return null;
      }
    },
    [],
  );

  const resetError = useCallback(() => {
    setUploadState((prev) => ({ ...prev, error: null }));
  }, []);

  return {
    uploadState,
    uploadImage,
    resetError,
  };
}
