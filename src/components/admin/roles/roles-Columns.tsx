"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableColumnHeader } from "@/components/ui/data-table-component/data-table-column-header";
import { DataTableRowActions, ActionItem } from "@/components/ui/data-table-component/data-table-row-actions";
import { Edit, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";

export type RoleType = 'admin' | 'seller' | 'client' | 'editor';

export interface Role {
  id: number;
  name: string;
  description: string;
  isActive: boolean;
  createdById: string;
  updatedById: string;
  deletedById: string;
  deletedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface RoleGetAllResponse {
  data: Role[]; // ✅ một mảng Role, không phải mảng các mảng
  totalItems: number;
  page: number;
  limit: number;
  totalPages: number;
}


const getRoleActions = (
  role: Role,
  onDelete: (role: Role) => void,
  onEdit: (role: Role) => void,
  t: (key: string) => string
): ActionItem<Role>[] => [
  {
    type: "command",
    label: t("admin.roles.editAction"),
    icon: <Edit />,
    onClick: () => onEdit(role),
  },
  { type: "separator" },
  {
    type: "command",
    label: t("admin.roles.deleteAction"),
    icon: <Trash2 />,
    onClick: () => onDelete(role),
    className: "text-red-600 hover:!text-red-700",
  },
];

export const RolesColumns = ({
  onDelete,
  onEdit,
}: {
  onDelete: (role: Role) => void;
  onEdit: (role: Role) => void;
}): ColumnDef<Role>[] => {
  const { t } = useTranslation();

  return [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
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
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("admin.roles.form.name")} />
      ),
      cell: ({ row }) => <div className="w-[200px] truncate">{row.getValue("name")}</div>,
    },
    {
      accessorKey: "description",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("admin.roles.form.description")} />
      ),
      cell: ({ row }) => <div className="w-[220px] truncate">{row.getValue("description")}</div>,
    },
    {
      accessorKey: "createdById",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Created By" />
      ),
      cell: ({ row }) => <div>{row.getValue("createdById")}</div>,
    },
    {
      accessorKey: "updatedById",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Updated By" />
      ),
      cell: ({ row }) => <div>{row.getValue("updatedById")}</div>,
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <DataTableRowActions
          row={row}
          actions={getRoleActions(row.original, onDelete, onEdit, t)}
        />
      ),
    },
  ];
};
