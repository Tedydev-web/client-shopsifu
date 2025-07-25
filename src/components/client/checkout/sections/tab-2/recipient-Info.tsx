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
    address?: string;
    receiverName: string;
    receiverPhone: string;
  };
  onEdit?: () => void;
}

export function RecipientInfo({ customerInfo, shippingAddress, onEdit }: RecipientInfoProps) {
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
          <CardTitle className="text-base font-medium">Thông tin nhận hàng</CardTitle>
          {onEdit && (
            <Button 
              variant="outline" 
              size="sm" 
              className="h-7 px-3 text-xs font-normal"
              onClick={onEdit}
            >
              Chỉnh sửa
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 text-sm">
          {/* Mobile Layout */}
          <div className="block sm:hidden space-y-3">
            <div className="space-y-2">
              <div className="flex items-center text-gray-500">
                <User className="h-3.5 w-3.5 mr-1.5" />
                <span>Khách hàng</span>
              </div>
              <div className="pl-5 font-medium">{customerInfo.name}</div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center text-gray-500">
                <Phone className="h-3.5 w-3.5 mr-1.5" />
                <span>Số điện thoại</span>
              </div>
              <div className="pl-5 font-medium">{customerInfo.phone}</div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center text-gray-500">
                <Mail className="h-3.5 w-3.5 mr-1.5" />
                <span>Email</span>
              </div>
              <div className="pl-5 font-medium">{customerInfo.email}</div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center text-gray-500">
                <MapPin className="h-3.5 w-3.5 mr-1.5" />
                <span>Nhận hàng tại</span>
              </div>
              <div className="pl-5 font-medium">{getFullAddress()}</div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center text-gray-500">
                <User className="h-3.5 w-3.5 mr-1.5" />
                <span>Người nhận</span>
              </div>
              <div className="pl-5">
                <span className="font-medium">{shippingAddress.receiverName}</span>
                <span className="text-gray-400 mx-1.5">|</span>
                <span className="font-medium">{shippingAddress.receiverPhone}</span>
              </div>
            </div>
          </div>

          {/* Desktop Layout */}
          <div className="hidden sm:block">
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center">
                <User className="h-4 w-4 text-gray-500 mr-2 flex-shrink-0" />
                <span className="text-gray-500">Khách hàng:</span>
              </div>
              <div className="font-medium">{customerInfo.name}</div>
              
              <div className="flex items-center">
                <Phone className="h-4 w-4 text-gray-500 mr-2 flex-shrink-0" />
                <span className="text-gray-500">Số điện thoại:</span>
              </div>
              <div className="font-medium">{customerInfo.phone}</div>
              
              <div className="flex items-center">
                <Mail className="h-4 w-4 text-gray-500 mr-2 flex-shrink-0" />
                <span className="text-gray-500">Email:</span>
              </div>
              <div className="font-medium">{customerInfo.email}</div>
              
              <div className="flex items-center">
                <MapPin className="h-4 w-4 text-gray-500 mr-2 flex-shrink-0" />
                <span className="text-gray-500">Nhận hàng tại:</span>
              </div>
              <div className="font-medium">{getFullAddress()}</div>
              
              <div className="flex items-center">
                <User className="h-4 w-4 text-gray-500 mr-2 flex-shrink-0" />
                <span className="text-gray-500">Người nhận:</span>
              </div>
              <div>
                <span className="font-medium">{shippingAddress.receiverName}</span>
                <span className="text-gray-400 mx-2">|</span>
                <span className="font-medium">{shippingAddress.receiverPhone}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
