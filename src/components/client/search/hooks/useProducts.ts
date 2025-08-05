"use client";

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useMemo, useRef } from 'react';
import { ClientProductsResponse, ClientProduct } from '@/types/client.products.interface';
import { clientProductsService } from '@/services/clientProductsService';
import { useServerDataTable } from '@/hooks/useServerDataTable';

// Định nghĩa interface cho params API
interface ApiParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: string;
  createdById?: number;
  categories?: string;
  [key: string]: any;
}

// Định nghĩa interface cho pagination để tránh lỗi undefined
interface PaginationData {
  totalItems: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
  [key: string]: any;
}

interface UseProductsProps {
  categoryId?: string | null;
}

interface UseProductsReturn {
  products: ClientProduct[];
  metadata: {
    totalItems: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  currentPage: number;
  pageLimit: number;
  handlePageChange: (page: number) => void;
  paginationData: {
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export function useProducts({ categoryId }: UseProductsProps): UseProductsReturn {
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('q') || '';
  
  // Lấy thông tin phân trang từ URL parameters
  const initialPage = Number(searchParams.get('page') || 1);
  const initialLimit = Number(searchParams.get('limit') || 20);
  
  // Sử dụng refs để theo dõi giá trị trước đó
  const prevCategoryIdRef = useRef<string | null | undefined>(categoryId);
  const prevSearchQueryRef = useRef<string>(searchQuery);
  const isFirstRenderRef = useRef<boolean>(true);
  const isUpdatingUrlRef = useRef<boolean>(false);

  // Sử dụng hook useServerDataTable
  const {
    data: products,
    loading: isLoading,
    pagination: paginationRaw,
    handlePageChange: internalHandlePageChange,
    refreshData,
  } = useServerDataTable<ClientProduct, ClientProduct>({
    fetchData: async (params: ApiParams) => {
      // Thêm các params đặc biệt
      const apiParams: ApiParams = { ...params };
      
      if (categoryId) {
        apiParams.categories = categoryId;
      }
      
      if (searchQuery) {
        apiParams.search = searchQuery;
      }
      
      return await clientProductsService.getProducts(apiParams);
    },
    getResponseData: (response: any) => response.data || [],
    getResponseMetadata: (response: any) => response.metadata,
    defaultLimit: initialLimit,
    requestConfig: {
      includeSearch: false,
      includeSort: true,
      includeCreatedById: false
    },
  });

  // Đảm bảo pagination không bao giờ undefined bằng cách tạo object mới với giá trị mặc định
  const pagination: PaginationData = {
    totalItems: paginationRaw?.totalItems || 0,
    page: paginationRaw?.page || initialPage,
    limit: paginationRaw?.limit || initialLimit,
    totalPages: paginationRaw?.totalPages || 1,
    hasNext: paginationRaw?.hasNext || false,
    hasPrevious: paginationRaw?.hasPrevious || false
  };

  // Đặt trang ban đầu khi component mount
  useEffect(() => {
    if (initialPage > 1) {
      internalHandlePageChange(initialPage);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Ghi đè handlePageChange để cập nhật URL
  const handlePageChange = (page: number): void => {
    if (page === pagination.page) return; // Nếu trang không thay đổi, không làm gì
    
    // Set flag để biết là đang update URL
    isUpdatingUrlRef.current = true;
    
    // Gọi logic internal trước
    internalHandlePageChange(page);
    
    // Cập nhật URL với tham số page mới
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set('page', page.toString());
    
    const pathname = window.location.pathname;
    const queryString = newParams.toString();
    const newPath = queryString ? `${pathname}?${queryString}` : pathname;
    
    router.push(newPath);
  };
  
  // Chỉ refresh data khi categoryId hoặc searchQuery thay đổi
  useEffect(() => {
    // Bỏ qua lần render đầu tiên
    if (isFirstRenderRef.current) {
      isFirstRenderRef.current = false;
      return;
    }
    
    // Kiểm tra xem categoryId hoặc searchQuery có thay đổi không
    const categoryIdChanged = categoryId !== prevCategoryIdRef.current;
    const searchQueryChanged = searchQuery !== prevSearchQueryRef.current;
    
    // Nếu có sự thay đổi, mới refresh data
    if (categoryIdChanged || searchQueryChanged) {
      // Cập nhật refs trước khi gọi refreshData để tránh vòng lặp
      prevCategoryIdRef.current = categoryId;
      prevSearchQueryRef.current = searchQuery;
      
      // Reset về trang 1 và refresh data
      internalHandlePageChange(1);
      
      // Cập nhật URL với page=1
      const newParams = new URLSearchParams(searchParams.toString());
      newParams.set('page', '1');
      const pathname = window.location.pathname;
      const queryString = newParams.toString();
      const newPath = queryString ? `${pathname}?${queryString}` : pathname;
      router.push(newPath);
    }
  }, [categoryId, searchQuery, internalHandlePageChange, router, searchParams]);
  
  // Tạo dữ liệu phân trang để trả về
  const paginationData = useMemo(() => ({
    totalPages: pagination.totalPages,
    hasNextPage: pagination.hasNext,
    hasPrevPage: pagination.hasPrevious || pagination.page > 1,
  }), [pagination]);

  return {
    products: products || [],
    metadata: {
      totalItems: pagination.totalItems,
      page: pagination.page,
      limit: pagination.limit,
      totalPages: pagination.totalPages,
      hasNext: pagination.hasNext,
      hasPrev: pagination.hasPrevious
    },
    isLoading,
    isError: false,
    error: null,
    currentPage: pagination.page,
    pageLimit: pagination.limit,
    handlePageChange,
    paginationData
  };
}