'use client'
import * as z from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
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
import { EmailSchema } from '../schema/index'
import { useSignup } from './useSignup'
import {
  AnimatedForm,
  AnimatedFormItem,
  AnimatedButton
} from '@/components/ui/animated-form'

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
