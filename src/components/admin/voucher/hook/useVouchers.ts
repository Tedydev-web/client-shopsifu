'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';
import { useDebounce } from '@/hooks/useDebounce';
import { Discount, CreateDiscountRequest, UpdateDiscountRequest } from '@/types/discount.interface';
import { discountService } from '@/services/discountService';

export function useVouchers() {
  const t = useTranslations('admin.ModuleVouchers');
  const [data, setData] = useState<Discount[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    totalItems: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
    search: '',
  });
  const [debouncedSearch] = useDebounce(pagination.search, 500);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [voucherToDelete, setVoucherToDelete] = useState<Discount | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [upsertOpen, setUpsertOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [voucherToEdit, setVoucherToEdit] = useState<Discount | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await discountService.getAll({
        page: pagination.page,
        limit: pagination.limit,
        search: debouncedSearch,
      });
      setData(response.data);
      setPagination(prev => ({
        ...prev,
        totalItems: response.metadata?.totalItems ?? 0,
        totalPages: response.metadata?.totalPages ?? 1,
      }));
    } catch (error) {
      console.error('Failed to fetch vouchers', error);
      toast.error('Failed to fetch vouchers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [pagination.page, pagination.limit, debouncedSearch]);

  const handleSearch = (search: string) => {
    setPagination(prev => ({ ...prev, search, page: 1 }));
  };

  const handlePageChange = (page: number) => {
    setPagination(prev => ({ ...prev, page }));
  };

  const handleLimitChange = (limit: number) => {
    setPagination(prev => ({ ...prev, limit, page: 1 }));
  };

  const handleOpenDelete = (voucher: Discount) => {
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
      fetchData(); // Re-fetch data
    } catch (error) {
      console.error('Error deleting voucher:', error);
      toast.error(t('Form.deleteError'));
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleOpenUpsertModal = (mode: 'add' | 'edit', voucher?: Discount) => {
    setModalMode(mode);
    setVoucherToEdit(voucher || null);
    setUpsertOpen(true);
  };

  const handleCloseUpsertModal = () => {
    setUpsertOpen(false);
    setVoucherToEdit(null);
  };

  const handleConfirmUpsert = async (values: CreateDiscountRequest | Partial<UpdateDiscountRequest>) => {
    setLoading(true);
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
      fetchData(); // Re-fetch data
    } catch (error) {
      console.error('Error saving voucher:', error);
      toast.error(t('Form.addError'));
    } finally {
      setLoading(false);
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
  };
}
