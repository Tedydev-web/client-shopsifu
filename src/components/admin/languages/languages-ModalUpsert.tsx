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
import { useTranslation } from "react-i18next"

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
  const { t } = useTranslation()
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

  const handleCodeChange = (selectedCode: string) => {
    setCode(selectedCode)
    const found = languageOptions.find(opt => opt.code === selectedCode)
    if (found) setName(found.name)
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {mode === 'add' ? t("admin.languages.modal.title") : t("admin.languages.modalEdit.title")}
          </DialogTitle>
          <DialogDescription>
            {mode === 'add' 
              ? t("admin.languages.modal.subtitle") 
              : t("admin.languages.modalEdit.subtitle")}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">{t("admin.languages.modal.code")}</label>
            <Select value={code} onValueChange={handleCodeChange} disabled={mode === 'edit'}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder={t("admin.languages.modal.codePlaceholder")} />
              </SelectTrigger>
              <SelectContent className="w-full">
                <div>
                  <input
                    className="w-full px-2 py-1 border rounded text-sm"
                    placeholder={t("admin.languages.modal.searchPlaceholder")}
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
            <label className="block text-sm font-medium mb-1">{t("admin.languages.modal.name")}</label>
            <Input 
              value={name} 
              onChange={e => setName(e.target.value)} 
              required 
              placeholder={t("admin.languages.modal.namePlaceholder")} 
            />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline" disabled={loading} onClick={onClose}>
                {t("admin.languages.modal.cancel")}
              </Button>
            </DialogClose>
            <Button type="submit" disabled={loading}>
              {loading 
                ? (mode === 'add' ? t("admin.languages.modal.processing") : t("admin.languages.modal.processing")) 
                : (mode === 'add' ? t("admin.languages.modal.save") : t("admin.languages.modal.save"))}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
