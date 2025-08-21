import { metadataConfig } from '@/lib/metadata'
import type { Metadata } from 'next'
import NewVoucherPage from './voucher-new-metadata'
export const metadata: Metadata = metadataConfig['/admin/voucher/new']

export default function Page() {
  return <NewVoucherPage />  // client component
}
