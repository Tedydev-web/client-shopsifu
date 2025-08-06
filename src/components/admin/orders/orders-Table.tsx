"use client";

import { useEffect } from "react";
import { OrdersColumns } from "./orders-Columns";
import { useOrder } from "./useOrders";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { DataTable } from "@/components/ui/data-table-component/data-table";
import SearchInput from "@/components/ui/data-table-component/search-input";
import DataTableViewOption from "@/components/ui/data-table-component/data-table-view-option";
import type { Table as TanstackTable } from "@tanstack/react-table";
import { useDataTable } from "@/hooks/useDataTable";
import type { Order } from "@/types/order.interface";

export function OrdersTable() {
  const t = useTranslations("admin.orders");
  const router = useRouter();

  const {
    orders,
    loading,
    pagination,
    handleSearch,
    handlePageChange,
    handleLimitChange,
    fetchAllOrders,
  } = useOrder();

  useEffect(() => {
    if (pagination.page !== undefined && pagination.limit !== undefined) {
      fetchAllOrders(pagination.page, pagination.limit);
    }
  }, [fetchAllOrders, pagination.page, pagination.limit]);

  const columns = OrdersColumns({ t });

  const table = useDataTable<Order>({
    data: orders,
    columns,
  });

  const OrdersTableToolbar = ({ table }: { table: TanstackTable<Order> }) => (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <SearchInput
          value={pagination.search || ""}
          onValueChange={handleSearch}
          placeholder={t("searchPlaceholder")}
          className="w-full md:max-w-sm"
        />
      </div>
      <div className="flex items-center gap-2">
        <DataTableViewOption table={table} />
      </div>
    </div>
  );

  return (
    <div className="w-full space-y-4">
      <DataTable
        table={table}
        columns={columns}
        loading={loading}
        notFoundMessage={t("notFound")}
        Toolbar={OrdersTableToolbar}
        pagination={{
          metadata: pagination,
          onPageChange: handlePageChange,
          onLimitChange: handleLimitChange,
        }}
        onRowClick={(row: Order) => {
          router.push(`/admin/order/${row.id}`);
        }}
      />
    </div>
  );
}
