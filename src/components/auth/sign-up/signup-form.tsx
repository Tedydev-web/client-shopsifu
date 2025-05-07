'use client'
import * as z from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter, useSearchParams } from 'next/navigation'
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
import { RegisterSchema, EmailSchema } from '../schema/index'
import { useSignup } from './useSignup'
import {
  AnimatedForm,
  AnimatedFormItem,
  AnimatedButton
} from '@/components/ui/animated-form'
import { useState, useEffect } from 'react'

interface SignupFormProps {
  email: string
  onBack: () => void
  className?: string
}

export function SignupForm({ email, onBack, className }: SignupFormProps) {
  const { loading, onSubmit } = useSignup()
  const router = useRouter()

  const registerForm = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: { 
      name: '', 
      email: '', 
      password: '', 
      confirmPassword: '',
      phoneNumber: '',
      code: ''
    }
  })

  useEffect(() => {
    registerForm.setValue('email', email, { shouldValidate: true })
  }, [email, registerForm])

  const handleBack = () => {
    onBack()
    registerForm.reset()
  }

  return (
    <>
      <Form {...registerForm}>
        <form
          onSubmit={registerForm.handleSubmit(onSubmit)}
          className={cn('flex flex-col gap-6', className)}
        >
          <AnimatedForm>
            <AnimatedFormItem>
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-4xl font-bold">Đăng ký tài khoản</h1>
                <p className="text-balance text-md text-muted-foreground">
                  Nhập thông tin của bạn để hoàn tất đăng ký
                </p>
              </div>
            </AnimatedFormItem>

            <div className="grid gap-6">
              <AnimatedFormItem>
                <FormField
                  control={registerForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Họ và tên</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          placeholder="Nguyễn Văn A"/>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </AnimatedFormItem>

              <AnimatedFormItem>
                <FormField
                  control={registerForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          type="email" 
                          disabled 
                          value={email} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </AnimatedFormItem>

              <AnimatedFormItem>
                <FormField
                  control={registerForm.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Số điện thoại</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="0123456789" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </AnimatedFormItem>

              <AnimatedFormItem>
                <FormField
                  control={registerForm.control}
                  name="code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mã xác thực</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Nhập mã xác thực" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </AnimatedFormItem>

              <AnimatedFormItem>
                <FormField
                  control={registerForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mật khẩu</FormLabel>
                      <FormControl>
                        <Input {...field} type="password" placeholder="******" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </AnimatedFormItem>

              <AnimatedFormItem>
                <FormField
                  control={registerForm.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Xác nhận mật khẩu</FormLabel>
                      <FormControl>
                        <Input {...field} type="password" placeholder="******" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </AnimatedFormItem>

              <div className="flex gap-2">
                <AnimatedButton
                  size="xl"
                  type="button"
                  variant="outline"
                  onClick={handleBack}
                  className="w-full"
                  disabled={loading}
                >
                  Quay lại
                </AnimatedButton>
                <AnimatedButton
                  size="xl"
                  type="submit"
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                  disabled={loading}
                >
                  {loading ? 'Đang xử lý...' : 'Đăng ký'}
                </AnimatedButton>
              </div>
            </div>
          </AnimatedForm>
        </form>
      </Form>

      {/* Google Sign In and Login Link */}
      <div className="mt-8 space-y-6">
        <AnimatedFormItem>
          <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
            <span className="relative z-10 bg-background px-2 text-muted-foreground">
              Hoặc tiếp tục với
            </span>
          </div>
        </AnimatedFormItem>

        <AnimatedButton
          variant="outline"
          className="w-full hover:border-primary hover:text-primary"
        >
          <Image src="/iconSvg/google.svg" alt="Google" width={20} height={20} />
          Đăng nhập với Google
        </AnimatedButton>

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
