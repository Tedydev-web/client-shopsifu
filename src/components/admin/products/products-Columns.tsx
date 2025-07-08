"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableColumnHeader } from "@/components/ui/data-table-component/data-table-column-header";
import { DataTableRowActions, ActionItem } from "@/components/ui/data-table-component/data-table-row-actions";
import { Edit, Eye, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { format } from "date-fns";
import { FilterFn } from "@tanstack/react-table";


const priceInRange: FilterFn<any> = (row, columnId, value, addMeta) => {
  const price = row.getValue(columnId) as number;
  const [min, max] = value as [number, number];
  return price >= min && price <= max;
};

// Define the Product type based on your data structure
export type Product = {
  id: string;
  name: string;
  slug: string;
  images: { url: string }[];
  price: number;
  stock: number;
  status: 'active' | 'inactive' | 'archived';
  category: string;
  createdAt: string;
  updatedAt: string;
};

const getProductActions = (
  product: Product,
  onDelete: (product: Product) => void,
  onEdit: (product: Product) => void,
  onView: (product: Product) => void,
  t: (key: string) => string
): ActionItem<Product>[] => [
  {
    type: "command",
    label: t("DataTable.view"),
    icon: <Eye />,
    onClick: () => onView(product),
  },
  {
    type: "command",
    label: t("DataTable.edit"),
    icon: <Edit />,
    onClick: () => onEdit(product),
  },
  { type: "separator" },
  {
    type: "command",
    label: t("DataTable.delete"),
    icon: <Trash2 />,
    onClick: () => onDelete(product),
    className: "text-red-600 hover:!text-red-700",
  },
];

export const productsColumns = ({
  onDelete,
  onEdit,
  onView,
}: {
  onDelete: (product: Product) => void;
  onEdit: (product: Product) => void;
  onView: (product: Product) => void;
}): ColumnDef<Product>[] => {
  const t = useTranslations('admin.ModuleProduct');

  return [
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
        header: () => t("DataTable.image"),
        cell: ({ row }) => {
            const imageUrl = row.original.images?.[0]?.url || '/images/image-placeholder.jpg';
            return (
                <Image
                    src={imageUrl}
                    alt={row.original.name}
                    width={65}
                    height={65}
                    className="rounded-sm object-cover"
                />
            )
        },
        enableSorting: false,
        enableHiding: true,
    },
    {
        accessorKey: "name",
        header: () => t("DataTable.name"),
        cell: ({ row }) => (
            <span className="font-medium line-clamp-3 w-40 whitespace-normal">{row.original.name}</span>
        ),
        enableSorting: true,
        enableHiding: true,
    },
    {
        accessorKey: "slug",
        header: () => t("DataTable.slug"),
        cell: ({ row }) => <div className="w-[150px] line-clamp-3 whitespace-normal">{row.original.slug}</div>,
        enableSorting: true,
        enableHiding: true,

    },
    {
        accessorKey: "category",
        header: () => t("DataTable.category"),
        cell: ({ row }) => <div className="w-[100px] line-clamp-3 whitespace-normal">{row.original.category}</div>,
        enableSorting: true,
        enableHiding: true,
    },
    {
        accessorKey: "price",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={t("DataTable.price")} />
        ),
        cell: ({ row }) => {
            const formattedPrice = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(row.original.price);
            return <div className="w-[100px]">{formattedPrice}</div>;
        },
        enableSorting: true,
        enableHiding: true,
        filterFn: priceInRange,
    },
    {
        accessorKey: "stock",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={t("DataTable.stock")} />
        ),
        cell: ({ row }) => <div className="w-[80px] text-center">{row.original.stock}</div>,
        enableSorting: true,
        enableHiding: true,
    },
    {
        accessorKey: "status",
        header: () => t("DataTable.status"),
        cell: ({ row }) => {
            const status = row.original.status;
            const statusVariant = {
                active: 'bg-green-100 text-green-800',
                inactive: 'bg-yellow-100 text-yellow-800',
                archived: 'bg-gray-100 text-gray-800',
            }[status] || 'bg-gray-100 text-gray-800';
            return (
                <Badge variant="outline" className={`capitalize ${statusVariant}`}>
                    {t(`Status.${status}`)}
                </Badge>
            );
        },
        enableSorting: true,
        enableHiding: true,
    },
    {
        accessorKey: "createdAt",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title={t("DataTable.createdAt")} />
        ),
        cell: ({ row }) => (
            <div>{format(new Date(row.original.createdAt), "dd/MM/yyyy")}</div>
        ),
        enableSorting: true,
        enableHiding: true,
    },
    {
        accessorKey: "updatedAt",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title={t("DataTable.updatedAt")} />
        ),
        cell: ({ row }) => (
            <div>{format(new Date(row.original.updatedAt), "dd/MM/yyyy")}</div>
        ),
        enableSorting: true,
        enableHiding: true,
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <DataTableRowActions
          row={row}
          actions={getProductActions(row.original, onDelete, onEdit, onView, t)}
        />
      ),
    },
  ];
};
