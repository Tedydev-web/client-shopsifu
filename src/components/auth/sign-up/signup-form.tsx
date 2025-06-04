'use client'
import * as z from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
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
import { RegisterSchema } from '../schema/index'
import { useSignup } from './useSignup'
import {
  AnimatedForm,
  AnimatedFormItem,
  AnimatedButton
} from '@/components/ui/animated-form'
import { OAuthForm } from '../layout/OAuthForm'
import { useTranslation } from 'react-i18next'
import { RegisterRequest } from '@/types/auth/auth.interface'
interface SignupFormProps {
  email: string
  className?: string
}

export function SignupForm({ email, className }: SignupFormProps) {
  const { loading, handleSignup } = useSignup()
  const { t } = useTranslation('')
  const Schema = RegisterSchema(t)

  const registerForm = useForm<RegisterRequest>({
    resolver: zodResolver(Schema),
    defaultValues: { 
      firstName: '', 
      lastName: '', 
      username: '',
      password: '', 
      confirmPassword: '',
      phoneNumber: '',
    }
  })

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
                <h1 className="text-4xl font-bold">{t('auth.register.title')}</h1>
                <p className="text-balance text-md text-muted-foreground">
                  {t('auth.register.subtitle')}
                </p>
              </div>
            </AnimatedFormItem>

            <div className="grid gap-6">              
              <AnimatedFormItem>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={registerForm.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('auth.common.first name')}</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            placeholder="Văn A"/>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={registerForm.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('auth.common.last name')}</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            placeholder="Nguyễn"/>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </AnimatedFormItem>
              
              <AnimatedFormItem>
                <FormField
                  control={registerForm.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('auth.common.username')}</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          placeholder="nguyen_van_a"/>
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
                      <FormLabel>{t('auth.common.phone number')}</FormLabel>
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
                      <FormLabel>{t('auth.register.password')}</FormLabel>
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
                      <FormLabel>{t('auth.register.confirm password')}</FormLabel>
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
                {loading ? t('auth.register.registering...') : t('auth.register.register')}
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
            {t('auth.register.Have an account')}{' '}
            <Link
              href="/sign-in"
              className="underline underline-offset-4 text-primary hover:text-primary/90"
            >
              {t('auth.register.login')}
            </Link>
          </div>
        </AnimatedFormItem>
      </div>
    </>
  )
}
