'use client'


import { ColumnDef } from "@tanstack/react-table"
import { format } from "date-fns"
import { useTranslation } from "react-i18next"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal, Edit, Trash2, Eye, ChevronDown, ChevronRight } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export type CategoryTableData = {
  id: string
  name: string
  description?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
  depth?: number
  children?: CategoryTableData[]
}

interface CategoryColumnsProps {
  onView?: (category: CategoryTableData) => void;
  onEdit?: (category: CategoryTableData) => void;
  onDelete?: (category: CategoryTableData) => void;
}

import { Checkbox } from "@/components/ui/checkbox";
import { DataTableColumnHeader } from "@/components/ui/data-table-component/data-table-column-header";


export const CategoryColumns = (param: CategoryColumnsProps = {}, table?: any): ColumnDef<CategoryTableData>[] => {
  const { onView, onEdit, onDelete } = param || {};
  const { t } = useTranslation();
  return [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={value => table.toggleAllPageRowsSelected(!!value)}
          aria-label={t('admin.pages.category.selectAll')}
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          disabled={!row.getCanSelect()}
          onCheckedChange={value => row.toggleSelected(!!value)}
          aria-label={t('admin.pages.category.selectRow')}
        />
      ),
      enableSorting: false,
      enableHiding: false,
      size: 32,
    },
    {
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("admin.pages.category.column.name")} />
      ),
      cell: ({ row }) => {
        const category = row.original;
        const hasChildren = Array.isArray(category.children) && category.children.length > 0;
        const expanded = row.getIsExpanded ? row.getIsExpanded() : false;
        return (
          <div style={{ paddingLeft: (category.depth || 0) * 20 }} className="flex items-center gap-1">
            {hasChildren && (
              <Button
                type="button"
                size="icon"
                variant="ghost"
                className="w-6 h-6 p-0 text-gray-500 hover:text-primary"
                onClick={() => row.toggleExpanded && row.toggleExpanded()}
                aria-label={expanded ? t('admin.pages.category.collapse') : t('admin.pages.category.expand')}
              >
                {expanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </Button>
            )}
            <span className="font-medium">{category.name}</span>
          </div>
        );
      },
      enableSorting: true,
      enableHiding: false,
      filterFn: "includesString",
    },
    {
      accessorKey: "isActive",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("admin.pages.category.column.status")} />
      ),
      cell: ({ row }) => {
        const isActive = row.getValue("isActive") as boolean;
        return (
          <Badge variant={isActive ? "default" : "secondary"}>
            {isActive ? t("admin.pages.category.statusActive") : t("admin.pages.category.statusInactive")}
          </Badge>
        );
      },
      enableSorting: true,
      enableHiding: true,
      filterFn: (row, columnId, filterValue) => {
        if (!filterValue) return true;
        return String(row.getValue(columnId)) === filterValue;
      },
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("admin.pages.category.column.createdAt")} />
      ),
      cell: ({ row }) => (
        <div className="whitespace-nowrap">{format(new Date(row.getValue("createdAt")), "yyyy-MM-dd HH:mm")}</div>
      ),
      enableSorting: true,
      enableHiding: true,
      filterFn: (row, columnId, filterValue) => {
        if (!filterValue) return true;
        const rowDate = format(new Date(row.getValue(columnId)), "yyyy-MM-dd");
        return rowDate === filterValue;
      },
    },
    {
      id: "actions",
      header: () => <div>{t("admin.pages.category.column.actions")}</div>,
      cell: ({ row }) => {
        const category = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {onView && (
                <DropdownMenuItem onClick={() => onView(category)}>
                  <Eye className="mr-2 h-4 w-4" />
                  {t("admin.pages.category.actions.view")}
                </DropdownMenuItem>
              )}
              {onEdit && (
                <DropdownMenuItem onClick={() => onEdit(category)}>
                  <Edit className="mr-2 h-4 w-4" />
                  {t("admin.pages.category.actions.edit")}
                </DropdownMenuItem>
              )}
              {onDelete && (
                <DropdownMenuItem onClick={() => onDelete(category)} className="text-destructive">
                  <Trash2 className="mr-2 h-4 w-4" />
                  {t("admin.pages.category.actions.delete")}
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
      enableSorting: false,
      enableHiding: false,
    },
  ];
};

// =============================
// HƯỚNG DẪN SỬ DỤNG CHO TABLE DANH MỤC (CÓ HIERARCHY, EXPAND/COLLAPSE, MULTI-SELECT)
//
// 1. Import mock data và columns:
//    import { mockCategoryData } from './category-MockData';
//    import { CategoryColumns } from './category-Columns';
//
// 2. Khởi tạo table với TanStack Table:
//    const table = useReactTable({
//      data: mockCategoryData, // DỮ LIỆU TREE (KHÔNG FLATTEN)
//      columns: CategoryColumns({ ...handlers }, table),
//      getSubRows: row => row.children || [], // BẮT BUỘC để expand/collapse hoạt động
//      getRowId: row => row.id, // Đảm bảo row có id duy nhất
//      getExpandedRowModel: getExpandedRowModel(), // BẮT BUỘC để expand/collapse hoạt động
//      // ... các options khác
//    });
//
// 3. Đảm bảo table được cấu hình đúng:
//    - getSubRows: row => row.children || []
//    - getRowId: row => row.id
//    - getExpandedRowModel: getExpandedRowModel()
//    - data: mockCategoryData (tree, không flatten)
//    - columns: CategoryColumns({ ...handlers }, table)
//    Nếu dùng Next.js/React, hãy chắc chắn table.getRowModel().rows chứa các row cha/con đúng thứ tự tree.
//    Nếu muốn custom render row con, dùng table.getExpandedRowModel().rows hoặc table.getRowModel().rows.
//    Nếu vẫn không thấy dữ liệu con, kiểm tra lại mockCategoryData có children đúng dạng array và mỗi node có id duy nhất.
//
// 4. KHÔNG FLATTEN dữ liệu, truyền tree trực tiếp từ mockCategoryData hoặc API.
//
// 5. Để expand/collapse hoạt động:
//    - getSubRows: row => row.children || []
//    - getRowId: row => row.id
//    - getExpandedRowModel: getExpandedRowModel()
//
// 6. Để multi-select hoạt động:
//    - Sử dụng column id "select" (đã có sẵn ở đầu columns)
//    - table.getIsAllPageRowsSelected(), row.getIsSelected(), ...
//
// 7. Để filter/sort/hide hoạt động:
//    - Đã cấu hình sẵn cho các column phù hợp (xem enableSorting, enableHiding, filterFn trong từng column ở CategoryColumns)
//
// 8. Nếu muốn custom thêm, hãy xem ví dụ ở README hoặc hỏi Copilot để được hướng dẫn chi tiết hơn.
// =============================
