'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Truck, Clock, MapPin, Package, Shield } from 'lucide-react';

interface ShippingMethod {
  id: string;
  name: string;
  price: number;
  estimatedTime: string;
  description: string;
  features?: string[];
  icon: 'truck' | 'package' | 'shield';
}

interface ShippingModalProps {
  isOpen: boolean;
  onClose: () => void;
  shopName: string;
  currentMethod?: ShippingMethod;
  onSelectMethod: (method: ShippingMethod) => void;
}

const mockShippingMethods: ShippingMethod[] = [
  {
    id: 'standard',
    name: 'Nhanh',
    price: 37700,
    estimatedTime: '24 Tháng 8 - 26 Tháng 8',
    description: 'Đảm bảo nhận hàng từ 24 Tháng 8 - 26 Tháng 8',
    features: ['Nhận Voucher trị giá ₫15.000 nếu đơn hàng được giao đến bạn sau ngày 26 Tháng 8 2025'],
    icon: 'truck'
  },
  {
    id: 'express',
    name: 'Hỏa Tốc',
    price: 45000,
    estimatedTime: '23 Tháng 8 - 24 Tháng 8',
    description: 'Giao hàng siêu nhanh trong 1-2 ngày',
    features: ['Ưu tiên xử lý đơn hàng', 'Giao hàng trong ngày làm việc'],
    icon: 'package'
  },
  {
    id: 'safe',
    name: 'Tiết Kiệm',
    price: 25000,
    estimatedTime: '26 Tháng 8 - 28 Tháng 8',
    description: 'Phương thức giao hàng tiết kiệm',
    features: ['Thời gian giao hàng linh hoạt', 'Chi phí thấp nhất'],
    icon: 'shield'
  }
];

const getIcon = (iconType: 'truck' | 'package' | 'shield') => {
  switch (iconType) {
    case 'truck':
      return <Truck className="h-5 w-5" />;
    case 'package':
      return <Package className="h-5 w-5" />;
    case 'shield':
      return <Shield className="h-5 w-5" />;
    default:
      return <Truck className="h-5 w-5" />;
  }
};

export function ShippingModal({ isOpen, onClose, shopName, currentMethod, onSelectMethod }: ShippingModalProps) {
  const [selectedMethod, setSelectedMethod] = useState<string>(currentMethod?.id || 'standard');

  const handleConfirm = () => {
    const method = mockShippingMethods.find(m => m.id === selectedMethod);
    if (method) {
      onSelectMethod(method);
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Truck className="h-5 w-5" />
            Chọn phương thức vận chuyển
          </DialogTitle>
          <p className="text-sm text-gray-600 mt-1">
            Phương thức vận chuyển liên kết với ShopSifu cho shop: <span className="font-medium">{shopName}</span>
          </p>
        </DialogHeader>

        <div className="space-y-4">
          <RadioGroup value={selectedMethod} onValueChange={setSelectedMethod}>
            {mockShippingMethods.map((method) => (
              <div
                key={method.id}
                className={`border rounded-lg p-4 transition-all cursor-pointer ${
                  selectedMethod === method.id 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSelectedMethod(method.id)}
              >
                <div className="flex items-start space-x-3">
                  <RadioGroupItem value={method.id} id={method.id} className="mt-1" />
                  <div className="flex-1">
                    <Label htmlFor={method.id} className="cursor-pointer">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {getIcon(method.icon)}
                          <span className="font-medium text-base">{method.name}</span>
                          <span className="text-lg font-semibold text-blue-600">
                            ₫{method.price.toLocaleString()}
                          </span>
                        </div>
                        <Badge variant="secondary" className="bg-green-100 text-green-700">
                          {selectedMethod === method.id ? 'Đã chọn' : 'Chọn'}
                        </Badge>
                      </div>
                      
                      <div className="mt-2 space-y-2">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Clock className="h-4 w-4" />
                          <span>{method.estimatedTime}</span>
                        </div>
                        
                        <p className="text-sm text-gray-700">{method.description}</p>
                        
                        {method.features && method.features.length > 0 && (
                          <div className="space-y-1">
                            {method.features.map((feature, index) => (
                              <div key={index} className="flex items-start gap-2 text-xs text-gray-600">
                                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 flex-shrink-0" />
                                <span>{feature}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </Label>
                  </div>
                </div>
              </div>
            ))}
          </RadioGroup>

          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
              <MapPin className="h-4 w-4" />
              <span>Lưu ý về vận chuyển</span>
            </div>
            <ul className="text-xs text-gray-600 space-y-1">
              <li>• Thời gian giao hàng có thể thay đổi tùy theo điều kiện thời tiết và giao thông</li>
              <li>• Đơn hàng sẽ được xử lý trong ngày làm việc (Thứ 2 - Thứ 6)</li>
              <li>• Bạn sẽ nhận được thông báo khi đơn hàng được giao đến shipper</li>
            </ul>
          </div>
        </div>

        <div className="flex gap-3 pt-4 border-t">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Trở Lại
          </Button>
          <Button onClick={handleConfirm} className="flex-1 bg-blue-600 hover:bg-blue-700">
            Xác Nhận
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
