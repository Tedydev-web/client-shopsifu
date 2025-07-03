'use client'

import { useState } from 'react'
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'

interface UseDataTableProps<TData> {
  data: TData[]
  columns: ColumnDef<TData, any>[]
}

export function useDataTable<TData>({ data, columns }: UseDataTableProps<TData>) {
  const [rowSelection, setRowSelection] = useState({})
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [sorting, setSorting] = useState<SortingState>([])

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
    // Bổ sung tree/expand/collapse
    // Nếu chỉ cần 1 cấp cha-con, chỉ trả về children ở cấp 1, các cấp sâu hơn sẽ không expand được
    getSubRows: (row: any) => Array.isArray(row.children) && row.children.length > 0 && !row._isChild
      ? row.children.map((child: any) => ({ ...child, _isChild: true }))
      : [],
    getRowId: (row: any) => row.id,
    getExpandedRowModel: require('@tanstack/react-table').getExpandedRowModel(),
  })

  return table
}
