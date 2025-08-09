"use client";

import { DataTable } from "@/components/ui/data-table-component/data-table";
import { columns } from "./columns";
import { useApproveOrders } from "@/hooks/order/useApproveOrders";

export function ApproveOrdersTable() {
  const { data, isLoading, pagination, onPaginationChange } = useApproveOrders();

  return (
    <DataTable
      columns={columns}
      data={data}
      isLoading={isLoading}
      pagination={pagination}
      onPaginationChange={onPaginationChange}
    />
  );
}
