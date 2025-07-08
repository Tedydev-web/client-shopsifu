'use client'

import { useState, useCallback } from "react"
import { useTranslations } from 'next-intl'
import { toast } from "sonner"
import { Brand, BrandCreateRequest, BrandUpdateRequest } from "@/types/admin/brands.interface"
import * as brandsService from "@/services/admin/brandsService"
import { useServerDataTable } from "@/hooks/useServerDataTable"

export const useBrand = () => {
  const t = useTranslations();
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
  
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [brandToDelete, setBrandToDelete] = useState<Brand | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Tạo các callbacks cho useServerDataTable
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
      hasPrevious: metadata.hasPrevious || false
    };
  }, []);

  const mapResponseToData = useCallback((brand: any): Brand => {
    return brand;
  }, []);

  // Sử dụng hook useServerDataTable để quản lý data và pagination
  const {
    data,
    loading,
    pagination,
    handlePageChange,
    handleLimitChange,
    handleSearch,
    handleSortChange,
    refreshData,
  } = useServerDataTable({
    fetchData: brandsService.getAllBrands,
    getResponseData,
    getResponseMetadata,
    mapResponseToData,
    initialSort: { sortBy: "id", sortOrder: "asc" },
    defaultLimit: 10,
  });

  // CRUD operations
  const createBrand = async (brand: BrandCreateRequest) => {
    try {
      await brandsService.createBrand(brand);
      toast.success(t('system.toasts.createSuccessDescription'), {
        description: brand.name,
      });
      refreshData();
      handleCloseModal();
      return true;
    } catch (error: any) {
      toast.error(t('system.toasts.error'), {
        description: error.message || t('system.toasts.createErrorDescription'),
      });
      return false;
    }
  };

  const updateBrand = async (id: number | string, brand: BrandUpdateRequest) => {
    try {
      await brandsService.updateBrand(id, brand);
      toast.success(t('system.toasts.updateSuccessDescription'), {
        description: brand.name,
      });
      refreshData();
      handleCloseModal();
      return true;
    } catch (error: any) {
      toast.error(t('system.toasts.error'), {
        description: error.message || t('system.toasts.updateErrorDescription'),
      });
      return false;
    }
  };

  const handleConfirmDelete = async () => {
    if (brandToDelete) {
      setDeleteLoading(true);
      try {
        await brandsService.deleteBrand(brandToDelete.id);
        toast.success(t('system.toasts.deleteSuccessDescription'), {
          description: brandToDelete.name,
        });
        refreshData();
        setDeleteOpen(false);
        setBrandToDelete(null);
      } catch (error: any) {
        toast.error(t('system.toasts.error'), {
          description: error.message || t('system.toasts.deleteErrorDescription'),
        });
      } finally {
        setDeleteLoading(false);
      }
    }
  };

  const handleOpenDelete = (brand: Brand) => {
    setBrandToDelete(brand);
    setDeleteOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setDeleteOpen(false);
    setBrandToDelete(null);
  };

  const handleOpenModal = (brand?: Brand) => {
    setSelectedBrand(brand || null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedBrand(null);
  };

  return {
    data,
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
    brandToDelete,
    deleteLoading,
    handleOpenDelete,
    handleConfirmDelete,
    handleCloseDeleteModal,

    // Upsert
    isModalOpen,
    selectedBrand,
    handleOpenModal,
    handleCloseModal,
    createBrand,
    updateBrand,
  };
};
