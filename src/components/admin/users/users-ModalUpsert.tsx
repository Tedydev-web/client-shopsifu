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

interface UsersModalUpsertProps {
  open: boolean;
  onClose: () => void;
  mode: 'add' | 'edit';
  user?: { id?: string; name: string; email: string; role: string; status: string };
  onSubmit: (user: { id?: string; name: string; email: string; role: string; status: string }) => Promise<void>;
}

export default function UsersModalUpsert({
  open, onClose, mode, user, onSubmit
}: UsersModalUpsertProps) {
  const { t } = useTranslation('')
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [role, setRole] = useState("user")
  const [status, setStatus] = useState("active")
  const [loading, setLoading] = useState(false)

  const ROLE_OPTIONS = [
    { value: 'user', label: t('admin.users.role.user') },
    { value: 'admin', label: t('admin.users.role.admin') },
    { value: 'editor', label: t('admin.users.role.editor') },
  ]
  const STATUS_OPTIONS = [
    { value: 'active', label: t('admin.users.status.active') },
    { value: 'inactive', label: t('admin.users.status.inactive') },
    { value: 'pending', label: t('admin.users.status.pending') },
  ]

  useEffect(() => {
    if (mode === 'edit' && user) {
      setName(user.name || "")
      setEmail(user.email || "")
      setRole(user.role || "user")
      setStatus(user.status || "active")
    } else if (mode === 'add') {
      setName(""); setEmail(""); setRole("user"); setStatus("active")
    }
  }, [mode, user, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    await onSubmit({ id: user?.id, name, email, role, status })
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
            <label className="block text-sm font-medium mb-1">{t('admin.users.modal.name')}</label>
            <Input
              value={name}
              onChange={e => setName(e.target.value)}
              required
              placeholder={t('admin.users.modal.name')}
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
                    {ROLE_OPTIONS.find(opt => opt.value === role)?.label || t('admin.users.modal.role')}
                    <ChevronDown size={16} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-full min-w-[120px]">
                  {ROLE_OPTIONS.map(opt => (
                    <DropdownMenuItem key={opt.value} onClick={() => setRole(opt.value)}>
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
