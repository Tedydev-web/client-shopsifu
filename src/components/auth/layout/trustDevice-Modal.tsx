'use client'

import { useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useTrustDevice } from '@/hooks/useTrustDevice'

export function TrustDeviceModal() {
  const { isOpen, loading, checkTrustDevice, handleTrustDevice, handleClose } = useTrustDevice()

  useEffect(() => {
    checkTrustDevice()
  }, [])

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Tin tưởng thiết bị này?</DialogTitle>
          <DialogDescription>
            Bạn có muốn tin tưởng thiết bị này không? Nếu tin tưởng, bạn sẽ không cần xác minh 2FA trong 30 ngày tới.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex gap-6 sm:gap-0">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={loading}
            className="mr-2"
          >
            Không
          </Button>
          <Button
            onClick={handleTrustDevice}
            disabled={loading}
          >
            {loading ? 'Đang xử lý...' : 'Tin tưởng thiết bị'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
