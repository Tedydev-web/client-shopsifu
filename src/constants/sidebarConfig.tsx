import { 
  LayoutDashboard, 
  ShoppingCart, 
  Users, 
  Package, 
  Settings,
  BarChart2,
  MessageSquare,
  FileText,
  HelpCircle
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
        href: '/admin/products',
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
    title: 'Khách hàng',
    href: '/admin/customers',
    icon: <Users className="w-5 h-5" />,
  },
  {
    title: 'Báo cáo',
    href: '/admin/reports',
    icon: <BarChart2 className="w-5 h-5" />,
  },
  {
    title: 'Tin nhắn',
    href: '/admin/messages',
    icon: <MessageSquare className="w-5 h-5" />,
  },
  {
    title: 'Bài viết',
    href: '/admin/posts',
    icon: <FileText className="w-5 h-5" />,
  },
  {
    title: 'Cài đặt',
    href: '/admin/settings',
    icon: <Settings className="w-5 h-5" />,
  },
  {
    title: 'Hỗ trợ',
    href: '/admin/support',
    icon: <HelpCircle className="w-5 h-5" />,
  }
]
