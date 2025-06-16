'use client'

import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import { ChevronDown } from 'lucide-react'
import { User } from '@/types/admin/user.interface' // Import User type

interface UsersModalUpsertProps {
  open: boolean;
  onClose: () => void;
  mode: 'add' | 'edit';
  user?: User; // Use the correct User type
  onSubmit: (user: User) => Promise<void>; // Expect a full User object to match the call site
}

export default function UsersModalUpsert({
  open, onClose, mode, user, onSubmit
}: UsersModalUpsertProps) {
  const { t } = useTranslation('')
  // Form state
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [roleId, setRoleId] = useState(1) // Assuming 1 is a default roleId
  const [status, setStatus] = useState("ACTIVE")
  const [loading, setLoading] = useState(false)

  // These should ideally come from an API or a shared constant
  const ROLE_OPTIONS = [
    { value: 1, label: t('admin.users.role.user') },
    { value: 2, label: t('admin.users.role.admin') },
  ]
  const STATUS_OPTIONS = [
    { value: 'ACTIVE', label: t('Hoạt động') },
    { value: 'INACTIVE', label: t('Không hoạt động') },
  ]

  useEffect(() => {
    if (mode === 'edit' && user) {
      setUsername(user.userProfile?.username || `${user.userProfile?.firstName} ${user.userProfile?.lastName}`.trim() || '')
      setEmail(user.email || "")
      setRoleId(user.roleId || 1)
      setStatus(user.status || "ACTIVE")
    } else if (mode === 'add') {
      // Reset form for adding new user
      setUsername(""); 
      setEmail(""); 
      setRoleId(1); 
      setStatus("ACTIVE");
    }
  }, [mode, user, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user && mode === 'edit') return; // Should not happen

    setLoading(true)
    // Construct a new user object that matches the `User` type to satisfy the call site in `users-Table.tsx`
    // This is a temporary solution. Ideally, this should send a UserUpdateRequest.
    const updatedUser: User = {
      ...(user || {}),
      id: user?.id || 0,
      email: email,
      status: status,
      roleId: roleId,
      isEmailVerified: user?.isEmailVerified || false,
      createdAt: user?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      userProfile: {
        ...(user?.userProfile),
        id: user?.userProfile?.id || 0,
        username: username,
        firstName: user?.userProfile?.firstName || '',
        lastName: user?.userProfile?.lastName || '',
        phoneNumber: user?.userProfile?.phoneNumber || '',
        bio: user?.userProfile?.bio || '',
        avatar: user?.userProfile?.avatar || '',
        countryCode: user?.userProfile?.countryCode || '',
        createdAt: user?.userProfile?.createdAt || '',
        updatedAt: user?.userProfile?.updatedAt || '',
        deletedAt: user?.userProfile?.deletedAt || null,
        deletedById: user?.userProfile?.deletedById || null,
        updatedById: user?.userProfile?.updatedById || null,
        createdById: user?.userProfile?.createdById || null,
      },
    };

    await onSubmit(updatedUser)
    setLoading(false)
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {mode === 'add' ? t('admin.users.modal.addTitle') : t('admin.users.modal.editTitle')}
          </DialogTitle>
          <DialogDescription>
            {mode === 'add' ? t('admin.users.modal.addDescription') : t('admin.users.modal.editDescription')}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">{t('Tên người dùng')}</label>
            <Input
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
              placeholder={t('Tên người dùng')}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">{t('admin.users.modal.email')}</label>
            <Input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              placeholder={t('admin.users.modal.email')}
              disabled={mode === 'edit'}
            />
          </div>
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">{t('admin.users.modal.role')}</label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full flex justify-between items-center">
                    {ROLE_OPTIONS.find(opt => opt.value === roleId)?.label || t('admin.users.modal.role')}
                    <ChevronDown size={16} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-full min-w-[120px]">
                  {ROLE_OPTIONS.map(opt => (
                    <DropdownMenuItem key={opt.value} onClick={() => setRoleId(opt.value)}>
                      {opt.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">{t('admin.users.modal.status')}</label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full flex justify-between items-center">
                    {STATUS_OPTIONS.find(opt => opt.value === status)?.label || t('admin.users.modal.status')}
                    <ChevronDown size={16} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-full min-w-[120px]">
                  {STATUS_OPTIONS.map(opt => (
                    <DropdownMenuItem key={opt.value} onClick={() => setStatus(opt.value)}>
                      {opt.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline" disabled={loading} onClick={onClose}>
                {t('admin.users.modal.cancel')}
              </Button>
            </DialogClose>
            <Button type="submit" disabled={loading}>
              {loading
                ? mode === 'add' ? t('admin.users.modal.loadingAdd') : t('admin.users.modal.loadingEdit')
                : mode === 'add' ? t('admin.users.modal.confirmAdd') : t('admin.users.modal.confirmEdit')
              }
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
