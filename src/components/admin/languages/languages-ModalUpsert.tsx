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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import ISO6391 from 'iso-639-1'

interface LanguagesModalUpsertProps {
  open: boolean
  onClose: () => void
  mode: 'add' | 'edit'
  language?: Language | null
  onSubmit: (values: { code: string; name: string }) => Promise<void>
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
  const [search, setSearch] = useState("")

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
    if (!code) {
      showToast("Vui lòng chọn mã ngôn ngữ", "error")
      return
    }
    if (name.length < 2) {
      showToast("Tên ngôn ngữ phải có ít nhất 2 ký tự", "error")
      return
    }

    setLoading(true)
    try {
      await onSubmit({ code, name })
      onClose()
    } catch (error) {
      showToast("Có lỗi xảy ra", "error")
    } finally {
      setLoading(false)
    }
  }

  // Lấy danh sách code ngôn ngữ từ iso-639-1
  const languageOptions = ISO6391.getAllCodes().map(code => ({
    code,
    name: ISO6391.getNativeName(code) || ISO6391.getName(code)
  }))

  // Lọc theo search
  const filteredOptions = search
    ? languageOptions.filter(opt =>
        opt.code.toLowerCase().includes(search.toLowerCase()) ||
        (opt.name && opt.name.toLowerCase().includes(search.toLowerCase()))
      )
    : languageOptions

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
            <Select value={code} onValueChange={setCode} disabled={mode === 'edit'}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Chọn mã ngôn ngữ" />
              </SelectTrigger>
              <SelectContent className="w-full">
                <div className="p-2">
                  <input
                    className="w-full px-2 py-1 border rounded text-sm"
                    placeholder="Tìm kiếm mã hoặc tên..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    onMouseDown={e => e.stopPropagation()}
                    autoFocus
                  />
                </div>
                <div className="max-h-60 overflow-y-auto">
                  {filteredOptions.length === 0 ? (
                    <div className="p-2 text-sm text-muted-foreground">Không tìm thấy ngôn ngữ phù hợp</div>
                  ) : (
                    filteredOptions.map(opt => (
                      <SelectItem key={opt.code} value={opt.code} className="w-full">
                        {opt.code} - {opt.name}
                      </SelectItem>
                    ))
                  )}
                </div>
              </SelectContent>
            </Select>
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
