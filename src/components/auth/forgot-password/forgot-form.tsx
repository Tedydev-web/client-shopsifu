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
import { useTranslation } from 'react-i18next'

export function ForgotPasswordForm({ className, ...props }: React.ComponentPropsWithoutRef<'form'>) {
  const { loading, handleForgotPassword } = useForgotPassword()
  // const router = useRouter()
  const { t } = useTranslation('')

  const form = useForm<z.infer<typeof ForgotPasswordSchema>>({
    resolver: zodResolver(ForgotPasswordSchema),
    defaultValues: { email: '' }
  })

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleForgotPassword)}
        className={cn('flex flex-col gap-6', className)}
        {...props}
      >
        <AnimatedForm>
          {/* Tiêu đề */}
          <AnimatedFormItem>
            <div className="flex flex-col items-center gap-2 text-center">
              <h1 className="text-4xl font-bold">{t('auth.forgotPassword.title')}</h1>
              <p className="text-balance text-md text-muted-foreground">
                {t('auth.forgotPassword.subtitle')}
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
              {loading ? ('auth.forgotPassword.Sending...') : t('auth.forgotPassword.confirm')}
            </AnimatedButton>
          </div>

          {/* Link về đăng nhập */}
          <AnimatedFormItem>
            <div className="text-center text-sm">
              {t('auth.forgotPassword.Remember password')}{' '}
              <Link 
                href="/buyer/sign-in"
                className="underline underline-offset-4 text-primary hover:text-primary/90"
              >
                {t('auth.forgotPassword.login')}
              </Link>
            </div>
          </AnimatedFormItem>
        </AnimatedForm>
      </form>
    </Form>
  )
}
