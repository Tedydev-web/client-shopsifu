'use client'

import { useTranslation } from 'react-i18next'
import { DataTable } from '@/components/ui/data-table-component/data-table'
import { Pagination } from '@/components/ui/data-table-component/pagination'
import { userColumns } from './users-Columns'
import { ConfirmDeleteModal } from '@/components/ui/confirm-delete-modal'
import UsersModalUpsert from './users-ModalUpsert'
import { useUsers } from './useUsers'
import { User } from '@/types/user.interface'

export default function UserTable({ search }: { search: string }) {
  const { t } = useTranslation();
  
  const {
    data,
    totalRecords,
    loading,
    limit,
    offset,
    currentPage,
    totalPages,
    deleteOpen,
    userToDelete,
    deleteLoading,
    handleOpenDelete,
    handleConfirmDelete,
    editOpen,
    userToEdit,
    handleOpenEdit,
    setEditOpen,
    editUser,
    handlePageChange,
    handleLimitChange,
    handleCloseDeleteModal,
  } = useUsers();

  return (
    <div className="space-y-4 relative">
      {/* Loading overlay chỉ che bảng, không che search input */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/60 z-10">
          <span className="text-gray-500 text-sm">
            {t('admin.users.loading')}
          </span>
        </div>
      )}

      <DataTable
        columns={userColumns({ onDelete: handleOpenDelete, onEdit: handleOpenEdit })}
        data={data}
      />

      {totalPages > 0 && (
        <Pagination
          limit={limit}
          page={currentPage}
          totalPages={totalPages}
          totalRecords={totalRecords}
          onPageChange={handlePageChange}
          onLimitChange={handleLimitChange}
        />
      )}

      {/* Xác nhận xóa */}
      <ConfirmDeleteModal
        open={deleteOpen}
        onClose={() => { if (!deleteLoading) handleCloseDeleteModal() }}
        onConfirm={handleConfirmDelete}
        title={t('admin.users.deleteConfirm.title')}
        description={
          userToDelete
            ? t('admin.users.deleteConfirm.description', { name: userToDelete.name })
            : ''
        }
        confirmText={t('admin.users.deleteConfirm.confirmText')}
        cancelText={t('admin.users.deleteConfirm.cancelText')}
        loading={deleteLoading}
      />

      {/* Modal cập nhật người dùng */}
      <UsersModalUpsert
        open={editOpen}
        onClose={() => setEditOpen(false)}
        mode="edit"
        user={userToEdit!}
        onSubmit={async (user) => {
          editUser(user as User)
        }}
      />
    </div>
  )
}
