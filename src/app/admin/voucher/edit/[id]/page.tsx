import EditProductPage from './voucher-edit-metada'
import { metadataConfig } from '@/lib/metadata'
import type { Metadata } from 'next'
export const metadata: Metadata = metadataConfig['/admin/roles']

export default function Page() {
  return <EditProductPage />  // client component
}
