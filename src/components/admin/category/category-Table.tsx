"use client";

import { CategoryColumns, CategoryTableData } from "./category-Columns";
import SearchInput from "@/components/ui/data-table-component/search-input";
import { DataTable } from "@/components/ui/data-table-component/data-table";
import { Pagination } from "@/components/ui/data-table-component/pagination";
import { useCategory } from "./useCategory";
import { Loader2, Plus } from "lucide-react";
import { CategoryModalUpsert } from "./category-ModalUpsert";
import { useTranslation } from "react-i18next";
import { useDataTable } from "@/hooks/useDataTable";
import DataTableViewOption from "@/components/ui/data-table-component/data-table-view-option";
import { Button } from "@/components/ui/button";

export function CategoryTable() {
  const { t } = useTranslation();
  const {
    data: categories,
    loading,
    pagination,
    handlePageChange,
    handleLimitChange,
    handleSearch,
    handleSortChange,
    refreshData,
    
    // Modal states
    upsertOpen,
    modalMode,
    categoryToEdit,
    handleOpenUpsertModal,
    handleCloseUpsertModal,
    
    // Delete states
    deleteOpen,
    categoryToDelete,
    deleteLoading,
    handleOpenDelete,
    handleConfirmDelete,
    handleCloseDeleteModal,
    
    // CRUD functions
    addCategory,
    editCategory,
  } = useCategory();

  const handleCreateCategory = () => {
    handleOpenUpsertModal('add');
  };
  
  const table = useDataTable({
    data: categories || [],
    columns: CategoryColumns({
      onEdit: (category) => handleOpenUpsertModal('edit', category),
      onDelete: handleOpenDelete,
      // Disable view functionality as per requirements
      onView: undefined,
    }),
  });

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between gap-2">
        <SearchInput
          value={searchValue}
          onValueChange={handleSearch}
          placeholder={t("admin.pages.category.searchPlaceholder")}
          className="max-w-sm"
        />
        <div className="flex flex-col items-end gap-2">
          <Button onClick={handleCreateCategory} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            {t("admin.pages.category.addCategory")}
          </Button>
          <DataTableViewOption table={table} />
        </div>
      </div>
      <div className="relative">
        <DataTable
          table={table}
          columns={CategoryColumns({
            onEdit: handleEdit,
            onDelete: handleDelete,
            // Disable view functionality as per requirements
            onView: undefined,
          })}
          notFoundMessage={t('admin.pages.category.noData')}
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
      {/* <CategoryModalView
        open={modalOpen}
        onOpenChange={setModalOpen}
        data={selectedCategory}
      /> */}
      <CategoryModalUpsert
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        mode={modalMode}
        category={selectedCategory}
      />
    </div>
  );
}
