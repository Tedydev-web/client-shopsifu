'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Brand } from "./brand-Columns"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

const formSchema = z.object({
  code: z.string().min(1, "Mã không được để trống"),
  name: z.string().min(1, "Tên không được để trống"),
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
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: brand?.code || "",
      name: brand?.name || "",
    },
  })

  const handleSubmit = async (values: FormValues) => {
    await onSubmit(values)
    form.reset()
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
