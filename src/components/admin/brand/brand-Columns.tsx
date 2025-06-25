'use client'

import { ColumnDef } from "@tanstack/react-table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { MoreHorizontal } from "lucide-react"

export interface Brand {
  code: string
  name: string
}

type BrandColumnsProps = {
  onEdit: (brand: Brand) => void
  onDelete: (brand: Brand) => void
}

export const BrandColumns = ({ onEdit, onDelete }: BrandColumnsProps): ColumnDef<Brand>[] => [
  {
    accessorKey: "code",
    header: "Mã",
  },
  {
    accessorKey: "name",
    header: "Tên thương hiệu",
  },
  {
    id: "actions",
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
