'use client'

import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useRouter } from 'next/navigation'
import { ShoppingBag, Package2, Users, Video, Radio, LucideIcon } from 'lucide-react'
import { useUserData } from '@/hooks/useGetData-UserLogin'

// Mock data cho các loại voucher
interface VoucherType {
  id: string
  nameKey: string
  descKey: string
  icon: React.ElementType
  redirect: string
}



export default function VoucherFormCreate() {
  const t = useTranslations('admin.ModuleVouchers')
  const router = useRouter()
  const userData = useUserData()

  // Xác định chủ sở hữu voucher dựa trên vai trò người dùng
  const owner = userData?.role?.name === 'ADMIN' ? 'PLATFORM' : 'SHOP';

  const voucherTypes: VoucherType[] = [
    {
      id: 'shop',
      nameKey: 'shopVoucher',
      descKey: 'shopVoucherDesc',
      icon: ShoppingBag,
      redirect: `/admin/voucher/new?usecase=1&owner=SHOP`
    },
    {
      id: 'product',
      nameKey: 'productVoucher',
      descKey: 'productVoucherDesc',
      icon: Package2,
      redirect: `/admin/voucher/new?usecase=2&owner=SHOP`
    },
    {
      id: 'private',
      nameKey: 'privateVoucher',
      descKey: 'privateVoucherDesc',
      icon: Users,
      redirect: `/admin/voucher/new?usecase=3&owner=SHOP`
    }
  ];

  const handleRedirect = (voucherType: VoucherType) => {
    console.log(`Redirect to create ${voucherType.id} voucher`)
    router.push(voucherType.redirect)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold tracking-tight">{t('createVoucher')}</h2>
        <p className="text-muted-foreground text-sm mt-1">
          {t('createVoucherDesc')}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {voucherTypes.map((voucherType) => {
          const IconComponent = voucherType.icon
          
          return (
            <Card key={voucherType.id} className="overflow-hidden rounded-xs">
              <CardContent className="p-0">
                <div className="flex flex-col h-full">
                  <div className="p-4 flex items-start gap-3">
                    <div className="h-10 w-10 flex items-center justify-center rounded-full bg-primary/10">
                      <IconComponent className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex flex-col">
                      <h3 className="font-semibold">{t(voucherType.nameKey)}</h3>
                      <p className="text-sm text-muted-foreground">
                        {t(voucherType.descKey)}
                      </p>
                    </div>
                  </div>
                  <div className="mt-auto border-t p-3 px-6 text-right">
                    <Button 
                      variant="default" 
                      size="sm" 
                      onClick={() => handleRedirect(voucherType)}
                      className='px-6'
                    >
                      {t('create')}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
