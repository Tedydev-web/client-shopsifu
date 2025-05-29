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
import { useTranslation } from 'react-i18next'

export function TrustDeviceModal() {
  const { isOpen, loading, checkTrustDevice, handleTrustDevice, handleClose } = useTrustDevice()
  const {t} = useTranslation('')

  useEffect(() => {
    checkTrustDevice()
  }, [])

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t('auth.trustDevices.title')}</DialogTitle>
          <DialogDescription>
            {t('auth.trustDevices.subtitle')}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex gap-6 sm:gap-0">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={loading}
            className="mr-2"
          >
            {t('auth.trustDevices.no')}
          </Button>
          <Button
            onClick={handleTrustDevice}
            disabled={loading}
          >
            {loading ? t('auth.trustDevices.processing') : t('auth.trustDevices.trustDevices')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
