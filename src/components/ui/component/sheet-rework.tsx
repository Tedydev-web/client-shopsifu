import { Sheet, SheetContent } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import React from 'react'

interface SheetReworkProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  subtitle?: string
  children: React.ReactNode
  onConfirm?: () => void
  onCancel?: () => void
  confirmText?: string
  cancelText?: string
  loading?: boolean
}

export function SheetRework({
  open,
  onOpenChange,
  title,
  subtitle,
  children,
  onConfirm,
  onCancel,
  confirmText = 'Xác nhận',
  cancelText = 'Hủy',
  loading = false,
}: SheetReworkProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="max-w-lg w-full p-0 flex flex-col rounded-md">
        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-1">{title}</h2>
          {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
        </div>
        {/* Body */}
        <div className="flex-1 px-6 py-6 overflow-y-auto">
          {children}
        </div>
        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex gap-3 justify-end">
          <Button variant="outline" onClick={onCancel} type="button">
            {cancelText}
          </Button>
          <Button onClick={onConfirm} type="button" disabled={loading}>
            {loading ? 'Đang xử lý...' : confirmText}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
