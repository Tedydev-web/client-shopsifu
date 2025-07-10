'use client'


import { ColumnDef } from "@tanstack/react-table"
import { format } from "date-fns"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal, Edit, Trash2, Eye, ChevronDown, ChevronRight } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export type CategoryTableData = {
  id: string
  name: string
  parentCategoryId?: number | null
  logo?: string | null
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
  const t  = useTranslations("admin.ModuleCategory.Table");
  return [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={value => table.toggleAllPageRowsSelected(!!value)}
          // aria-label={t('admin.pages.category.selectAll')}
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          disabled={!row.getCanSelect()}
          onCheckedChange={value => row.toggleSelected(!!value)}
          // aria-label={t('admin.pages.category.selectRow')}
        />
      ),
      enableSorting: false,
      enableHiding: false,
      size: 32,
    },
    {
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("name")} />
      ),
      cell: ({ row }) => {
        const category = row.original;
        return (
          <div className="flex items-center gap-1">
            <span className="font-medium">{category.name}</span>
          </div>
        );
      },
      enableSorting: true,
      enableHiding: false,
      filterFn: "includesString",
    },
    {
      accessorKey: "parentCategoryId",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("parentCategory")} />
      ),
      cell: ({ row }) => {
        const parentId = row.getValue("parentCategoryId");
        return (
          <div>{parentId ? String(parentId) : t("noParent")}</div>
        );
      },
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: "logo",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("logo")} />
      ),
      cell: ({ row }) => {
        const logo = row.getValue("logo") as string | null;
        return logo ? (
          <div className="h-10 w-10 relative">
            <img
              src={logo}
              alt={row.getValue("name")}
              className="h-full w-full object-contain rounded"
            />
          </div>
        ) : (
          <div className="text-muted-foreground italic">{t("noLogo")}</div>
        );
      },
      enableSorting: false,
      enableHiding: true,
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("createdAt")} />
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
      header: () => <div>{t("actions")}</div>,
      cell: ({ row }) => {
        const category = row.original;
        return (
          <div className="flex justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
                >
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">{t("openMenu")}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[160px]">
                <DropdownMenuItem
                  onClick={() => onView(category)}
                  className="cursor-pointer"
                >
                  <Eye className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
                  {t("viewSubcategories")}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onEdit(category)}
                  className="cursor-pointer"
                >
                  <Edit className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
                  {t("edit")}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => onDelete(category)}
                  className="cursor-pointer text-destructive focus:text-destructive"
                >
                  <Trash2 className="mr-2 h-3.5 w-3.5" />
                  {t("delete")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
      enableSorting: false,
      enableHiding: false,
    },
  ];
};