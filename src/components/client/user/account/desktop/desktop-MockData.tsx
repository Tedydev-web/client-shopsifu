// sidebarItems.ts
import {
  BellDot,
  User,
  NotepadText,
} from 'lucide-react'

export const sidebarItems = [
  {
    labelKey: 'user.settings.section.notifications',
    href: '/user/notifications',
    icon: <BellDot className="w-5 h-5 mr-2 text-gray-900" />,
  },
  {
    labelKey: 'user.account.profile.profile',
    href: '/user/profile',
    icon: <User className="w-5 h-5 mr-2 text-gray-900" />,
    subItems: [
      { labelKey: 'user.account.profile.profile', href: '/user/profile' },
      { labelKey: 'user.account.address.address', href: '/user/profile/address' },
      { labelKey: 'user.account.payment.payment', href: '/user/profile/payment' },
      { labelKey: 'user.account.security.security', href: '/user/profile/security' },
    ],
  },
  {
    labelKey: 'user.account.myPurchase.myPurchase',
    href: '/user/purchase',
    icon: <NotepadText className="w-5 h-5 mr-2 text-gray-900" />,
    subItems: [
      { labelKey: 'user.account.profile.profile', href: '/user/profile' },
      { labelKey: 'user.account.address.address', href: '/user/profile/address' },
      { labelKey: 'user.account.payment.payment', href: '/user/profile/payment' },
      { labelKey: 'user.account.security.security', href: '/user/profile/security' },
    ],
  },
]
