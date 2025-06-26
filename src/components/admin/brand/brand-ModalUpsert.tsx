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
      code: brand?.code || "",
      name: brand?.name || "",
      description: brand?.description || "",
      logo: brand?.logo || "",
      website: brand?.website || "",
      country: brand?.country || "",
      status: brand?.status || "active",
    },
  })

  // Set logo preview when brand data changes
  useEffect(() => {
    if (brand?.logo) {
      setLogoPreview(brand.logo)
    }
  }, [brand])

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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{mode === "add" ? "Thêm" : "Sửa"} thương hiệu</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mã thương hiệu</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={mode === "edit"} />
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
                  <FormLabel>Tên thương hiệu</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mô tả</FormLabel>
                  <FormControl>
                    <Textarea {...field} rows={3} placeholder="Nhập mô tả thương hiệu..." />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="logo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Logo thương hiệu</FormLabel>
                  <FormControl>
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        {logoPreview && (
                          <div className="relative">
                            <Avatar className="h-16 w-16">
                              <AvatarImage src={logoPreview} alt="Logo preview" />
                              <AvatarFallback>
                                <Upload className="h-6 w-6" />
                              </AvatarFallback>
                            </Avatar>
                            <Button
                              type="button"
                              variant="destructive"
                              size="icon"
                              className="absolute -top-2 -right-2 h-6 w-6"
                              onClick={handleRemoveLogo}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        )}
                        <div className="flex-1 space-y-2">
                          <label htmlFor="logo-upload" className="cursor-pointer">
                            <div className="flex items-center gap-2 px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-colors">
                              <Upload className="h-4 w-4 text-gray-500" />
                              <span className="text-sm text-gray-600">
                                {selectedFile ? selectedFile.name : "Chọn logo thương hiệu"}
                              </span>
                            </div>
                          </label>
                          <input
                            id="logo-upload"
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="hidden"
                          />
                          {/* <p className="text-xs text-muted-foreground">
                            Định dạng: PNG, JPG, GIF • Tối đa 5MB
                          </p> */}
                        </div>
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="website"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Website</FormLabel>
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
                  <FormLabel>Quốc gia</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Việt Nam" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Trạng thái</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn trạng thái" />
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
            <div className="flex justify-end gap-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Hủy
              </Button>
              <Button type="submit">
                {mode === "add" ? "Thêm" : "Lưu"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
