import { SigninForm } from "@/components/auth/sign-in/signin-form"
import { metadataConfig } from '@/lib/metadata'
import type { Metadata } from 'next'

export const metadata: Metadata = metadataConfig['/buyer/sign-in']
export default function SigninPage() {
  return (
      <SigninForm />
  )
}
