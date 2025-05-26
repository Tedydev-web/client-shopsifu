'use client'

import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { PlusIcon, Loader2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import SearchInput from '@/components/ui/data-table-component/search-input'
import { DataTable } from '@/components/ui/data-table-component/data-table'
import { Pagination } from '@/components/ui/data-table-component/pagination'
import { ConfirmDeleteModal } from '@/components/ui/confirm-delete-modal'

import { RolesColumns, Role } from './roles-Columns'
import RolesModalUpsert from './roles-ModalUpsert'
import { useDebounce } from '@/hooks/useDebounce'
import { showToast } from '@/components/ui/toastify'
import { useRoles } from './useRoles'

export default function RolesTable() {
  const { t } = useTranslation()
  const {
    roles,
    totalItems,
    page,
    totalPages,
    loading,
    isModalOpen,
    selectedRole,
    getAllRoles,
    handleOpenModal,
    handleCloseModal,
    setCurrentPage,
    deleteRole,
    createRole,
    updateRole,
  } = useRoles()

  const [searchValue, setSearchValue] = useState("");
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [roleToDelete, setRoleToDelete] =
    useState<Role | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const [limit, setLimit] = useState(10)
  const [offset, setOffset] = useState(0)

  const debouncedSearchValue = useDebounce(searchValue, 1000)

  useEffect(() => {
    getAllRoles({ page, limit })
  }, [page, limit])

  useEffect(() => {
    if (debouncedSearchValue !== undefined) {
      setCurrentPage(1)
      getAllRoles({ page: 1, limit, search: debouncedSearchValue })
    }
  }, [debouncedSearchValue, limit])

  const handleEdit = (role: Role) => {
    handleOpenModal(role)
  }

  const handleOpenDelete = (role: Role) => {
    setRoleToDelete(role);
    setDeleteOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setDeleteOpen(false)
    setRoleToDelete(null)
  }

  const handleConfirmDelete = async () => {
    if (!roleToDelete) return;
    setDeleteLoading(true);
    try {
      const success = await deleteRole(roleToDelete.id); // Chuyển id thành string
      if (success) {
        handleCloseDeleteModal();
        getAllRoles({ page: page, limit}); // Chuyển page và limit thành string
      }
    } catch (error) {
      console.error('Lỗi khi xóa quyền:', error);
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleSubmit = async (values: {
    name: string
    description: string
    isActive: boolean
    permissionIds: string[]
  }) => {
    const payload = {
      name: values.name,
      description: values.description,
      isActive: values.isActive,
      permissionIds: [], // Permission assignment done later?
    }

    try {
      if (selectedRole) {
        await updateRole(selectedRole.id, payload)
        showToast(t('admin.roles.updatedSuccess'), 'success')
      } else {
        await createRole(payload)
        showToast(t('admin.roles.createdSuccess'), 'success')
      }
      handleCloseModal()
      getAllRoles({ page, limit, search: debouncedSearchValue })
    } catch (err) {
      showToast(
        selectedRole
          ? t('admin.roles.updateError')
          : t('admin.roles.createError'),
        'error'
      )
    }
  }

  const handleSearch = (value: string) => {
    setSearchValue(value)
  }

  const handlePageChange = (newPage: number) => {
    getAllRoles({ page: newPage, limit })
  }

  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit)
    getAllRoles({ page: 1, limit: newLimit })
  }

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center gap-2">
        <SearchInput
          value={searchValue}
          onValueChange={handleSearch}
          placeholder={t("admin.roles.searchPlaceholder")}
          className="max-w-sm"
        />
        <Button onClick={() => handleOpenModal()} className="ml-auto">
          <PlusIcon className="w-4 h-4 mr-2" />
          {t("admin.roles.addAction")}
        </Button>
      </div>

      <div className="relative">
        {(loading || isSearching) && (
          <div className="absolute inset-0 bg-white/50 flex items-center justify-center z-10">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}
        <DataTable
          columns={RolesColumns({
            onDelete: handleOpenDelete,
            onEdit: handleEdit,
          })}
          data={roles}
        />
      </div>

      {totalPages > 0 && (
        <Pagination
          limit={limit}
          page={page}
          totalPages={totalPages}
          totalRecords={totalItems}
          onPageChange={setCurrentPage}
          onLimitChange={setLimit}
        />
      )}

      <RolesModalUpsert
        open={isModalOpen}
        onClose={handleCloseModal}
        mode={selectedRole ? "edit" : "add"}
        role={selectedRole}
        onSubmit={handleSubmit}
      />

      <ConfirmDeleteModal
        open={deleteOpen}
        onClose={() => !deleteLoading && setDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
        title={t("admin.roles.confirmDeleteTitle")}
        description={
          roleToDelete
            ? t("admin.roles.confirmDeleteDesc", { name: roleToDelete.name })
            : ""
        }
        confirmText={t("admin.roles.modal.delete")}
        cancelText={t("admin.roles.modal.cancel")}
        loading={deleteLoading}
      />
    </div>
  );
}
