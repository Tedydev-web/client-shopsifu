"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableColumnHeader } from "@/components/ui/data-table-component/data-table-column-header";
import { DataTableRowActions, ActionItem } from "@/components/ui/data-table-component/data-table-row-actions";
import { Edit, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { useTranslation } from "react-i18next";

// Interface mới theo PerGetByIdResponse
export type Permission = {
  id: number;
  code: string;
  name: string;
  description: string;
  path: string;
  isActive: boolean;
  method: string;
  createdAt: string;
  updatedAt: string;
};

const getPermissionActions = (
  permission: Permission,
  onDelete: (permission: Permission) => void,
  onEdit: (permission: Permission) => void,
  t: (key: string) => string
): ActionItem<Permission>[] => [
  {
    type: "command",
    label: t("admin.permissions.editAction"),
    icon: <Edit />,
    onClick: (permission) => onEdit(permission),
  },
  { type: "separator" },
  {
    type: "command",
    label: t("admin.permissions.deleteAction"),
    icon: <Trash2 />,
    onClick: (permission) => onDelete(permission),
    className: "text-red-600 hover:!text-red-700",
  },
];

export const PermissionsColumns = ({
  onDelete,
  onEdit,
}: {
  onDelete: (permission: Permission) => void;
  onEdit: (permission: Permission) => void;
}): ColumnDef<Permission>[] => {
  const { t } = useTranslation();

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
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("admin.permissions.form.name")} />
      ),
      cell: ({ row }) => <div className="w-[200px] truncate">{row.getValue("name")}</div>,
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: "description",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("admin.permissions.form.description")} />
      ),
      cell: ({ row }) => <div className="w-[220px] truncate">{row.getValue("description")}</div>,
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: "path",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("admin.permissions.form.path")} />
      ),
      cell: ({ row }) => <div className="w-[220px] truncate">{row.getValue("path")}</div>,
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: "method",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("admin.permissions.form.method")} />
      ),
      cell: ({ row }) => <div className="w-[120px] uppercase truncate">{row.getValue("method")}</div>,
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("admin.permissions.createdAt")} />
      ),
      cell: ({ row }) => (
        <div className="w-[160px] truncate">
          {format(new Date(row.getValue("createdAt")), "dd/MM/yyyy HH:mm")}
        </div>
      ),
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: "updatedAt",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("admin.permissions.updatedAt")} />
      ),
      cell: ({ row }) => (
        <div className="w-[160px] truncate">
          {format(new Date(row.getValue("updatedAt")), "dd/MM/yyyy HH:mm")}
        </div>
      ),
      enableSorting: true,
      enableHiding: true,
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <DataTableRowActions
          row={row}
          actions={getPermissionActions(row.original, onDelete, onEdit, t)}
        />
      ),
    },
  ];
};
