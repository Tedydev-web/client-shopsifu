import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { Order } from "@/types/order.interface";

export const columns: ColumnDef<Order>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "code",
    header: "Mã đơn",
  },
  {
    accessorKey: "customerName",
    header: "Khách hàng",
  },
  {
    accessorKey: "totalPrice",
    header: "Tổng tiền",
    cell: ({ row }) => `${row.original.totalPrice.toLocaleString()}₫`,
  },
  {
    accessorKey: "status",
    header: "Trạng thái",
  },
  {
    id: "actions",
    header: "Thao tác",
    cell: ({ row }) => (
      <Button variant="ghost" size="sm">
        <Eye className="w-4 h-4 mr-2" />
        Xem
      </Button>
    ),
  },
];
