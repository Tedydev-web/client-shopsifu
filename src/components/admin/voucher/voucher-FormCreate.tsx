'use client'

import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useRouter } from 'next/navigation'
import { ShoppingBag, Package2, Users, Video, Radio } from 'lucide-react'

export default function VoucherFormCreate() {
  const t = useTranslations('admin.ModuleVouchers')
  const router = useRouter()

  const handleRedirect = (type: string) => {
    // Chỉ redirect, không có logic xử lý
    console.log(`Redirect to create ${type} voucher`)
    // router.push(`/admin/voucher/create?type=${type}`)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold tracking-tight">{t('createVoucher')}</h2>
        <p className="text-muted-foreground text-sm mt-1">
          {t('createVoucherDesc')}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Voucher toàn shop */}
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div className="flex flex-col h-full">
              <div className="p-4 flex items-start gap-3">
                <div className="h-10 w-10 flex items-center justify-center rounded-full bg-primary/10">
                  <ShoppingBag className="h-5 w-5 text-primary" />
                </div>
                <div className="flex flex-col">
                  <h3 className="font-semibold">{t('shopVoucher')}</h3>
                  <p className="text-sm text-muted-foreground">
                    {t('shopVoucherDesc')}
                  </p>
                </div>
              </div>
              <div className="mt-auto border-t p-3 text-right">
                <Button 
                  variant="default" 
                  size="sm" 
                  onClick={() => handleRedirect('shop')}
                >
                  {t('create')}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Voucher sản phẩm */}
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div className="flex flex-col h-full">
              <div className="p-4 flex items-start gap-3">
                <div className="h-10 w-10 flex items-center justify-center rounded-full bg-primary/10">
                  <Package2 className="h-5 w-5 text-primary" />
                </div>
                <div className="flex flex-col">
                  <h3 className="font-semibold">{t('productVoucher')}</h3>
                  <p className="text-sm text-muted-foreground">
                    {t('productVoucherDesc')}
                  </p>
                </div>
              </div>
              <div className="mt-auto border-t p-3 text-right">
                <Button 
                  variant="default" 
                  size="sm" 
                  onClick={() => handleRedirect('product')}
                >
                  {t('create')}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Voucher riêng tư */}
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div className="flex flex-col h-full">
              <div className="p-4 flex items-start gap-3">
                <div className="h-10 w-10 flex items-center justify-center rounded-full bg-primary/10">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div className="flex flex-col">
                  <h3 className="font-semibold">{t('privateVoucher')}</h3>
                  <p className="text-sm text-muted-foreground">
                    {t('privateVoucherDesc')}
                  </p>
                </div>
              </div>
              <div className="mt-auto border-t p-3 text-right">
                <Button 
                  variant="default" 
                  size="sm" 
                  onClick={() => handleRedirect('private')}
                >
                  {t('create')}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Voucher Shopee Live */}
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div className="flex flex-col h-full">
              <div className="p-4 flex items-start gap-3">
                <div className="h-10 w-10 flex items-center justify-center rounded-full bg-primary/10">
                  <Radio className="h-5 w-5 text-primary" />
                </div>
                <div className="flex flex-col">
                  <h3 className="font-semibold">{t('liveVoucher')}</h3>
                  <p className="text-sm text-muted-foreground">
                    {t('liveVoucherDesc')}
                  </p>
                </div>
              </div>
              <div className="mt-auto border-t p-3 text-right">
                <Button 
                  variant="default" 
                  size="sm" 
                  onClick={() => handleRedirect('live')}
                >
                  {t('create')}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Voucher Shopee Video */}
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div className="flex flex-col h-full">
              <div className="p-4 flex items-start gap-3">
                <div className="h-10 w-10 flex items-center justify-center rounded-full bg-primary/10">
                  <Video className="h-5 w-5 text-primary" />
                </div>
                <div className="flex flex-col">
                  <h3 className="font-semibold">{t('videoVoucher')}</h3>
                  <p className="text-sm text-muted-foreground">
                    {t('videoVoucherDesc')}
                  </p>
                </div>
              </div>
              <div className="mt-auto border-t p-3 text-right">
                <Button 
                  variant="default" 
                  size="sm" 
                  onClick={() => handleRedirect('video')}
                >
                  {t('create')}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
