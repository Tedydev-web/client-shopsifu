"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Ticket, Clock, CheckCircle } from "lucide-react";
import Image from "next/image";

// Định nghĩa interface cho voucher
interface VoucherProps {
  id: string;
  code: string;
  title: string;
  description: string;
  discount: number;
  minSpend: number;
  expiryDate: string;
  image?: string;
  shopId?: string;
  shopName?: string;
  isShopVoucher: boolean;
}

// Mock data cho vouchers của shop
const mockShopVouchers: VoucherProps[] = [
  {
    id: "sv1",
    code: "SHOP10",
    title: "Giảm 10% cho đơn hàng",
    description: "Giảm 10% cho đơn hàng từ 200.000₫",
    discount: 10,
    minSpend: 200000,
    expiryDate: "31/08/2025",
    image: "/payment-icons/visa.svg",
    shopId: "shop1",
    shopName: "LEEHOZY GARDEN",
    isShopVoucher: true
  },
  {
    id: "sv2",
    code: "SHOP20K",
    title: "Giảm 20.000₫",
    description: "Giảm 20.000₫ cho đơn hàng từ 100.000₫",
    discount: 20000,
    minSpend: 100000,
    expiryDate: "15/08/2025",
    image: "/payment-icons/master.svg",
    shopId: "shop1",
    shopName: "LEEHOZY GARDEN",
    isShopVoucher: true
  }
];

// Mock data cho vouchers của sàn
const mockPlatformVouchers: VoucherProps[] = [
  {
    id: "pv1",
    code: "PLATFORM15",
    title: "Giảm 15% toàn sàn",
    description: "Giảm 15% cho đơn hàng từ 500.000₫",
    discount: 15,
    minSpend: 500000,
    expiryDate: "31/08/2025",
    image: "/payment-icons/visa.svg",
    isShopVoucher: false
  },
  {
    id: "pv2",
    code: "FREESHIP",
    title: "Miễn phí vận chuyển",
    description: "Freeship cho đơn hàng từ 199.000₫",
    discount: 30000,
    minSpend: 199000,
    expiryDate: "31/07/2025",
    image: "/payment-icons/master.svg",
    isShopVoucher: false
  }
];

interface VoucherCardProps {
  voucher: VoucherProps;
  onSelect: (voucher: VoucherProps) => void;
  isSelected: boolean;
}

// Component hiển thị một voucher
const VoucherCard = ({ voucher, onSelect, isSelected }: VoucherCardProps) => {
  return (
    <div 
      className={`flex border rounded-md p-4 mb-3 cursor-pointer transition-all ${
        isSelected ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300"
      }`}
      onClick={() => onSelect(voucher)}
    >
      <div className="w-12 h-12 mr-3 flex-shrink-0">
        {voucher.image ? (
          <Image src={voucher.image} alt={voucher.title} width={48} height={48} className="object-contain" />
        ) : (
          <div className="w-12 h-12 bg-gray-200 rounded-md flex items-center justify-center">
            <Ticket className="w-6 h-6 text-gray-500" />
          </div>
        )}
      </div>
      <div className="flex-1">
        <div className="flex justify-between items-start">
          <h4 className="font-bold text-base text-gray-800">{voucher.title}</h4>
          {isSelected && <CheckCircle className="w-5 h-5 text-blue-500" />}
        </div>
        <p className="text-sm text-gray-600 my-1">{voucher.description}</p>
        <div className="flex justify-between items-center mt-2">
          <div className="flex items-center text-xs text-gray-500">
            <Clock className="w-3.5 h-3.5 mr-1" />
            <span>HSD: {voucher.expiryDate}</span>
          </div>
          <span className="text-sm font-medium bg-gray-100 text-gray-800 px-2 py-1 rounded">
            {voucher.code}
          </span>
        </div>
      </div>
    </div>
  );
};

// Component chính của modal voucher
interface VoucherModalProps {
  isOpen: boolean;
  onClose: () => void;
  shopId: string;
  shopName: string;
  onApplyVoucher?: (voucher: VoucherProps | null) => void;
}

