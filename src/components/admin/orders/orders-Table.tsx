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

export function OrdersTable() {
  const t = useTranslations("admin.orders");
  const router = useRouter();
  const {
    orders,
    loading,
    fetchAllOrders,
  } = useOrder();

  useEffect(() => {
    fetchAllOrders(1, 10);
  }, [fetchAllOrders]);

  const onView = (order: OrderColumn) => {
    // ✅ Đẩy đúng cấu trúc: /admin/order/[id]
    router.push(`/admin/order/${order.id}`);
  };

  const columns = OrdersColumns({ t, onView });
  const table = useDataTable({ data: orders, columns });

  const OrdersTableToolbar = ({
    table,
  }: {
    table: TanstackTable<OrderColumn>;
  }) => (
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
      />
    </div>
  );
}
