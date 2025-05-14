"use client"

import { DataTable, columns } from "@/components/admin/role/datatable"
import { DataTableToolbar } from "@/components/admin/role/toolbar"
import { AddNewRole } from "@/components/admin/role/AddNewRole"
import { useState } from "react"
import type { Table } from "@tanstack/react-table"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from "@/components/ui/pagination"

import { RoleResponse } from "@/types/role.interface"

const products: RoleResponse[] = [
  {
    id: "1",
    image: "/images/logo/logofullred.png",
    name: "Quản trị viên",
    fullName: "Nguyễn Văn Admin",
    role: "admin",
    description: "Quản lý toàn bộ hệ thống",
    permissions: [{
      id: "1",
      name: "Tất cả quyền",
      code: "all",
      description: "Có tất cả các quyền trong hệ thống",
      groupName: "Hệ thống"
    }],
    status: "active",
    createdAt: Date.now() - 1000000,
    updatedAt: Date.now() - 500000,
  },
  {
    id: "2",
    image: "/images/logo/logofullred.png",
    name: "Người mua hàng",
    fullName: "Trần Thị User",
    role: "customer",
    description: "Khách hàng của hệ thống",
    permissions: [
      {
        id: "2",
        name: "Xem sản phẩm",
        code: "view",
        description: "Xem thông tin sản phẩm",
        groupName: "Sản phẩm"
      },
      {
        id: "3",
        name: "Mua sản phẩm",
        code: "buy",
        description: "Mua sản phẩm",
        groupName: "Sản phẩm"
      }
    ],
    status: "inactive",
    createdAt: Date.now() - 2000000,
    updatedAt: Date.now() - 1000000,
  },
]

export default function Page() {
  const [tableInstance, setTableInstance] = useState<Table<RoleResponse> | null>(null)
  const [isAddNewOpen, setIsAddNewOpen] = useState(false)

  const handleAddRole = () => {
    setIsAddNewOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Danh sách Role (vai trò)</h2>
          <p className="text-muted-foreground">
            Quản lý tất cả quyền của bạn tại đây
          </p>
        </div>
      </div>

      {tableInstance && (
        <DataTableToolbar 
          table={tableInstance}
          onAdd={handleAddRole}
        />
      )}

      <DataTable
        columns={columns} 
        data={products} 
        onTableChange={setTableInstance}
      />

      <Pagination className="pt-4 justify-end">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href="#" />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#" isActive>1</PaginationLink>
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

      <AddNewRole 
        open={isAddNewOpen}
        onOpenChange={setIsAddNewOpen}
      />
    </div>
  )
}
