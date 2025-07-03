"use client";

import { useEffect, useState } from "react";
import { CategoryColumns, CategoryTableData } from "./category-Columns";
import SearchInput from "@/components/ui/data-table-component/search-input";
import { DataTable } from "@/components/ui/data-table-component/data-table";
import { Pagination } from "@/components/ui/data-table-component/pagination";
import { useCategory } from "./useCategory";
import { useDebounce } from "@/hooks/useDebounce";
import { Loader2, Plus } from "lucide-react";
import { CategoryModalView } from "./category-ModalView";
import { CategoryModalUpsert } from "./category-ModalUpsert";
import { useTranslation } from "react-i18next";
import { useDataTable } from "@/hooks/useDataTable";
import DataTableViewOption from "@/components/ui/data-table-component/data-table-view-option";
import { Button } from "@/components/ui/button";
import { mockCategoryData } from "./category-MockData";


// Để hiển thị dữ liệu mẫu, hãy dùng mockCategoryData làm data cho table khi chưa có dữ liệu thực tế
// Xoá dòng DataTable lỗi phía trên, chỉ render DataTable trong return như bên dưới

export function CategoryTable() {
  const { t } = useTranslation();
  const {
    categories,
    totalItems,
    page,
    totalPages,
    loading,
    getAllCategories,
  } = useCategory();

  const [searchValue, setSearchValue] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [limit, setLimit] = useState(10);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<any | null>(null);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>("add");

  const debouncedSearchValue = useDebounce(searchValue, 1000);

  useEffect(() => {
    getAllCategories();
  }, []);

  useEffect(() => {
    if (debouncedSearchValue !== undefined) {
      setIsSearching(true);
      getAllCategories({ 
        metadata: { 
          page: 1, 
          limit: limit,
          search: debouncedSearchValue || undefined
        } 
      }).finally(() => setIsSearching(false));
    }
  }, [debouncedSearchValue, limit]);

  const handleSearch = (value: string) => {
    setSearchValue(value);
  };

  const handlePageChange = (newPage: number) => {
    getAllCategories({ metadata: { page: newPage, limit: limit } });
  };

  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    getAllCategories({ metadata: { page: 1, limit: newLimit } });
  };



  const handleCreateCategory = () => {
    setSelectedCategory(null);
    setModalMode("add");
    setModalOpen(true);
  };

  // Nếu không có dữ liệu thực tế thì hiển thị dữ liệu mẫu
  // Truyền callback để hiển thị nút sửa/xóa
  const handleEdit = (category: CategoryTableData) => {
    setSelectedCategory(category);
    setModalMode("edit");
    setModalOpen(true);
  };
  const handleDelete = (category: CategoryTableData) => {
    // TODO: Thực hiện logic xóa ở đây
    // Ví dụ: mở modal xác nhận xóa hoặc gọi API xóa
    alert(`Xóa: ${category.name}`);
  };
  const handleView = (category: CategoryTableData) => {
    setSelectedCategory(category);
    setModalMode("edit");
    setModalOpen(true);
  };
  const table = useDataTable({
    data: (categories && categories.length > 0) ? categories : mockCategoryData,
    columns: CategoryColumns({
      onEdit: handleEdit,
      onDelete: handleDelete,
      onView: handleView,
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
            onView: handleView,
          })}
          notFoundMessage={t('admin.pages.category.noData')}
          // Đã bỏ tính năng click row mở modal edit, không truyền onRowClick
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
