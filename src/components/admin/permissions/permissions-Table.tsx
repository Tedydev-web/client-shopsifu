'use client'

import { useEffect, useState } from "react"
import { PermissionsColumns, Permission } from "./permissions-Columns"
import SearchInput from "@/components/ui/data-table-component/search-input"
import PermissionsModalUpsert from "./permissions-ModalUpsert"
import { ConfirmDeleteModal } from "@/components/ui/confirm-delete-modal"
import { DataTable } from "@/components/ui/data-table-component/data-table"
import { usePermissions } from "./usePermissions"
import { useTranslations } from "next-intl"
import DataTableViewOption from "@/components/ui/data-table-component/data-table-view-option"
import { useDataTable } from "@/hooks/useDataTable"

export function PermissionsTable() {
  const t = useTranslations()
  const {
    permissions,
    loading,
    isSearching,
    search,
    handleSearch,
    isModalOpen,
    selectedPermission,
    getAllPermissions,
    deletePermission,
    createPermission,
    updatePermission,
    handleOpenModal,
    handleCloseModal
  } = usePermissions()

  const [deleteOpen, setDeleteOpen] = useState(false)
  const [permissionToDelete, setPermissionToDelete] = useState<Permission | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  useEffect(() => {
    getAllPermissions()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleOpenDelete = (permission: Permission) => {
    setPermissionToDelete(permission)
    setDeleteOpen(true)
  }

  const handleCloseDeleteModal = () => {
    setDeleteOpen(false)
    setPermissionToDelete(null)
  }

  const handleConfirmDelete = async () => {
    if (!permissionToDelete) return
    setDeleteLoading(true)
    try {
      const success = await deletePermission(permissionToDelete.id.toString())
      if (success) {
        handleCloseDeleteModal()
        getAllPermissions()
      }
    } catch (error) {
      console.error('Lỗi khi xóa quyền:', error)
    } finally {
      setDeleteLoading(false)
    }
  }

  const handleSubmit = async (formData: any) => {
    try {
      if (selectedPermission) {
        await updatePermission(selectedPermission.code, formData)
      } else {
        await createPermission(formData)
      }
      handleCloseModal()
      getAllPermissions()
    } catch (error) {
      console.error('Lỗi khi xử lý quyền:', error)
    }
  }

  const table = useDataTable({
    data: permissions,
    columns: PermissionsColumns({ onDelete: handleOpenDelete, onEdit: handleOpenModal }),
  })

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-end gap-2">
        <SearchInput
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder={t("admin.permissions.searchPlaceholder")}
          className="w-full md:max-w-sm"
        />
        <DataTableViewOption table={table} />
      </div>

      <div className="relative">
        <DataTable
          table={table}
          columns={PermissionsColumns({ onDelete: handleOpenDelete, onEdit: handleOpenModal })}
          loading={loading || isSearching}
          notFoundMessage={t('admin.permissions.notFound')}
        />
      </div>

      {/* <PermissionsModalUpsert
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        permission={selectedPermission}
      />

      <ConfirmDeleteModal
        isOpen={deleteOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        loading={deleteLoading}
        title={t("admin.permissions.deleteTitle")}
        description={t("admin.permissions.deleteDescription")}
      /> */}
    </div>
  )
}
