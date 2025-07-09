import { useState, useCallback, useEffect } from 'react';
import { categoryService } from '@/services/admin/categoryService';
import { showToast } from '@/components/ui/toastify';
import { parseApiError } from '@/utils/error';
import { Category, CategoryCreateRequest, CategoryUpdateRequest } from '@/types/admin/category.interface';
import { useServerDataTable } from '@/hooks/useServerDataTable';
import { useTranslations } from "next-intl";
import { CategoryTableData } from './category-Columns';

export function useCategory() {
  const t = useTranslations();
  
  // Modal states
  const [upsertOpen, setUpsertOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [categoryToEdit, setCategoryToEdit] = useState<Category | null>(null);
  
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  
  // Callbacks for useServerDataTable
  const getResponseData = useCallback((response: any) => {
    return response.data || [];
  }, []);

  const getResponseMetadata = useCallback((response: any) => {
    const metadata = response.metadata || {};
    return {
      totalItems: metadata.totalItems || 0,
      page: metadata.page || 1,
      totalPages: metadata.totalPages || 1,
      limit: metadata.limit || 10,
      hasNext: metadata.hasNext || false,
      hasPrevious: metadata.hasPrev || false
    };
  }, []);

  const mapResponseToData = useCallback((category: any): CategoryTableData => {
    return {
      id: String(category.id),
      name: category.name,
      parentCategoryId: category.parentCategoryId,
      logo: category.logo || null,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
    };
  }, []);

  // Use the useServerDataTable hook
  const {
    data: categories,
    loading,
    pagination,
    handlePageChange,
    handleLimitChange,
    handleSearch,
    handleSortChange,
    refreshData,
  } = useServerDataTable({
    fetchData: categoryService.getAll,
    getResponseData,
    getResponseMetadata,
    mapResponseToData,
    initialSort: { sortBy: "createdAt", sortOrder: "desc" },
    defaultLimit: 10,
  });

  // CRUD operations
  const addCategory = async (data: CategoryCreateRequest) => {
    try {
      const response = await categoryService.create(data);
      showToast(response.message || t("admin.notifications.categoryCreated"), "success");
      refreshData();
      handleCloseUpsertModal();
      return response;
    } catch (error) {
      showToast(parseApiError(error), "error");
      console.error("Error creating category:", error);
      return null;
    }
  };

  const editCategory = async (id: string, data: CategoryUpdateRequest) => {
    try {
      const response = await categoryService.update(id, data);
      showToast(response.message || t("admin.notifications.categoryUpdated"), "success");
      refreshData();
      handleCloseUpsertModal();
      return response;
    } catch (error) {
      showToast(parseApiError(error), "error");
      console.error("Error updating category:", error);
      return null;
    }
  };

  const handleConfirmDelete = async (): Promise<void> => {
    if (categoryToDelete) {
      setDeleteLoading(true);
      try {
        const response = await categoryService.delete(String(categoryToDelete.id));
        showToast(response.message || t("admin.notifications.categoryDeleted"), "success");
        refreshData();
        handleCloseDeleteModal();
      } catch (error) {
        showToast(parseApiError(error), "error");
        console.error("Error deleting category:", error);
      } finally {
        setDeleteLoading(false);
      }
    }
  };

  // Modal handlers
  const handleOpenDelete = (category: CategoryTableData) => {
    setCategoryToDelete(category as unknown as Category);
    setDeleteOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setDeleteOpen(false);
    setCategoryToDelete(null);
  };

  // Fetch category details by ID
  const fetchCategoryDetails = async (categoryId: string) => {
    try {
      const response = await categoryService.getById(categoryId);
      if (response) {
        setCategoryToEdit(response.data);
      }
    } catch (error) {
      showToast(parseApiError(error), "error");
      console.error("Error fetching category details:", error);
    }
  };
  
  const handleOpenUpsertModal = (mode: 'add' | 'edit', category?: CategoryTableData) => {
    setModalMode(mode);
    
    if (mode === 'edit' && category) {
      console.log("Opening edit modal for category:", category);
      setCategoryToEdit(category as unknown as Category);
      // Fetch detailed category info
      fetchCategoryDetails(category.id);
    } else {
      console.log("Opening add modal");
      setCategoryToEdit(null);
    }
    
    setUpsertOpen(true);
  };

  const handleCloseUpsertModal = () => {
    setUpsertOpen(false);
    setCategoryToEdit(null);
  };

  return {
    data: categories,
    loading,
    pagination,
    
    // Server-side pagination handlers
    handlePageChange,
    handleLimitChange,
    handleSearch,
    handleSortChange,
    refreshData,
    
    // Delete
    deleteOpen,
    categoryToDelete,
    deleteLoading,
    handleOpenDelete,
    handleConfirmDelete,
    handleCloseDeleteModal,

    // Upsert
    upsertOpen,
    modalMode,
    categoryToEdit,
    handleOpenUpsertModal,
    handleCloseUpsertModal,
    addCategory,
    editCategory,
    fetchCategoryDetails,
  };
    } catch (error) {
      return [];
    }
  };

  return {
    categories,
    totalItems,
    page,
    totalPages,
    loading,
    getAllCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory,
    getRootCategories,
  };
}
