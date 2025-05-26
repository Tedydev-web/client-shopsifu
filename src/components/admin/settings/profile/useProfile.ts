import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { authService } from '@/services/authService'
import { showToast } from '@/components/ui/toastify'
import { parseApiError } from '@/utils/error'

export function useProfile() {
  const { t } = useTranslation()
  const [is2FAEnabled, setIs2FAEnabled] = useState(false)
  const [show2FADialog, setShow2FADialog] = useState(false)
  const [showQRDialog, setShowQRDialog] = useState(false)
  const [qrUri, setQrUri] = useState('')
  const [loading, setLoading] = useState(false)
  const [totpCode, setTotpCode] = useState('')
  const [setupToken, setSetupToken] = useState('')

  const handle2FAToggle = async (checked: boolean) => {
    setShow2FADialog(true)
  }

  const handleConfirm2FA = async () => {
    try {
      setLoading(true)
      if (!is2FAEnabled) {
        // Setup 2FA
        const response = await authService.setup2fa()
        setQrUri(response.uri)
        setSetupToken(response.setupToken)
        setShowQRDialog(true)
        showToast(t('admin.profileSettings.scanQRFirst'), 'info')
      } else {
        // Disable 2FA
        await authService.disable2fa({ type: 'totp', code: totpCode })
        setIs2FAEnabled(false)
        showToast(t('admin.profileSettings.2faDisabledSuccess'), 'success')
      }
    } catch (error: any) {
      console.error('Error toggling 2FA:', error)
      showToast(parseApiError(error), 'error')
    } finally {
      setLoading(false)
      setShow2FADialog(false)
    }
  }

  const handleConfirmSetup = async () => {
    try {
      setLoading(true)
      await authService.confirm2fa({
        setupToken,
        totpCode: totpCode
      })
      setIs2FAEnabled(true)
      setShowQRDialog(false)
      showToast(t('admin.profileSettings.2faSetupSuccess'), 'success')
    } catch (error: any) {
      console.error('Error confirming 2FA:', error)
      showToast(parseApiError(error), 'error')
    } finally {
      setLoading(false)
    }
  }

  return {
    is2FAEnabled,
    setIs2FAEnabled,
    show2FADialog,
    setShow2FADialog,
    showQRDialog,
    setShowQRDialog,
    qrUri,
    loading,
    totpCode,
    setTotpCode,
    handle2FAToggle,
    handleConfirm2FA,
    handleConfirmSetup,
    t,
  }
}
