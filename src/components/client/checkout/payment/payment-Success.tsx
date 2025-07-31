'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/utils/formatter';
import { CheckCircle2, Home, ShoppingBag } from 'lucide-react';
import Link from 'next/link';

interface PaymentSuccessProps {
  orderId: string;
  totalAmount: number;
}

export function PaymentSuccess({ orderId, totalAmount }: PaymentSuccessProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-lg mx-auto shadow-lg text-center">
        <CardHeader className="bg-green-50 rounded-t-lg">
          <div className="mx-auto bg-green-100 rounded-full p-4 w-fit">
            <CheckCircle2 className="h-16 w-16 text-green-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-green-800 mt-4">Thanh toán thành công!</CardTitle>
          <CardDescription className="text-gray-600">
            Cảm ơn bạn đã mua sắm. Đơn hàng của bạn đang được xử lý.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          <div className="text-left bg-gray-50 p-4 rounded-lg border">
            <h3 className="font-semibold text-lg mb-3">Chi tiết đơn hàng</h3>
            <div className="flex justify-between items-center">
              <span className="text-gray-500">Mã đơn hàng:</span>
              <span className="font-mono font-semibold text-gray-800">{orderId}</span>
            </div>
            <div className="flex justify-between items-center mt-2">
              <span className="text-gray-500">Tổng thanh toán:</span>
              <span className="font-bold text-lg text-green-700">{formatCurrency(totalAmount)}</span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row gap-4 pt-4">
          <Button asChild className="w-full" variant="outline">
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Quay về trang chủ
            </Link>
          </Button>
          <Button asChild className="w-full">
            <Link href="/user/orders">
              <ShoppingBag className="mr-2 h-4 w-4" />
              Kiểm tra đơn hàng
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
