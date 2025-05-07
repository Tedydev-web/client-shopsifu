'use client'
import { useState } from 'react'
import { SignupForm } from "@/components/auth/sign-up/signup-form"
import { SendForm } from "@/components/auth/sign-up/send-form"
import { metadataConfig } from '@/lib/metadata'
import type { Metadata } from 'next'

// export const metadata: Metadata = metadataConfig['/buyer/sign-up']

export default function SignupPage() {
  const [verifiedEmail, setVerifiedEmail] = useState<string | null>(null)

  const handleEmailSuccess = (email: string) => {
    setVerifiedEmail(email)
  }

  const handleBack = () => {
    setVerifiedEmail(null)
  }

  return (
    <div className="container max-w-lg mx-auto py-10">
      {verifiedEmail ? (
        <SignupForm 
          email={verifiedEmail} 
          onBack={handleBack}
        />
      ) : (
        <SendForm onSuccess={handleEmailSuccess} />
      )}
    </div>
  )
}
