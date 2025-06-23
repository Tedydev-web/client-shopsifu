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
import { useTranslation } from 'react-i18next' // Add this import

export const useSettingsMockData = () => { // Convert to a hook
  const { t, i18n } = useTranslation() // Add translation hook

  const langLabel = i18n.language === "vi" ? "Tiếng Việt" : "English";

  return {
    header: {
      title: t('user.settings.title'),
      statusTitle: t('user.settings.subtitle'),
      statusDesc: t('user.settings.description'),
      items: [
        { 
          label: t('user.settings.items.Account security'), 
          icon: <ShieldCheck className="w-4 h-4" />, 
          href: '/user/profile' 
        },
        { 
          label: t('user.settings.items.Privacy'), 
          icon: <Lock className="w-4 h-4" />, 
          href: '/user/privacy' 
        },
        { 
          label: t('user.settings.items.Permissions'), 
          icon: <UserCheck className="w-4 h-4" />, 
          href: '/user/permissions' 
        },
        { 
          label: t('user.settings.items.Safety center'), 
          icon: <Shield className="w-4 h-4" />, 
          href: '/user/safety' 
        },
      ],
    },
    sections: [
      { 
        label: t('user.settings.section.paymentmethods'), 
        href: '/user/payment', 
        icon: <CreditCard className="w-4 h-4" /> 
      },
      { 
        label: t('user.settings.section.country'), 
        href: '/user/region', 
        value: 'VN', 
        icon: <Globe className="w-4 h-4" /> 
      },
      { 
        label: t('user.settings.section.language'), 
        href: '/user/language', 
        value: langLabel, 
        icon: <Languages className="w-4 h-4" /> 
      },
      { 
        label: t('user.settings.section.currency'), 
        href: '/user/currency', 
        value: 'VND', 
        icon: <Globe className="w-4 h-4" /> 
      },
      { 
        label: t('user.settings.section.notifications'), 
        href: '/user/notifications', 
        icon: <BellDot className="w-4 h-4" /> 
      },
      { 
        label: t('user.settings.section.about'), 
        href: '/user/about', 
        icon: <FileText className="w-4 h-4" /> 
      },
      { 
        label: t('user.settings.section.legalTermPolicies'), 
        href: '/user/legal', 
        icon: <FileText className="w-4 h-4" /> 
      },
      { 
        label: t('user.settings.section.switchAccount'), 
        href: '/user/switch', 
        icon: <Repeat2 className="w-4 h-4" /> 
      },
    ],
    signOut: {
      label: t('user.settings.signout'),
      href: '/logout',
      icon: <LogOut className="w-4 h-4" />,
    },
  }
}