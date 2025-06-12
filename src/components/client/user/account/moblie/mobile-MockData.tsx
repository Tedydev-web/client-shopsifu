import {
  Lock,
  ShieldCheck,
  UserCheck,
  Shield,
  Globe,
  Languages,
  BellDot,
  FileText,
  Share,
  LogOut,
  Repeat2,
  CreditCard,
} from 'lucide-react'

export const settingsMockData = {
  header: {
    title: 'Settings',
    statusTitle: 'Your account is protected',
    statusDesc:
      'Temu protects your personal information and keeps it private, safe and secure.',
    items: [
      { label: 'Account security', icon: <ShieldCheck className="w-4 h-4" />, href: '/user/profile' },
      { label: 'Privacy', icon: <Lock className="w-4 h-4" />, href: '/user/privacy' },
      { label: 'Permissions', icon: <UserCheck className="w-4 h-4" />, href: '/user/permissions' },
      { label: 'Safety center', icon: <Shield className="w-4 h-4" />, href: '/user/safety' },
    ],
  },
  sections: [
    { label: 'Your payment methods', href: '/user/payment', icon: <CreditCard className="w-4 h-4" /> },
    { label: 'Country & region', href: '/user/region', value: 'VN', icon: <Globe className="w-4 h-4" /> },
    { label: 'Language', href: '/user/language', value: 'English', icon: <Languages className="w-4 h-4" /> },
    { label: 'Currency', href: '/user/currency', value: 'VND', icon: <Globe className="w-4 h-4" /> },
    { label: 'Notifications', href: '/user/notifications', icon: <BellDot className="w-4 h-4" /> },
    { label: 'About this app', href: '/user/about', icon: <FileText className="w-4 h-4" /> },
    { label: 'Legal terms & policies', href: '/user/legal', icon: <FileText className="w-4 h-4" /> },
    { label: 'Share this app', href: '/user/share', icon: <Share className="w-4 h-4" /> },
    { label: 'Switch accounts', href: '/user/switch', icon: <Repeat2 className="w-4 h-4" /> },
  ],
  signOut: {
    label: 'Sign out',
    href: '/logout',
    icon: <LogOut className="w-4 h-4" />,
  },
}
