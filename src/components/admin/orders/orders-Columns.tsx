"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/ui/data-table-component/data-table-column-header";
import { format } from "date-fns";
import { Order } from "@/types/order.interface";
import { Badge } from "@/components/ui/badge";
import { Package } from "lucide-react";

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
        className="w-[160px] truncate text-center font-medium text-blue-600 py-3"
        title={getValue<string>()}
      >
        #{getValue<string>().slice(-8).toUpperCase()}
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
        <div className="w-[170px] truncate text-center text-sm py-3" title={date}>
          {date}
        </div>
      );
    },
  },
  {
    accessorFn: (row) => row.userId, // Sử dụng userId thay vì receiver.name
    id: "customerName",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={t("customerName")}
        className="justify-center text-center px-2"
      />
    ),
    cell: ({ getValue, row }) => {
      const userId = getValue<string>();
      // Tạm thời hiển thị userId, sau này có thể join với user data
      return (
        <div className="w-[160px] text-center py-3">
          <div className="font-medium truncate text-xs" title={userId}>
            UUID: {userId.slice(-8).toUpperCase()}
          </div>
        </div>
      );
    },
  },
  {
    accessorFn: (row) => row.items,
    id: "products",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={t("products")}
        className="justify-center text-center px-2"
      />
    ),
    cell: ({ getValue }) => {
      const items = getValue<Order['items']>();
      const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
      const firstItem = items[0];
      
      return (
        <div className="w-[180px] text-center py-3">
          <div className="flex items-center gap-2 mb-1">
            {firstItem?.image ? (
              <img 
                src={firstItem.image} 
                alt={firstItem.productName}
                className="w-12 h-12 object-cover rounded border flex-shrink-0"
              />
            ) : (
              <div className="w-6 h-6 bg-gray-100 rounded border flex items-center justify-center flex-shrink-0">
                <Package className="w-3 h-3 text-gray-400" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="text-xs font-medium truncate" title={firstItem?.productName}>
                {firstItem?.productName}
              </div>
              <div className="text-xs text-gray-500">
                {totalItems} sản phẩm
                {items.length > 1 && ` (+${items.length - 1})`}
              </div>
            </div>
          </div>
        </div>
      );
    },
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
      const statusConfig: Record<string, { color: string; label: string; dotColor: string }> = {
        PENDING_PAYMENT: {
          color: "bg-yellow-50 text-yellow-700 border-yellow-200",
          label: t("statuses.pendingPayment"),
          dotColor: "bg-yellow-500"
        },
        PENDING_PICKUP: {
          color: "bg-blue-50 text-blue-700 border-blue-200",
          label: t("statuses.pendingPickup"),
          dotColor: "bg-blue-500"
        },
        PENDING_DELIVERY: {
          color: "bg-purple-50 text-purple-700 border-purple-200",
          label: t("statuses.pendingDelivery"),
          dotColor: "bg-purple-500"
        },
        DELIVERED: {
          color: "bg-green-50 text-green-700 border-green-200",
          label: t("statuses.delivered"),
          dotColor: "bg-green-500"
        },
        RETURNED: {
          color: "bg-gray-50 text-gray-700 border-gray-200",
          label: t("statuses.returned"),
          dotColor: "bg-gray-500"
        },
        CANCELLED: {
          color: "bg-red-50 text-red-700 border-red-200",
          label: t("statuses.cancelled"),
          dotColor: "bg-red-500"
        },
      };

      const { color, label, dotColor } = statusConfig[status] || {
        color: "bg-slate-50 text-slate-700 border-slate-200",
        label: status,
        dotColor: "bg-slate-500"
      };

      return (
        <div className="w-[160px] text-center py-3" title={label}>
          <Badge 
            variant="outline"
            className={`${color} border px-3 py-1.5 w-full justify-center font-medium text-xs inline-flex items-center gap-2`}
          >
            <span className={`w-2 h-2 rounded-full ${dotColor}`}></span>
            {label}
          </Badge>
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
    cell: ({ getValue }) => {
      const paymentId = getValue<number>();
      const paymentMethods: Record<number, { label: string; color: string }> = {
        1: { label: 'COD', color: 'text-green-600 bg-green-50' },
        2: { label: 'VNPay', color: 'text-blue-600 bg-blue-50' },
        3: { label: 'MoMo', color: 'text-pink-600 bg-pink-50' },
        4: { label: 'Bank Transfer', color: 'text-purple-600 bg-purple-50' },
      };
      
      const payment = paymentMethods[paymentId] || { 
        label: `Payment ${paymentId}`, 
        color: 'text-gray-600 bg-gray-50' 
      };
      
      return (
        <div className="w-[120px] text-center py-3">
          <div className={`px-2 py-1 rounded-lg text-xs font-medium ${payment.color}`}>
            {payment.label}
          </div>
        </div>
      );
    },
  },
  {
    accessorFn: (row) => row.items.reduce((total, item) => total + (item.skuPrice * item.quantity), 0),
    id: "totalAmount",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={t("totalAmount")}
        className="justify-center text-center px-2"
      />
    ),
    cell: ({ getValue, row }) => {
      const totalAmount = getValue<number>();
      const items = row.original.items;
      const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
      
      const formatCurrency = (amount: number) => 
        new Intl.NumberFormat('vi-VN').format(amount);

      return (
        <div className="w-[140px] text-center py-3">
          <div className="font-bold text-lg text-green-600 mb-1">
            {formatCurrency(totalAmount)}₫
          </div>
          <div className="text-xs text-gray-500">
            {itemCount} sản phẩm
          </div>
        </div>
      );
    },
  },
  // Bỏ column deliveryAddress vì không có trong response
];
