// hooks/useServerDataTable.ts
import { useState, useEffect, useRef } from 'react';
import { useDebounce } from '@/hooks/useDebounce';
import { PaginationMetadata, PaginationRequest } from '@/types/base.interface';
import { showToast } from '@/components/ui/toastify';
import { parseApiError } from '@/utils/error';

interface UseServerDataTableProps<T, U> {
  fetchData: (params: PaginationRequest, signal?: AbortSignal) => Promise<any>;
  getResponseData: (response: any) => T[]; // Function để trích xuất data từ response
  getResponseMetadata?: (response: any) => PaginationMetadata | undefined; // Function để trích xuất metadata
  mapResponseToData?: (item: any) => U;
  initialSort?: {
    sortBy: string;
    sortOrder: 'asc' | 'desc';
  };
  defaultLimit?: number;
}

export function useServerDataTable<T, U = T>({
  fetchData,
  getResponseData,
  getResponseMetadata,
  mapResponseToData,
  initialSort = { sortBy: 'id', sortOrder: 'asc' },
  defaultLimit = 10,
}: UseServerDataTableProps<T, U>) {
  // Khởi tạo metadata với đầy đủ thông tin
  const [pagination, setPagination] = useState<PaginationMetadata>({
    page: 1,
    limit: defaultLimit,
    search: '',
    sortBy: initialSort.sortBy,
    sortOrder: initialSort.sortOrder,
    totalPages: 1,
    totalItems: 0,
    hasNext: false,
    hasPrevious: false,
  });

  // Thêm trigger để force refresh dữ liệu
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const [data, setData] = useState<U[]>([]);
  const [loading, setLoading] = useState(false);
  const debouncedSearch = useDebounce(pagination.search, 500);

  // Sử dụng useRef để lưu trữ active request
  const activeRequestRef = useRef<AbortController | null>(null);
  
  // Lưu trữ các hàm callback để không tạo lại mỗi lần render
  const stableFetchData = useRef(fetchData).current;
  const stableGetResponseData = useRef(getResponseData).current;
  const stableGetResponseMetadata = useRef(getResponseMetadata).current;
  const stableMapResponseToData = useRef(mapResponseToData).current;

  // Effect để fetch data khi pagination thay đổi
  useEffect(() => {
    const loadData = async () => {
      // Hủy request trước đó nếu có
      if (activeRequestRef.current) {
        activeRequestRef.current.abort();
      }
      
      // Tạo controller mới cho request hiện tại
      const controller = new AbortController();
      activeRequestRef.current = controller;
      
      // Thiết lập timeout để tự động hủy request nếu quá lâu
      const timeoutId = setTimeout(() => {
        if (activeRequestRef.current === controller && !controller.signal.aborted) {
          controller.abort();
          console.warn('Request timed out after 8 seconds');
          setLoading(false);
        }
      }, 8000);
      
      try {
        setLoading(true);
        const requestParams: PaginationRequest = {
          page: pagination.page,
          limit: pagination.limit,
          search: debouncedSearch,
          sortBy: pagination.sortBy,
          sortOrder: pagination.sortOrder,
        };
        
        // Gọi API và lấy response với AbortSignal
        const response = await stableFetchData(requestParams, controller.signal);
        
        // Xóa timeout vì request đã hoàn thành
        clearTimeout(timeoutId);
        
        // Kiểm tra nếu request đã bị hủy
        if (controller.signal.aborted) return;
        
        // Log response để debug
        console.log("API Response:", response);
        
        // Trích xuất dữ liệu từ response
        let responseData: T[] = [];
        try {
          responseData = stableGetResponseData(response);
          if (!Array.isArray(responseData)) {
            console.error("Response data is not an array:", responseData);
            responseData = [];
          }
        } catch (error) {
          console.error("Error extracting data from response:", error);
        }
        
        // Map data nếu có hàm map được cung cấp
        const mappedData: U[] = stableMapResponseToData 
          ? responseData.map(stableMapResponseToData) 
          : responseData as unknown as U[];
        
        // Kiểm tra lại nếu request đã bị hủy
        if (controller.signal.aborted) return;
        
        setData(mappedData);
        
        // Cập nhật metadata nếu có
        if (stableGetResponseMetadata) {
          try {
            const metadata = stableGetResponseMetadata(response);
            if (metadata) {
              setPagination(prev => ({
                ...prev,
                totalItems: metadata.totalItems ?? prev.totalItems,
                page: metadata.page || prev.page,
                limit: metadata.limit || prev.limit,
                totalPages: metadata.totalPages || prev.totalPages,
                hasNext: metadata.hasNext ?? prev.hasNext,
                hasPrevious: metadata.hasPrevious ?? prev.hasPrevious,
              }));
            }
          } catch (error) {
            console.error("Error extracting metadata from response:", error);
          }
        }
      } catch (error) {
        // Xóa timeout trong trường hợp lỗi
        clearTimeout(timeoutId);
        
        // Chỉ xử lý lỗi nếu không phải do abort request
        if (!controller.signal.aborted) {
          console.error("Error fetching data:", error);
          showToast(parseApiError(error), 'error');
        }
      } finally {
        // Chỉ reset loading nếu đây là request mới nhất
        if (activeRequestRef.current === controller) {
          setLoading(false);
          activeRequestRef.current = null;
        }
      }
    };

    loadData();
    
    // Cleanup function
    return () => {
      if (activeRequestRef.current) {
        activeRequestRef.current.abort();
      }
    };
  }, [
    pagination.page,
    pagination.limit,
    debouncedSearch,
    pagination.sortBy,
    pagination.sortOrder,
    refreshTrigger, // Thêm trigger vào dependency để force re-fetch
    // Loại bỏ các callback ra khỏi dependency array vì đã dùng useRef để ổn định chúng
  ]);

  // Handlers
  const handlePageChange = (page: number) => {
    setPagination(prev => ({ ...prev, page }));
  };

  const handleLimitChange = (limit: number) => {
    setPagination(prev => ({ ...prev, limit, page: 1 }));
  };

  const handleSearch = (search: string) => {
    setPagination(prev => ({ ...prev, search, page: 1 }));
  };

  const handleSortChange = (sortBy: string, sortOrder: 'asc' | 'desc') => {
    setPagination(prev => ({ ...prev, sortBy, sortOrder }));
  };
  
  // Hàm để refresh dữ liệu - thực sự bắt buộc fetch lại dữ liệu mới
  const refreshData = () => {
    // Tăng giá trị refreshTrigger để kích hoạt useEffect và force re-fetch
    setRefreshTrigger(prev => prev + 1);
    console.log("🔄 Refreshing data...");
  };

  return {
    data,
    loading,
    pagination,
    handlePageChange,
    handleLimitChange,
    handleSearch,
    handleSortChange,
    refreshData,
  };
}