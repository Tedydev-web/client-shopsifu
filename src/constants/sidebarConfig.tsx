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
import { t } from "i18next"

export type SidebarItem = {
  title: string
  href: string
  icon?: React.ReactNode
  subItems?: SidebarItem[]
  isTitle?: boolean
}

export const sidebarConfig: SidebarItem[] = [
  {
    title: t('admin.sidebar.dashboard'),
    href: '/admin',
    icon: <LayoutDashboard className="w-5 h-5" />,
  },
  // {
  //   title: t('admin.sidebar.orders.orders'),
  //   href: '/admin/orders',
  //   icon: <ShoppingCart className="w-5 h-5" />,
  //   subItems: [
  //     {
  //       title: t('admin.sidebar.orders.allOrders'),
  //       href: '/admin/orders',
  //       icon: null,
  //     },
  //     {
  //       title: t('admin.sidebar.orders.newOrders'),
  //       href: '/admin/orders/new',
  //       icon: null,
  //     },
  //     {
  //       title: t('admin.sidebar.orders.processedOrders'),
  //       href: '/admin/orders/processed',
  //       icon: null,
  //     },
  //   ],
  // },
  // {
  //   title: t('admin.sidebar.products.products'),
  //   href: '/admin/products',
  //   icon: <Package className="w-5 h-5" />,
  //   subItems: [
  //     {
  //       title: t('admin.sidebar.products.productsList'),
  //       href: '/admin/product',
  //       icon: null,
  //     },
  //     {
  //       title: t('admin.sidebar.products.addProducts'),
  //       href: '/admin/products/add',
  //       icon: null,
  //     },
  //     {
  //       title: t('admin.sidebar.categories.categories'),
  //       href: '/admin/products/categories',
  //       icon: null,
  //     },
  //   ],
  // },  
  {
    title: t('admin.sidebar.system.system'),
    href: '/admin/system',
    icon: <MonitorCog className="w-5 h-5" />,
    subItems: [
      {
        title: t('admin.sidebar.system.permissionManager'),
        href: '/admin/permissions',
        icon: null,
      },
      {
        title: t('admin.sidebar.system.roleManager'),
        href: '/admin/roles',
        icon: null,
      },
      {
        title: t('admin.sidebar.system.userManager'),
        href: '/admin/users',
        icon: null,
      },
      {
        title: t('admin.sidebar.system.systemLog'),
        href: '/admin/audit-logs',
        icon: null,
      },
      {
        title: t('admin.sidebar.system.deviceManager'),
        href: '/admin/device',
        icon: null,
      },
    ],
  },  
  {
    title: t('admin.sidebar.categories.categories'),
    href: '/admin/categories',
    icon: <FolderClosed className="w-5 h-5" />,
    subItems: [
      {
        title: t('admin.sidebar.language.languageManager'),
        href: '/admin/languages',
        icon: null,
      },
    ],
  },
  {
    title: t('admin.sidebar.settings.settings'),
    href: '/admin/settings',
    icon: <Settings className="w-5 h-5" />,
  },
]

export const settingsSidebarConfig: SidebarItem[] = [
  {
    title: t('admin.sidebar.settings.systemSettings'),
    href: '/admin',
    icon: <Undo className="w-5 h-5" />,
    isTitle: true
  },
  {
    title: t('admin.sidebar.settings.accountSettings'),
    href: '/admin/settings',
    subItems:[
      {
        title: t('admin.sidebar.settings.profile'),
        href: '/admin/settings/profile',
      },
      {
        title: t('admin.sidebar.settings.passwordAndSecurity'),
        href: '/admin/settings/password-and-security',
      },
    ]
  }
  // Add more settings items as needed
]
