import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { showToast } from '@/components/ui/toastify'
import { parseApiError } from '@/utils/error'

export function useProfile() {
  const { t } = useTranslation()
  const [loading, setLoading] = useState(false)

  const handleUpdateProfile = async (data: any) => {
    try {
      setLoading(true)
      // TODO: Call API to update profile
      showToast(t('admin.profileSettings.updateSuccess'), 'success')
    } catch (error: any) {
      console.error('Error updating profile:', error)
      showToast(parseApiError(error), 'error')
    } finally {
      setLoading(false)
    }
  }

  return {
    loading,
    handleUpdateProfile,
    t,
  }
}
