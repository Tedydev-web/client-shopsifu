'use client'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/ui/data-table-component/data-table'
import { voucherColumns } from './voucher-Columns'
import { ConfirmDeleteModal } from '@/components/ui/confirm-delete-modal'
// import VoucherModalUpsert from './voucher-ModalUpsert'
import { useVouchers } from './hook/useVouchers'
import SearchInput from '@/components/ui/data-table-component/search-input'
import { PlusIcon } from 'lucide-react'
import { Voucher, VoucherCreateRequest } from '@/types/admin/voucher.interface'
import { useDataTable } from '@/hooks/useDataTable'
import DataTableViewOption from '@/components/ui/data-table-component/data-table-view-option'
import VoucherFormCreate from './voucher-FormCreate'
import { useState } from 'react'

export default function VoucherTable() {
  const t = useTranslations("admin.ModuleVouchers.Table");
  const [showCreateForm, setShowCreateForm] = useState(false);
  
  const {
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
  } = useVouchers();

  const table = useDataTable({
      data: data,
      columns: voucherColumns({ onEdit: (voucher) => handleOpenUpsertModal('edit', voucher), onDelete: handleOpenDelete }),
    });
  return (
    <div className="w-full space-y-4">
        <div className="bg-background border rounded-lg p-4">
          <VoucherFormCreate />
        </div>

      {/* Hàng 2: Search + View Option */}
      <div className="flex justify-between flex-wrap gap-4 items-center">
        <div className="flex-1">
          <SearchInput
            value={pagination.search || ""}
            onValueChange={(value) => handleSearch(value)}
            placeholder={t("searchPlaceholder")}
            className="w-full md:max-w-sm"
          />
        </div>
        <DataTableViewOption table={table} />
      </div>

      {/* Data Table */}
      <div className="relative">
        <DataTable
          table={table}
          columns={voucherColumns({ onEdit: (voucher) => handleOpenUpsertModal('edit', voucher), onDelete: handleOpenDelete })}
          loading={loading}
          notFoundMessage={t('notFound')}
          pagination={{
            metadata: pagination,
            onPageChange: handlePageChange,
            onLimitChange: handleLimitChange,
          }}
        />
      </div>

      {/* Modal xác nhận xóa */}
      <ConfirmDeleteModal
        open={deleteOpen}
        onClose={() => {
          if (!deleteLoading) handleCloseDeleteModal();
        }}
        onConfirm={handleConfirmDelete}
        title={t('deleteConfirm.title')}
        description={
          voucherToDelete
            ? t('deleteConfirm.description', {
                code: voucherToDelete?.code || '',
              })
            : ''
        }
        confirmText={t('deleteConfirm.deleteAction')}
        cancelText={t('deleteConfirm.cancel')}
        loading={deleteLoading}
      />
    </div>
  )
}
