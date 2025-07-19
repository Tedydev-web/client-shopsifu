"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MessageSquare, Store } from "lucide-react";

interface ShopInfoProps {
  shop: {
    id: string;
    name: string;
    avatar: string;
    isOnline: boolean;
    lastActive?: string;
    rating?: number;
    responseRate?: number;
    responseTime?: string;
    followers?: number;
    joinedDate?: string;
    productsCount?: number;
  };
}

export default function ProductShopInfo({ shop }: ShopInfoProps) {
  // Tạo dữ liệu tĩnh cho UI demo
  const defaultShop = {
    id: "cool-crew-12345",
    name: "Cool Crew",
    avatar: "/images/logo/coolcrew-logo.png", // Đường dẫn hình ảnh mặc định
    isOnline: true,
    lastActive: "1 giờ trước",
    rating: 3.7,
    responseRate: 100,
    responseTime: "trong vài giờ",
    followers: 5500,
    joinedDate: "9 tháng trước",
    productsCount: 86
  };
  
  // Kết hợp dữ liệu mặc định với dữ liệu từ props
  const demoShop = { ...defaultShop, ...shop };

  return (
    <div className="bg-white border rounded-sm overflow-hidden">
      <div className="flex items-center p-5 border-b">
        {/* Avatar shop */}
        <div className="relative w-16 h-16 rounded-full overflow-hidden mr-4">
          <Image 
            src={demoShop.avatar || "/images/placeholder.png"}
            alt={demoShop.name}
            width={64}
            height={64}
            className="object-cover"
          />
          {demoShop.isOnline && (
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
          )}
        </div>

        {/* Shop name and status */}
        <div className="flex-1">
          <h3 className="text-lg font-medium">{demoShop.name}</h3>
          <p className="text-sm text-muted-foreground">
            {demoShop.isOnline ? "Online" : `${demoShop.lastActive}`} • {demoShop.joinedDate}
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="border-red-500 text-red-500 hover:bg-red-50 hover:text-red-600"
            asChild
          >
            <Link href={`/chat/${demoShop.id}`}>
              <MessageSquare className="w-4 h-4 mr-1" />
              Chat Ngay
            </Link>
          </Button>
          
          <Button 
            variant="outline" 
            size="sm"
            className="border-gray-300 text-gray-700 hover:bg-gray-50"
            asChild
          >
            <Link href={`/shop/${demoShop.id}`}>
              <Store className="w-4 h-4 mr-1" />
              Xem Shop
            </Link>
          </Button>
        </div>
      </div>

      {/* Shop metrics */}
      <div className="grid grid-cols-4 text-center border-y py-4">
        <div className="px-4 border-r">
          <div className="text-red-500 font-medium text-lg">{demoShop.rating}k</div>
          <div className="text-sm text-muted-foreground">Đánh Giá</div>
        </div>
        
        <div className="px-4 border-r">
          <div className="text-lg font-medium">{demoShop.productsCount}</div>
          <div className="text-sm text-muted-foreground">Sản Phẩm</div>
        </div>
        
        <div className="px-4 border-r">
          <div className="text-lg font-medium">trong vài giờ</div>
          <div className="text-sm text-muted-foreground">Thời Gian Phản Hồi</div>
        </div>
        
        <div className="px-4">
          <div className="text-lg font-medium">{demoShop.responseRate}%</div>
          <div className="text-sm text-muted-foreground">Tỉ Lệ Phản Hồi</div>
        </div>
      </div>

      {/* Shop details */}
      <div className="grid grid-cols-2 text-sm px-5 py-3">
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">Tham Gia:</span>
          <span className="font-medium">{demoShop.joinedDate}</span>
        </div>
        
        <div className="flex items-center gap-2 justify-end">
          <span className="text-muted-foreground">Người Theo Dõi:</span>
          <span className="font-medium text-red-500">{demoShop.followers.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}
