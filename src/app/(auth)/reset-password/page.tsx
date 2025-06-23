import ResetFormWrapper from "@/components/auth/reset-password/reset-form-Wrapper"
import { metadataConfig } from '@/lib/metadata'
import type { Metadata } from 'next'

export const metadata: Metadata = metadataConfig['/buyer/reset-password']
export default function ResetPage() {
    return(
        <ResetFormWrapper/>
    )
}