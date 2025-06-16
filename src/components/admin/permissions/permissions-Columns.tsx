"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableColumnHeader } from "@/components/ui/data-table-component/data-table-column-header";
import { DataTableRowActions, ActionItem } from "@/components/ui/data-table-component/data-table-row-actions";
import { Edit, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { useTranslation } from "react-i18next";

// Interface mới theo PerGetByIdResponse
export type Permission = {
  id: number;
  code: string;
  name: string;
  description: string;
  path: string;
  method: string;
};

const methodColorMap: { [key: string]: string } = {
  READ: "text-blue-600 border-blue-200 bg-blue-50 hover:bg-blue-100",
  CREATE: "text-green-600 border-green-200 bg-green-50 hover:bg-green-100",
  PUT: "text-yellow-600 border-yellow-200 bg-yellow-50 hover:bg-yellow-100",
  UPDATE: "text-orange-600 border-orange-200 bg-orange-50 hover:bg-orange-100",
  DELETE: "text-red-600 border-red-200 bg-red-50 hover:bg-red-100",
  MANAGE: "text-red-600 border-red-200 bg-red-50 hover:bg-red-100",
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
      accessorKey: "id",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("ID")} />
      ),
      cell: ({ row }) => <div className="w-[100px] truncate">{row.getValue("id")}</div>,
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: "path",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("admin.permissions.form.name")} />
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
      cell: ({ row }) => {
        const method = (row.getValue("method") as string).toUpperCase();
        const colorClass = methodColorMap[method] || "text-gray-600 border-gray-200 bg-gray-50 hover:bg-gray-100";
        return (
          <Badge
            variant="outline"
            className={`uppercase w-20 justify-center py-1 ${colorClass}`}
          >
            {method}
          </Badge>
        );
      },
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
    // {
    //   id: "actions",
    //   cell: ({ row }) => (
    //     <DataTableRowActions
    //       row={row}
    //       actions={getPermissionActions(row.original, onDelete, onEdit, t)}
    //     />
    //   ),
    // },
  ];
};
