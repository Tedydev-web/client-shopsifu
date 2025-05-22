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
import { showToast } from "@/components/ui/toastify"
import { useTranslation } from "react-i18next"
import { Permission } from "./permissions-Columns"

interface PermissionsModalUpsertProps {
  open: boolean
  onClose: () => void
  mode: 'add' | 'edit'
  permission?: Permission | null
  onSubmit: (values: { name: string, description: string, path: string, method: string }) => Promise<void>
}

export default function PermissionsModalUpsert({
  open,
  onClose,
  mode,
  permission,
  onSubmit,
}: PermissionsModalUpsertProps) {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [loading, setLoading] = useState(false)
  const { t } = useTranslation()

  useEffect(() => {
    if (mode === 'edit' && permission) {
      setName(permission.name || "")
      setDescription(permission.description || "")
    } else if (mode === 'add') {
      setName("")
      setDescription("")
    }
  }, [mode, permission, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (name.length < 2) {
      showToast("Tên quyền phải có ít nhất 2 ký tự", "error")
      return
    }

    setLoading(true)
    try {
      await onSubmit({ name, description, path: "", method: "" })
      onClose()
    } catch (error) {
      showToast("Có lỗi xảy ra", "error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {mode === 'add' ? t("admin.permissions.modal.title") : t("admin.permissions.modalEdit.title")}
          </DialogTitle>
          <DialogDescription>
            {mode === 'add'
              ? t("admin.permissions.modal.subtitle")
              : t("admin.permissions.modalEdit.subtitle")}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">{t("admin.permissions.modal.name")}</label>
            <Input
              value={name}
              onChange={e => setName(e.target.value)}
              required
              placeholder={t("admin.permissions.modal.namePlaceholder")}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">{t("admin.permissions.modal.description")}</label>
            <Input
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder={t("admin.permissions.modal.descriptionPlaceholder")}
            />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline" disabled={loading} onClick={onClose}>
                {t("admin.permissions.modal.cancel")}
              </Button>
            </DialogClose>
            <Button type="submit" disabled={loading}>
              {loading
                ? t("admin.permissions.modal.processing")
                : t("admin.permissions.modal.save")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
