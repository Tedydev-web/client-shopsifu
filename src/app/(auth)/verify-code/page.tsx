import { VerifyForm } from "@/components/auth/verify-code/verify-form"
import { metadataConfig } from '@/lib/metadata'
import type { Metadata } from 'next'

export const metadata: Metadata = metadataConfig['/buyer/verify-code']
export default function SigninPage() {
  return (
      <VerifyForm />
  )
}
