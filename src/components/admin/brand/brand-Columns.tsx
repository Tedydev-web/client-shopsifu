'use client'

import { ColumnDef } from "@tanstack/react-table"
import { Checkbox } from "@/components/ui/checkbox"
import { DataTableColumnHeader } from "@/components/ui/data-table-component/data-table-column-header"
import { DataTableRowActions, ActionItem } from "@/components/ui/data-table-component/data-table-row-actions"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Edit, Trash2, ExternalLink } from "lucide-react"
import { format } from "date-fns"

export interface Brand {
  id?: string | number
  code: string
  name: string
  description?: string
  logo?: string
  website?: string
  country?: string
  status: "active" | "inactive"
  createdAt?: string
  updatedAt?: string
}

// Hàm tạo danh sách actions cho Brand
const getBrandActions = (
  brand: Brand,
  onDelete: (brand: Brand) => void,
  onEdit: (brand: Brand) => void
): ActionItem<Brand>[] => [
  {
    type: "command",
    label: "Chỉnh sửa",
    icon: <Edit />,
    onClick: (brand) => {
      onEdit(brand);
    },
  },
  { type: "separator" },
  {
    type: "command",
    label: "Xóa",
    icon: <Trash2 />,
    onClick: (brand) => onDelete(brand),
    className: "text-red-600 hover:!text-red-700",
  },
]

type BrandColumnsProps = {
  onEdit: (brand: Brand) => void
  onDelete: (brand: Brand) => void
}

export const BrandColumns = ({ 
  onEdit, 
  onDelete
}: BrandColumnsProps): ColumnDef<Brand>[] => [
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
    accessorKey: "logo",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Logo" />
    ),
    cell: ({ row }) => {
      const brand = row.original
      return (
        <div className="w-[60px]">
          <Avatar className="h-10 w-10">
            <AvatarImage src={brand.logo} alt={brand.name} />
            <AvatarFallback>
              {brand.name.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>
      )
    },
    enableSorting: false,
    enableHiding: true,
  },
  {
    accessorKey: "code",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Mã" />
    ),
    cell: ({ row }) => <div className="w-[100px] font-medium">{row.getValue("code")}</div>,
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tên thương hiệu" />
    ),
    cell: ({ row }) => <div className="w-[180px] font-medium">{row.getValue("name")}</div>,
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "description",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Mô tả" />
    ),
    cell: ({ row }) => {
      const description = row.getValue("description") as string
      if (!description) return <div className="w-[200px] text-gray-500">-</div>
      return (
        <div className="w-[200px] truncate" title={description}>
          {description}
        </div>
      )
    },
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "country",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Quốc gia" />
    ),
    cell: ({ row }) => {
      const country = row.getValue("country") as string
      return <div className="w-[120px]">{country || <span className="text-gray-500">-</span>}</div>
    },
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "website",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Website" />
    ),
    cell: ({ row }) => {
      const website = row.getValue("website") as string
      if (!website) return <div className="w-[160px] text-gray-500">-</div>
      return (
        <div className="w-[160px]">
          <a 
            href={website} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 flex items-center gap-1 truncate"
          >
            <span className="truncate">{website}</span>
            <ExternalLink className="h-3 w-3 flex-shrink-0" />
          </a>
        </div>
      )
    },
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Trạng thái" />
    ),
    cell: ({ row }) => {
      const status = row.getValue("status") as string
      return (
        <div className="w-[120px]">
          <Badge variant={status === "active" ? "default" : "secondary"}>
            {status === "active" ? "Hoạt động" : "Không hoạt động"}
          </Badge>
        </div>
      )
    },
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Ngày tạo" />
    ),
    cell: ({ row }) => {
      const date = row.getValue("createdAt") as string
      if (!date) return <div className="w-[140px] text-gray-500">-</div>
      return (
        <div className="w-[140px]">
          {format(new Date(date), "dd/MM/yyyy HH:mm")}
        </div>
      )
    },
    enableSorting: true,
    enableHiding: true,
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <DataTableRowActions row={row} actions={getBrandActions(row.original, onDelete, onEdit)} />
    ),
  },
]
