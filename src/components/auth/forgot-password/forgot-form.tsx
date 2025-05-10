'use client'
import * as z from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
// import { useRouter } from 'next/navigation'
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
// import { Button } from '@/components/ui/button'
import { ForgotPasswordSchema } from '../schema/index'
import { useForgotPassword } from './useForgot'
import {
  AnimatedForm,
  AnimatedFormItem,
  AnimatedButton
} from '@/components/ui/animated-form'

export function ForgotPasswordForm({ className, ...props }: React.ComponentPropsWithoutRef<'form'>) {
  const { loading, onSubmit } = useForgotPassword()
  // const router = useRouter()

  const form = useForm<z.infer<typeof ForgotPasswordSchema>>({
    resolver: zodResolver(ForgotPasswordSchema),
    defaultValues: { email: '' }
  })

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn('flex flex-col gap-6', className)}
        {...props}
      >
        <AnimatedForm>
          {/* Tiêu đề */}
          <AnimatedFormItem>
            <div className="flex flex-col items-center gap-2 text-center">
              <h1 className="text-4xl font-bold">Quên mật khẩu?</h1>
              <p className="text-balance text-md text-muted-foreground">
                Nhập email của bạn bên dưới và chúng tôi sẽ gửi cho bạn một liên kết để đặt lại mật khẩu.
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
              size="xl"
              type="submit"
              className="w-full h-full bg-primary text-primary-foreground hover:bg-primary/90"
              disabled={loading}
            >
              {loading ? 'Đang gửi...' : 'Xác nhận'}
            </AnimatedButton>
          </div>

          {/* Link về đăng nhập */}
          <AnimatedFormItem>
            <div className="text-center text-sm">
              Đã nhớ mật khẩu?{' '}
              <Link 
                href="/buyer/sign-in"
                className="underline underline-offset-4 text-primary hover:text-primary/90"
              >
                Đăng nhập
              </Link>
            </div>
          </AnimatedFormItem>
        </AnimatedForm>
      </form>
    </Form>
  )
}
