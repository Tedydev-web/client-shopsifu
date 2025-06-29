'use client'

import { useEffect, useState } from 'react'
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
import { Switch } from "@/components/ui/switch"
import { showToast } from "@/components/ui/toastify"
import { useTranslations } from "next-intl"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
import { PerGetAllResponse } from '@/types/auth/permission.interface'
import { Role } from './roles-Columns'

interface RolesModalUpsertProps {
  open: boolean
  onClose: () => void
  mode: 'add' | 'edit'
  role?: Role | null
  onSubmit: (values: {
    name: string
    description: string
    isActive: boolean
    permissionIds: number[]
  }) => Promise<void>
  permissionsData: PerGetAllResponse['data'];
  isPermissionsLoading: boolean;
}

export default function RolesModalUpsert({
  open,
  onClose,
  mode,
  role,
  onSubmit,
  permissionsData,
  isPermissionsLoading,
}: RolesModalUpsertProps) {
  const t = useTranslations()

  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [isActive, setIsActive] = useState(true)
  const [loading, setLoading] = useState(false)
  const [selectedPermissionIds, setSelectedPermissionIds] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (mode === 'edit' && role) {
      setName(role.name || '')
      setDescription(role.description || '')
      setIsActive(role.isActive ?? true)
      const initialPermissionIds = role.permissions?.map(p => p.id) || []
      setSelectedPermissionIds(new Set(initialPermissionIds))
    } else {
      // Reset fields for "add" mode or when role is not available
      setName('')
      setDescription('')
      setIsActive(true)
      setSelectedPermissionIds(new Set())
    }
  }, [mode, role, open])

  const handleMasterSwitchChange = (subject: string, checked: boolean) => {
    const subjectPermissions = permissionsData[subject] || [];
    const subjectPermissionIds = subjectPermissions.map(p => p.id);
    const initialPermissionIds = role?.permissions?.map(p => p.id) || []

    setSelectedPermissionIds(prev => {
      const newSet = new Set(initialPermissionIds);
      if (checked) {
        subjectPermissionIds.forEach(id => newSet.add(id));
      } else {
        subjectPermissionIds.forEach(id => newSet.delete(id));
      }
      return newSet;
    });
  };

  const handleChildSwitchChange = (id: number, checked: boolean) => {
    setSelectedPermissionIds(prev => {
      const newSet = new Set(prev);
      if (checked) {
        newSet.add(id);
      } else {
        newSet.delete(id);
      }
      return newSet;
    });
  };

  const getActionColor = (action: string) => {
    const lowerAction = action.toLowerCase();
    if (lowerAction.includes('create') || lowerAction.includes('add')) return 'text-blue-600 font-bold';
    if (lowerAction.includes('read') || lowerAction.includes('get') || lowerAction.includes('view')) return 'text-emerald-600 font-bold';
    if (lowerAction.includes('update') || lowerAction.includes('edit') || lowerAction.includes('set')) return 'text-amber-600 font-bold';
    if (lowerAction.includes('delete') || lowerAction.includes('remove')) return 'text-red-600 font-bold';
    return 'text-slate-600 font-bold';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim()) {
      showToast(t("admin.roles.modal.nameValidation"), "error")
      return
    }

    setLoading(true)
    try {
      await onSubmit({
        name,
        description,
        isActive,
        permissionIds: Array.from(selectedPermissionIds),
      })
      onClose()
    } catch (error) {
      showToast("Có lỗi xảy ra", "error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>
            {mode === 'add'
              ? t("admin.roles.modal.title")
              : t("admin.roles.modalEdit.title")}
          </DialogTitle>
          <DialogDescription>
            {mode === 'add'
              ? t("admin.roles.modal.subtitle")
              : t("admin.roles.modalEdit.subtitle")}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex-grow flex flex-col overflow-hidden">
          <div className="flex-grow overflow-y-auto pr-4 space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">{t("admin.roles.modal.name")}</label>
              <Input
                value={name}
                onChange={e => setName(e.target.value)}
                required
                placeholder={t("admin.roles.modal.namePlaceholder")}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">{t("admin.roles.modal.description")}</label>
              <Input
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder={t("admin.roles.modal.descriptionPlaceholder")}
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <label className="text-sm font-medium">{t("admin.roles.modal.isActive")}</label>
              <Switch checked={isActive} onCheckedChange={setIsActive} />
            </div>

            <div className="space-y-2 pt-2">
              <div>
                <h3 className="font-semibold leading-none tracking-tight">{t("admin.roles.modal.permissions")}</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {t("admin.roles.modal.permissionsDescription")}
                </p>
              </div>
              <div className="rounded-lg border mt-2">
                {isPermissionsLoading ? (
                  <div className="p-4 space-y-4">
                    <Skeleton className="h-12 w-full rounded-lg" />
                    <Skeleton className="h-12 w-full rounded-lg" />
                    <Skeleton className="h-12 w-full rounded-lg" />
                    <Skeleton className="h-12 w-full rounded-lg" />
                  </div>
                ) : (
                  <Accordion type="multiple" className="w-full">
                    {Object.entries(permissionsData || {}).map(([subject, items]) => {
                      const allSelected = items.every(item => selectedPermissionIds.has(item.id));
                      return (
                        <AccordionItem value={subject} key={subject}>
                          <AccordionTrigger className="bg-slate-50 hover:bg-slate-100 px-4 data-[state=open]:bg-slate-100 rounded-t-lg">
                            <div className="flex items-center justify-between w-full">
                              <span className="font-semibold uppercase tracking-wider">{subject}</span>
                              <Switch
                                checked={allSelected}
                                onCheckedChange={(checked) => handleMasterSwitchChange(subject, checked)}
                                onClick={(e) => e.stopPropagation()}
                              />
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="bg-white p-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                              {items.map(item => (
                                <div key={item.id} className="space-y-1">
                                  <div className="flex items-center justify-between">
                                    <Label htmlFor={`perm-${item.id}`} className={`uppercase ${getActionColor(item.action)}`}>
                                      {item.action}
                                    </Label>
                                    <Switch
                                      id={`perm-${item.id}`}
                                      checked={selectedPermissionIds.has(item.id)}
                                      onCheckedChange={(checked) => handleChildSwitchChange(item.id, checked)}
                                    />
                                  </div>
                                  <p className="text-sm text-muted-foreground pr-6">{item.description}</p>
                                </div>
                              ))}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      );
                    })}
                  </Accordion>
                )}
              </div>
            </div>
          </div>

          <DialogFooter className="pt-4 border-t mt-4 flex-shrink-0">
            <DialogClose asChild>
              <Button type="button" variant="outline" disabled={loading} onClick={onClose}>
                {t("admin.roles.modal.cancel")}
              </Button>
            </DialogClose>
            <Button type="submit" disabled={loading}>
              {loading
                ? t("admin.roles.modal.processing")
                : t("admin.roles.modal.save")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
