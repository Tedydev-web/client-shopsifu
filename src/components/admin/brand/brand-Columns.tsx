'use client'

import { ColumnDef } from "@tanstack/react-table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MoreHorizontal, ExternalLink } from "lucide-react"

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

type BrandColumnsProps = {
  onEdit: (brand: Brand) => void
  onDelete: (brand: Brand) => void
}

export const BrandColumns = ({ onEdit, onDelete }: BrandColumnsProps): ColumnDef<Brand>[] => [
  {
    accessorKey: "logo",
    header: "Logo",
    cell: ({ row }) => {
      const brand = row.original
      return (
        <Avatar className="h-10 w-10">
          <AvatarImage src={brand.logo} alt={brand.name} />
          <AvatarFallback>
            {brand.name.substring(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      )
    },
  },
  {
    accessorKey: "code",
    header: "Mã",
  },
  {
    accessorKey: "name",
    header: "Tên thương hiệu",
  },
  {
    accessorKey: "description",
    header: "Mô tả",
    cell: ({ row }) => {
      const description = row.getValue("description") as string
      if (!description) return <span className="text-gray-500">-</span>
      return (
        <div className="max-w-xs truncate" title={description}>
          {description}
        </div>
      )
    },
  },
  {
    accessorKey: "country",
    header: "Quốc gia",
    cell: ({ row }) => {
      const country = row.getValue("country") as string
      return country ? country : <span className="text-gray-500">-</span>
    },
  },
  {
    accessorKey: "website",
    header: "Website",
    cell: ({ row }) => {
      const website = row.getValue("website") as string
      if (!website) return <span className="text-gray-500">-</span>
      return (
        <div className="flex items-center gap-2">
          <a 
            href={website} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
          >
            <span className="max-w-xs truncate">{website}</span>
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      )
    },
  },
  {
    accessorKey: "status",
    header: "Trạng thái",
    cell: ({ row }) => {
      const status = row.getValue("status") as string
      return (
        <Badge variant={status === "active" ? "default" : "secondary"}>
          {status === "active" ? "Hoạt động" : "Không hoạt động"}
        </Badge>
      )
    },
  },
  {
    accessorKey: "createdAt",
    header: "Ngày tạo",
    cell: ({ row }) => {
      const date = row.getValue("createdAt") as string
      if (!date) return <span className="text-gray-500">-</span>
      return new Date(date).toLocaleDateString("vi-VN")
    },
  },
  {
    id: "actions",
    header: "Thao tác",
    cell: ({ row }) => {
      const brand = row.original
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(brand)}>
              Chỉnh sửa
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDelete(brand)}>
              Xóa
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
