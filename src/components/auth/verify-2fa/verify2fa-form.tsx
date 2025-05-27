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
  InputOTPSlot,
  InputOTPSeparator
} from '@/components/ui/input-otp'
import { Button } from '@/components/ui/button'
import { useVerify2FA } from './useVerify2fa'
import {
  AnimatedForm,
  AnimatedFormItem,
  AnimatedButton
} from '@/components/ui/animated-form'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export function Verify2FAForm({ className, ...props }: React.ComponentPropsWithoutRef<'form'>) {
  const router = useRouter()
  const { loading, handleVerifyCode, sendOTP, type, switchToRecovery, schema } = useVerify2FA()

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { otp: '' }
  })

  // Reset form when type changes
  useEffect(() => {
    form.reset({ otp: '' })
  }, [type])

  // Khi nhập đủ ký tự thì tự động submit
  const handleOTPChange = (value: string) => {
    if (type === 'RECOVERY') {
      // Chỉ lấy các ký tự nhập vào, bỏ qua dấu gạch ngang
      const cleanValue = value.replace(/-/g, '');
      // Chỉ lấy 10 ký tự đầu tiên
      const firstPart = cleanValue.slice(0, 5);
      const secondPart = cleanValue.slice(5, 10);
      // Tạo giá trị cuối cùng với dấu gạch ngang ở giữa
      const processedValue = `${firstPart}-${secondPart}`;
      // console.log('Processed value:', processedValue);
      form.setValue('otp', processedValue, { shouldValidate: true });
      
      if (cleanValue.length === 10) {
        form.handleSubmit(handleVerifyCode)();
      }
    } else {
      form.setValue('otp', value, { shouldValidate: true });
      if (value.length === 6) {
        form.handleSubmit(handleVerifyCode)();
      }
    }
  }

  // Gửi OTP khi component mount nếu type là OTP
  // useEffect(() => {
  //   if (type === 'OTP') {
  //     sendOTP()
  //   }
  // }, [])

  const renderTitle = () => {
    switch (type) {
      case 'OTP':
        return 'Nhập mã xác minh OTP'
      case 'RECOVERY':
        return 'Nhập mã khôi phục'
      default:
        return 'Nhập mã xác minh từ ứng dụng Authenticator'
    }
  }

  const renderDescription = () => {
    switch (type) {
      case 'OTP':
        return 'Chúng tôi đã gửi mã OTP gồm 6 chữ số đến email của bạn. Vui lòng nhập mã bên dưới.'
      case 'RECOVERY':
        return 'Vui lòng nhập mã khôi phục của bạn (ví dụ: 45UXR-RU50C)'
      default:
        return 'Vui lòng nhập mã 6 chữ số từ ứng dụng Authenticator của bạn.'
    }
  }

  const renderSwitchMethod = () => {
    if (type === 'OTP') {
      return null // Không hiển thị nút chuyển đổi khi đang ở chế độ OTP
    }

    return (
      <AnimatedFormItem>
        <div className="text-center text-sm">
          <button
            type="button"
            onClick={type === 'TOTP' ? switchToRecovery : () => router.replace('?type=TOTP')}
            disabled={loading}
            className="underline underline-offset-4 text-primary hover:text-primary/90 disabled:opacity-50"
          >
            {type === 'TOTP' ? 'Sử dụng mã khôi phục' : 'Sử dụng Authenticator'}
          </button>
        </div>
      </AnimatedFormItem>
    )
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
                {renderTitle()}
              </h1>
              <p className="text-balance text-md text-muted-foreground">
                {renderDescription()}
              </p>
            </div>
          </AnimatedFormItem>

          {/* Input OTP/Recovery */}
          <AnimatedFormItem>
            <FormField
              control={form.control}
              name="otp"
              render={({ field }) => (
                <FormItem className="flex flex-col items-center">
                  <FormLabel>Nhập mã xác minh</FormLabel>
                  <FormControl>
                    <InputOTP 
                      maxLength={type === 'RECOVERY' ? 10 : 6}
                      {...field} 
                      onChange={handleOTPChange}
                      className="gap-2"
                      pattern={type === 'RECOVERY' ? '[A-Za-z0-9]*' : '[0-9]*'}
                      value={type === 'RECOVERY' ? field.value.replace(/-/g, '') : field.value}
                    >
                      {type === 'RECOVERY' ? (
                        <>
                          <InputOTPGroup>
                            {[...Array(5)].map((_, index) => (
                              <InputOTPSlot key={index} index={index} />
                            ))}
                          </InputOTPGroup>
                          <InputOTPSeparator>-</InputOTPSeparator>
                          <InputOTPGroup>
                            {[...Array(5)].map((_, index) => (
                              <InputOTPSlot key={index + 5} index={index + 5} />
                            ))}
                          </InputOTPGroup>
                        </>
                      ) : (
                        <InputOTPGroup>
                          {[...Array(6)].map((_, index) => (
                            <InputOTPSlot key={index} index={index} />
                          ))}
                        </InputOTPGroup>
                      )}
                    </InputOTP>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </AnimatedFormItem>

          {/* Nút chuyển đổi phương thức xác minh */}
          {renderSwitchMethod()}

          {/* Link resend (chỉ hiển thị khi type là OTP) */}
          {type === 'OTP' && (
            <AnimatedFormItem>
              <div className="text-center text-sm">
                Không nhận được mã?{' '}
                <button
                  type="button"
                  // onClick={sendOTP}
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
