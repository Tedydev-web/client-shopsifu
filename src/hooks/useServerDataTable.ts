// hooks/useServerDataTable.ts
import { useState, useEffect } from 'react';
import { useDebounce } from '@/hooks/useDebounce';
import { PaginationMetadata, PaginationRequest } from '@/types/base.interface';
import { showToast } from '@/components/ui/toastify';
import { parseApiError } from '@/utils/error';

interface UseServerDataTableProps<T, U> {
  fetchData: (params: PaginationRequest) => Promise<{
    data: T[];
    metadata?: PaginationMetadata;
  }>;
  mapResponseToData?: (item: any) => U;
  initialSort?: {
    sortBy: string;
    sortOrder: 'asc' | 'desc';
  };
  defaultLimit?: number;
}

export function useServerDataTable<T, U = T>({
  fetchData,
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

  const [data, setData] = useState<U[]>([]);
  const [loading, setLoading] = useState(false);
  const debouncedSearch = useDebounce(pagination.search, 500);

  // Effect để fetch data khi pagination thay đổi
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const requestParams: PaginationRequest = {
          page: pagination.page,
          limit: pagination.limit,
          search: debouncedSearch,
          sortBy: pagination.sortBy,
          sortOrder: pagination.sortOrder,
        };
        
        const response = await fetchData(requestParams);
        
        // Map data nếu có hàm map được cung cấp
        const mappedData = mapResponseToData 
          ? response.data.map(mapResponseToData) 
          : response.data as unknown as U[];
        
        setData(mappedData);
        
        // Cập nhật metadata
        if (response.metadata) {
          setPagination(prev => ({
            ...prev,
            totalItems: response.metadata.totalItems,
            page: response.metadata.page || prev.page,
            limit: response.metadata.limit || prev.limit,
            totalPages: response.metadata.totalPages || 1,
            hasNext: response.metadata.hasNext || false,
            hasPrevious: response.metadata.hasPrevious || false,
          }));
        }
      } catch (error) {
        showToast(parseApiError(error), 'error');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [
    pagination.page,
    pagination.limit,
    debouncedSearch,
    pagination.sortBy,
    pagination.sortOrder,
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

  return {
    data,
    loading,
    pagination,
    handlePageChange,
    handleLimitChange,
    handleSearch,
    handleSortChange,
  };
}