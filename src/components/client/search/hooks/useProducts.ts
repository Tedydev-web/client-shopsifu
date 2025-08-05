"use client";

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useMemo, useRef } from 'react';
import { ClientProductsResponse, ClientProduct, ClientSearchResultItem } from '@/types/client.products.interface';
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
  key?: string; // Key để force re-render khi cần thiết
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

export function useProducts({ categoryId, key }: UseProductsProps): UseProductsReturn {
  // Ghi log khi hook được gọi lại để debug
  console.log("useProducts hook called with:", { categoryId, key });
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
  } = useServerDataTable<ClientProduct | ClientSearchResultItem, ClientProduct>({
    fetchData: async (params: ApiParams) => {
      // Thêm các params đặc biệt
      const apiParams: ApiParams = { ...params };
      
      // Nếu có từ khóa tìm kiếm, ưu tiên API search và bỏ qua category filter
      if (searchQuery) {
        // Xóa category param nếu đang tìm kiếm để đảm bảo tìm kiếm trên toàn bộ sản phẩm
        delete apiParams.categories;
      } else if (categoryId) {
        // Chỉ áp dụng filter theo category khi không có search query
        apiParams.categories = categoryId;
      }
      
      // Nếu có từ khóa tìm kiếm, sử dụng API search
      if (searchQuery) {
        apiParams.q = searchQuery; // Sử dụng param 'q' thay vì 'search' cho API search
        
        // Thêm tham số timestamp để đảm bảo không cache kết quả
        apiParams._t = new Date().getTime();
        
        console.log("Searching products with params:", { q: searchQuery, ...apiParams });
        
        const searchResponse = await clientProductsService.searchProducts(apiParams);
        
        // Chuyển đổi dữ liệu từ search API sang định dạng tương thích với ClientProduct
        const convertedData = searchResponse.data.map(item => ({
          id: item.productId,
          name: item.productName,
          description: item.productDescription || '',
          basePrice: item.skuPrice || 0,
          virtualPrice: item.skuPrice || 0, // Có thể cần thêm logic xử lý giá ảo
          brandId: item.brandId || '',
          images: item.productImages || [],
          variants: item.variants || [],
          productTranslations: [],
          publishedAt: item.createdAt,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
          // Thêm các trường bắt buộc từ BaseEntity
          createdById: 0, // Default value
          updatedById: null,
          deletedById: null,
          deletedAt: null,
          // Thêm các trường cần thiết khác
          isPublished: true,
          brandName: item.brandName || '',
          categories: item.categoryIds?.map((id, index) => ({
            id,
            name: item.categoryNames?.[index] || ''
          })) || []
        })) as unknown as ClientProduct[]; // Sử dụng unknown làm trung gian
        
        console.log("Search response received:", {
          itemCount: convertedData.length,
          metadata: searchResponse.metadata
        });
    
        return {
          statusCode: searchResponse.statusCode,
          message: searchResponse.message,
          data: convertedData,
          metadata: searchResponse.metadata,
        };
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
  
  // Force refresh data khi URL thay đổi và khi categoryId hoặc searchQuery thay đổi
  useEffect(() => {
    // Bỏ qua lần render đầu tiên (chỉ để tránh refresh không cần thiết khi mount)
    if (isFirstRenderRef.current) {
      isFirstRenderRef.current = false;
      return;
    }
    
    // Kiểm tra xem categoryId hoặc searchQuery có thay đổi không
    const categoryIdChanged = categoryId !== prevCategoryIdRef.current;
    const searchQueryChanged = searchQuery !== prevSearchQueryRef.current;
    
    // Force refresh data mỗi khi URL chứa search query thay đổi
    if (categoryIdChanged || searchQueryChanged) {
      console.log("Data refresh triggered:", { categoryId, searchQuery });
      
      // Cập nhật refs trước khi gọi refreshData để tránh vòng lặp
      prevCategoryIdRef.current = categoryId;
      prevSearchQueryRef.current = searchQuery;
      
      // Reset về trang 1 và refresh data ngay lập tức
      setTimeout(() => {
        refreshData();
        internalHandlePageChange(1);
      }, 0);
      
      // Cập nhật URL với page=1 nếu đang không trong quá trình update URL từ các nơi khác
      if (!isUpdatingUrlRef.current) {
        const newParams = new URLSearchParams(searchParams.toString());
        newParams.set('page', '1');
        const pathname = window.location.pathname;
        const queryString = newParams.toString();
        const newPath = queryString ? `${pathname}?${queryString}` : pathname;
        router.push(newPath);
      }
      
      // Reset flag
      isUpdatingUrlRef.current = false;
    }
  }, [categoryId, searchQuery, internalHandlePageChange, router, searchParams, refreshData]);
  
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