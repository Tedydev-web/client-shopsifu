'use client'
import * as z from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { EmailSchema } from '../schema'
import {
  AnimatedForm,
  AnimatedFormItem,
  AnimatedButton
} from '@/components/ui/animated-form'
import { useVerifyEmail } from './useVerifyEmail'
import { OAuthForm } from '../layout/OAuthForm'

interface VerifyEmailFormProps {
  className?: string
  onSuccess?: (email: string) => void
}

type ActionType = 'signup' | 'forgot'

export function VerifyEmailForm({ className, onSuccess }: VerifyEmailFormProps) {
  const searchParams = useSearchParams()
  const action = (searchParams.get('action') as ActionType) || 'signup'
  const { loading, handleSendOTP } = useVerifyEmail()

  const form = useForm<z.infer<typeof EmailSchema>>({
    resolver: zodResolver(EmailSchema),
    defaultValues: { email: '' }
  })

  const onSubmit = async (data: z.infer<typeof EmailSchema>) => {
    const success = await handleSendOTP(data.email)
    if (success) {
      onSuccess?.(data.email)
    }
  }

  const getFormContent = () => {
    switch (action) {
      case 'signup':
        return {
          title: 'Đăng ký tài khoản',
          subtitle: 'Nhập email của bạn để bắt đầu đăng ký',
          successMessage: 'Mã xác thực đã được gửi đến email của bạn',
          buttonText: 'Tiếp tục',
          linkText: 'Đã có tài khoản?',
          linkHref: '/buyer/sign-in',
          linkLabel: 'Đăng nhập'
        }
      case 'forgot':
        return {
          title: 'Quên mật khẩu?',
          subtitle: 'Nhập email của bạn để đặt lại mật khẩu',
          successMessage: 'Link đặt lại mật khẩu đã được gửi đến email của bạn',
          buttonText: 'Gửi link',
          linkText: 'Đã nhớ mật khẩu?',
          linkHref: '/buyer/sign-in',
          linkLabel: 'Đăng nhập'
        }
      default:
        return {
          title: 'Xác thực email',
          subtitle: 'Nhập email của bạn để xác thực',
          successMessage: 'Mã xác thực đã được gửi đến email của bạn',
          buttonText: 'Xác nhận',
          linkText: 'Quay lại',
          linkHref: '/buyer/sign-in',
          linkLabel: 'Đăng nhập'
        }
    }
  }

  const content = getFormContent()

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className={cn('flex flex-col gap-6', className)}
        >
          <AnimatedForm>
            {/* Tiêu đề */}
            <AnimatedFormItem>
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-4xl font-bold">{content.title}</h1>
                <p className="text-balance text-md text-muted-foreground">
                  {content.subtitle}
                </p>
              </div>
            </AnimatedFormItem>

            {/* Form */}
            <div className="grid gap-6">
              <AnimatedFormItem>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input {...field} type="email" placeholder="m@example.com" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </AnimatedFormItem>

              <AnimatedButton
                size="sm"
                type="submit"
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                disabled={loading}
              >
                {loading ? 'Đang xử lý...' : content.buttonText}
              </AnimatedButton>
            </div>
            {/* OAuth Form */}
            {action === 'signup' && <OAuthForm type="signup"/>}

            {/* Link chuyển hướng */}
            <AnimatedFormItem>
              <div className="text-center text-sm">
                {content.linkText}{' '}
                <Link 
                  href={content.linkHref}
                  className="underline underline-offset-4 text-primary hover:text-primary/90"
                >
                  {content.linkLabel}
                </Link>
              </div>
            </AnimatedFormItem>
          </AnimatedForm>
        </form>
      </Form>

      
    </>
  )
}
