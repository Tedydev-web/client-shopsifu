"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableColumnHeader } from "@/components/ui/data-table-component/data-table-column-header";
import { DataTableRowActions, ActionItem } from "@/components/ui/data-table-component/data-table-row-actions";
import { Edit, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { format } from "date-fns";

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
  t: (key: string) => string
): ActionItem<Product>[] => [
  {
    type: "command",
    label: t("admin.dataTable.edit"),
    icon: <Edit />,
    onClick: () => onEdit(product),
  },
  { type: "separator" },
  {
    type: "command",
    label: t("admin.dataTable.delete"),
    icon: <Trash2 />,
    onClick: () => onDelete(product),
    className: "text-red-600 hover:!text-red-700",
  },
];

export const productsColumns = ({
  onDelete,
  onEdit,
}: {
  onDelete: (product: Product) => void;
  onEdit: (product: Product) => void;
}): ColumnDef<Product>[] => {
  const t = useTranslations();

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
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={t("admin.products.form.image")} />
        ),
        cell: ({ row }) => {
            const imageUrl = row.original.images?.[0]?.url || '/placeholder.jpg';
            return (
                <Image
                    src={imageUrl}
                    alt={row.original.name}
                    width={40}
                    height={40}
                    className="rounded-md object-cover"
                />
            )
        },
        enableSorting: false,
        enableHiding: true,
    },
    {
        accessorKey: "name",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={t("admin.products.form.name")} />
        ),
        cell: ({ row }) => (
            <span className="font-medium line-clamp-3 w-40 whitespace-normal">{row.original.name}</span>
        ),
        enableSorting: true,
        enableHiding: true,
    },
    {
        accessorKey: "slug",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={t("admin.products.form.slug")} />
        ),
        cell: ({ row }) => <div className="w-[150px] line-clamp-3 whitespace-normal">{row.original.slug}</div>,
        enableSorting: true,
        enableHiding: true,
    },
    {
        accessorKey: "category",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={t("admin.products.form.category")} />
        ),
        cell: ({ row }) => <div className="w-[100px] line-clamp-3 whitespace-normal">{row.original.category}</div>,
        enableSorting: true,
        enableHiding: true,
    },
    {
        accessorKey: "price",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={t("admin.products.form.price")} />
        ),
        cell: ({ row }) => {
            const formattedPrice = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(row.original.price);
            return <div className="w-[100px]">{formattedPrice}</div>;
        },
        enableSorting: true,
        enableHiding: true,
    },
    {
        accessorKey: "stock",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={t("admin.products.form.stock")} />
        ),
        cell: ({ row }) => <div className="w-[80px] text-center">{row.original.stock}</div>,
        enableSorting: true,
        enableHiding: true,
    },
    {
        accessorKey: "status",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={t("admin.dataTable.status")} />
        ),
        cell: ({ row }) => {
            const status = row.original.status;
            const statusVariant = {
                active: 'bg-green-100 text-green-800',
                inactive: 'bg-yellow-100 text-yellow-800',
                archived: 'bg-gray-100 text-gray-800',
            }[status] || 'bg-gray-100 text-gray-800';
            return (
                <Badge variant="outline" className={`capitalize ${statusVariant}`}>
                    {t(`admin.dataTable.${status}`)}
                </Badge>
            );
        },
        enableSorting: true,
        enableHiding: true,
    },
    {
        accessorKey: "createdAt",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title={t("admin.dataTable.createdAt")} />
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
            <DataTableColumnHeader column={column} title={t("admin.dataTable.updatedAt")} />
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
          actions={getProductActions(row.original, onDelete, onEdit, t)}
        />
      ),
    },
  ];
};
