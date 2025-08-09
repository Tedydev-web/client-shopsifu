'use client';

import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';
import { Discount, CreateDiscountRequest, UpdateDiscountRequest, DiscountStatus, DiscountType, DiscountGetAllResponse } from '@/types/discount.interface';
import { discountService } from '@/services/discountService';
import { useUserData } from '@/hooks/useGetData-UserLogin';
import { useServerDataTable } from '@/hooks/useServerDataTable';
import { PaginationRequest } from '@/types/base.interface';

export type VoucherColumn = {
  id: string;
  name: string;
  code: string;
  discountType: DiscountType;
  value: number;
  startDate: string;
  endDate: string;
  discountStatus: DiscountStatus;
  createdAt: string;
  updatedAt: string;
  original: Discount;
};

export function useVouchers() {
  const t = useTranslations('admin.ModuleVouchers');
  const user = useUserData();

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [voucherToDelete, setVoucherToDelete] = useState<VoucherColumn | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [upsertOpen, setUpsertOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [voucherToEdit, setVoucherToEdit] = useState<VoucherColumn | null>(null);

  const {
    data,
    loading,
    pagination,
    handleSearch,
    handlePageChange,
    handleLimitChange,
    refreshData,
  } = useServerDataTable<Discount, VoucherColumn>({
    fetchData: useCallback((params: PaginationRequest) => {
        if (!user?.id) {
            // Return a promise that resolves to an empty response
            return Promise.resolve({ data: [], metadata: { totalItems: 0, totalPages: 1, page: 1, limit: 10 } } as DiscountGetAllResponse);
        }
        return discountService.getAll({ ...params, createdById: user.id });
    }, [user?.id]),
    getResponseData: (response) => response.data,
    getResponseMetadata: (response) => response.metadata,
    mapResponseToData: (item: Discount): VoucherColumn => ({
      id: item.id,
      name: item.name,
      code: item.code,
      discountType: item.discountType,
      value: item.value,
      startDate: item.startDate,
      endDate: item.endDate,
      discountStatus: item.discountStatus,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
      original: item,
    }),
    initialSort: { createdById: user?.id },
  });

  const handleOpenDelete = (voucher: VoucherColumn) => {
    setVoucherToDelete(voucher);
    setDeleteOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setDeleteOpen(false);
    setVoucherToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (!voucherToDelete) return;
    setDeleteLoading(true);
    try {
      await discountService.delete(voucherToDelete.id);
      toast.success(t('Form.deleteSuccess'), {
        description: t('Form.deleteSuccessDesc', { code: voucherToDelete.code }),
      });
      handleCloseDeleteModal();
      refreshData(); // Re-fetch data
    } catch (error) {
      console.error('Error deleting voucher:', error);
      toast.error(t('Form.deleteError'));
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleOpenUpsertModal = (mode: 'add' | 'edit', voucher?: VoucherColumn) => {
    setModalMode(mode);
    setVoucherToEdit(voucher || null);
    setUpsertOpen(true);
  };

  const handleCloseUpsertModal = () => {
    setUpsertOpen(false);
    setVoucherToEdit(null);
  };

  const handleConfirmUpsert = async (values: CreateDiscountRequest | Partial<UpdateDiscountRequest>) => {
    try {
      if (modalMode === 'add') {
        await discountService.create(values as CreateDiscountRequest);
        toast.success(t('Form.addSuccess'), {
          description: t('Form.addSuccessDesc', { code: (values as CreateDiscountRequest).code }),
        });
      } else if (voucherToEdit?.id) {
        await discountService.update(voucherToEdit.id, values as Partial<UpdateDiscountRequest>);
        toast.success(t('Form.editSuccess'), {
          description: t('Form.editSuccessDesc', { code: values.code || voucherToEdit.code }),
        });
      }
      handleCloseUpsertModal();
      refreshData(); // Re-fetch data
    } catch (error) {
      console.error('Error saving voucher:', error);
      toast.error(t('Form.addError'));
    }
  };

  return {
    data,
    loading,
    pagination,
    handleSearch,
    handlePageChange,
    handleLimitChange,
    deleteOpen,
    voucherToDelete,
    deleteLoading,
    handleOpenDelete,
    handleConfirmDelete,
    handleCloseDeleteModal,
    upsertOpen,
    modalMode,
    voucherToEdit,
    handleOpenUpsertModal,
    handleCloseUpsertModal,
    handleConfirmUpsert,
    refreshData,
  };
}
