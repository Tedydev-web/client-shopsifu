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
import { Language } from "./languages-Columns"

interface LanguagesModalUpsertProps {
  open: boolean
  onClose: () => void
  mode: 'add' | 'edit'
  language?: Language | null
  onSubmit: (values: { code: string; name: string; isActive: boolean }) => Promise<void>
}

export default function LanguagesModalUpsert({
  open,
  onClose,
  mode,
  language,
  onSubmit,
}: LanguagesModalUpsertProps) {
  const [code, setCode] = useState("")
  const [name, setName] = useState("")
  const [isActive, setIsActive] = useState(true)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (mode === 'edit' && language) {
      setCode(language.code || "")
      setName(language.name || "")
      setIsActive(language.isActive ?? true)
    } else if (mode === 'add') {
      setCode("")
      setName("")
      setIsActive(true)
    }
  }, [mode, language, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (code.length < 2) {
      showToast("Mã ngôn ngữ phải có ít nhất 2 ký tự", "error")
      return
    }
    if (name.length < 2) {
      showToast("Tên ngôn ngữ phải có ít nhất 2 ký tự", "error")
      return
    }

    setLoading(true)
    try {
      await onSubmit({ code, name, isActive })
      showToast("Lưu ngôn ngữ thành công", "success")
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
            {mode === 'add' ? 'Thêm ngôn ngữ mới' : 'Chỉnh sửa ngôn ngữ'}
          </DialogTitle>
          <DialogDescription>
            {mode === 'add' 
              ? 'Nhập thông tin ngôn ngữ để thêm mới vào hệ thống.' 
              : 'Cập nhật thông tin ngôn ngữ.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Mã ngôn ngữ</label>
            <Input 
              value={code} 
              onChange={e => setCode(e.target.value)} 
              required 
              placeholder="Nhập mã ngôn ngữ..." 
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Tên ngôn ngữ</label>
            <Input 
              value={name} 
              onChange={e => setName(e.target.value)} 
              required 
              placeholder="Nhập tên ngôn ngữ..." 
            />
          </div>
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <label className="text-base font-medium">Trạng thái hoạt động</label>
              <div className="text-sm text-muted-foreground">
                Đặt trạng thái hoạt động của ngôn ngữ
              </div>
            </div>
            <Switch
              checked={isActive}
              onCheckedChange={setIsActive}
            />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline" disabled={loading} onClick={onClose}>
                Hủy
              </Button>
            </DialogClose>
            <Button type="submit" disabled={loading}>
              {loading 
                ? (mode === 'add' ? 'Đang thêm...' : 'Đang cập nhật...') 
                : (mode === 'add' ? 'Thêm mới' : 'Cập nhật')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
