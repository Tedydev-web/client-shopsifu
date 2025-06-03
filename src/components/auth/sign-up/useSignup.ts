import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { z } from 'zod'
import { RegisterSchema } from '../schema/index'
import { authService } from '@/services/authService'
import { showToast } from '@/components/ui/toastify'
import { parseApiError } from '@/utils/error'
import { useTranslation } from 'react-i18next'

const TOKEN_KEY = 'token_verify_code'

export function useSignup() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get('email')

  const {t} = useTranslation()
  const Schema = RegisterSchema(t)

  const handleSignup = async (data: z.infer<typeof Schema>) => {
    if (!email) {
      showToast(t('admin.showToast.auth.emailNotFound'), 'error')
      return
    }

    const token = localStorage.getItem(TOKEN_KEY)
    if (!token) {
      showToast(t('admin.showToast.auth.sessionExpireds'), 'error')
      return
    }

    try {
      setLoading(true)
      await authService.register({
        name: data.name,
        email: email,
        password: data.password,
        confirmPassword: data.confirmPassword,
        phoneNumber: data.phoneNumber,
        otpToken: token
      })
      
      // Clear token after successful registration
      localStorage.removeItem(TOKEN_KEY)
      
      showToast(t('admin.showToast.auth.registerSuccessful'), 'success')
      router.push('/sign-in')
    } catch (error) {
      showToast(parseApiError(error), 'error')
      console.error('Registration error:', error)
    } finally {
      setLoading(false)
    }
  }

  return { loading, handleSignup }
}
