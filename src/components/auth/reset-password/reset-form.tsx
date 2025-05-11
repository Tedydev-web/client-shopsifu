'use client'
import * as z from 'zod'
import { useForm } from 'react-hook-form'
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
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { resetPasswordSchema } from '../schema/index'
import Link from 'next/link'
import { useReset } from './useReset'
import {
  AnimatedForm,
  AnimatedFormItem,
  AnimatedButton
} from '@/components/ui/animated-form'

export function ResetForm({ className, ...props }: React.ComponentPropsWithoutRef<'form'>) {
  const form = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: '', confirmPassword: '' }
  })

  const { loading, handleResetPassword } = useReset()

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleResetPassword)}
        className={cn('flex flex-col gap-6', className)}
        {...props}
      >
        <AnimatedForm>
          {/* Tiêu đề */}
          <AnimatedFormItem>
            <div className="flex flex-col items-center gap-2 text-center">
              <h1 className="text-4xl font-bold">Đặt lại mật khẩu</h1>
              <p className="text-balance text-md text-muted-foreground">
                Nhập mật khẩu mới của bạn bên dưới.
              </p>
            </div>
          </AnimatedFormItem>

          {/* Form */}
          <div className="grid gap-6">
            {/* Mật khẩu mới */}
            <AnimatedFormItem>
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mật khẩu mới</FormLabel>
                    <FormControl>
                      <Input {...field} type="password" placeholder="******" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </AnimatedFormItem>

            {/* Xác nhận mật khẩu */}
            <AnimatedFormItem>
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Xác nhận mật khẩu mới</FormLabel>
                    <FormControl>
                      <Input {...field} type="password" placeholder="******" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </AnimatedFormItem>

            {/* Nút gửi */}
            <AnimatedButton
              size="xl"
              type="submit"
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
              disabled={loading}
            >
              {loading ? 'Đang xử lý...' : 'Đặt lại mật khẩu'}
            </AnimatedButton>
          </div>

          {/* Link trở lại đăng nhập */}
          <AnimatedFormItem>
            <div className="text-center text-sm">
              Nhớ mật khẩu?{' '}
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
