'use client'
import * as z from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import Image from 'next/image'
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
import { LoginSchema } from '../schema'
import { useSignin } from './useSignin'
import { AnimatedForm, AnimatedFormItem, AnimatedButton } from '@/components/ui/animated-form'

export function SigninForm({ className, ...props }: React.ComponentPropsWithoutRef<'form'>) {
  const { onSubmit, loading } = useSignin()

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: { email: '', password: '' }
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
              <h1 className="text-4xl font-bold">Chào mừng quay trở lại</h1>
              <p className="text-balance text-md text-muted-foreground">
                Nhập email và mật khẩu của bạn phía bên dưới
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

            <AnimatedFormItem>
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel>Mật khẩu</FormLabel>
                      <Link
                        href="/buyer/forgot-password"
                        className="text-sm text-primary hover:underline underline-offset-4"
                      >
                        Quên mật khẩu?
                      </Link>
                    </div>
                    <FormControl>
                      <Input {...field} type="password" placeholder="******" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </AnimatedFormItem>

            <AnimatedButton
              size="xl"
              type="submit"
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
              disabled={loading}
            >
              {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
            </AnimatedButton>

            {/* Hoặc login bằng Google */}
            <AnimatedFormItem>
              <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                <span className="relative z-10 bg-background px-2 text-muted-foreground">
                  Hoặc tiếp tục với
                </span>
              </div>
            </AnimatedFormItem>

            <AnimatedButton variant="outline" className="w-full hover:border-primary hover:text-primary">
              <Image src="/iconSvg/google.svg" alt="Google" width={20} height={20} />
              Đăng nhập bằng Google
            </AnimatedButton>
          </div>

          {/* Link đến đăng ký */}
          <AnimatedFormItem>
            <div className="text-center text-sm">
              Chưa có tài khoản?{' '}
              <Link
                href="/buyer/sign-up"
                className="underline underline-offset-4 text-primary hover:text-primary/90"
              >
                Đăng ký tại đây
              </Link>
            </div>
          </AnimatedFormItem>
        </AnimatedForm>
      </form>
    </Form>
  )
}
