'use client';

import { useState, useCallback } from 'react';
import { baseService } from '@/services/baseService';
import { toast } from 'sonner';

export interface FileWithPreview extends File {
  preview?: string;
}

export interface UploadState {
  files: FileWithPreview[];
  uploadedUrls: string[];
  isUploading: boolean;
  progress: number;
  error: string | null;
}

export function useUploadMedia() {
  const [state, setState] = useState<UploadState>({
    files: [],
    uploadedUrls: [],
    isUploading: false,
    progress: 0,
    error: null,
  });

  // Xử lý thêm files
  const handleAddFiles = useCallback((newFiles: FileList | File[]) => {
    setState((prev) => {
      // Chuyển FileList thành mảng và thêm preview URL
      const filesArray = Array.from(newFiles).map((file) => {
        const fileWithPreview = file as FileWithPreview;
        fileWithPreview.preview = URL.createObjectURL(file);
        return fileWithPreview;
      });

      return {
        ...prev,
        files: [...prev.files, ...filesArray],
        error: null,
      };
    });
  }, []);

  // Xử lý xóa file
  const handleRemoveFile = useCallback((index: number) => {
    setState((prev) => {
      const newFiles = [...prev.files];
      
      // Revoke object URL để tránh memory leak
      if (newFiles[index]?.preview) {
        URL.revokeObjectURL(newFiles[index].preview!);
      }
      
      newFiles.splice(index, 1);
      
      return {
        ...prev,
        files: newFiles,
      };
    });
  }, []);

  // Xử lý xóa tất cả files
  const handleRemoveAllFiles = useCallback(() => {
    setState((prev) => {
      // Revoke tất cả object URLs
      prev.files.forEach((file) => {
        if (file.preview) URL.revokeObjectURL(file.preview);
      });
      
      return {
        ...prev,
        files: [],
        uploadedUrls: [],
        progress: 0,
      };
    });
  }, []);

  // Upload tất cả files
  const uploadFiles = useCallback(async () => {
    if (state.files.length === 0) {
      toast.error('Vui lòng chọn ít nhất một tệp để tải lên');
      return [];
    }

    setState((prev) => ({
      ...prev,
      isUploading: true,
      progress: 0,
      error: null,
    }));

    try {
      // Giả lập tiến trình upload
      const progressInterval = setInterval(() => {
        setState((prev) => ({
          ...prev,
          progress: Math.min(prev.progress + 10, 90),
        }));
      }, 200);

      // Thực hiện upload
      const response = await baseService.uploadMedia(state.files);
      
      clearInterval(progressInterval);

      // Lấy các URLs từ response
      const urls = response.data.map((item) => item.url);
      
      setState((prev) => ({
        ...prev,
        uploadedUrls: urls,
        isUploading: false,
        progress: 100,
      }));

      toast.success(`Đã tải lên ${urls.length} tệp thành công`);
      return urls;
    } catch (error: any) {
      setState((prev) => ({
        ...prev,
        isUploading: false,
        error: error.message || 'Lỗi khi tải tệp lên',
      }));
      
      toast.error('Lỗi khi tải tệp lên', {
        description: error.message || 'Vui lòng thử lại sau',
      });
      
      return [];
    }
  }, [state.files]);

  // Reset state
  const reset = useCallback(() => {
    setState((prev) => {
      // Revoke tất cả object URLs
      prev.files.forEach((file) => {
        if (file.preview) URL.revokeObjectURL(file.preview);
      });
      
      return {
        files: [],
        uploadedUrls: [],
        isUploading: false,
        progress: 0,
        error: null,
      };
    });
  }, []);

  return {
    files: state.files,
    uploadedUrls: state.uploadedUrls,
    isUploading: state.isUploading,
    progress: state.progress,
    error: state.error,
    handleAddFiles,
    handleRemoveFile,
    handleRemoveAllFiles,
    uploadFiles,
    reset,
  };
}

export default useUploadMedia;