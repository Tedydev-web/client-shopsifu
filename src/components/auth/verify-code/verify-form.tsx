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
import { useVerify } from './useVerify'
import {
  AnimatedForm,
  AnimatedFormItem,
  AnimatedButton
} from '@/components/ui/animated-form'

export function VerifyForm({ className, ...props }: React.ComponentPropsWithoutRef<'form'>) {
  const { loading, handleverifycode } = useVerify()

  const form = useForm<z.infer<typeof otpSchema>>({
    resolver: zodResolver(otpSchema),
    defaultValues: { otp: '' }
  })

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleverifycode)}
        className={cn('flex flex-col gap-6', className)}
        {...props}
      >
        <AnimatedForm>
          {/* Tiêu đề */}
          <AnimatedFormItem>
            <div className="flex flex-col items-center gap-2 text-center">
              <h1 className="text-4xl font-bold">Nhập mã xác minh</h1>
              <p className="text-balance text-md text-muted-foreground">
                Chúng tôi đã gửi mã OTP gồm 6 chữ số đến email của bạn. Vui lòng nhập mã bên dưới.
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
                  <FormLabel>Nhập mã OTP</FormLabel>
                  <FormControl>
                    <InputOTP maxLength={6} {...field}>
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

          {/* Button Submit */}
          <AnimatedButton
            size="xl"
            type="submit"
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
            disabled={loading}
          >
            {loading ? 'Đang xác minh...' : 'Xác minh OTP'}
          </AnimatedButton>

          {/* Link resend */}
          <AnimatedFormItem>
            <div className="text-center text-sm">
              Không nhận được mã?{' '}
              <button
                type="button"
                className="underline underline-offset-4 text-primary hover:text-primary/90"
              >
                Gửi lại OTP
              </button>
            </div>
          </AnimatedFormItem>
        </AnimatedForm>
      </form>
    </Form>
  )
}
