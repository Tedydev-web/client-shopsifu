'use client'

import { ColumnDef } from '@tanstack/react-table'
import { DiscountStatus, DiscountType, VoucherType, DisplayType } from '@/types/discount.interface'
import { VoucherColumn } from './hook/useVouchers'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/ui/data-table-component/data-table-column-header'
import { DataTableRowActions, ActionItem } from '@/components/ui/data-table-component/data-table-row-actions'
import { Edit, Trash2, Ticket } from 'lucide-react'
import { format } from 'date-fns'
import { useTranslations } from 'next-intl'

const getVoucherActions = (
  onDelete: (voucher: VoucherColumn) => void,
  onEdit: (voucher: VoucherColumn) => void,
  t: (key: string) => string
): ActionItem<VoucherColumn>[] => [
  {
    type: 'command',
    label: t('actions.edit'),
    icon: <Edit className="w-4 h-4" />,
    onClick: (voucher) => onEdit(voucher as VoucherColumn),
  },
  { type: 'separator' },
  {
    type: 'command',
    label: t('actions.delete'),
    icon: <Trash2 className="w-4 h-4" />,
    onClick: (voucher) => onDelete(voucher as VoucherColumn),
    className: 'text-red-500 hover:!text-red-500',
  },
]

export const voucherColumns = (
  { onDelete, onEdit }: { onDelete: (voucher: VoucherColumn) => void; onEdit: (voucher: VoucherColumn) => void }
): ColumnDef<VoucherColumn>[] => {
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
      accessorKey: 'value',
      header: ({ column }) => <DataTableColumnHeader column={column} title={t('discountValue')} />,
      cell: ({ row }) => {
        const value = row.original.value || 0;
        const type = row.original.discountType;
        return <div>{type === DiscountType.PERCENTAGE ? `${value}%` : `${value.toLocaleString()}₫`}</div>;
      },
    },
    {
      accessorKey: 'discountType',
      header: ({ column }) => <DataTableColumnHeader column={column} title={t('discountType')} />,
      cell: ({ row }) => {
        const type = row.getValue('discountType') as DiscountType;
        let badgeClass = 'border-blue-500 text-blue-500 bg-blue-50';
        let typeText = 'Không xác định';

        switch (type) {
          case DiscountType.PERCENTAGE:
            badgeClass = 'border-green-600 text-green-600 bg-green-50';
            typeText = 'Phần trăm';
            break;
          case DiscountType.FIX_AMOUNT:
            badgeClass = 'border-blue-600 text-blue-600 bg-blue-50';
            typeText = 'Số tiền cố định';
            break;
        }

        return (
          <Badge variant="outline" className={badgeClass}>
            {typeText}
          </Badge>
        );
      },
      filterFn: (row, id, value) => value.includes(row.getValue(id)),
    },
    {
      accessorKey: 'voucherType',
      header: ({ column }) => <DataTableColumnHeader column={column} title={t('voucherType')} />,
      cell: ({ row }) => {
        const type = row.getValue('voucherType') as VoucherType;
        let badgeClass = 'border-purple-500 text-purple-500 bg-purple-50';
        let typeText = 'Không xác định';

        switch (type) {
          case VoucherType.SHOP:
            badgeClass = 'border-purple-600 text-purple-600 bg-purple-50';
            typeText = 'Cửa hàng';
            break;
          case VoucherType.PRODUCT:
            badgeClass = 'border-indigo-600 text-indigo-600 bg-indigo-50';
            typeText = 'Sản phẩm';
            break;
          case VoucherType.PLATFORM:
            badgeClass = 'border-red-600 text-red-600 bg-red-50';
            typeText = 'Nền tảng';
            break;
          case VoucherType.CATEGORY:
            badgeClass = 'border-yellow-600 text-yellow-600 bg-yellow-50';
            typeText = 'Danh mục';
            break;
          case VoucherType.BRAND:
            badgeClass = 'border-pink-600 text-pink-600 bg-pink-50';
            typeText = 'Thương hiệu';
            break;
          case VoucherType.PRIVATE:
            badgeClass = 'border-gray-600 text-gray-600 bg-gray-50';
            typeText = 'Riêng tư';
            break;
        }

        return (
          <Badge variant="outline" className={badgeClass}>
            {typeText}
          </Badge>
        );
      },
      filterFn: (row, id, value) => value.includes(row.getValue(id)),
    },
    {
      accessorKey: 'displayType',
      header: ({ column }) => <DataTableColumnHeader column={column} title={t('displayType')} />,
      cell: ({ row }) => {
        const type = row.getValue('displayType') as DisplayType;
        let badgeClass = 'border-teal-500 text-teal-500 bg-teal-50';
        let typeText = 'Không xác định';

        switch (type) {
          case DisplayType.PUBLIC:
            badgeClass = 'border-green-600 text-green-600 bg-green-50';
            typeText = 'Công khai';
            break;
          case DisplayType.PRIVATE:
            badgeClass = 'border-gray-600 text-gray-600 bg-gray-50';
            typeText = 'Riêng tư';
            break;
        }

        return (
          <Badge variant="outline" className={badgeClass}>
            {typeText}
          </Badge>
        );
      },
      filterFn: (row, id, value) => value.includes(row.getValue(id)),
    },
    {
      accessorKey: 'discountStatus',
      header: ({ column }) => <DataTableColumnHeader column={column} title={t('status')} />,
      cell: ({ row }) => {
        const status = row.getValue('discountStatus') as DiscountStatus;
        let badgeClass = 'border-gray-500 text-gray-500 bg-gray-50';
        let statusText = 'Không xác định';

        switch (status) {
          case DiscountStatus.ACTIVE:
            badgeClass = 'border-green-600 text-green-600 bg-green-50';
            statusText = 'Hoạt động';
            break;
          case DiscountStatus.INACTIVE:
            badgeClass = 'border-gray-500 text-gray-500 bg-gray-50';
            statusText = 'Không hoạt động';
            break;
          case DiscountStatus.EXPIRED:
            badgeClass = 'border-orange-500 text-orange-500 bg-orange-50';
            statusText = 'Hết hạn';
            break;
        }

        return (
          <Badge variant="outline" className={badgeClass}>
            {statusText}
          </Badge>
        );
      },
      filterFn: (row, id, value) => value.includes(row.getValue(id)),
    },
    {
      accessorKey: 'startDate',
      header: ({ column }) => <DataTableColumnHeader column={column} title={t('validFrom')} />,
      cell: ({ row }) => {
        const date = new Date(row.getValue('startDate'));
        return <span>{format(date, 'dd/MM/yyyy')}</span>;
      },
    },
    {
      accessorKey: 'endDate',
      header: ({ column }) => <DataTableColumnHeader column={column} title={t('validTo')} />,
      cell: ({ row }) => {
        const date = new Date(row.getValue('endDate'));
        return <span>{format(date, 'dd/MM/yyyy')}</span>;
      },
    },
    // {
    //   accessorKey: 'createdAt',
    //   header: ({ column }) => <DataTableColumnHeader column={column} title={t('createdAt')} />,
    //   cell: ({ row }) => {
    //     const date = new Date(row.getValue('createdAt'));
    //     return <span>{format(date, 'dd/MM/yyyy HH:mm')}</span>;
    //   },
    // },
    // {
    //   accessorKey: 'updatedAt',
    //   header: ({ column }) => <DataTableColumnHeader column={column} title={t('updatedAt')} />,
    //   cell: ({ row }) => {
    //     const date = new Date(row.getValue('updatedAt'));
    //     return <span>{format(date, 'dd/MM/yyyy HH:mm')}</span>;
    //   },
    // },
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
