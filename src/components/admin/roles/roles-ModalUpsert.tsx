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
import { PermissionDetail } from '@/types/auth/permission.interface'
import { Role } from './roles-Columns'
import { Permission } from '@/types/auth/role.interface'

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
  permissionsData: Record<string, PermissionDetail[]> | PermissionDetail[];
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
      // Initialize form with role data
      setName(role.name || '')
      setDescription(role.description || '')
      setIsActive(role.isActive ?? true)
      
      // Set permission IDs from the fetched role data
      if (role.permissions && role.permissions.length > 0) {
        const initialPermissionIds = role.permissions.map((p: Permission) => Number(p.id)) || []
        console.log("Setting initial permission IDs:", initialPermissionIds)
        setSelectedPermissionIds(new Set<number>(initialPermissionIds))
      } else {
        console.log("No permissions found in role data")
        setSelectedPermissionIds(new Set<number>())
      }
    } else {
      // Reset fields for "add" mode or when role is not available
      setName('')
      setDescription('')
      setIsActive(true)
      setSelectedPermissionIds(new Set<number>())
    }
  }, [mode, role, open])

  // Additional effect to update selected permissions when data changes
  useEffect(() => {
    if (mode === 'edit' && role?.permissions && !isPermissionsLoading) {
      console.log("Updating permissions from useEffect due to permissionsData change");
      const initialPermissionIds = role.permissions.map((p: Permission) => Number(p.id)) || []
      setSelectedPermissionIds(new Set<number>(initialPermissionIds))
    }
  }, [permissionsData, isPermissionsLoading, mode, role])

  const handleMasterSwitchChange = (subject: string, checked: boolean) => {
    // Type guard để xác định permissionsData là Record
    const isRecordType = (data: Record<string, PermissionDetail[]> | PermissionDetail[]): 
      data is Record<string, PermissionDetail[]> => !Array.isArray(data);
      
    if (!isRecordType(permissionsData)) {
      console.error("Permissions data is not in expected format");
      return;
    }
    
    const subjectPermissions = permissionsData[subject] || [];
    const subjectPermissionIds = subjectPermissions.map((p: PermissionDetail) => Number(p.id));
    
    console.log(`${checked ? 'Selecting' : 'Deselecting'} all permissions for module ${subject}:`, subjectPermissionIds);

    setSelectedPermissionIds(prev => {
      const newSet = new Set<number>(prev);
      if (checked) {
        subjectPermissionIds.forEach((id: number) => newSet.add(id));
      } else {
        subjectPermissionIds.forEach((id: number) => newSet.delete(id));
      }
      return newSet;
    });
  };

  const handleChildSwitchChange = (id: number, checked: boolean) => {
    console.log(`${checked ? 'Selecting' : 'Deselecting'} permission:`, id);
    
    setSelectedPermissionIds(prev => {
      const newSet = new Set(prev);
      const numericId = Number(id);
      
      if (checked) {
        newSet.add(numericId);
      } else {
        newSet.delete(numericId);
      }
      
      console.log("New selected permission IDs:", Array.from(newSet));
      return newSet;
    });
  };

  const getActionColor = (action?: string) => {
    if (!action) return 'text-slate-600 font-medium';
    const lowerAction = action.toLowerCase();
    
    // Format dựa trên METHOD (đang có format "METHOD - /path")
    if (lowerAction.startsWith('get ')) return 'text-emerald-600 font-medium';
    if (lowerAction.startsWith('post ')) return 'text-blue-600 font-medium';
    if (lowerAction.startsWith('put ') || lowerAction.startsWith('patch ')) return 'text-amber-600 font-medium';
    if (lowerAction.startsWith('delete ')) return 'text-red-600 font-medium';
    
    return 'text-slate-600 font-medium';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim()) {
      showToast(t("admin.roles.modal.nameValidation"), "error")
      return
    }

    setLoading(true)
    try {
      // Tạo request data khác nhau cho add và edit
      if (mode === 'add') {
        await onSubmit({
          name,
          description,
          isActive,
          permissionIds: [],  // Không gửi permissionIds khi tạo mới
        })
      } else {
        // Mode edit
        const permissionIds = Array.from(selectedPermissionIds)
        console.log("Submitting with permission IDs:", permissionIds)
        
        await onSubmit({
          name,
          description,
          isActive,
          permissionIds: permissionIds,
        })
      }
      
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

            {/* Chỉ hiển thị phần permission khi đang ở chế độ Edit */}
            {mode === 'edit' && (
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
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <Skeleton className="h-4 w-32" />
                          <Skeleton className="h-4 w-12" />
                        </div>
                        <Skeleton className="h-6 w-12" />
                      </div>
                      <Skeleton className="h-12 w-full rounded-lg" />
                      <Skeleton className="h-12 w-full rounded-lg" />
                      <Skeleton className="h-12 w-full rounded-lg" />
                      <Skeleton className="h-12 w-full rounded-lg" />
                    </div>
                  ) : (
                    <Accordion type="multiple" className="w-full">
                      {Object.entries(permissionsData || {}).map(([subject, items]) => {
                        const allSelected = items.every((item: PermissionDetail) => selectedPermissionIds.has(Number(item.id)));
                        return (
                          <AccordionItem value={subject} key={subject}>
                            <AccordionTrigger className="bg-slate-50 hover:bg-slate-100 px-4 data-[state=open]:bg-slate-100 rounded-t-lg">
                              <div className="flex items-center justify-between w-full">
                                <span className="font-semibold uppercase tracking-wider">
                                  {subject} 
                                  <span className="text-xs text-muted-foreground ml-2 normal-case">
                                    ({items.filter(item => selectedPermissionIds.has(Number(item.id))).length}/{items.length} quyền)
                                  </span>
                                </span>
                                <Switch
                                  checked={allSelected}
                                  onCheckedChange={(checked) => handleMasterSwitchChange(subject, checked)}
                                  onClick={(e) => e.stopPropagation()}
                                />
                              </div>
                            </AccordionTrigger>
                            <AccordionContent className="bg-white p-4">
                              <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-6 gap-y-4">
                                {items.map((item: PermissionDetail) => (                                   
                                   <div key={item.id} className="space-y-1">
                                    <div className="flex items-center justify-between gap-2">
                                      <div className="flex-1 min-w-0">
                                        <Label 
                                          htmlFor={`perm-${item.id}`} 
                                          className={`
                                            ${getActionColor(item.action)} 
                                            line-clamp-2 
                                            text-sm
                                            ${selectedPermissionIds.has(Number(item.id)) ? 'font-semibold' : 'font-normal'}
                                          `}
                                        >
                                          {item.action}
                                        </Label>
                                      </div>
                                      <div className="flex-shrink-0">
                                        <Switch
                                          id={`perm-${item.id}`}
                                          checked={selectedPermissionIds.has(Number(item.id))}
                                          onCheckedChange={(checked) => handleChildSwitchChange(Number(item.id), checked)}
                                        />
                                      </div>
                                    </div>
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
            )}
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
