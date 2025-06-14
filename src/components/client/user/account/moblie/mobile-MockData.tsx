'use client'
import {
  Lock,
  ShieldCheck,
  UserCheck,
  Shield,
  Globe,
  Languages,
  BellDot,
  FileText,
  LogOut,
  Repeat2,
  CreditCard,
} from 'lucide-react'

export const settingsMockData = {
  header: {
    title: 'user.settings.title',
    statusTitle: 'user.settings.subtitle',
    statusDesc: 'user.settings.description',
    items: [
      { 
        label: 'user.settings.items.Account security', 
        icon: <ShieldCheck className="w-4 h-4" />, 
        href: '/user/profile' 
      },
      { 
        label: 'user.settings.items.Privacy', 
        icon: <Lock className="w-4 h-4" />, 
        href: '/user/privacy' 
      },
      { 
        label: 'user.settings.items.Permissions', 
        icon: <UserCheck className="w-4 h-4" />, 
        href: '/user/permissions' 
      },
      { 
        label: 'user.settings.items.Safety center', 
        icon: <Shield className="w-4 h-4" />, 
        href: '/user/safety' 
      },
    ],
  },
  sections: [
    { 
      label: 'user.settings.section.paymentmethods', 
      href: '/user/payment', 
      icon: <CreditCard className="w-4 h-4" /> 
    },
    { 
      label: 'user.settings.section.country', 
      href: '/user/region', 
      value: 'VN', 
      icon: <Globe className="w-4 h-4" /> 
    },
    { 
      label: 'user.settings.section.language', 
      href: '/user/language', 
      value: 'English', 
      icon: <Languages className="w-4 h-4" /> 
    },
    { 
      label: 'user.settings.section.currency', 
      href: '/user/currency', 
      value: 'VND', 
      icon: <Globe className="w-4 h-4" /> 
    },
    { 
      label: 'user.settings.section.notifications', 
      href: '/user/notifications', 
      icon: <BellDot className="w-4 h-4" /> 
    },
    { 
      label: 'user.settings.section.about', 
      href: '/user/about', 
      icon: <FileText className="w-4 h-4" /> 
    },
    { 
      label: 'user.settings.section.legalTermPolicies', 
      href: '/user/legal', 
      icon: <FileText className="w-4 h-4" /> 
    },
    { 
      label: 'user.settings.section.switchAccount', 
      href: '/user/switch', 
      icon: <Repeat2 className="w-4 h-4" /> 
    },
  ],
  signOut: {
    label: 'user.settings.signout',
    href: '/logout',
    icon: <LogOut className="w-4 h-4" />,
  },
}