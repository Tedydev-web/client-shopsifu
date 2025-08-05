"use client";

import { createContext, useContext, ReactNode, useMemo, useEffect } from 'react';
import { useProducts } from '../hooks/useProducts';
import { ClientProduct, ClientProductsResponse } from '@/types/client.products.interface';
import { useSearchParams } from 'next/navigation';

interface ProductsContextValue {
  products: ClientProduct[];
  metadata: ClientProductsResponse['metadata'] | undefined;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  currentPage: number;
  pageLimit: number;
  selectedSort: string;
  handlePageChange: (page: number) => void;
  setSelectedSort: (sort: string) => void;
  paginationData: {
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

const ProductsContext = createContext<ProductsContextValue | undefined>(undefined);

interface ProductsProviderProps {
  children: ReactNode;
  currentCategoryId?: string | null;
}

export function ProductsProvider({ children, currentCategoryId }: ProductsProviderProps) {
  const searchParams = useSearchParams();
  const sort = searchParams.get('sort') || 'relevance';
  const searchQuery = searchParams.get('q') || '';
  
  // Nếu có search query, bỏ qua categoryId để đảm bảo tìm kiếm trên toàn bộ sản phẩm
  const effectiveCategoryId = searchQuery ? null : currentCategoryId;
  
  // Tạo key để force re-render khi search query hoặc categoryId thay đổi
  // Điều này đảm bảo useProducts sẽ luôn chạy lại khi URL thay đổi
  const dataKey = useMemo(() => `${searchQuery || ''}-${effectiveCategoryId || ''}-${sort || ''}`, 
    [searchQuery, effectiveCategoryId, sort]);
  
  // useProducts sẽ được khởi tạo lại khi dataKey thay đổi
  const productsData = useProducts({ 
    categoryId: effectiveCategoryId, 
    key: dataKey // Truyền key để làm điểm phân biệt
  });
  
  // Thêm các giá trị bổ sung cho context
  // useEffect để log khi searchQuery hoặc categoryId thay đổi
  useEffect(() => {
    console.log("ProductsContext detected changes:", { 
      searchQuery, 
      currentCategoryId, 
      effectiveCategoryId,
      dataKey 
    });
  }, [searchQuery, currentCategoryId, effectiveCategoryId, dataKey]);
  
  const contextValue = useMemo(() => ({
    ...productsData,
    selectedSort: sort,
    setSelectedSort: (newSort: string) => {
      // Chức năng này sẽ được triển khai trong SortBar component
      console.log('Changing sort to:', newSort);
    }
  }), [productsData, sort]);
  
  return (
    <ProductsContext.Provider value={contextValue}>
      {children}
    </ProductsContext.Provider>
  );
}

export function useProductsContext() {
  const context = useContext(ProductsContext);
  if (!context) {
    throw new Error('useProductsContext must be used within a ProductsProvider');
  }
  return context;
}
