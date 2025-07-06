"use client";

import { useEffect, useState } from "react";
import { mockCartItems } from "@/components/client/cart/mobile/cart-MockData";
import CartItem from "@/components/client/cart/mobile/cart-ItemsMobile";
import CartFooter from "@/components/client/cart/mobile/cart-FooterMobile";
import MobileCartHeader from "@/components/client/cart/mobile/cart-HeaderMobile";
import { ArrowUpToLine, Edit } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

function getIsMobile(breakpoint = 768) {
  if (typeof window === "undefined") return false;
  const userAgent = navigator.userAgent.toLowerCase();
  const isMobileDevice =
    /android|iphone|ipad|ipod|webos|blackberry|windows phone/.test(userAgent);
  const isSmallScreen = window.innerWidth <= breakpoint;
  return isMobileDevice || isSmallScreen;
}

export default function CartPageMobile() {
  const { t } = useTranslation();
  const [cartItems, setCartItems] = useState(mockCartItems);
  const [selectedShops, setSelectedShops] = useState<Record<string, boolean>>(
    {}
  );
  const [selectedItems, setSelectedItems] = useState<Record<string, boolean>>(
    {}
  );
  const [editingShops, setEditingShops] = useState<Record<string, boolean>>({});
  const [isEditingGlobal, setIsEditingGlobal] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(getIsMobile());
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const allSelected = cartItems.every((group) =>
    group.items.every((item) => selectedItems[item.id])
  );

  const handleToggleShop = (
    shop: string,
    items: (typeof cartItems)[number]["items"]
  ) => {
    const isChecked = !selectedShops[shop];
    const updatedItems = { ...selectedItems };
    items.forEach((item) => {
      updatedItems[item.id] = isChecked;
    });
    setSelectedShops((prev) => ({ ...prev, [shop]: isChecked }));
    setSelectedItems(updatedItems);
  };

  const handleToggleItem = (
    shop: string,
    itemId: string,
    shopItems: (typeof cartItems)[number]["items"]
  ) => {
    const updatedItems = { ...selectedItems, [itemId]: !selectedItems[itemId] };
    setSelectedItems(updatedItems);
    const allSelected = shopItems.every((item) => updatedItems[item.id]);
    setSelectedShops((prev) => ({ ...prev, [shop]: allSelected }));
  };

  const handleToggleAll = () => {
    const newValue = !allSelected;
    const updatedShops: Record<string, boolean> = {};
    const updatedItems: Record<string, boolean> = {};
    cartItems.forEach((group) => {
      updatedShops[group.shop] = newValue;
      group.items.forEach((item) => {
        updatedItems[item.id] = newValue;
      });
    });
    setSelectedShops(updatedShops);
    setSelectedItems(updatedItems);
  };

  const handleQuantityChange = (itemId: string, delta: number) => {
    setCartItems((prev) =>
      prev.map((group) => ({
        ...group,
        items: group.items.map((item) =>
          item.id === itemId
            ? { ...item, quantity: Math.max(1, item.quantity + delta) }
            : item
        ),
      }))
    );
  };

  const handleVariationChange = (itemId: string, newVariation: string) => {
    setCartItems((prev) =>
      prev.map((group) => ({
        ...group,
        items: group.items.map((item) =>
          item.id === itemId ? { ...item, variation: newVariation } : item
        ),
      }))
    );
  };

  const selectedItemList = cartItems.flatMap((group) =>
    group.items.filter((item) => selectedItems[item.id])
  );

  const total = selectedItemList.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const totalSaved = selectedItemList.reduce((sum, item) => {
    if (item.originalPrice) {
      return sum + (item.originalPrice - item.price) * item.quantity;
    }
    return sum;
  }, 0);

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
    <>
      {isMobile && (
        <MobileCartHeader
          title={t("user.cart.title")}
          onEdit={() => {
            setIsEditingGlobal((prev) => !prev);
            setEditingShops({});
          }}
          isEditingGlobal={isEditingGlobal}
        />
      )}

      <div className="space-y-4 pb-32 pt-[20px]">
        {" "}
        {/* padding top để không che header */}
        {cartItems.map((group, groupIdx) => (
          <div key={group.shop + "-" + groupIdx} className="bg-white border-b">
            <div className="flex items-center justify-between px-3 py-2 pl-2">
              <div className="flex items-center gap-2 pl-2">
                <Checkbox
                  checked={!!selectedShops[group.shop]}
                  onCheckedChange={() =>
                    handleToggleShop(group.shop, group.items)
                  }
                  className="w-4 h-4 sm:w-5 sm:h-5"
                />
                <span className="font-medium text-sm sm:text-base">
                  {group.shop + " >"}
                </span>
              </div>
              {!isEditingGlobal && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    setEditingShops((prev) => ({
                      ...prev,
                      [group.shop]: !prev[group.shop],
                    }))
                  }
                  className="text-primary gap-1"
                >
                  <Edit className="w-4 h-4 sm:w-5 sm:h-5" />
                  {editingShops[group.shop] ? "Done" : "Edit"}
                </Button>
              )}
            </div>
            {group.items.map((item) => (
              <CartItem
                key={item.id}
                item={item}
                checked={!!selectedItems[item.id]}
                onCheckedChange={() =>
                  handleToggleItem(group.shop, item.id, group.items)
                }
                onQuantityChange={(delta: number) =>
                  handleQuantityChange(item.id, delta)
                }
                onVariationChange={handleVariationChange}
                isEditing={editingShops[group.shop] || isEditingGlobal}
              />
            ))}
          </div>
        ))}
        {showScrollButton && (
          <div className="fixed bottom-10 right-4 z-50">
            <Button
              onClick={scrollToTop}
              variant="outline"
              size="icon"
              className="rounded-full border shadow-md"
            >
              <ArrowUpToLine className="w-6 h-6 text-red-500" />
            </Button>
          </div>
        )}
        <div
          className={`w-full bg-white border-t ${
            isMobile ? "fixed bottom-0 z-50" : "sticky bottom-0"
          }`}
        >
          <CartFooter
            total={total}
            totalSaved={totalSaved}
            selectedCount={selectedItemList.length}
            allSelected={allSelected}
            onToggleAll={handleToggleAll}
            isEditing={isEditingGlobal}
          />
        </div>
      </div>
    </>
  );
}
