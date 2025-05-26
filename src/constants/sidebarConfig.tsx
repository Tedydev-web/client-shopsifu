'use client'

import { 
  LayoutDashboard, 
  ShoppingCart, 
  Users, 
  Package, 
  Settings,
  BarChart2,
  MessageSquare,
  FileText,
  HelpCircle,
  MonitorCog,
  FolderClosed,
  Undo 
} from 'lucide-react'

export type SidebarItem = {
  title: string
  href: string
  icon?: React.ReactNode
  subItems?: SidebarItem[]
  isTitle?: boolean
}

export const sidebarConfig: SidebarItem[] = [
  {
    title: 'Tổng quan',
    href: '/admin',
    icon: <LayoutDashboard className="w-5 h-5" />,
  },
  {
    title: 'Đơn hàng',
    href: '/admin/orders',
    icon: <ShoppingCart className="w-5 h-5" />,
    subItems: [
      {
        title: 'Tất cả đơn hàng',
        href: '/admin/orders',
        icon: null,
      },
      {
        title: 'Đơn hàng mới',
        href: '/admin/orders/new',
        icon: null,
      },
      {
        title: 'Đơn hàng đã xử lý',
        href: '/admin/orders/processed',
        icon: null,
      },
    ],
  },
  {
    title: 'Sản phẩm',
    href: '/admin/products',
    icon: <Package className="w-5 h-5" />,
    subItems: [
      {
        title: 'Danh sách sản phẩm',
        href: '/admin/product',
        icon: null,
      },
      {
        title: 'Thêm sản phẩm',
        href: '/admin/products/add',
        icon: null,
      },
      {
        title: 'Danh mục',
        href: '/admin/products/categories',
        icon: null,
      },
    ],
  },  
  {
    title: 'Hệ thống',
    href: '/admin/system',
    icon: <MonitorCog className="w-5 h-5" />,
    subItems: [
      {
        title: 'Quản lý phân quyền',
        href: '/admin/permission',
        icon: null,
      },
      {
        title: 'Quản lý vai trò',
        href: '/admin/role',
        icon: null,
      },
      {
        title: 'Quản Lý Người Dùng',
        href: '/admin/users',
        icon: null,
      },
      {
        title: 'Nhật ký hệ thống',
        href: '/admin/audit-logs',
        icon: null,
      },
      {
        title: 'Quản lý thiết bị',
        href: '/admin/device',
        icon: null,
      },
    ],
  },  
  {
    title: 'Danh mục',
    href: '/admin/categories',
    icon: <FolderClosed className="w-5 h-5" />,
    subItems: [
      {
        title: 'Quản lý ngôn ngữ',
        href: '/admin/languages',
        icon: null,
      },
    ],
  },
  {
    title: 'Cài đặt',
    href: '/admin/settings',
    icon: <Settings className="w-5 h-5" />,
  },
]

export const settingsSidebarConfig: SidebarItem[] = [
  {
    title: 'Cài đặt hệ thống',
    href: '/admin',
    icon: <Undo className="w-5 h-5" />,
    isTitle: true
  },
  {
    title: 'Cài đặt tài khoản',
    href: '/admin/settings',
    subItems:[
      {
        title: 'Hồ sơ cá nhân',
        href: '/admin/settings/profile',
      },
      {
        title: 'Mật khẩu và bảo mật',
        href: '/admin/settings/password-and-security',
      },
    ]
  }
  // Add more settings items as needed
]
