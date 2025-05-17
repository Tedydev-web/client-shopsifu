'use client'

import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  MonitorCog
} from 'lucide-react'

import { useTranslation } from 'react-i18next'

export type SidebarItem = {
  title: string
  href: string
  icon: React.ReactNode
  subItems?: SidebarItem[]
}

export const useSidebarConfig = (): SidebarItem[] => {
  const { t } = useTranslation()

  return [
    {
      title: t('admin.sidebar.overview'),
      href: '/admin',
      icon: <LayoutDashboard className="w-5 h-5" />,
    },
    {
      title: t('admin.sidebar.orders'),
      href: '/admin/orders',
      icon: <ShoppingCart className="w-5 h-5" />,
      subItems: [
        {
          title: t('admin.sidebar.allOrders'),
          href: '/admin/orders',
          icon: null,
        },
        {
          title: t('admin.sidebar.newOrders'),
          href: '/admin/orders/new',
          icon: null,
        },
        {
          title: t('admin.sidebar.processedOrders'),
          href: '/admin/orders/processed',
          icon: null,
        },
      ],
    },
    {
      title: t('admin.sidebar.products'),
      href: '/admin/products',
      icon: <Package className="w-5 h-5" />,
      subItems: [
        {
          title: t('admin.sidebar.productList'),
          href: '/admin/product',
          icon: null,
        },
        {
          title: t('admin.sidebar.addProduct'),
          href: '/admin/products/add',
          icon: null,
        },
        {
          title: t('admin.sidebar.categories'),
          href: '/admin/products/categories',
          icon: null,
        },
      ],
    },
    {
      title: t('admin.sidebar.system'),
      href: '/admin/system',
      icon: <MonitorCog className="w-5 h-5" />,
      subItems: [
        {
          title: t('admin.sidebar.rolesPermissions'),
          href: '/admin/role',
          icon: null,
        },
      ],
    },
  ]
}
