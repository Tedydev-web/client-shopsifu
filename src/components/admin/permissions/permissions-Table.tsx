'use client'

import { useEffect, useState } from "react"
import { PermissionsColumns, Permission } from "./permissions-Columns"
import SearchInput from "@/components/ui/data-table-component/search-input"
import PermissionsModalUpsert from "./permissions-ModalUpsert"
import { PlusIcon, Loader2 } from "lucide-react"
import { ConfirmDeleteModal } from "@/components/ui/confirm-delete-modal"
import { DataTable } from "@/components/ui/data-table-component/data-table"
import { Pagination } from "@/components/ui/data-table-component/pagination"
import { Button } from "@/components/ui/button"
import { usePermissions } from "./usePermissions"
import { useDebounce } from "@/hooks/useDebounce"
import { useTranslation } from "react-i18next"

export function PermissionsTable() {
  const { t } = useTranslation()
  const {
    permissions,
    totalItems,
    page,
    totalPages,
    loading,
    isModalOpen,
    selectedPermission,
    getAllPermissions,
    deletePermission,
    createPermission,
    updatePermission,
    handleOpenModal,
    handleCloseModal
  } = usePermissions()

  const [searchValue, setSearchValue] = useState("")
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [permissionToDelete, setPermissionToDelete] = useState<Permission | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [isSearching, setIsSearching] = useState(false)

  const [limit, setLimit] = useState(10)
  const [offset, setOffset] = useState(0)

  const debouncedSearchValue = useDebounce(searchValue, 1000)

  useEffect(() => {
    getAllPermissions()
  }, [])

  useEffect(() => {
    if (debouncedSearchValue !== undefined) {
      setIsSearching(true)
      getAllPermissions({ page: 1, limit, search: debouncedSearchValue })
      .finally(() => {
        setIsSearching(false)
      })
    }
  }, [debouncedSearchValue, limit])

  const handleEdit = (permission: Permission) => {
    handleOpenModal(permission)
  }

  const handleOpenDelete = (permission: Permission) => {
    setPermissionToDelete(permission)
    setDeleteOpen(true)
  }

  const handleCloseDeleteModal = () => {
    setDeleteOpen(false)
    setPermissionToDelete(null)
  }

  const handleConfirmDelete = async () => {
    if (!permissionToDelete) return;
    setDeleteLoading(true);
    try {
      const success = await deletePermission(permissionToDelete.id.toString()); // Chuyển id thành string
      if (success) {
        handleCloseDeleteModal();
        getAllPermissions({ page: page, limit}); // Chuyển page và limit thành string
      }
    } catch (error) {
      console.error('Lỗi khi xóa quyền:', error);
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleSubmit = async (values: {
    code?: string;
    name: string;
    description: string;
    path: string;
    method: string;
  }) => {
    try {
      if (selectedPermission) {
        // Gán code cho id vì giá trị code chính là id
        const id = selectedPermission.code;
  
        const response = await updatePermission(id, {
          name: values.name,
          description: values.description,
          path: values.path,
          method: values.method,
        });
  
        if (response) {
          handleCloseModal();
          getAllPermissions({ page, limit });
        }
      } else {
        // Tạo mới
        const response = await createPermission({
          name: values.name,
          description: values.description,
          path: values.path,
          method: values.method,
        });
  
        if (response) {
          handleCloseModal();
          getAllPermissions({ page, limit });
        }
      }
    } catch (error) {
      console.error("Error saving permission:", error);
    }
  };

  const handleSearch = (value: string) => {
    setSearchValue(value)
  }

  const handlePageChange = (newPage: number) => {
    getAllPermissions({ page: newPage, limit })
  }

  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit)
    getAllPermissions({ page: 1, limit: newLimit })
  }

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center gap-2">
        <SearchInput
          value={searchValue}
          onValueChange={handleSearch}
          placeholder={t("admin.permissions.searchPlaceholder")}
          className="max-w-sm"
        />
        <Button onClick={() => handleOpenModal()} className="ml-auto">
          <PlusIcon className="w-4 h-4 mr-2" />{t("admin.permissions.addAction")}
        </Button>
      </div>

      <div className="relative">
        {(loading || isSearching) && (
          <div className="absolute inset-0 bg-white/50 flex items-center justify-center z-10">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}
        <DataTable
          columns={PermissionsColumns({ onDelete: handleOpenDelete, onEdit: handleEdit })}
          data={permissions}
        />
      </div>

      {totalPages > 0 && (
        <Pagination
          limit={limit}
          page={page}
          totalPages={totalPages}
          totalRecords={totalItems}
          onPageChange={handlePageChange}
          onLimitChange={handleLimitChange}
        />
      )}

      <PermissionsModalUpsert
        open={isModalOpen}
        onClose={handleCloseModal}
        mode={selectedPermission ? "edit" : "add"}
        permission={selectedPermission}
        onSubmit={handleSubmit}
      />

      <ConfirmDeleteModal
        open={deleteOpen}
        onClose={() => { if (!deleteLoading) handleCloseDeleteModal() }}
        onConfirm={handleConfirmDelete}
        title={t("admin.permissions.confirmDeleteTitle")}
        description={
          permissionToDelete
            ? t("admin.permissions.confirmDeleteDesc", { name: permissionToDelete.name })
            : ""
        }
        confirmText={t("admin.permissions.modal.delete")}
        cancelText={t("admin.permissions.modal.cancel")}
        loading={deleteLoading}
      />
    </div>
  )
}
