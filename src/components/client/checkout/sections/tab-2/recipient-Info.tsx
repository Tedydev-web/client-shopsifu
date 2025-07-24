'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Phone, Mail, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface RecipientInfoProps {
  customerInfo: {
    name: string;
    phone: string;
    email: string;
  };
  shippingAddress: {
    addressDetail?: string;
    ward?: string;
    district?: string;
    province?: string;
    address?: string; // Fallback nếu không có địa chỉ chi tiết
    receiverName: string;
    receiverPhone: string;
  };
  onEdit?: () => void;
}

export function RecipientInfo({ customerInfo, shippingAddress, onEdit }: RecipientInfoProps) {
  // Format địa chỉ đầy đủ từ các thành phần
  const getFullAddress = () => {
    if (shippingAddress.addressDetail) {
      return [
        shippingAddress.addressDetail,
        shippingAddress.ward,
        shippingAddress.district,
        shippingAddress.province
      ].filter(Boolean).join(', ');
    }
    return shippingAddress.address || 'Chưa có địa chỉ';
  };

  return (
    <Card className='shadow-none'>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-base font-semibold">Thông tin nhận hàng</CardTitle>
          {onEdit && (
            <Button 
              variant="outline" 
              size="sm" 
              className="h-7 px-3"
              onClick={onEdit}
            >
              Chỉnh sửa
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 text-sm">
          <div className="flex items-start">
            <div className="flex items-center w-1/2">
              <User className="h-4 w-4 text-gray-600 mr-2 flex-shrink-0" />
              <span className="text-gray-600">Khách hàng:</span>
            </div>
            <div className="w-1/2 font-medium">{customerInfo.name}</div>
          </div>
          
          <div className="flex items-start">
            <div className="flex items-center w-1/2">
              <Phone className="h-4 w-4 text-gray-600 mr-2 flex-shrink-0" />
              <span className="text-gray-600">Số điện thoại:</span>
            </div>
            <div className="w-1/2 font-medium">{customerInfo.phone}</div>
          </div>
          
          <div className="flex items-start">
            <div className="flex items-center w-1/2">
              <Mail className="h-4 w-4 text-gray-600 mr-2 flex-shrink-0" />
              <span className="text-gray-600">Email:</span>
            </div>
            <div className="w-1/2 font-medium">{customerInfo.email}</div>
          </div>
          
          <div className="flex items-start">
            <div className="flex items-center w-1/2">
              <MapPin className="h-4 w-4 text-gray-600 mr-2 flex-shrink-0" />
              <span className="text-gray-600">Nhận hàng tại:</span>
            </div>
            <div className="w-1/2 font-medium line-clamp-3">
              {getFullAddress()}
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="flex items-center w-1/2">
              <User className="h-4 w-4 text-gray-600 mr-2 flex-shrink-0" />
              <span className="text-gray-600">Người nhận:</span>
            </div>
            <div className="w-1/2">
              <span className="font-medium">{shippingAddress.receiverName}</span>
              <span className="text-gray-500 mx-1">|</span>
              <span className="font-medium">{shippingAddress.receiverPhone}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
