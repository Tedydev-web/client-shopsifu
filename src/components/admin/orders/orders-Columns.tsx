"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/ui/data-table-component/data-table-column-header";
import { format } from "date-fns";
import { Order } from "@/types/order.interface";
import { Badge } from "@/components/ui/badge";

export const OrdersColumns = ({
  t,
}: {
  t: (key: string) => string;
}): ColumnDef<Order, any>[] => [
  {
    accessorFn: (row) => row.id,
    id: "orderCode",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={t("orderCode")}
        className="justify-center text-center px-2"
      />
    ),
    cell: ({ getValue }) => (
      <div
        className="w-[140px] truncate text-center"
        title={getValue<string>()}
      >
        {getValue<string>()}
      </div>
    ),
  },
  {
    accessorFn: (row) => row.createdAt,
    id: "orderDate",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={t("orderDate")}
        className="justify-center text-center px-2"
      />
    ),
    cell: ({ getValue }) => {
      const date = format(new Date(getValue<string>()), "dd/MM/yyyy HH:mm");
      return (
        <div className="w-[160px] truncate text-center" title={date}>
          {date}
        </div>
      );
    },
  },
  {
    accessorFn: (row) => row.receiver?.name,
    id: "customerName",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={t("customerName")}
        className="justify-center text-center px-2"
      />
    ),
    cell: ({ getValue }) => (
      <div
        className="w-[160px] truncate text-center"
        title={getValue<string>()}
      >
        {getValue<string>()}
      </div>
    ),
  },
  {
    accessorFn: (row) => row.shopId,
    id: "shopName",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={t("shopName")}
        className="justify-center text-center px-2"
      />
    ),
    cell: ({ getValue }) => (
      <div
        className="w-[160px] truncate text-center"
        title={getValue<string>()}
      >
        {getValue<string>()}
      </div>
    ),
  },
  {
    accessorFn: (row) => row.status,
    id: "status",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={t("status")}
        className="justify-center text-center px-2"
      />
    ),
    cell: ({ getValue }) => {
      const status = getValue<string>();
      const statusConfig: Record<string, { color: string; label: string }> = {
        PENDING_PAYMENT: {
          color: "bg-yellow-100 text-yellow-700",
          label: t("admin.orders.statuses.pendingPayment"),
        },
        PENDING_PICKUP: {
          color: "bg-blue-100 text-blue-700",
          label: t("admin.orders.statuses.pendingPickup"),
        },
        PENDING_DELIVERY: {
          color: "bg-purple-100 text-purple-700",
          label: t("admin.orders.statuses.pendingDelivery"),
        },
        DELIVERED: {
          color: "bg-green-100 text-green-700",
          label: t("admin.orders.statuses.delivered"),
        },
        RETURNED: {
          color: "bg-gray-100 text-gray-700",
          label: t("admin.orders.statuses.returned"),
        },
        CANCELLED: {
          color: "bg-red-100 text-red-700",
          label: t("admin.orders.statuses.cancelled"),
        },
      };

      const { color, label } = statusConfig[status] || {
        color: "bg-slate-100 text-slate-700",
        label: status,
      };

      return (
        <div className="w-[140px] truncate text-center" title={label}>
          <Badge className={`${color} w-full justify-center`}>{label}</Badge>
        </div>
      );
    },
  },
  {
    accessorFn: (row) => row.paymentId,
    id: "paymentMethod",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={t("paymentMethod")}
        className="justify-center text-center px-2"
      />
    ),
    cell: ({ getValue }) => (
      <div
        className="w-[140px] truncate text-center"
        title={getValue<string>()}
      >
        {getValue<string>()}
      </div>
    ),
  },
  {
    accessorFn: (row) =>
      row.items.reduce(
        (total, item) => total + item.skuPrice * item.quantity,
        0
      ),
    id: "totalAmount",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={t("totalAmount")}
        className="justify-center text-center px-2"
      />
    ),
    cell: ({ getValue }) => {
      const amount = Number(getValue<number>()).toLocaleString();
      return (
        <div
          className="w-[140px] font-semibold text-green-600 truncate text-center"
          title={`${amount}₫`}
        >
          {amount}₫
        </div>
      );
    },
  },
];
