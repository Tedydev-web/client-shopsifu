"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableColumnHeader } from "@/components/ui/data-table-component/data-table-column-header";
import { DataTableRowActions, ActionItem } from "@/components/ui/data-table-component/data-table-row-actions";
import { Edit, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { format } from "date-fns";
import { RoleGetAllResponse } from "@/types/auth/role.interface";

export type Role = RoleGetAllResponse['data'][0];

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
  const t = useTranslations();

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
      accessorKey: "createdAt",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Tạo lúc" />
      ),
      cell: ({ row }) => {
        return (
          <div className="w-[160px]">
            {format(new Date(row.getValue("createdAt")), "dd/MM/yyyy HH:mm")}
          </div>
        );
      },
    },
    {
      accessorKey: "updatedAt",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Cập nhật lúc" />
      ),
      cell: ({ row }) => {
        return (
          <div className="w-[160px]">
            {format(new Date(row.getValue("updatedAt")), "dd/MM/yyyy HH:mm")}
          </div>
        );
      },
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
