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
        <div className="w-[80px] flex justify-center">
          <Avatar className="h-12 w-12 border-2 border-gray-200">
            <AvatarImage src={brand.logo} alt={brand.name} className="object-contain p-1" />
            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
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
    cell: ({ row }) => (
      <div className="w-[100px]">
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          {row.getValue("code")}
        </span>
      </div>
    ),
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tên thương hiệu" />
    ),
    cell: ({ row }) => (
      <div className="w-[180px]">
        <p className="font-semibold text-gray-900">{row.getValue("name")}</p>
      </div>
    ),
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
      if (!description) return (
        <div className="w-[250px] text-gray-400 italic">
          Chưa có mô tả
        </div>
      )
      return (
        <div className="w-[250px]">
          <p className="text-sm text-gray-600 leading-relaxed overflow-hidden text-ellipsis" 
             style={{
               display: '-webkit-box',
               WebkitLineClamp: 2,
               WebkitBoxOrient: 'vertical'
             }}
             title={description}>
            {description}
          </p>
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
      return (
        <div className="w-[120px]">
          {country ? (
            <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-green-100 text-green-800">
              {country}
            </span>
          ) : (
            <span className="text-gray-400 italic">-</span>
          )}
        </div>
      )
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
      if (!website) return (
        <div className="w-[180px] text-gray-400 italic">
          Chưa có website
        </div>
      )
      return (
        <div className="w-[180px]">
          <a 
            href={website} 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 hover:underline text-sm truncate transition-colors"
          >
            <span className="truncate">{website.replace(/^https?:\/\//, '')}</span>
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
        <div className="w-[130px]">
          {status === "active" ? (
            <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-green-100 text-green-800">
              Hoạt động
            </span>
          ) : (
            <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800">
              Không hoạt động
            </span>
          )}
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
      if (!date) return (
        <div className="w-[140px] text-gray-400 italic">
          -
        </div>
      )
      return (
        <div className="w-[140px]">
          <div className="text-sm">
            <p className="font-medium text-gray-900">
              {format(new Date(date), "dd/MM/yyyy")}
            </p>
            <p className="text-gray-500 text-xs">
              {format(new Date(date), "HH:mm")}
            </p>
          </div>
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
