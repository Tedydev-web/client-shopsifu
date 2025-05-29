'use client'

import { ColumnDef } from '@tanstack/react-table'
import { User } from '@/types/user.interface'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/ui/data-table-component/data-table-column-header'
import { DataTableRowActions, ActionItem } from '@/components/ui/data-table-component/data-table-row-actions'
import { Edit, Trash2, Eye, UserCog } from 'lucide-react'
import { useTranslation } from 'react-i18next'

const getUserActions = (
  rowUser: User,
  onDelete: (user: User) => void,
  onEdit: (user: User) => void,
  t: (key: string) => string
): ActionItem<User>[] => [
  {
    type: 'command',
    label: t('admin.users.actions.view'),
    icon: <Eye />,
  },
  {
    type: 'command',
    label: t('admin.users.actions.edit'),
    icon: <Edit />,
    onClick: (user) => onEdit(user),
  },
  {
    type: 'command',
    label: t('admin.users.actions.assignPermissions'),
    icon: <UserCog />,
    onClick: (user) => {
      console.log('Phân quyền user:', user.id)
    },
  },
  { type: 'separator' },
  {
    type: 'command',
    label: t('admin.users.actions.delete'),
    icon: <Trash2 />,
    onClick: (user) => onDelete(user),
    className: 'text-red-600 hover:!text-red-700',
  },
]

export const userColumns = (
  { onDelete, onEdit }: { onDelete: (user: User) => void; onEdit: (user: User) => void }
): ColumnDef<User>[] => {
  const { t } = useTranslation()

  return [
    {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
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
      accessorKey: 'name',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('admin.users.table.name')} />
      ),
      cell: ({ row }) => <div>{row.getValue('name')}</div>,
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: 'email',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('admin.users.table.email')} />
      ),
      cell: ({ row }) => <div>{row.getValue('email')}</div>,
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: 'role',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('admin.users.table.role')} />
      ),
      cell: ({ row }) => {
        const role = row.getValue('role') as string
        const label = t(`admin.users.role.${role}`)
        return <Badge variant={role === 'admin' ? 'destructive' : 'outline'}>{label}</Badge>
      },
      filterFn: (row, id, value) => value.includes(row.getValue(id)),
    },
    {
      accessorKey: 'status',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('admin.users.table.status')} />
      ),
      cell: ({ row }) => {
        const status = row.getValue('status') as string
        const label = t(`admin.users.status.${status}`)

        let variant: 'default' | 'secondary' | 'destructive' | 'outline' = 'secondary'
        if (status === 'active') variant = 'default'
        if (status === 'inactive') variant = 'outline'
        if (status === 'pending') variant = 'secondary'

        return (
          <Badge
            variant={variant}
            className={`capitalize ${
              status === 'active'
                ? 'bg-green-100 text-green-700'
                : status === 'pending'
                ? 'bg-yellow-100 text-yellow-700'
                : 'bg-gray-100 text-gray-700'
            }`}
          >
            {label}
          </Badge>
        )
      },
      filterFn: (row, id, value) => value.includes(row.getValue(id)),
    },
    {
      accessorKey: 'createdAt',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('admin.users.table.createdAt')} />
      ),
      cell: ({ row }) => {
        const date = new Date(row.getValue('createdAt'))
        return <span>{date.toLocaleDateString('vi-VN')}</span>
      },
    },
    {
      id: 'actions',
      header: () => <div className="text-right">{t('admin.users.table.actions')}</div>,
      cell: ({ row }) => (
        <DataTableRowActions
          row={row}
          actions={getUserActions(row.original, onDelete, onEdit, t)}
        />
      ),
    },
  ]
}
