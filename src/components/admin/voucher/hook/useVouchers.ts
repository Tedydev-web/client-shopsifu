'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';
import { Voucher, VoucherCreateRequest, VoucherUpdateRequest } from '@/types/admin/voucher.interface';
import { mockVouchers, mockPagination } from '../voucher-Mockdata';

export function useVouchers() {
  const t = useTranslations('admin.ModuleVouchers');

  // Data state
  const [data, setData] = useState<Voucher[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
    search: ''
  });

  // Modal states
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [voucherToDelete, setVoucherToDelete] = useState<Voucher | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [upsertOpen, setUpsertOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [voucherToEdit, setVoucherToEdit] = useState<Voucher | null>(null);

  // Fetch mock data
  useEffect(() => {
    setLoading(true);
    // Simulate API call delay
    setTimeout(() => {
      setData(mockVouchers);
      setPagination({
        ...pagination,
        total: mockPagination.total,
        totalPages: mockPagination.totalPages
      });
      setLoading(false);
    }, 500);
  }, []);

  // Data handling functions
  const handleSearch = (search: string) => {
    setPagination({...pagination, search, page: 1});
    // Mock search in local data
    if (search) {
      const filteredData = mockVouchers.filter(voucher => 
        voucher.code.toLowerCase().includes(search.toLowerCase()) || 
        voucher.name.toLowerCase().includes(search.toLowerCase())
      );
      setData(filteredData);
    } else {
      setData(mockVouchers);
    }
  };

  const handlePageChange = (page: number) => {
    setPagination({...pagination, page});
  };

  const handleLimitChange = (limit: number) => {
    setPagination({...pagination, limit, page: 1});
  };

  const refreshData = () => {
    // Re-fetch mock data
    setData([...mockVouchers]);
  };

  // Open delete modal
  const handleOpenDelete = (voucher: Voucher) => {
    setVoucherToDelete(voucher);
    setDeleteOpen(true);
  };

  // Close delete modal
  const handleCloseDeleteModal = () => {
    setDeleteOpen(false);
    setVoucherToDelete(null);
  };

  // Confirm delete action
  const handleConfirmDelete = async () => {
    if (!voucherToDelete) return;
    
    setDeleteLoading(true);
    try {
      // Simulate API deletion
      setTimeout(() => {
        // Filter out the deleted voucher
        setData(data.filter(item => item.id !== voucherToDelete.id));
        
        toast(t('Table.deleteConfirm.success'), {
          description: t('Table.deleteConfirm.successDesc', { code: voucherToDelete.code }),
        });
        
        setDeleteLoading(false);
        handleCloseDeleteModal();
      }, 500);
    } catch (error) {
      console.error('Error deleting voucher:', error);
      toast(t('Table.deleteConfirm.error'), {
        description: t('Table.deleteConfirm.errorDesc')
      });
      setDeleteLoading(false);
      handleCloseDeleteModal();
    }
  };

  // Open add/edit modal
  const handleOpenUpsertModal = (mode: 'add' | 'edit', voucher?: Voucher) => {
    setModalMode(mode);
    if (mode === 'edit' && voucher) {
      setVoucherToEdit(voucher);
    } else {
      setVoucherToEdit(null);
    }
    setUpsertOpen(true);
  };

  // Close add/edit modal
  const handleCloseUpsertModal = () => {
    setUpsertOpen(false);
    setVoucherToEdit(null);
  };

  // Add voucher
  const addVoucher = async (formData: VoucherCreateRequest) => {
    try {
      // Simulate API creation
      setTimeout(() => {
        // Create a new voucher with a generated ID
        const newVoucher = {
          ...formData,
          id: `new-${Date.now()}`,
          usageCount: 0,
          discountStatus: 'ACTIVE',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        } as unknown as Voucher;
        
        // Add the new voucher to the data
        setData([newVoucher, ...data]);
        
        toast(t('Form.addSuccess'), {
          description: t('Form.addSuccessDesc', { code: formData.code }),
        });
        
        handleCloseUpsertModal();
      }, 500);
    } catch (error) {
      console.error('Error adding voucher:', error);
      toast(t('Form.addError'), {
        description: t('Form.addErrorDesc'),
      });
    }
  };

  // Edit voucher
  const editVoucher = async (formData: Voucher) => {
    try {
      // Simulate API update
      setTimeout(() => {
        // Update the voucher in the data
        const updatedData = data.map(item => 
          item.id === formData.id ? { ...item, ...formData, updatedAt: new Date().toISOString() } : item
        );
        
        setData(updatedData);
        
        toast(t('Form.editSuccess'), {
          description: t('Form.editSuccessDesc', { code: formData.code }),
        });
        
        handleCloseUpsertModal();
      }, 500);
    } catch (error) {
      console.error('Error updating voucher:', error);
      toast(t('Form.editError'), {
        description: t('Form.editErrorDesc'),
      });
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
    addVoucher,
    editVoucher,
  };
}
