import { privateAxios, publicAxios } from '@/lib/api';
import { API_ENDPOINTS } from '@/constants/api';
import { 
    LangCreateRequest,
    LangCreateResponse,
    LangGetAllResponse,
    LangUpdateRequest,
    LangUpdateResponse,
    LangDeleteRequest,
    LangDeleteResponse,
    LangGetByIdResponse,
 } from '@/types/languages.interface';

class LanguagesService {
    // Lấy danh sách tất cả ngôn ngữ
    async getAll(): Promise<LangGetAllResponse> {
        const response = await privateAxios.get(API_ENDPOINTS.LANGUAGES.GETALL, {});
        return response.data;
    }

    // Lấy thông tin ngôn ngữ theo ID
    async getById(id: string): Promise<LangGetByIdResponse> {
        const response = await privateAxios.get(
            API_ENDPOINTS.LANGUAGES.GETBYID.replace(':id', id), {}
        );
        return response.data;
    }

    // Tạo ngôn ngữ mới
    async create(data: LangCreateRequest): Promise<LangCreateResponse> {
        const response = await privateAxios.post(
            API_ENDPOINTS.LANGUAGES.POST,
            data
        );
        return response.data;
    }

    // Cập nhật ngôn ngữ
    async update(id: string, data: LangUpdateRequest): Promise<LangUpdateResponse> {
        const response = await privateAxios.put(
            API_ENDPOINTS.LANGUAGES.UPDATE.replace(':id', id),
            data
        );
        return response.data;
    }

    // Xóa ngôn ngữ theo ID
    async deleteById(id: string): Promise<LangDeleteResponse> {
        const response = await privateAxios.delete(
            API_ENDPOINTS.LANGUAGES.DELETE_BY_ID.replace(':id', id), {}
        );
        return response.data;
    }
}

export const languagesService = new LanguagesService();
