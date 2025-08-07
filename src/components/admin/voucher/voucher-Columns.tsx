'use client'

import { ColumnDef } from '@tanstack/react-table'
import { Voucher } from '@/types/admin/voucher.interface'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/ui/data-table-component/data-table-column-header'
import { DataTableRowActions, ActionItem } from '@/components/ui/data-table-component/data-table-row-actions'
import { Edit, Trash2, Ticket } from 'lucide-react'
import { format } from 'date-fns'
import { useTranslations } from 'next-intl'

const getVoucherActions = (
  onDelete: (voucher: Voucher) => void,
  onEdit: (voucher: Voucher) => void,
  t: (key: string) => string
): ActionItem<Voucher>[] => [
  {
    type: 'command',
    label: t('actions.edit'),
    icon: <Edit className="w-4 h-4" />,
    onClick: (voucher) => onEdit(voucher),
  },
  { type: 'separator' },
  {
    type: 'command',
    label: t('actions.delete'),
    icon: <Trash2 className="w-4 h-4" />,
    onClick: (voucher) => onDelete(voucher),
    className: 'text-red-500 hover:!text-red-500',
  },
]

export const voucherColumns = (
  { onDelete, onEdit }: { onDelete: (voucher: Voucher) => void; onEdit: (voucher: Voucher) => void }
): ColumnDef<Voucher>[] => {
  const t = useTranslations("admin.ModuleVouchers.Table");

  return [
    {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      id: 'icon',
      header: () => null,
      cell: ({ row }) => {
        return (
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
            <Ticket className="w-5 h-5 text-primary" />
          </div>
        );
      },
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'code',
      header: ({ column }) => <DataTableColumnHeader column={column} title={t('code')} />,
      cell: ({ row }) => {
        const code = row.original.code || '';
        return <div className="font-medium uppercase">{code.trim() || 'N/A'}</div>;
      },
    },
    {
      accessorKey: 'name',
      header: ({ column }) => <DataTableColumnHeader column={column} title={t('name')} />,
      cell: ({ row }) => {
        const name = row.original.name || '';
        return <div>{name}</div>;
      },
    },
    {
      accessorKey: 'discountValue',
      header: ({ column }) => <DataTableColumnHeader column={column} title={t('discountValue')} />,
      cell: ({ row }) => {
        const value = row.original.id || 0;
        const type = row.original.discountType;
        return <div>{type === 'PERCENTAGE' ? `${value}%` : `${value.toLocaleString()}₫`}</div>;
      },
    },
    {
      accessorKey: 'status',
      header: ({ column }) => <DataTableColumnHeader column={column} title={t('status')} />,
      cell: ({ row }) => {
        const status = row.getValue('status');
        let badgeClass = 'border-gray-500 text-gray-500 bg-gray-50';
        let statusText = 'Không hoạt động';
        
        if (status === 'ACTIVE') {
          badgeClass = 'border-green-600 text-green-600 bg-green-50';
          statusText = 'Hoạt động';
        } else if (status === 'EXPIRED') {
          badgeClass = 'border-orange-500 text-orange-500 bg-orange-50';
          statusText = 'Hết hạn';
        } else if (status === 'USED') {
          badgeClass = 'border-blue-500 text-blue-500 bg-blue-50';
          statusText = 'Đã sử dụng';
        }
        
        return (
          <Badge
            variant="outline"
            className={badgeClass}
          >
            {statusText}
          </Badge>
        );
      },
      filterFn: (row, id, value) => value.includes(row.getValue(id)),
    },
    {
      accessorKey: 'validFrom',
      header: ({ column }) => <DataTableColumnHeader column={column} title={t('validFrom')} />,
      cell: ({ row }) => {
        const date = new Date(row.getValue('validFrom'));
        return <span>{format(date, 'dd/MM/yyyy')}</span>;
      },
    },
    {
      accessorKey: 'validTo',
      header: ({ column }) => <DataTableColumnHeader column={column} title={t('validTo')} />,
      cell: ({ row }) => {
        const date = new Date(row.getValue('validTo'));
        return <span>{format(date, 'dd/MM/yyyy')}</span>;
      },
    },
    {
      accessorKey: 'createdAt',
      header: ({ column }) => <DataTableColumnHeader column={column} title={t('createdAt')} />,
      cell: ({ row }) => {
        const date = new Date(row.getValue('createdAt'));
        return <span>{format(date, 'dd/MM/yyyy HH:mm')}</span>;
      },
    },
    {
      accessorKey: 'updatedAt',
      header: ({ column }) => <DataTableColumnHeader column={column} title={t('updatedAt')} />,
      cell: ({ row }) => {
        const date = new Date(row.getValue('updatedAt'));
        return <span>{format(date, 'dd/MM/yyyy HH:mm')}</span>;
      },
    },
    {
      id: 'actions',
      cell: ({ row }) => (
        <DataTableRowActions
          row={row}
          actions={getVoucherActions(onDelete, onEdit, t)}
        />
      ),
    },
  ]
}
