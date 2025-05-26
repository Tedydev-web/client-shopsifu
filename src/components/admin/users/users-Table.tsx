'use client'

import { useEffect, useState } from 'react'
import { DataTable } from '@/components/ui/data-table-component/data-table'
import { Pagination } from '@/components/ui/data-table-component/pagination'
import { userColumns } from './users-Columns'
import { User } from '@/types/user.interface'
import { ConfirmDeleteModal } from '@/components/ui/confirm-delete-modal'
import { useUsers } from './useUsers'
import UsersModalUpsert from './users-ModalUpsert'

export default function UserTable({ search }: { search: string }) {
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
          <span className="text-gray-500 text-sm">Đang tải dữ liệu...</span>
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

      {/* Popup xác nhận xóa */}
      <ConfirmDeleteModal
        open={deleteOpen}
        onClose={() => { if (!deleteLoading) handleCloseDeleteModal() }}
        onConfirm={handleConfirmDelete}
        title="Xác nhận xóa người dùng"
        description={
          userToDelete
            ? <>Bạn có chắc chắn muốn xóa người dùng <b>{userToDelete.name}</b> không? Hành động này không thể hoàn tác.</>
            : ""
        }
        confirmText="Xóa"
        cancelText="Hủy"
        loading={deleteLoading}
      />

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
