import { privateAxios, publicAxios } from '@/lib/api';
import { API_ENDPOINTS } from '@/constants/api';
import { PaginationRequest, BaseResponse, MediaUploadResponse } from '@/types/base.interface';
import { AxiosError } from 'axios';


export const baseService = {
  /**
   * Upload một hoặc nhiều file media (hình ảnh, video, etc.)
   * @param files - Danh sách file cần upload
   * @returns Promise với response chứa URLs của các file đã upload
   */
  uploadMedia: async (files: File[], signal?: AbortSignal): Promise<MediaUploadResponse> => {
    try {
      const formData = new FormData();
      
      // Thêm từng file vào form data với key "files"
      files.forEach((file) => {
        formData.append('files', file);
      });

      const response = await privateAxios.post(API_ENDPOINTS.BASE.UPLOAD_MEDIA, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        signal: signal
      });

      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error('Error uploading media:', axiosError);
      throw axiosError.response?.data || {
        message: 'Có lỗi xảy ra khi tải lên tệp',
      };
    }
  }
};
