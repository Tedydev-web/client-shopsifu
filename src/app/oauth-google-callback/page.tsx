'use client'

import { ROUTES } from '@/constants/route'
import { setCredentials } from '@/store/features/auth/authSlide'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { useDispatch } from 'react-redux'

export default function OauthCallbackPage() {
  const searchParams = useSearchParams()
  const dispatch = useDispatch()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const accessToken = searchParams.get('accessToken')
    const refreshToken = searchParams.get('refreshToken')
    const success = searchParams.get('success')
    const errorMessageFromQuery = searchParams.get('errorMessage')
    const name = searchParams.get('name') // For personalized message

    setLoading(true)

    if (errorMessageFromQuery) {
      setError(errorMessageFromQuery)
      toast.error(errorMessageFromQuery)
      setLoading(false)
      setTimeout(() => {
        window.location.replace(ROUTES.BUYER.SIGNIN ?? '/buyer/sign-in')
      }, 3000)
    } else if (accessToken && refreshToken) {
      // Case 1: Tokens are in the URL (original logic)
      try {
        dispatch(
          setCredentials({
            accessToken,
            refreshToken
          })
        )
        toast.success(`Đăng nhập thành công${name ? `, chào ${name}!` : '!'}`)
        // Redirect immediately after dispatching and toasting
        window.location.replace(ROUTES.HOME ?? '/')
        // setLoading(false) is not strictly needed here due to immediate redirect
      } catch (e) {
        console.error('Lỗi khi lưu tokens:', e)
        const message = 'Có lỗi xảy ra khi lưu thông tin đăng nhập. Vui lòng thử lại.'
        setError(message)
        toast.error(message)
        setLoading(false)
        setTimeout(() => {
          window.location.replace(ROUTES.BUYER.SIGNIN ?? '/buyer/sign-in')
        }, 3000)
      }
    } else if (success === 'true') {
      // Case 2: No tokens in URL, but success=true (assume cookies might have been set by server)
      // Client doesn't have access to HttpOnly tokens.
      // Dispatching user info if available or letting home page verify session.
      // For now, show success and redirect.
      toast.success(`Đăng nhập Google thành công${name ? `, chào ${name}!` : '!'}. Đang chuyển hướng...`)
      // setLoading(false); // Not strictly needed here due to redirect
      setTimeout(() => {
        window.location.replace(ROUTES.HOME ?? '/')
      }, 1500) // Delay for toast visibility
    } else {
      // Case 3: No tokens, no success=true, no specific error message from query
      const message = 'Đăng nhập Google không thành công hoặc phản hồi không hợp lệ.'
      setError(message)
      toast.error(message)
      setLoading(false)
      setTimeout(() => {
        window.location.replace(ROUTES.BUYER.SIGNIN ?? '/buyer/sign-in')
      }, 3000)
    }
  }, [searchParams, dispatch])

  return (
    <div className='flex flex-col items-center justify-center min-h-screen p-4'>
      {error && <div className='mb-4 p-3 bg-destructive/15 text-destructive text-sm rounded-md'>{error}</div>}
      {loading && !error && (
        <div className='flex flex-col items-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4'></div>
          <p className='text-muted-foreground'>Đang xử lý đăng nhập...</p>
        </div>
      )}
    </div>
  )
}
