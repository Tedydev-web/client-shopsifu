'use client'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { cn } from '@/lib/utils'
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage
} from '@/components/ui/form'
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot
} from '@/components/ui/input-otp'
import { Button } from '@/components/ui/button'
import { otpSchema } from '../schema/index'
import { useVerify2FA } from './useVerify2fa'
import {
  AnimatedForm,
  AnimatedFormItem,
  AnimatedButton
} from '@/components/ui/animated-form'
import { useSearchParams, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'

export function Verify2FAForm({ className, ...props }: React.ComponentPropsWithoutRef<'form'>) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [type, setType] = useState<'TOTP' | 'OTP'>(searchParams.get('type') as 'TOTP' | 'OTP' || 'TOTP')
  const { loading, handleVerifyCode, resendOTP } = useVerify2FA()

  const form = useForm<z.infer<typeof otpSchema>>({
    resolver: zodResolver(otpSchema),
    defaultValues: { otp: '' }
  })

  // Khi nhập đủ 6 ký tự OTP thì tự động submit
  const handleOTPChange = (value: string) => {
    form.setValue('otp', value, { shouldValidate: true })
    if (value.length === 6) {
      form.handleSubmit(handleVerifyCode)()
    }
  }

  // Khi chuyển đổi phương thức xác minh, cập nhật URL và reset form
  const switchMethod = () => {
    const newType = type === 'TOTP' ? 'OTP' : 'TOTP'
    setType(newType)
    router.replace(`?type=${newType}`)
    form.reset()
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleVerifyCode)}
        className={cn('flex flex-col gap-6', className)}
        {...props}
      >
        <AnimatedForm>
          {/* Tiêu đề */}
          <AnimatedFormItem>
            <div className="flex flex-col items-center gap-2 text-center">
              <h1 className="text-4xl font-bold">
                {type === 'TOTP' ? 'Nhập mã xác minh từ ứng dụng Authenticator' : 'Nhập mã xác minh OTP'}
              </h1>
              <p className="text-balance text-md text-muted-foreground">
                {type === 'TOTP'
                  ? 'Vui lòng nhập mã 6 chữ số từ ứng dụng Authenticator của bạn.'
                  : 'Chúng tôi đã gửi mã OTP gồm 6 chữ số đến email của bạn. Vui lòng nhập mã bên dưới.'}
              </p>
            </div>
          </AnimatedFormItem>

          {/* Input OTP */}
          <AnimatedFormItem>
            <FormField
              control={form.control}
              name="otp"
              render={({ field }) => (
                <FormItem className="flex flex-col items-center">
                  <FormLabel>Nhập mã xác minh</FormLabel>
                  <FormControl>
                    <InputOTP maxLength={6} {...field} onChange={handleOTPChange}>
                      <InputOTPGroup>
                        {[...Array(6)].map((_, index) => (
                          <InputOTPSlot key={index} index={index} />
                        ))}
                      </InputOTPGroup>
                    </InputOTP>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </AnimatedFormItem>

          {/* Nút chuyển đổi phương thức xác minh */}
          <AnimatedFormItem>
            <div className="text-center text-sm">
              <button
                type="button"
                onClick={switchMethod}
                disabled={loading}
                className="underline underline-offset-4 text-primary hover:text-primary/90 disabled:opacity-50"
              >
                {type === 'TOTP' ? 'Xác minh bằng OTP qua email' : 'Xác minh bằng Authenticator'}
              </button>
            </div>
          </AnimatedFormItem>

          {/* Link resend (chỉ hiển thị khi type là OTP) */}
          {type === 'OTP' && (
            <AnimatedFormItem>
              <div className="text-center text-sm">
                Không nhận được mã?{' '}
                <button
                  type="button"
                  onClick={resendOTP}
                  disabled={loading}
                  className="underline underline-offset-4 text-primary hover:text-primary/90 disabled:opacity-50"
                >
                  Gửi lại OTP
                </button>
              </div>
            </AnimatedFormItem>
          )}
        </AnimatedForm>
      </form>
    </Form>
  )
}
