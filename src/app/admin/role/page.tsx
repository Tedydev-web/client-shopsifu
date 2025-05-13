"use client"

import { DataTable, columns } from "@/components/admin/role/datatable"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from "@/components/ui/pagination"

// Define Product interface inline
interface Product {
  id: string;
  image: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  status: string;
  createdAt: number;
  updatedAt: number;
  actions: string;
}

// Define Category interface inline
interface Category {
  id: string;
  name: string;
}

const products: Product[] = [
  {
    id: "1",
    image: "/images/logo/logofullred.png",
    name: "Sản phẩm 1",
    category: "Danh mục 1",
    price: 100000,
    stock: 50,
    status: "Hoạt động",
    createdAt: 100000,
    updatedAt: 50,
    actions: "Sửa",
  },
  {
    id: "2",
    image: "/images/logo/logofullred.png",
    name: "Sản phẩm 2",
    category: "Danh mục 2",
    price: 200000,
    stock: 0,
    status: "Không hoạt động",
    createdAt: 200000,
    updatedAt: 30,
    actions: "Xóa",
  },
]

const categories: Category[] = [
  { id: "1", name: "Danh mục 1" },
  { id: "2", name: "Danh mục 2" },
]

export default function Page() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Danh sách Role (vai trò)</h2>
          <p className="text-muted-foreground">
            Quản lý tất cả quyền của bạn tại đây
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Thêm sản phẩm
        </Button>
      </div>

      {/* DataTable */}
      <DataTable columns={columns} data={products} categories={categories} />

      {/* Pagination */}
      <Pagination className="pt-4 justify-end">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href="#" />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#" isActive>
              1
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">2</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">5</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationNext href="#" />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}
