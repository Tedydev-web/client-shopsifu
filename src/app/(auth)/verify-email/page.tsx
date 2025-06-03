import { VerifyEmailForm } from "@/components/auth/verify-email/verifyemail-form"
import { metadataConfig } from '@/lib/metadata'
import type { Metadata } from 'next'

// export const metadata: Metadata = metadataConfig['/buyer/verify-email']
export default function VerifyEmailPage() {
    return(
        <VerifyEmailForm/>
    )
}