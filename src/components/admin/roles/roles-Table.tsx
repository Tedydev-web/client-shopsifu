'use client'

import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { PlusIcon, Loader2 } from 'lucide-react'

import { roleService } from '@/services/roleService'
import { RoleCreateRequest, RoleGetAllResponse } from '@/types/role.interface'

import { Button } from '@/components/ui/button'
import SearchInput from '@/components/ui/data-table/search-input'
import { DataTable } from '@/components/ui/data-table/data-table'
import { Pagination } from '@/components/ui/data-table/pagination'
import { ConfirmDeleteModal } from '@/components/ui/confirm-delete-modal'

import { RolesColumns, Role } from './roles-Columns'
import RolesModalUpsert from './roles-ModalUpsert'
import { useDebounce } from '@/hooks/useDebounce'
import { showToast } from '@/components/ui/toastify'

export default function RolesTable() {
  const { t } = useTranslation()
  const [roles, setRoles] = useState<Role[]>([])
  const [loading, setLoading] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [roleToDelete, setRoleToDelete] = useState<Role | null>(null)
  const [roleToEdit, setRoleToEdit] = useState<Role | null>(null)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)

  const [searchValue, setSearchValue] = useState("")
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [totalPages, setTotalPages] = useState(0)
  const [totalItems, setTotalItems] = useState(0)

  const debouncedSearch = useDebounce(searchValue, 1000)

  const fetchRoles = async () => {
    setLoading(true)
    try {
      const res: RoleGetAllResponse = await roleService.getAll({ page, limit, search: debouncedSearch })
      const flattened = res.data.flat()
      setRoles(flattened)
      setTotalItems(res.totalItems)
      setTotalPages(res.totalPages)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRoles()
  }, [page, limit])

  useEffect(() => {
    if (debouncedSearch !== undefined) {
      setIsSearching(true)
      setPage(1)
      roleService.getAll({ page: 1, limit, search: debouncedSearch })
        .then(res => {
          const flattened = res.data.flat()
          setRoles(flattened)
          setTotalItems(res.totalItems)
          setTotalPages(res.totalPages)
        })
        .finally(() => setIsSearching(false))
    }
  }, [debouncedSearch])

  const handleDelete = (role: Role) => {
    setRoleToDelete(role)
    setDeleteOpen(true)
  }

  const confirmDelete = async () => {
    if (!roleToDelete) return
    setDeleteLoading(true)
    try {
      await roleService.delete(roleToDelete.id.toString())
      setDeleteOpen(false)
      fetchRoles()
      showToast(t("admin.roles.deletedSuccess"), "success")
    } catch (err) {
      showToast(t("admin.roles.deleteError"), "error")
    } finally {
      setDeleteLoading(false)
    }
  }

  const handleAddRole = () => {
    setRoleToEdit(null)
    setIsModalOpen(true)
  }

  const handleEdit = (role: Role) => {
    setRoleToEdit(role)
    setIsModalOpen(true)
  }

  const handleSubmit = async (values: {
    name: string;
    description: string;
    isActive: boolean;
    permissionIds: string[]
  }) => {
    const payload: RoleCreateRequest = {
      name: values.name,
      description: values.description,
      isActive: values.isActive,
      permissionIds: [], // sẽ thay đổi sau khi gán quyền
    };

    try {
      if (roleToEdit) {
        await roleService.update(roleToEdit.id.toString(), payload);
        showToast(t("admin.roles.updatedSuccess"), "success");
      } else {
        await roleService.create(payload);
        showToast(t("admin.roles.createdSuccess"), "success");
      }
      setIsModalOpen(false);
      setRoleToEdit(null);
      fetchRoles();
    } catch (err) {
      showToast(
        roleToEdit
          ? t("admin.roles.updateError")
          : t("admin.roles.createError"),
        "error"
      );
    }
  };

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center gap-2">
        <SearchInput
          value={searchValue}
          onValueChange={setSearchValue}
          placeholder={t("admin.roles.searchPlaceholder")}
          className="max-w-sm"
        />
        <Button onClick={handleAddRole} className="ml-auto">
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
          columns={RolesColumns({ onDelete: handleDelete, onEdit: handleEdit })}
          data={roles}
        />
      </div>

      {totalPages > 0 && (
        <Pagination
          limit={limit}
          page={page}
          totalPages={totalPages}
          totalRecords={totalItems}
          onPageChange={setPage}
          onLimitChange={setLimit}
        />
      )}

      <RolesModalUpsert
        open={isModalOpen}
        onClose={handleCloseModal}
        mode="edit"
        defaultValues={roleToEdit}
        onSubmit={handleSubmit}
      />

      <ConfirmDeleteModal
        open={deleteOpen}
        onClose={() => !deleteLoading && setDeleteOpen(false)}
        onConfirm={confirmDelete}
        title={t("admin.roles.confirmDeleteTitle")}
        description={
          roleToDelete
            ? t("admin.roles.confirmDeleteDesc", { name: roleToDelete.name })
            : ""
        }
        confirmText={t("common.delete")}
        cancelText={t("common.cancel")}
        loading={deleteLoading}
      />
    </div>
  );
}
