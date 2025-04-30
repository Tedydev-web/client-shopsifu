import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { z } from 'zod'
import { LoginSchema } from '../schema/index'

export function useSignin() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const onSubmit = async (data: z.infer<typeof LoginSchema>) => {
    setLoading(true)
    console.log(data)
    // Simulate successful login
    setTimeout(() => {
      setLoading(false)
      router.push('/admin/dashboard') // Redirect after login
    }, 2000)
  }

  return { onSubmit, loading }
}
