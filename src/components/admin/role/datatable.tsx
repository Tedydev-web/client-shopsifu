"use client"

import * as React from "react"
import Image from "next/image"
import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  type Table,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { EditRole } from "./EditRole"

interface ActionCellProps {
  row: {
    original: RoleResponse
  }
}

const ActionCell = ({ row }: ActionCellProps) => {
  const [open, setOpen] = React.useState(false)
  
  return (
    <>
      <div className="flex space-x-2">
        <Button
          onClick={() => setOpen(true)} 
          variant="outline"
          size="sm">
          Sửa
        </Button>
        <Button
          variant="destructive"
          size="sm">
          Xóa
        </Button>
      </div>
      <EditRole 
        open={open} 
        onOpenChange={setOpen}
        data={row.original}
      />
    </>
  )
}

import {
  Table as UITable,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"

import { RoleResponse } from "@/types/role.interface"

interface DataTableProps<TData> {
  columns: ColumnDef<TData, unknown>[]
  data: TData[]
  onTableChange?: (table: Table<TData>) => void
}

export const columns: ColumnDef<RoleResponse, unknown>[] = [
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
    accessorKey: "image",
    header: "Hình ảnh",
    cell: ({ row }) => (
      <Image 
        src={row.getValue("image")} 
        alt={row.getValue("name")} 
        width={48}
        height={48}
        className="object-cover rounded-md"
      />
    )
  },
  {
    accessorKey: "fullName",
    header: "Họ và tên",
  },
  {
    accessorKey: "name",
    header: "Tên vai trò",
  },
  {
    accessorKey: "status",
    header: "Trạng thái",
  },
  {
    accessorKey: "createdAt",
    header: "Ngày tạo",
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"))
      return date.toLocaleDateString("vi-VN")
    },
  },
  {
    accessorKey: "updatedAt",
    header: "Ngày cập nhật",
    cell: ({ row }) => {
      const date = new Date(row.getValue("updatedAt"))
      return date.toLocaleDateString("vi-VN")
    },
  },  {
    accessorKey: "actions",
    header: "Thao tác",
    cell: ({ row }) => <ActionCell row={row} />,
  }
]

export function DataTable<TData>({
  columns,
  data,
  onTableChange,
}: DataTableProps<TData>) {
  const [rowSelection, setRowSelection] = React.useState({})
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [sorting, setSorting] = React.useState<SortingState>([])

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  })

  React.useEffect(() => {
    if (onTableChange) {
      onTableChange(table)
    }
  }, [table, onTableChange])

  return (
    <div className="space-y-4">
      {/* <DataTableToolbar table={table} /> */}
      <div className="rounded-md border">
        <UITable>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} colSpan={header.colSpan}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Không có dữ liệu
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </UITable>
      </div>
      {/* <DataTablePagination table={table} /> */}
    </div>
  )
}