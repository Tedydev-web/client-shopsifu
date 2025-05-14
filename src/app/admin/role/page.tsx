"use client"

import { DataTable, columns } from "@/components/admin/role/datatable"
import { DataTableToolbar } from "@/components/admin/role/toolbar"
import { useState } from "react"
import type { Table } from "@tanstack/react-table"
import AddNewRole from "./add-new/page"
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

const RolePage = () => {
  const [isAddNewOpen, setIsAddNewOpen] = useState(false);
  const [tableInstance, setTableInstance] = useState<Table<RoleResponse> | null>(null)

  return (
    <div className="space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Quản lý vai trò</h2>
      </div>
      <div className="space-y-4">
        {tableInstance && (
          <DataTableToolbar 
            table={tableInstance}
            onAdd={() => setIsAddNewOpen(true)}
          />
        )}
        <DataTable
          columns={columns} 
          data={products} 
          onTableChange={setTableInstance}
        />
        <div className="flex items-center justify-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious href="#" />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#">1</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
              <PaginationItem>
                <PaginationNext href="#" />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
      <AddNewRole 
        open={isAddNewOpen}
        onOpenChange={setIsAddNewOpen}
      />
    </div>
  )
}

export default RolePage
