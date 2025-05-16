import { Verify2FAForm } from "@/components/auth/verify-2fa/verify2fa-form"  
import { metadataConfig } from "@/lib/metadata"
import type { Metadata } from "next"
import { redirect } from 'next/navigation'

export const metadata: Metadata = metadataConfig['/buyer/verify-2fa']

export default function Verify2faPage({ searchParams }: { searchParams: { [key: string]: string } }) {
    const type = searchParams?.type

    if (!type) {
        redirect('/buyer/verify-2fa?type=TOTP')
    }

    return (
        <div>
            <Verify2FAForm />
        </div>
    )
}

