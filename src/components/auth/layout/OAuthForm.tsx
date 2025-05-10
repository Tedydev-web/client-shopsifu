'use client'

import Image from 'next/image'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { AnimatedFormItem, AnimatedButton } from '@/components/ui/animated-form'
import { authService } from '@/services/authService'
import { toast } from 'react-toastify'

interface OAuthFormProps {
  className?: string
  type?: 'signin' | 'signup'
}

export function OAuthForm({ className, type = 'signin' }: OAuthFormProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const handleOAuthCallback = () => {
      // Kiểm tra xem có phải đang ở trang callback không
      if (window.location.pathname === '/oauth-google-callback') {
        const accessToken = searchParams.get('accessToken')
        const refreshToken = searchParams.get('refreshToken')

        if (accessToken && refreshToken) {
          try {
            // Lưu tokens vào localStorage
            localStorage.setItem('accessToken', accessToken)
            localStorage.setItem('refreshToken', refreshToken)
            
            // Chuyển hướng về trang chủ
            window.location.href = '/'
            toast.success('Đăng nhập thành công!')
          } catch (error) {
            console.error('Error saving tokens:', error)
            setError('Có lỗi xảy ra khi lưu thông tin đăng nhập')
            toast.error('Có lỗi xảy ra khi lưu thông tin đăng nhập')
          }
        } else {
          const errorMessage = searchParams.get('errorMessage')
          setError(errorMessage ?? 'Có lỗi xảy ra khi đăng nhập bằng Google')
          toast.error(errorMessage ?? 'Có lỗi xảy ra khi đăng nhập bằng Google')
          window.location.href = '/buyer/sign-in'
        }
      }
    }

    handleOAuthCallback()
  }, [searchParams])

  const handleGoogleAuth = async () => {
    try {
      const { url } = await authService.getGoogleLoginUrl()
      // Chuyển hướng đến trang đăng nhập Google
      window.location.href = url
    } catch (error) {
      console.error('Google auth error:', error)
      setError('Có lỗi xảy ra khi đăng nhập bằng Google')
      toast.error('Có lỗi xảy ra khi đăng nhập bằng Google')
    }
  }

  return (
    <div className={className}>
      {error && (
        <div className="mb-4 p-3 bg-destructive/15 text-destructive text-sm rounded-md">
          {error}
        </div>
      )}
      
      <AnimatedFormItem>
        <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
          <span className="relative z-10 bg-background px-2 text-muted-foreground">
            Hoặc tiếp tục với
          </span>
        </div>
      </AnimatedFormItem>

      <AnimatedButton 
        variant="outline" 
        className="w-full hover:border-primary hover:text-primary mt-3"
        onClick={handleGoogleAuth}
      >
        <Image src="/iconSvg/google.svg" alt="Google" width={20} height={20} />
        {type === 'signin' ? 'Đăng nhập bằng Google' : 'Đăng ký bằng Google'}
      </AnimatedButton>
    </div>
  )
} 