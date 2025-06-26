'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Brand } from "./brand-Columns"
import { useForm } from "react-hook-form"
import { useState, useEffect } from "react"
import { Upload, X } from "lucide-react"
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

const formSchema = z.object({
  code: z.string().min(1, "Mã không được để trống"),
  name: z.string().min(1, "Tên không được để trống"),
  description: z.string().optional(),
  logo: z.string().optional(),
  website: z.string().url("URL website không hợp lệ").optional().or(z.literal("")),
  country: z.string().optional(),
  status: z.enum(["active", "inactive"]),
})

type FormValues = z.infer<typeof formSchema>

interface BrandModalUpsertProps {
  open: boolean
  onClose: () => void
  mode: "add" | "edit"
  brand?: Brand | null
  onSubmit: (values: FormValues) => Promise<void>
}

export default function BrandModalUpsert({
  open,
  onClose,
  mode,
  brand,
  onSubmit,
}: BrandModalUpsertProps) {
  const [logoPreview, setLogoPreview] = useState<string>("")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: "",
      name: "",
      description: "",
      logo: "",
      website: "",
      country: "",
      status: "active",
    },
  })

  // Reset form when brand changes
  useEffect(() => {
    if (brand) {
      form.reset({
        code: brand.code || "",
        name: brand.name || "",
        description: brand.description || "",
        logo: brand.logo || "",
        website: brand.website || "",
        country: brand.country || "",
        status: brand.status || "active",
      })
    } else {
      form.reset({
        code: "",
        name: "",
        description: "",
        logo: "",
        website: "",
        country: "",
        status: "active",
      })
    }
  }, [brand, form])

  // Set logo preview when brand data changes
  useEffect(() => {
    if (brand?.logo) {
      setLogoPreview(brand.logo)
      form.setValue("logo", brand.logo)
    } else {
      setLogoPreview("")
      form.setValue("logo", "")
    }
  }, [brand, form])

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setLogoPreview(result)
        form.setValue("logo", result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemoveLogo = () => {
    setLogoPreview("")
    setSelectedFile(null)
    form.setValue("logo", "")
  }

  const handleSubmit = async (values: FormValues) => {
    await onSubmit(values)
    form.reset()
    setLogoPreview("")
    setSelectedFile(null)
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl h-[90vh] flex flex-col p-0">
        {/* Fixed Header */}
        <DialogHeader className="flex-shrink-0 px-6 py-4 border-b border-gray-200">
          <DialogTitle className="text-xl font-semibold">
            {mode === "add" ? "Thêm mới thương hiệu" : "Chỉnh sửa thương hiệu"}
          </DialogTitle>
        </DialogHeader>
        
        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              {/* Row 1: Code and Name */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">Mã thương hiệu <span className="text-red-500">*</span></FormLabel>
                      <FormControl>
                        <Input {...field} disabled={mode === "edit"} placeholder="VD: APPLE" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">Tên thương hiệu <span className="text-red-500">*</span></FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="VD: Apple Inc." />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Row 2: Logo Upload */}
              <FormField
                control={form.control}
                name="logo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Logo thương hiệu</FormLabel>
                    <FormControl>
                      <div className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg bg-gray-50/50">
                        {/* Avatar hiển thị luôn */}
                        <div className="relative flex-shrink-0">
                          <Avatar className="h-16 w-16 border-2 border-gray-200 bg-white">
                            {logoPreview ? (
                              <AvatarImage 
                                src={logoPreview} 
                                alt="Logo preview" 
                                className="object-contain p-2" 
                              />
                            ) : (
                              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                                <Upload className="h-6 w-6" />
                              </AvatarFallback>
                            )}
                          </Avatar>
                          {logoPreview && (
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 hover:bg-red-600 border-white border-2 text-white shadow-sm"
                              onClick={handleRemoveLogo}
                            >
                              <X className="h-2.5 w-2.5" />
                            </Button>
                          )}
                        </div>
                        <div className="flex-1 space-y-2">
                          <label htmlFor="logo-upload" className="cursor-pointer block">
                            <div className="flex items-center gap-3 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50/50 transition-all">
                              <Upload className="h-5 w-5 text-gray-500" />
                              <div className="flex-1">
                                <p className="text-sm font-medium text-gray-700">
                                  {selectedFile ? selectedFile.name : "Chọn hoặc kéo thả logo vào đây"}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                  PNG, JPG, GIF tối đa 5MB
                                </p>
                              </div>
                            </div>
                          </label>
                          <input
                            id="logo-upload"
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="hidden"
                          />
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Row 3: Description */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Mô tả thương hiệu</FormLabel>
                    <FormControl>
                      <Textarea 
                        {...field} 
                        rows={3} 
                        placeholder="Nhập mô tả chi tiết về thương hiệu..." 
                        className="resize-none"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Row 4: Website and Country */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="website"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">Website</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="https://example.com" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">Quốc gia</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="VD: Việt Nam" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Row 5: Status */}
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Trạng thái <span className="text-red-500">*</span></FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn trạng thái hoạt động" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="active">Hoạt động</SelectItem>
                        <SelectItem value="inactive">Không hoạt động</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </div>

        {/* Fixed Footer */}
        <div className="flex-shrink-0 flex justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-white">
          <Button type="button" variant="outline" onClick={onClose} className="px-6">
            Hủy bỏ
          </Button>
          <Button 
            type="submit" 
            className="px-6 bg-red-600 hover:bg-red-700"
            onClick={form.handleSubmit(handleSubmit)}
          >
            Thêm mới
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