export default function VoucherModal({ 
  isOpen, 
  onClose, 
  shopId, 
  shopName,
  onApplyVoucher 
}: VoucherModalProps) {
  const [activeTab, setActiveTab] = useState("shop");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedVoucher, setSelectedVoucher] = useState<VoucherProps | null>(null);
  const [manualCode, setManualCode] = useState("");

  // Lọc vouchers theo shop
  const filteredShopVouchers = mockShopVouchers
    .filter(voucher => voucher.shopId === shopId)
    .filter(voucher => 
      voucher.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      voucher.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

  // Lọc vouchers theo sàn
  const filteredPlatformVouchers = mockPlatformVouchers
    .filter(voucher => 
      voucher.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      voucher.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

  // Chọn voucher
  const handleSelectVoucher = (voucher: VoucherProps) => {
    setSelectedVoucher(prev => prev?.id === voucher.id ? null : voucher);
    setManualCode(voucher.code);
  };

  // Xử lý khi áp dụng voucher
  const handleApply = () => {
    if (selectedVoucher) {
      onApplyVoucher?.(selectedVoucher);
    } else if (manualCode) {
      // Tìm voucher từ mã nhập vào
      const foundVoucher = [...mockShopVouchers, ...mockPlatformVouchers].find(
        v => v.code.toLowerCase() === manualCode.toLowerCase()
      );
      
      if (foundVoucher) {
        onApplyVoucher?.(foundVoucher);
      } else {
        // Có thể hiển thị thông báo lỗi ở đây
        console.log("Mã voucher không hợp lệ");
      }
    }
    
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg">
            <Ticket className="w-5 h-5 text-red-500" />
            <span>
              {activeTab === "shop" 
                ? `Mã giảm giá của ${shopName}` 
                : "Mã giảm giá của Sàn"}
            </span>
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="shop" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="shop">Mã giảm giá Shop</TabsTrigger>
            <TabsTrigger value="platform">Mã giảm giá Sàn</TabsTrigger>
          </TabsList>

          {/* Thanh tìm kiếm và nhập mã */}
          <div className="flex items-center gap-2 mb-4 relative">
            <Search className="w-4 h-4 absolute left-3 text-gray-400" />
            <Input
              placeholder="Nhập mã voucher"
              value={manualCode || searchTerm}
              onChange={(e) => {
                setManualCode(e.target.value);
                setSearchTerm(e.target.value);
                setSelectedVoucher(null);
              }}
              className="pl-9"
            />
            <Button 
              size="sm" 
              disabled={!manualCode}
              onClick={handleApply}
              className="min-w-[80px]"
            >
              Áp dụng
            </Button>
          </div>

          <TabsContent value="shop" className="max-h-[40vh] overflow-y-auto">
            {filteredShopVouchers.length > 0 ? (
              filteredShopVouchers.map(voucher => (
                <VoucherCard 
                  key={voucher.id}
                  voucher={voucher}
                  onSelect={handleSelectVoucher}
                  isSelected={selectedVoucher?.id === voucher.id}
                />
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Ticket className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p className="text-gray-500">Không tìm thấy mã giảm giá nào</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="platform" className="max-h-[40vh] overflow-y-auto">
            {filteredPlatformVouchers.length > 0 ? (
              filteredPlatformVouchers.map(voucher => (
                <VoucherCard 
                  key={voucher.id}
                  voucher={voucher}
                  onSelect={handleSelectVoucher}
                  isSelected={selectedVoucher?.id === voucher.id}
                />
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Ticket className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p className="text-gray-500">Không tìm thấy mã giảm giá nào</p>
              </div>
            )}
          </TabsContent>
        </Tabs>

        <DialogFooter className="gap-2 sm:gap-0 mt-4">
          <Button variant="outline" onClick={onClose} className="w-full sm:w-auto">
            Hủy
          </Button>
          <Button 
            onClick={handleApply} 
            className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white"
            disabled={!selectedVoucher && !manualCode}
          >
            Xác nhận
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Component nút mở modal voucher
interface VoucherButtonProps {
  shopId: string;
  shopName: string;
  onApplyVoucher?: (voucher: VoucherProps | null) => void;
}

export function VoucherButton({ shopId, shopName, onApplyVoucher }: VoucherButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="flex items-center justify-between px-4 py-3 text-base">
        <div className="flex items-center gap-4 text-gray-500">
          <Ticket className="w-5 h-5 text-red-500" />
          <span className="text-black">Mã giảm giá của {shopName}</span>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="text-blue-600 hover:underline text-base"
        >
          Xem thêm voucher
        </button>
      </div>

      <VoucherModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        shopId={shopId}
        shopName={shopName}
        onApplyVoucher={onApplyVoucher}
      />
    </>
  );
}
