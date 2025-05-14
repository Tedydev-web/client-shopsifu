"use client"

import * as React from "react"
import { type Table } from "@tanstack/react-table"
import { DataTableSearch } from "@/components/ui/dataTableSearch"
import { DataTableExport } from "@/components/ui/dataTableExport"
import { DataTableViewOptions } from "@/components/ui/data-table-view-options"
import { DateRangePicker, type DateRange } from "@/components/ui/date-range-picker"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

interface DataTableToolbarProps<TData> {
  table: Table<TData>
  onAdd?: () => void
}

export function DataTableToolbar<TData>({ 
  table,
  onAdd
}: DataTableToolbarProps<TData>) {
  const [date, setDate] = React.useState<DateRange>()

  const handleDateChange = (newDate: DateRange | undefined) => {
    setDate(newDate)
    if (newDate?.from && newDate?.to) {
      table.getColumn("createdAt")?.setFilterValue([
        newDate.from.getTime(),
        newDate.to.getTime(),
      ])
    } else {
      table.getColumn("createdAt")?.setFilterValue(undefined)
    }
  }

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-wrap items-center gap-2">
        <DataTableSearch 
          table={table}
          searchColumn="name"
          placeholder="Tìm kiếm role..." 
        />
        <DateRangePicker
          date={date}
          onDateChange={handleDateChange}
        />
        <DataTableViewOptions table={table} />
      </div>
      <div className="flex items-center gap-2">
        <DataTableExport table={table} />
        <Button onClick={onAdd}>
          <Plus className="mr-2 h-4 w-4" />
          Thêm role
        </Button>
      </div>
    </div>
  )
}