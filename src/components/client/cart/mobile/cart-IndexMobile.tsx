"use client";

import { useEffect, useState } from "react";
import { mockCartItems } from "@/components/client/cart/mobile/cart-MockData";
import CartItem from "@/components/client/cart/mobile/cart-ItemsMobile";
import CartFooter from "@/components/client/cart/mobile/cart-FooterMobile";
import { ArrowUpToLine, Edit } from "lucide-react";

export default function CartPageMobile() {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false)

  const handleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
    );
  };

  const allItems = mockCartItems.flatMap((group) => group.items);
  const selectedItems = allItems.filter((item) => selectedIds.includes(item.id));
  const total = selectedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalSaved = selectedItems.reduce((sum, item) => {
    if (item.originalPrice !== undefined) {
      return sum + (item.originalPrice - item.price) * item.quantity;
    }
    return sum;
  }, 0);
  const selectedCount = selectedItems.length;

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollButton(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="space-y-4 pb-32">
      {mockCartItems.map((group, groupIdx) => (
        <div key={group.shop + "-" + groupIdx} className="bg-white">
          <div className="flex items-center justify-between px-3 py-2">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={group.items.every((item) =>
                  selectedIds.includes(item.id)
                )}
                onChange={(e) => {
                  const allIds = group.items.map((item) => item.id);
                  if (e.target.checked) {
                    setSelectedIds((prev) => [
                      ...new Set([...prev, ...allIds]),
                    ]);
                  } else {
                    setSelectedIds((prev) =>
                      prev.filter((id) => !allIds.includes(id))
                    );
                  }
                }}
                className="w-4 h-4 sm:w-5 sm:h-5"
              />
              <span className="font-medium text-sm sm:text-base">
                {group.shop + " >"}
              </span>
            </div>
            <button
              className="text-sm sm:text-base text-primary flex items-center gap-1"
              onClick={() => setIsEditing((prev) => !prev)}
            >
              <Edit className="w-4 h-4 sm:w-5 sm:h-5" />
              {isEditing ? "Done" : "Edit"}
            </button>
          </div>
          {group.items.map((item) => (
            <CartItem
              key={item.id}
              item={item}
              checked={selectedIds.includes(item.id)}
              onCheck={() => handleSelect(item.id)}
            />
          ))}
        </div>
      ))}

      {/* Scroll to top button */}
      {showScrollButton && (
        <div className="fixed bottom-42 right-4 z-50">
          <button
            onClick={scrollToTop}
            className="w-12 h-12 rounded-full bg-white border border-gray-200 shadow-md flex items-center justify-center transition-all"
          >
            <ArrowUpToLine className="w-6 h-6 text-red-500" />
          </button>
        </div>
      )}
    </div>
  );
}