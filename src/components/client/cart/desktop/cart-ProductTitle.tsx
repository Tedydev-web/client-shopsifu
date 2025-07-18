"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { useTranslations } from "next-intl";

interface DesktopCartHeaderProps {
  allSelected: boolean;
  onToggleAll: () => void;
}

export default function DesktopCartHeader({
  allSelected,
  onToggleAll,
}: DesktopCartHeaderProps) {
  const t = useTranslations();

  return (
    <div className="mt-8">
      <div className="bg-white text-sm text-muted-foreground border rounded-sm">
        <div className="flex items-center px-3 py-4">
          <div className="flex items-center gap-2 w-[45%]">
            <Checkbox
              className="scale-90 ml-[30px]"
              checked={allSelected}
              onCheckedChange={onToggleAll}
            />
            <span className="font-medium text-black">
              {t("user.cart.productTitle.product")}
            </span>
          </div>
          <div className="w-[15%] text-center">
            {t("user.cart.productTitle.unitPrice")}
          </div>
          <div className="w-[15%] text-center">
            {t("user.cart.productTitle.quantity")}
          </div>
          <div className="w-[15%] text-center">
            {t("user.cart.productTitle.totalPrice")}
          </div>
          <div className="w-[10%] text-center">
            {t("user.cart.productTitle.actions")}
          </div>
        </div>
      </div>
    </div>
  );
}
