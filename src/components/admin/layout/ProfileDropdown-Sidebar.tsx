"use client"

import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuSub, DropdownMenuSubTrigger, DropdownMenuSubContent } from '@/components/ui/dropdown-menu'
import { User, LogOut, Languages, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import React from 'react'
import { useChangeLang } from '@/hooks/useChangeLang'
import { useLogout } from '@/hooks/useLogout'
import { useRouter } from 'next/navigation'
import { t } from 'i18next'

export function ProfileDropdownSidebar() {
  // Static user info for demo
  const name = "Nguyen Phat"
  const email = "nguyendangphat1312@gmail.com"
  const { changeLanguage, currentLangName, currentSelectedLang } = useChangeLang()
  const { handleLogout, loading: logoutLoading } = useLogout()
  const router = useRouter()
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="w-full flex items-center justify-start gap-2 px-3 py-2 rounded-lg hover:bg-gray-100">
          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-lg">
            {name[0]}
          </div>
          <span className="font-medium text-sm text-left flex flex-col">
            <span className="leading-tight">{name}</span>
            <span className="text-xs text-gray-500 truncate max-w-[150px]">{email}</span>
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 p-0 bg-white border border-gray-200 rounded-lg shadow-lg">
      <div className="flex items-center justify-center pt-4 pb-2 w-full">
        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-xl font-semibold mr-3 flex-shrink-0">
            {name[0]}
        </div>
        <div className="flex flex-col max-w-[150px]">
            <div className="font-medium text-base text-gray-900 truncate">{name}</div>
            <div className="text-xs text-gray-500 truncate">{email}</div>
        </div>
        </div>
        <DropdownMenuSeparator className="bg-gray-200" />
        <DropdownMenuItem className="text-gray-700 hover:bg-gray-100 px-4 py-2"
        onClick={() => router.push('/admin/settings/profile')}>
          <User className="w-4 h-4 mr-2 text-gray-600" />
          {t('admin.profileDropdown.profileManage')}
        </DropdownMenuItem>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger className="text-gray-700 hover:bg-gray-100 px-4 py-2">
            <Languages className="w-4 h-4 mr-2 text-gray-600"/>
            {t('admin.profileDropdown.language')} {currentLangName}
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent className="w-56 bg-white border border-gray-200 rounded-lg shadow-lg">
            <DropdownMenuItem className="text-gray-700 hover:bg-gray-100 px-4 py-2" onClick={() => changeLanguage('vi')}>
              {t('admin.profileDropdown.lang.vi')}
              {currentSelectedLang === 'vi' && <Check className="w-4 h-4 text-green-500" />}
            </DropdownMenuItem>
            <DropdownMenuItem className="text-gray-700 hover:bg-gray-100 px-4 py-2" onClick={() => changeLanguage('en')}>
              {t('admin.profileDropdown.lang.en')}
              {currentSelectedLang === 'en' && <Check className="w-4 h-4 text-green-500" />}
            </DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        <DropdownMenuSeparator className="bg-gray-200" />
        <DropdownMenuItem className="text-gray-700 hover:bg-gray-100 px-4 py-2"
        onClick={handleLogout} 
        disabled={logoutLoading}
        >
          <LogOut className="w-4 h-4 mr-2 text-gray-600" />
          {t('admin.profileDropdown.logout')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}