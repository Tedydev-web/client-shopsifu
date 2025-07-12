"use client";

import { MessageCircle } from "lucide-react";

export default function ProductsFooter({ onAddToCart, onBuyNow, onChat }: {
  onAddToCart?: () => void;
  onBuyNow?: () => void;
  onChat?: () => void;
}) {
  return (
    <div className="fixed bottom-0 left-0 w-full z-50 bg-white border-t flex items-center px-2 py-2 gap-2">
      {/* Chat ngay */}
      <button
        onClick={onChat}
        className="flex flex-col items-center justify-center w-14 h-12 text-xs text-gray-700 hover:text-orange-500"
      >
        <MessageCircle className="w-6 h-6 mb-1" />
        Chat ngay
      </button>
      {/* Thêm vào giỏ hàng */}
      <button
        onClick={onAddToCart}
        className="flex-1 h-12 rounded-md bg-yellow-400 hover:bg-yellow-500 text-white font-semibold text-base transition-colors"
      >
        Thêm vào giỏ hàng
      </button>
      {/* Mua ngay */}
      <button
        onClick={onBuyNow}
        className="flex-1 h-12 rounded-md bg-orange-500 hover:bg-orange-600 text-white font-semibold text-base transition-colors"
      >
        Mua ngay
      </button>
    </div>
  );
}