'use client'
import * as z from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
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
import { EmailSchema } from '../schema/index'
import { useSignup } from './useSignup'
import {
  AnimatedForm,
  AnimatedFormItem,
  AnimatedButton
} from '@/components/ui/animated-form'
import { OAuthForm } from '../layout/OAuthForm'

interface SendFormProps {
  onSuccess: (email: string) => void
  className?: string
}

export function SendForm({ onSuccess, className }: SendFormProps) {
  const { loading, handleSendOTP } = useSignup()
  const router = useRouter()

  const emailForm = useForm<z.infer<typeof EmailSchema>>({
    resolver: zodResolver(EmailSchema),
    defaultValues: {
      email: ''
    }
  })

  const handleEmailSubmit = async (data: z.infer<typeof EmailSchema>) => {
    const success = await handleSendOTP(data.email)
    if (success) {
      onSuccess(data.email)
    }
  }

  return (
    <>
      <Form {...emailForm}>
        <form
          onSubmit={emailForm.handleSubmit(handleEmailSubmit)}
          className={cn('flex flex-col gap-6', className)}
        >
          <AnimatedForm>
            <AnimatedFormItem>
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-4xl font-bold">Đăng ký tài khoản</h1>
                <p className="text-balance text-md text-muted-foreground">
                  Nhập email của bạn để xác thực
                </p>
              </div>
            </AnimatedFormItem>

            <div className="grid gap-6">
              <AnimatedFormItem>
                <FormField
                  control={emailForm.control}
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
                <AnimatedButton
                  size="xl"
                  type="submit"
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90 mt-4"
                  disabled={loading}
                >
                  {loading ? 'Đang xử lý...' : 'Tiếp tục'}
                </AnimatedButton>
              </AnimatedFormItem>
            </div>
          </AnimatedForm>
        </form>
      </Form>

      {/* Google Sign In and Login Link */}
      <div className="mt-8 space-y-6">
        <OAuthForm type="signup" />

        <AnimatedFormItem>
          <div className="text-center text-sm">
            Đã có tài khoản?{' '}
            <Link
              href="/buyer/sign-in"
              className="underline underline-offset-4 text-primary hover:text-primary/90"
            >
              Đăng nhập
            </Link>
          </div>
        </AnimatedFormItem>
      </div>
    </>
  )
}
