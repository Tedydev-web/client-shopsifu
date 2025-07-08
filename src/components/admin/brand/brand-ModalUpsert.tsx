'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { z } from 'zod'
import { ZodError } from 'zod'
import { useTranslations } from 'next-intl'
import { Brand, BrandCreateRequest, BrandUpdateRequest } from '@/types/admin/brands.interface'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Upload, X } from "lucide-react"

interface BrandModalUpsertProps {
  open: boolean
  onClose: () => void
  mode: "add" | "edit"
  brand: Brand | null
  onSubmit: (values: BrandCreateRequest | BrandUpdateRequest) => Promise<void>
}

export default function BrandModalUpsert({
  open,
  onClose,
  mode,
  brand,
  onSubmit,
}: BrandModalUpsertProps) {
  const t = useTranslations('admin.ModuleBrands')
  
  // Form state
  const [name, setName] = useState("")
  const [logo, setLogo] = useState("")
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Reset form when modal opens or mode/brand changes
  useEffect(() => {
    if (mode === 'edit' && brand) {
      setName(brand.name || "")
      setLogo(brand.logo || "")
    } else if (mode === 'add') {
      setName("")
      setLogo("")
      setErrors({})
    }
  }, [mode, brand, open])

  // Create validation schema
  const brandSchema = z.object({
    name: z.string().min(1, "Tên thương hiệu là bắt buộc"),
    logo: z.string().optional(),
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      brandSchema.parse({ name, logo });
      setErrors({});
      setLoading(true);
      
      try {
        if (mode === 'add') {
          const data: BrandCreateRequest = {
            name,
            logo,
          };
          await onSubmit(data);
        } else if (mode === 'edit' && brand) {
          const data: BrandUpdateRequest = {
            name,
            logo,
          };
          await onSubmit(data);
        }
        onClose();
      } catch (error) {
        console.error('Error submitting form:', error);
      } finally {
        setLoading(false);
      }
    } catch (error) {
      if (error instanceof ZodError) {
        const formattedErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            formattedErrors[err.path[0].toString()] = err.message;
          }
        });
        setErrors(formattedErrors);
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {mode === 'add' ? t('modal.addTitle') || 'Thêm thương hiệu' : t('modal.editTitle') || 'Chỉnh sửa thương hiệu'}
          </DialogTitle>
          <DialogDescription>
            {mode === 'add' 
              ? t('modal.addDescription') || 'Điền thông tin để thêm thương hiệu mới'
              : t('modal.editDescription') || 'Chỉnh sửa thông tin thương hiệu'
            }
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                {t('modal.name') || 'Tên thương hiệu'} <span className="text-red-500">*</span>
              </label>
              <Input 
                value={name} 
                onChange={e => setName(e.target.value)} 
                placeholder={t('modal.namePlaceholder') || 'Nhập tên thương hiệu'} 
              />
              {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                {t('modal.logo') || 'Logo URL'}
              </label>
              <div className="flex items-center space-x-4">
                <Avatar className="h-16 w-16 border-2 border-gray-200">
                  {logo ? (
                    <AvatarImage 
                      src={logo} 
                      alt="Logo preview" 
                      className="object-contain p-2" 
                    />
                  ) : (
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                      {name ? name.substring(0, 2).toUpperCase() : <Upload className="h-6 w-6" />}
                    </AvatarFallback>
                  )}
                </Avatar>
                <Input 
                  value={logo} 
                  onChange={e => setLogo(e.target.value)} 
                  placeholder={t('modal.logoPlaceholder') || 'Nhập URL logo'} 
                />
              </div>
              {errors.logo && <p className="text-sm text-red-500 mt-1">{errors.logo}</p>}
            </div>
          </div>

          <DialogFooter className="mt-6">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose} 
              disabled={loading}
            >
              {t('modal.cancel') || 'Hủy'}
            </Button>
            <Button 
              type="submit" 
              disabled={loading}
            >
              {loading 
                ? (mode === 'add' ? t('modal.adding') || 'Đang thêm...' : t('modal.saving') || 'Đang lưu...')
                : (mode === 'add' ? t('modal.add') || 'Thêm' : t('modal.save') || 'Lưu')
              }
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
