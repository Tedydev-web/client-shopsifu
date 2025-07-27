import { useState } from "react";
import {
  User,
  Mail,
  Phone,
  Calendar,
  ShoppingCart,
  Eye,
  EyeOff,
} from "lucide-react";

interface UserInfoCardProps {
  name: string;
  email: string;
  phone: string;
  birthday?: string;
  avatar?: string;
  totalOrders?: number;
}

export default function DashboardUser({
  name,
  email,
  phone,
  birthday,
  avatar,
  totalOrders = 0,
}: UserInfoCardProps) {
  const [showPhone, setShowPhone] = useState(false);

  const maskPhone = (phone: string) => {
    if (phone.length < 7) return phone;
    return phone.slice(0, 3) + "*".repeat(5) + phone.slice(-2);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm flex flex-col md:flex-row justify-between md:items-center p-4 md:p-6 min-h-[170px] space-y-4 md:space-y-0">
      {/* Left: Avatar + Info */}
      <div className="flex flex-col md:flex-row md:items-start md:space-x-5 space-y-4 md:space-y-0">
        {/* Avatar */}
        <div className="flex-shrink-0 self-center md:self-start">
          {avatar ? (
            <img
              src={avatar}
              alt="Avatar"
              className="w-20 h-20 rounded-full object-cover border border-gray-300"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-semibold text-xl">
              {name?.[0]?.toUpperCase() || "U"}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="space-y-2 ">
          <div className="flex items-center">
            <User className="w-4 h-4 mr-2 text-gray-500" />
            <span className="font-semibold text-base text-[#121214]">{name}</span>
          </div>
          <div className="flex items-center">
            <Mail className="w-4 h-4 mr-2 text-gray-500" />
            <span className="font-medium text-xs text-[#71717A]">Email:</span>
            <span className="ml-2 break-all text-xs text-[#71717A]">{email}</span>
          </div>
          <div className="flex items-center">
            <Phone className="w-4 h-4 mr-2 text-gray-500" />
            <span className="font-medium text-xs text-[#71717A]">Số điện thoại:</span>
            <span className="ml-2 text-xs text-[#71717A]">{showPhone ? phone : maskPhone(phone)}</span>
            <button
              onClick={() => setShowPhone(!showPhone)}
              className="ml-2 text-gray-500 hover:text-gray-700"
            >
              {showPhone ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
          {birthday && (
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-2 text-gray-500" />
              <span className="font-medium">Ngày sinh:</span>
              <span className="ml-2">{birthday}</span>
            </div>
          )}
        </div>
      </div>

      {/* Right: Total Orders */}
      <div className="flex items-center gap-4 md:pl-6 md:border-l-4 border-red-500">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-100 to-white flex items-center justify-center">
          <ShoppingCart className="w-6 h-6 text-red-500" />
        </div>
        <div className="flex flex-col">
          <span className="text-lg font-bold text-black leading-none">
            {totalOrders}
          </span>
          <span className="text-sm text-gray-500 whitespace-nowrap">
            Tổng số đơn hàng đã mua
          </span>
        </div>
      </div>
    </div>
  );
}
