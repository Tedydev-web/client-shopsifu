'use client'

import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { PlusIcon, Loader2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/ui/data-table-component/data-table'
import { Pagination } from '@/components/ui/data-table-component/pagination'
import { ConfirmDeleteModal } from '@/components/ui/confirm-delete-modal'

import { RolesColumns, Role } from './roles-Columns'
import RolesModalUpsert from './roles-ModalUpsert'
import { useDebounce } from '@/hooks/useDebounce'
import { showToast } from '@/components/ui/toastify'
import { useRoles } from './useRoles'
import {
  RoleCreateRequest,
  RoleUpdateRequest,
} from "@/types/auth/role.interface"

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
    fetchRoles,
    handleOpenModal,
    handleCloseModal,
    setCurrentPage,
    deleteRole,
    createRole,
    updateRole,
    permissionsData,
    isPermissionsLoading,
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
    fetchRoles({ metadata: { page: page, limit: limit } })
  }, [page, limit])

  useEffect(() => {
    if (debouncedSearchValue !== undefined) {
      setCurrentPage(1)
      fetchRoles({ metadata: { page: 1, limit: limit, search: debouncedSearchValue } })
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
        fetchRoles({ metadata: { page: page, limit: limit }}); // Chuyển page và limit thành string
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
    permissionIds: number[]
  }) => {
    try {
      if (selectedRole) {
        const payload: RoleUpdateRequest = {
          name: values.name,
          description: values.description,
          isActive: values.isActive,
          permissionIds: values.permissionIds,
          message: "",
        };
        await updateRole(selectedRole.id, payload);
      } else {
        const payload: RoleCreateRequest = {
          name: values.name,
          description: values.description,
          permissionIds: values.permissionIds,
          message: "",
        };
        await createRole(payload);
      }
      handleCloseModal();
      fetchRoles({ metadata: { page: page, limit: limit, search: debouncedSearchValue } });
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
    fetchRoles({ metadata: { page: newPage, limit: limit } })
  }

  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit)
    fetchRoles({ metadata: { page: 1, limit: newLimit } })
  }

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center gap-2">
        {/* <SearchInput
          value={searchValue}
          onValueChange={handleSearch}
          placeholder={t("admin.roles.searchPlaceholder")}
          className="max-w-sm"
        /> */}
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

      {totalPages >= 0 && (
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
        permissionsData={permissionsData}
        isPermissionsLoading={isPermissionsLoading}
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
