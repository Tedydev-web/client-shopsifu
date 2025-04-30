import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { z } from 'zod'
import { RegisterSchema } from '../schema/index'

export function useSignup() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const onSubmit = async (data: z.infer<typeof RegisterSchema>) => {
    setLoading(true)
    console.log(data)
    // Simulate successful registration
    setTimeout(() => {
      setLoading(false)
      router.push('/dashboard') // Redirect after registration
    }, 2000)
  }

  return { loading, onSubmit }
}
