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
import { RegisterSchema } from '../schema/index'
import { useSignup } from './useSignup'
import {
  AnimatedForm,
  AnimatedFormItem,
  AnimatedButton
} from '@/components/ui/animated-form'
import { useEffect } from 'react'
import { OAuthForm } from '../layout/OAuthForm'

interface SignupFormProps {
  email: string
  className?: string
}

export function SignupForm({ email, className }: SignupFormProps) {
  const { loading, handleSignup } = useSignup()

  const registerForm = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: { 
      name: '', 
      email: '', 
      password: '', 
      confirmPassword: '',
      phoneNumber: '',
      token: ''
    }
  })

  useEffect(() => {
    registerForm.setValue('email', email, { shouldValidate: true })
  }, [email, registerForm])

  return (
    <>
      <Form {...registerForm}>
        <form
          onSubmit={registerForm.handleSubmit(handleSignup)}
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

              <AnimatedButton
                size="sm"
                type="submit"
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                disabled={loading}
              >
                {loading ? 'Đang đăng ký...' : 'Đăng ký'}
              </AnimatedButton>

              {/* OAuth Form */}
              <OAuthForm type="signup" />
            </div>
          </AnimatedForm>
        </form>
      </Form>

      {/* Google Sign In and Login Link */}
      <div className="mt-8 space-y-6">
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
