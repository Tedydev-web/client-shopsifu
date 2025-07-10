import { useState, useEffect, useCallback, useRef } from "react";

// Types
type ModalMode = 'add' | 'edit';

type BreadcrumbItem = {
  id: string;
  name: string;
};

type Category = {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
  parentId?: string | null;
};

type PaginationResponse = {
  page: number;
  limit: number;
  totalPages: number;
  totalItems: number;
  hasNext: boolean;
  hasPrevious: boolean;
};

type PaginationRequest = {
  page: number;
  limit: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  parentId?: string | null;
};

export const useCategory = () => {
  // Data & Pagination state
  const [data, setData] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState<PaginationResponse>({
    page: 1,
    limit: 10,
    totalPages: 1,
    totalItems: 0,
    hasNext: false,
    hasPrevious: false,
  });

  // Modal state
  const [upsertOpen, setUpsertOpen] = useState(false);
  const [modalMode, setModalMode] = useState<ModalMode>('add');
  const [categoryToEdit, setCategoryToEdit] = useState<Category | null>(null);

  // Navigation state
  const [currentParentId, setCurrentParentId] = useState<string | null>(null);
  const [breadcrumb, setBreadcrumb] = useState<BreadcrumbItem[]>([]);
  const [currentCategoryTitle, setCurrentCategoryTitle] = useState<string>("");

  // Request params
  const paramsRef = useRef<PaginationRequest>({
    page: 1,
    limit: 10,
    search: "",
    sortBy: "",
    sortOrder: "asc",
  });

  // Mock API call - Replace with actual API call
  const fetchCategories = async (params: PaginationRequest) => {
    // Simulated API response
    return {
      data: [],
      pagination: {
        page: params.page,
        limit: params.limit,
        totalPages: 1,
        totalItems: 0,
        hasNext: false,
        hasPrevious: false,
      },
    };
  };

  // Fetch data
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetchCategories({
        ...paramsRef.current,
        parentId: currentParentId,
      });
      setData(response.data);
      setPagination(response.pagination);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  }, [currentParentId]);

  // Initial fetch
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Modal handlers
  const handleOpenUpsertModal = useCallback((mode: ModalMode, category?: Category) => {
    setModalMode(mode);
    setCategoryToEdit(category || null);
    setUpsertOpen(true);
  }, []);

  const handleCloseUpsertModal = useCallback(() => {
    setUpsertOpen(false);
    setCategoryToEdit(null);
  }, []);

  // CRUD operations
  const addCategory = useCallback(async (data: Partial<Category>) => {
    try {
      // Implement actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      fetchData();
      handleCloseUpsertModal();
    } catch (error) {
      throw error;
    }
  }, [fetchData, handleCloseUpsertModal]);

  const editCategory = useCallback(async (id: string, data: Partial<Category>) => {
    try {
      // Implement actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      fetchData();
      handleCloseUpsertModal();
    } catch (error) {
      throw error;
    }
  }, [fetchData, handleCloseUpsertModal]);

  // Navigation handlers
  const handleViewSubcategories = useCallback((category: Category) => {
    setCurrentParentId(category.id);
    setBreadcrumb(prev => [...prev, { id: category.id, name: category.name }]);
    setCurrentCategoryTitle(category.name);
    paramsRef.current = { ...paramsRef.current, page: 1 };
    fetchData();
  }, [fetchData]);

  const handleBackToRoot = useCallback(() => {
    setCurrentParentId(null);
    setBreadcrumb([]);
    setCurrentCategoryTitle("");
    paramsRef.current = { ...paramsRef.current, page: 1 };
    fetchData();
  }, [fetchData]);

  const handleBreadcrumbClick = useCallback((index: number) => {
    if (index === 0) {
      handleBackToRoot();
      return;
    }
    const newBreadcrumb = breadcrumb.slice(0, index);
    const lastCrumb = newBreadcrumb[newBreadcrumb.length - 1];
    setCurrentParentId(lastCrumb.id);
    setBreadcrumb(newBreadcrumb);
    setCurrentCategoryTitle(lastCrumb.name);
    paramsRef.current = { ...paramsRef.current, page: 1 };
    fetchData();
  }, [breadcrumb, handleBackToRoot, fetchData]);

  // Table handlers
  const handlePageChange = useCallback((page: number) => {
    paramsRef.current = { ...paramsRef.current, page };
    fetchData();
  }, [fetchData]);

  const handleLimitChange = useCallback((limit: number) => {
    paramsRef.current = { ...paramsRef.current, limit, page: 1 };
    fetchData();
  }, [fetchData]);

  const handleSearch = useCallback((search: string) => {
    paramsRef.current = { ...paramsRef.current, search, page: 1 };
    fetchData();
  }, [fetchData]);

  const handleSortChange = useCallback((sortBy: string, sortOrder: "asc" | "desc") => {
    paramsRef.current = { ...paramsRef.current, sortBy, sortOrder, page: 1 };
    fetchData();
  }, [fetchData]);

  return {
    // Data & loading state
    data,
    loading,
    pagination,
    refreshData: fetchData,

    // Table handlers
    handlePageChange,
    handleLimitChange, 
    handleSearch,
    handleSortChange,

    // Modal state & handlers
    upsertOpen,
    modalMode,
    categoryToEdit,
    handleOpenUpsertModal,
    handleCloseUpsertModal,

    // CRUD operations 
    addCategory,
    editCategory,

    // Navigation state & handlers
    currentParentId,
    breadcrumb,
    currentCategoryTitle,
    handleViewSubcategories,
    handleBackToRoot,
    handleBreadcrumbClick,
  };
};
