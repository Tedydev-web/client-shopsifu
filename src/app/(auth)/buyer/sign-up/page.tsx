import { SignupForm } from "@/components/auth/sign-up/signup-form"
import { metadataConfig } from '@/lib/metadata'
import type { Metadata } from 'next'

export const metadata: Metadata = metadataConfig['/buyer/sign-up']
export default function SigninPage() {
  return (
      <SignupForm />
  )
}
