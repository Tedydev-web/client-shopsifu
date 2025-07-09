'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { z } from 'zod'
import { ZodError } from 'zod'
import { useTranslations } from 'next-intl'
import { showToast } from '@/components/ui/toastify'
import { Brand, BrandCreateRequest, BrandUpdateRequest } from '@/types/admin/brands.interface'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Upload, X, Camera, Image as ImageIcon } from "lucide-react"
import { useUploadMedia } from '@/hooks/useUploadMedia'
import { Progress } from '@/components/ui/progress'

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
  
  // Upload media hook
  const { 
    files, 
    uploadedUrls, 
    isUploading,
    progress,
    error: uploadError,
    handleAddFiles,
    handleRemoveFile,
    handleRemoveAllFiles,
    uploadFiles,
    reset: resetUpload
  } = useUploadMedia()

  // Reset form when modal opens or mode/brand changes
  useEffect(() => {
    if (mode === 'edit' && brand) {
      setName(brand.name || "")
      setLogo(brand.logo || "")
      
      // Reset upload state
      resetUpload()
    } else if (mode === 'add') {
      setName("")
      setLogo("")
      setErrors({})
      
      // Reset upload state
      resetUpload()
    }
  }, [mode, brand, open, resetUpload])

  // Handle file change for logo upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      // File type validation
      const file = e.target.files[0];
      if (!file.type.startsWith('image/')) {
        showToast('Định dạng tệp không được hỗ trợ. Vui lòng chọn tệp hình ảnh (JPG, PNG, GIF, etc.)', 'error');
        return;
      }
      
      // Clear existing files first
      handleRemoveAllFiles();
      
      // Add the new file (which will be compressed automatically)
      handleAddFiles(e.target.files);
    }
  };
  
  // Handle logo upload
  const handleUploadLogo = async () => {
    if (files.length === 0) return;
    
    const urls = await uploadFiles();
    if (urls.length > 0) {
      // Use the first uploaded image URL as logo
      setLogo(urls[0]);
    }
  };

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
                {t('modal.logo') || 'Logo thương hiệu'}
              </label>
              
              <div className="space-y-3">
                {/* Logo preview with integrated select button */}
                <div className="flex items-center space-x-4">
                  <div className="relative group">
                    <Avatar className="h-16 w-16 border-2 border-gray-200">
                      {logo ? (
                        <AvatarImage 
                          src={logo} 
                          alt="Logo preview" 
                          className="object-contain p-1" 
                        />
                      ) : (
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                          {name ? name.substring(0, 2).toUpperCase() : <ImageIcon className="h-6 w-6" />}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    
                    {/* Overlay select button */}
                    <button 
                      type="button"
                      onClick={() => document.getElementById('logo-upload')?.click()}
                      disabled={isUploading}
                      aria-label={t('modal.selectImage') || 'Chọn logo'}
                      title={t('modal.selectImage') || 'Chọn logo'}
                      className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 rounded-full transition-opacity"
                    >
                      <Camera className="h-5 w-5 text-white" />
                    </button>
                  </div>
                  
                  {/* Logo URL - Read Only */}
                  <div className="flex-1 space-y-1">
                    <Input 
                      value={logo} 
                      onChange={e => setLogo(e.target.value)}
                      placeholder={t('modal.logoPlaceholder') || 'URL sẽ được tạo sau khi tải lên'} 
                      className="bg-muted"
                    />
                    
                    {/* Upload button only shown when a file is selected */}
                    {files.length > 0 && (
                      <Button 
                        type="button"
                        size="sm"
                        onClick={handleUploadLogo}
                        disabled={isUploading}
                        className="w-full"
                      >
                        {isUploading ? t('modal.uploading') || 'Đang tải lên...' : t('modal.uploadImage') || 'Tải lên'}
                      </Button>
                    )}
                  </div>
                </div>
                
                <input
                  id="logo-upload"
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                  disabled={isUploading}
                  accept="image/*"
                  aria-label={t('modal.selectImage') || 'Chọn logo'}
                />
                
                {/* Upload progress */}
                {isUploading && (
                  <div className="space-y-1">
                    <Progress value={progress} className="h-1" />
                    <p className="text-xs text-muted-foreground">
                      {progress}% {t('modal.completed') || 'đã hoàn thành'}
                    </p>
                  </div>
                )}
                
                {/* File preview */}
                {files.length > 0 && !isUploading && (
                  <div className="text-xs text-muted-foreground">
                    {files[0].name} ({Math.round(files[0].size / 1024)} KB)
                  </div>
                )}
                
                {/* Upload error */}
                {uploadError && (
                  <p className="text-sm text-red-500">{uploadError}</p>
                )}
              </div>
              {errors.logo && <p className="text-sm text-red-500 mt-1">{errors.logo}</p>}
            </div>
          </div>

          <DialogFooter className="mt-6">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose} 
              disabled={loading || isUploading}
            >
              {t('modal.cancel') || 'Hủy'}
            </Button>
            <Button 
              type="submit" 
              disabled={loading || isUploading}
            >
              {loading || isUploading
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
