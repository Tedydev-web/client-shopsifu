'use client'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/ui/data-table-component/data-table'
import { Pagination } from '@/components/ui/data-table-component/pagination'
import { userColumns } from './users-Columns'
import { ConfirmDeleteModal } from '@/components/ui/confirm-delete-modal'
import UsersModalUpsert from './users-ModalUpsert'
import { useUsers } from './useUsers'
import SearchInput from '@/components/ui/data-table-component/search-input'
import { PlusIcon } from 'lucide-react'
import { User, UserCreateRequest } from '@/types/admin/user.interface'
import { useDataTable } from '@/hooks/useDataTable'
import DataTableViewOption from '@/components/ui/data-table-component/data-table-view-option'

export default function UserTable() {
  const t = useTranslations();
  
  const {
    data,
    totalRecords,
    loading,
    limit,
    currentPage,
    totalPages,
    search,
    handleSearch,
    handlePageChange,
    handleLimitChange,
    deleteOpen,
    userToDelete,
    deleteLoading,
    handleOpenDelete,
    handleConfirmDelete,
    handleCloseDeleteModal,
    upsertOpen,
    modalMode,
    userToEdit,
    handleOpenUpsertModal,
    handleCloseUpsertModal,
    addUser,
    editUser,
    roles,
    isSearching,
  } = useUsers();

  const handleSubmit = async (formData: User | UserCreateRequest) => {
    if (modalMode === 'edit') {
      await editUser(formData as User);
    } else {
      await addUser(formData as UserCreateRequest);
    }
  };

  const table = useDataTable({
      data: data,
      columns: userColumns({ onEdit: (user) => handleOpenUpsertModal('edit', user), onDelete: handleOpenDelete }),
    });
  return (
    <div className="space-y-4 relative">
      <div className="flex items-center gap-2">
      <Button 
          onClick={() => handleOpenUpsertModal('add')}
          className="ml-auto"
        >
          <PlusIcon className="w-4 h-4 mr-2" />{t("admin.languages.addAction")}
        </Button>
      </div>
       <div className="flex items-center gap-2">
        <SearchInput
          value={search}
          onValueChange={handleSearch}
          placeholder={t("admin.languages.searchPlaceholder")}
          className="max-w-sm"
        />
        <DataTableViewOption table={table} />
      </div>

      <DataTable
        table={table}
        columns={userColumns({ onEdit: (user) => handleOpenUpsertModal('edit', user), onDelete: handleOpenDelete })}
        loading={loading || isSearching}
        notFoundMessage={t('admin.users.notFound')}
      />

      {totalPages > 1 && (
        <Pagination
          limit={limit}
          page={currentPage}
          totalPages={totalPages}
          totalRecords={totalRecords}
          onPageChange={handlePageChange}
          onLimitChange={handleLimitChange}
        />
      )}

      <ConfirmDeleteModal
        open={deleteOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        title={t('admin.users.deleteConfirm.title')}
        description={
          userToDelete
            ? t('admin.users.deleteConfirm.description', {
                name: userToDelete?.userProfile?.username || '',
              })
            : ''
        }
        loading={deleteLoading}
      />

      {/* Add/Edit Modal */}
      {upsertOpen && (
        <UsersModalUpsert
          open={upsertOpen}
          onClose={handleCloseUpsertModal}
          roles={roles}
          mode={modalMode}
          user={userToEdit}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  )
}
