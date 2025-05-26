'use client'

import { ColumnDef } from '@tanstack/react-table'
import { User } from '@/types/user.interface' // Import User type
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/ui/data-table-component/data-table-column-header' // Assuming you will create this for sorting
import { DataTableRowActions, ActionItem } from '@/components/ui/data-table-component/data-table-row-actions' // Import ActionItem
import { Edit, Trash2, Eye, UserCog } from 'lucide-react'; // Ví dụ icons

// Hàm tạo danh sách actions cụ thể cho User
const getUserActions = (
  rowUser: User,
  onDelete: (user: User) => void,
  onEdit: (user: User) => void
): ActionItem<User>[] => [
  {
    type: 'command',
    label: 'Xem chi tiết',
    icon: <Eye />,
    // onClick: (user) => {
    //   console.log('Xem chi tiết user:', user.id);
    //   // router.push(`/admin/users/${user.id}`)
    // },
  },
  {
    type: 'command',
    label: 'Sửa thông tin',
    icon: <Edit />,
    onClick: (user) => {
      onEdit(user);
    },
  },
  {
    type: 'command',
    label: 'Phân quyền',
    icon: <UserCog />,
    onClick: (user) => {
      console.log('Phân quyền user:', user.id);
      // Open modal phân quyền
    },
  },
  { type: 'separator' }, // Đây là SeparatorAction
  {
    type: 'command',
    label: 'Xóa người dùng',
    icon: <Trash2 />,
    onClick: (user) => onDelete(user),
    className: 'text-red-600 hover:!text-red-700',
  },
];

export const userColumns = (
  { onDelete, onEdit }: { onDelete: (user: User) => void, onEdit: (user: User) => void }
  ): ColumnDef<User>[] => [
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
      <DataTableColumnHeader column={column} title="Tên người dùng" />
    ),
    cell: ({ row }) => <div>{row.getValue('name')}</div>,
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: 'email',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
    cell: ({ row }) => <div>{row.getValue('email')}</div>,
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: 'role',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Vai trò" />
    ),
    cell: ({ row }) => {
      const role = row.getValue('role') as string
      return <Badge variant={role === 'admin' ? 'destructive' : 'outline'}>{role}</Badge>
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Trạng thái" />
    ),
    cell: ({ row }) => {
      const status = row.getValue('status') as string
      let variant: 'default' | 'secondary' | 'destructive' | 'outline' = 'secondary'
      if (status === 'active') variant = 'default' // Green or primary
      if (status === 'inactive') variant = 'outline'
      if (status === 'pending') variant = 'secondary' // Yellow or secondary

      return <Badge variant={variant} className={`capitalize ${status === 'active' ? 'bg-green-100 text-green-700' : status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700' }`}>{status}</Badge>
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Ngày tạo" />
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue('createdAt'))
      return <span>{date.toLocaleDateString('vi-VN')}</span>
    },
  },
  {
    id: 'actions',
    //header: () => <div className="text-right">Hành động</div>, // Hoặc để trống nếu không muốn title cho cột actions
    cell: ({ row }) => <DataTableRowActions row={row} actions={getUserActions(row.original, onDelete, onEdit)} />,
  },
]
