import { vi } from 'date-fns/locale';
import { useState, useCallback, useEffect } from 'react';
import { productsService } from '@/services/productsService';
import { useServerDataTable } from '@/hooks/useServerDataTable';
import { Product, ProductCreateRequest, ProductUpdateRequest } from '@/types/products.interface';
import { PaginationMetadata } from '@/types/base.interface';
import { showToast } from '@/components/ui/toastify';
import { parseApiError } from '@/utils/error';
import { useUserData } from '@/hooks/useGetData-UserLogin'

interface PopulatedProduct extends Omit<Product, 'brandId' | 'categories'> {
  brand: { id: number; name: string };
  categories: { id: number; name: string }[];
}

export type ProductColumn = {
  id: string;
  name: string;
  image: string;
  price: number;
  virtualPrice: number;
  status: 'active' | 'inactive';
  category: string;
  brand: string;
  createdAt: string;
  updatedAt: string;
  original: PopulatedProduct;
};

export function useProducts() {
  const user = useUserData();
  const [upsertOpen, setUpsertOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [productToEdit, setProductToEdit] = useState<ProductColumn | null>(null);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<ProductColumn | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  
  // State for price filtering
  const [priceFilter, setPriceFilter] = useState<{minPrice: number | null, maxPrice: number | null}>({
    minPrice: null,
    maxPrice: null
  });
  
  // Log price filter changes for debugging
  useEffect(() => {
    console.log('Price filter state updated:', priceFilter);
  }, [priceFilter]);

  const getResponseData = useCallback((response: any) => response.data || [], []);

  const getResponseMetadata = useCallback((response: any): PaginationMetadata => {
    const metadata = response.metadata || {};
    return {
      totalItems: metadata.totalItems || 0,
      page: metadata.page || 1,
      totalPages: metadata.totalPages || 1,
      limit: metadata.limit || 10,
      hasNext: metadata.hasNext || false,
      hasPrevious: metadata.hasPrev || false,
    };
  }, []);

  const mapResponseToData = useCallback((product: PopulatedProduct): ProductColumn => ({
    id: product.id,
    name: product.name,
    image: product.images?.[0] || '',
    price: product.basePrice,
    virtualPrice: product.virtualPrice,
    status: product.publishedAt ? 'active' : 'inactive',
    category: product.categories?.[0]?.name || 'N/A',
    brand: product.brand?.name || 'N/A',
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
    original: product,
  }), []);

  // Custom fetchData function to include price filter parameters
  const fetchDataWithFilters = useCallback((params: any, signal?: AbortSignal) => {
    // Create a new params object to avoid mutation issues
    const enhancedParams = { ...params };
    
    // Add price filter parameters if they exist
    if (priceFilter.minPrice !== null) {
      enhancedParams.minPrice = priceFilter.minPrice;
    }
    if (priceFilter.maxPrice !== null) {
      enhancedParams.maxPrice = priceFilter.maxPrice;
    }
    
    console.log('Fetching with params:', enhancedParams);
    
    // Now the productsService.getAll accepts a signal parameter
    return productsService.getAll(enhancedParams, signal);
  }, [priceFilter.minPrice, priceFilter.maxPrice]);

  const serverDataTable = useServerDataTable<PopulatedProduct, ProductColumn>({
    fetchData: fetchDataWithFilters,
    getResponseData,
    getResponseMetadata,
    mapResponseToData,
    initialSort: { sortBy: 'createdAt', sortOrder: 'desc', createdById: user?.id },
    defaultLimit: 10,
  });

  const handleOpenUpsertModal = (mode: 'add' | 'edit', product: ProductColumn | null = null) => {
    setModalMode(mode);
    setProductToEdit(product);
    setUpsertOpen(true);
  };

  const handleCloseUpsertModal = () => {
    setUpsertOpen(false);
    setProductToEdit(null);
  };

  const handleOpenDelete = (product: ProductColumn) => {
    setProductToDelete(product);
    setDeleteOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setDeleteOpen(false);
    setProductToDelete(null);
  };
  
  // Handler for price filter changes
  const handlePriceFilterChange = useCallback((minPrice: number | null, maxPrice: number | null) => {
    console.log(`Price filter changed: min=${minPrice}, max=${maxPrice}`);
    // Update the price filter state
    setPriceFilter({ minPrice, maxPrice });
    // Reset pagination to first page when filter changes
    serverDataTable.handlePageChange(1);
    // Use a longer timeout to ensure the priceFilter state is updated before refresh
    setTimeout(() => {
      console.log('Refreshing with price filter:', { minPrice, maxPrice });
      serverDataTable.refreshData();
    }, 300);
  }, [serverDataTable]);

  const addProduct = async (data: ProductCreateRequest) => {
    try {
      const response = await productsService.create(data);
      showToast(response.message, 'success');
      serverDataTable.refreshData();
      handleCloseUpsertModal();
      return response;
    } catch (error) {
      showToast(parseApiError(error), 'error');
      return null;
    }
  };

  const editProduct = async (id: number, data: ProductUpdateRequest) => {
    try {
      const response = await productsService.update(String(id), data);
      showToast(response.message, 'success');
      serverDataTable.refreshData();
      handleCloseUpsertModal();
      return response;
    } catch (error) {
      showToast(parseApiError(error), 'error');
      return null;
    }
  };

  const handleConfirmDelete = async (): Promise<void> => {
    if (productToDelete) {
      setDeleteLoading(true);
      try {
        const response = await productsService.delete(String(productToDelete.id));
        showToast(response.message, 'success');
        serverDataTable.refreshData();
        handleCloseDeleteModal();
      } catch (error) {
        showToast(parseApiError(error), 'error');
      } finally {
        setDeleteLoading(false);
      }
    }
  };

  return {
    ...serverDataTable,
    upsertOpen,
    modalMode,
    productToEdit,
    handleOpenUpsertModal,
    handleCloseUpsertModal,
    deleteOpen,
    productToDelete,
    deleteLoading,
    handleOpenDelete,
    handleConfirmDelete,
    handleCloseDeleteModal,
    addProduct,
    editProduct,
    handlePriceFilterChange,
    priceFilter,
  };
}