import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { z } from 'zod'
import { resetPasswordSchema } from '../schema/index'

export function useReset() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const onSubmit = async (data: z.infer<typeof resetPasswordSchema>) => {
    setLoading(true)
    console.log(data)
    // Simulate successful password reset
    setTimeout(() => {
      setLoading(false)
      alert('Password has been reset successfully!')
      router.push('/admin/login') // Redirect after password reset
    }, 2000)
  }

  return { loading, onSubmit }
}
