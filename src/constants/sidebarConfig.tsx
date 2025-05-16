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
  MonitorCog 
} from 'lucide-react'

export type SidebarItem = {
  title: string
  href: string
  icon: React.ReactNode
  subItems?: SidebarItem[]
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
        title: 'Vai Trò Và Phân Quyền',
        href: '/admin/role',
        icon: null,
      },
    ],
  },  
]
