'use client'

import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { DataTableColumnHeader } from "@/components/ui/data-table/data-table-column-header"
import { DataTableRowActions, ActionItem } from "@/components/ui/data-table/data-table-row-actions"
import { Edit, Trash2 } from "lucide-react"
import { format } from "date-fns"

export type Language = {
  id: number
  code: string
  name: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

// Hàm tạo danh sách actions cho Language
const getLanguageActions = (
  language: Language,
  onDelete: (language: Language) => void,
  onEdit: (language: Language) => void
): ActionItem<Language>[] => [
  {
    type: 'command',
    label: 'Sửa thông tin',
    icon: <Edit />,
    onClick: (language) => {
      onEdit(language);
    },
  },
  { type: 'separator' },
  {
    type: 'command',
    label: 'Xóa ngôn ngữ',
    icon: <Trash2 />,
    onClick: (language) => onDelete(language),
    className: 'text-red-600 hover:!text-red-700',
  },
];

export const LanguagesColumns = (
  { onDelete, onEdit }: { onDelete: (language: Language) => void, onEdit: (language: Language) => void }
): ColumnDef<Language>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "code",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Mã ngôn ngữ" />
    ),
    cell: ({ row }) => <div className="w-[80px]">{row.getValue("code")}</div>,
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tên ngôn ngữ" />
    ),
    cell: ({ row }) => <div className="w-[160px]">{row.getValue("name")}</div>,
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Ngày tạo" />
    ),
    cell: ({ row }) => {
      return (
        <div className="w-[160px]">
          {format(new Date(row.getValue("createdAt")), "dd/MM/yyyy HH:mm")}
        </div>
      )
    },
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "updatedAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Ngày cập nhật" />
    ),
    cell: ({ row }) => {
      return (
        <div className="w-[160px]">
          {format(new Date(row.getValue("updatedAt")), "dd/MM/yyyy HH:mm")}
        </div>
      )
    },
    enableSorting: true,
    enableHiding: true,
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} actions={getLanguageActions(row.original, onDelete, onEdit)} />,
  },
]
