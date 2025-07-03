'use client'


import { ColumnDef } from "@tanstack/react-table"
import { format } from "date-fns"
import { useTranslation } from "react-i18next"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal, Edit, Trash2, Eye } from "lucide-react"
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
    // Checkbox multi-select column
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={value => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          disabled={!row.getCanSelect()}
          onCheckedChange={value => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
      size: 32,
    },
    // Name column with filter (giống Languages)
    {
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("admin.pages.category.column.name")} />
      ),
      cell: ({ row }) => <div className="font-medium">{row.getValue("name")}</div>,
      enableSorting: true,
      enableHiding: false,
      filterFn: "includesString",
    },
    // Status column with filter (giống Languages, dùng DataTableColumnHeader)
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
    // CreatedAt column with date filter
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
        // So sánh ngày yyyy-MM-dd
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
