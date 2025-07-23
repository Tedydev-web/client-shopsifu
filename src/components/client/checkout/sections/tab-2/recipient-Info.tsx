'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Phone, Mail, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface RecipientInfoProps {
  customerInfo: {
    name: string;
    phone: string;
    email: string;
  };
  shippingAddress: {
    address: string;
    receiverName: string;
    receiverPhone: string;
  };
  onEdit?: () => void;
}

export function RecipientInfo({ customerInfo, shippingAddress, onEdit }: RecipientInfoProps) {
  return (
    <Card className='shadow-none'>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-base font-semibold">Thông tin nhận hàng</CardTitle>
          {onEdit && (
            <Button 
              variant="outline" 
              size="sm" 
              className="h-7  px-3"
              onClick={onEdit}
            >
              Chỉnh sửa
            </Button>
          )}
        </div>
        {/* <CardDescription className="text-sm font-light">
          Đơn hàng sẽ được giao đến địa chỉ này
        </CardDescription> */}
      </CardHeader>
      <CardContent>
        <div className="space-y-4 text-sm">
          <div className="flex items-center">
            <div className="flex items-center w-1/2">
              <User className="h-4 w-4 text-gray-600 mr-2" />
              <span className=" text-gray-600">Khách hàng:</span>
            </div>
            <div className="w-1/2">{customerInfo.name}</div>
          </div>
          
          <div className="flex items-center">
            <div className="flex items-center w-1/2">
              <Phone className="h-4 w-4 text-gray-600 mr-2" />
              <span className=" text-gray-600">Số điện thoại:</span>
            </div>
            <div className="w-1/2">{customerInfo.phone}</div>
          </div>
          
          <div className="flex items-center">
            <div className="flex items-center w-1/2">
              <Mail className="h-4 w-4 text-gray-600 mr-2" />
              <span className=" text-gray-600">Email:</span>
            </div>
            <div className="w-1/2">{customerInfo.email}</div>
          </div>
          
          <div className="flex items-center">
            <div className="flex items-center w-1/2">
              <MapPin className="h-4 w-4 text-gray-600 mr-2" />
              <span className=" text-gray-600">Nhận hàng tại:</span>
            </div>
            <div className="w-1/2 line-clamp-2">{shippingAddress.address}</div>
          </div>
          
          <div className="flex items-center">
            <div className="flex items-center w-1/2">
              <User className="h-4 w-4 text-gray-600 mr-2" />
              <span className=" text-gray-600">Người nhận:</span>
            </div>
            <div className="w-1/2">{shippingAddress.receiverName} - {shippingAddress.receiverPhone}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
