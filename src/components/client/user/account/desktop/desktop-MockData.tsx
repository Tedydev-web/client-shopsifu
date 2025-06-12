// sidebarItems.ts
import {
  BellDot,
  User,
  NotepadText,
} from 'lucide-react'

export const sidebarItems = [
  {
    labelKey: 'user.account.notifications.notifications',
    href: '/user/account/notifications',
    icon: <BellDot className="w-5 h-5 mr-2 text-gray-900" />,
  },
  {
    labelKey: 'user.account.profile.profile',
    href: '/user/account/profile',
    icon: <User className="w-5 h-5 mr-2 text-gray-900" />,
    subItems: [
      { labelKey: 'user.account.profile.profile', href: '/user/account/profile' },
      { labelKey: 'user.account.address.address', href: '/user/account/address' },
      { labelKey: 'user.account.payment.payment', href: '/user/account/payment' },
      { labelKey: 'user.account.security.security', href: '/user/account/security' },
    ],
  },
  {
    labelKey: 'user.account.myPurchase.myPurchase',
    href: '/user/account/purchase',
    icon: <NotepadText className="w-5 h-5 mr-2 text-gray-900" />,
  },
]
