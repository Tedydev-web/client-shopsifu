"use client";

import { useState } from "react";
import {
  User,
  Mail,
  Phone,
  Calendar,
  ShoppingCart,
  Eye,
  EyeOff,
  Receipt,
} from "lucide-react";

interface ProfileHeaderProps {
  name: string;
  email: string;
  phone: string;
  birthday?: string;
  avatar?: string;
  totalOrders?: number;
  totalSpent?: number;
  memberSince?: string;
  createdAt?: string;
}

export default function ProfileHeader({
  name,
  email,
  phone,
  birthday,
  avatar,
  createdAt,
  totalOrders = 0,
  totalSpent = 0,
  memberSince,
}: ProfileHeaderProps) {
  const [showPhone, setShowPhone] = useState(false);

  const maskPhone = (phone: string) => {
    if (!phone || phone.length < 7) return phone;
    return phone.slice(0, 3) + "*".repeat(5) + phone.slice(-2);
  };

  const formattedMemberSince = memberSince
    ? new Date(memberSince).toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
    : "";

  return (
    <div className="bg-white rounded-lg shadow-sm flex flex-col lg:flex-row min-h-[170px] overflow-hidden items-center border border-gray-200">
      {/* Avatar + Info */}
      <div className="flex flex-1 items-center gap-4 p-4 sm:p-6 w-full">
        {/* Avatar */}
        {avatar ? (
          <img
            src={avatar}
            alt="Avatar"
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border border-gray-300"
          />
        ) : (
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-red-100 flex items-center justify-center text-red-500 font-semibold text-xl sm:text-2xl">
            {name?.[0]?.toUpperCase() || "U"}
          </div>
        )}
        {/* Info */}
        <div className="space-y-1">
          <div className="flex items-center">
            <User className="w-4 h-4 mr-2 text-gray-500" />
            <span className="font-semibold text-sm sm:text-base text-[#121214]">
              {name}
            </span>
          </div>
          <div className="flex items-center">
            <Mail className="w-4 h-4 mr-2 text-gray-500" />
            <span className="text-xs text-[#71717A] break-all">{email}</span>
          </div>
          <div className="flex items-center">
            <Phone className="w-4 h-4 mr-2 text-gray-500" />
            <span className="text-xs text-[#71717A]">
              {showPhone ? phone : maskPhone(phone)}
            </span>
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
              <span className="text-xs text-[#71717A]">{birthday}</span>
            </div>
          )}
        </div>
      </div>

      {/* Separator */}
      <div className="hidden lg:block h-24 w-[3px] bg-red-500 rounded-full mx-2" />

      {/* Total Orders */}
      <div className="flex flex-1 items-center gap-4 p-4 sm:p-6 w-full border-t lg:border-t-0 lg:border-l border-gray-100">
        <div className="w-12 h-12 sm:w-15 sm:h-15 rounded-full bg-gradient-to-br from-red-100 to-white flex items-center justify-center">
          <ShoppingCart className="w-6 h-6 sm:w-8 sm:h-8 text-red-500" />
        </div>
        <div className="flex flex-col">
          <span className="text-base sm:text-lg font-bold text-black leading-none">
            {totalOrders}
          </span>
          <span className="text-xs sm:text-sm text-gray-500 whitespace-nowrap">
            Tổng số đơn hàng đã mua
          </span>
        </div>
      </div>

      {/* Separator */}
      <div className="hidden lg:block h-24 w-[3px] bg-red-500 rounded-full mx-2" />

      {/* Total Spent */}
      <div className="flex flex-1 items-center gap-4 p-4 sm:p-6 w-full border-t lg:border-t-0 lg:border-l border-gray-100">
        <div className="w-12 h-12 sm:w-15 sm:h-15 rounded-full bg-gradient-to-br from-red-100 to-white flex items-center justify-center">
          <Receipt className="w-6 h-6 sm:w-8 sm:h-8 text-red-500" />
        </div>
        <div className="flex flex-col">
          <span className="text-base sm:text-lg font-bold text-black leading-none">
            {totalSpent.toLocaleString()}đ
          </span>
          <span className="text-xs sm:text-sm text-gray-500 whitespace-nowrap">
            Tổng tiền tích lũy
            {createdAt && ` • Từ ${createdAt}`}
          </span>
        </div>
      </div>
    </div>
  );
}
