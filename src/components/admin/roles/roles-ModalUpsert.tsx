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
import { Checkbox } from "@/components/ui/checkbox"
import { usePermissions } from "@/components/admin/permissions/usePermissions"
import { showToast } from "@/components/ui/toastify"
import { useTranslation } from "react-i18next"

interface Role {
  id?: number
  name: string
  description?: string
  isActive: boolean
  permissionIds?: string[]
}

interface RolesModalUpsertProps {
  open: boolean
  onClose: () => void
  mode: 'add' | 'edit'
  role?: Role | null
  onSubmit: (values: {
    name: string
    description: string
    isActive: boolean
    permissionIds: string[]
  }) => Promise<void>
}

export default function RolesModalUpsert({
  open,
  onClose,
  mode,
  role,
  onSubmit,
}: RolesModalUpsertProps) {
  const { t } = useTranslation()
  const { permissions, getAllPermissions } = usePermissions()

  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [isActive, setIsActive] = useState(true)
  const [selectedPermissionIds, setSelectedPermissionIds] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (permissions.length === 0) {
      getAllPermissions()
    }
  }, [])

  useEffect(() => {
    if (mode === "edit" && role) {
      setName(role.name || "")
      setDescription(role.description || "")
      setIsActive(role.isActive ?? true)
      setSelectedPermissionIds(role.permissionIds || [])
    } else if (mode === "add") {
      setName("")
      setDescription("")
      setIsActive(true)
      setSelectedPermissionIds([])
    }
  }, [mode, role, open])

  const handleTogglePermission = (id: string) => {
    setSelectedPermissionIds(prev =>
      prev.includes(id) ? prev.filter(pid => pid !== id) : [...prev, id]
    )
  }

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
        permissionIds: selectedPermissionIds,
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
      <DialogContent className="max-h-[90vh] overflow-y-auto">
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

        <form onSubmit={handleSubmit} className="space-y-4">
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

          <div>
            <label className="block text-sm font-medium mb-2">{t("admin.roles.modal.permissions")}</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-60 overflow-y-auto border rounded-md p-2">
              {permissions.map((permission) => (
                <label key={permission.id} className="flex items-center gap-2">
                  <Checkbox
                    checked={selectedPermissionIds.includes(permission.id.toString())}
                    onCheckedChange={() => handleTogglePermission(permission.id.toString())}
                  />
                  <span className="text-sm">{permission.name}</span>
                </label>
              ))}
            </div>
          </div>

          <DialogFooter className="pt-4">
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
