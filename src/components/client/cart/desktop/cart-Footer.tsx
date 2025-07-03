"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Ticket, Coins } from "lucide-react";
import { t } from "i18next"

interface CartFooterProps {
  total: number;
  totalSaved: number;
  isEditing?: boolean;
  selectedCount: number;
  allSelected: boolean;
  onToggleAll: () => void;
}

export default function CartFooter({
  total,
  totalSaved,
  isEditing = false,
  selectedCount,
  allSelected,
  onToggleAll,
}: CartFooterProps) {
  return (
    <div className="w-full sticky bottom-0 bg-white border-t text-sm text-muted-foreground">
      {/* Voucher */}
      {!isEditing && (
        <div className="flex items-center justify-between h-10 px-4 border-b">
          <div className="flex items-center gap-1 text-foreground font-medium">
            <Ticket className="w-4 h-4 text-red-500" />
            <span>{t("user.cart.footer.platformVoucher")}</span>
          </div>
          <button className="text-blue-600 hover:underline">
            {t("user.cart.footer.selectOrEnterCode")}
          </button>
        </div>
      )}

      {/* Coin */}
      {!isEditing && (
        <div className="flex items-center justify-between h-10 px-4 border-b">
          <div className="flex items-center gap-2 opacity-50">
            <input type="checkbox" disabled className="w-3.5 h-3.5" />
            <Coins className="w-4 h-4 text-yellow-400" />
            <span>{t("user.cart.footer.noItemSelected")}</span>
          </div>
          <span className="opacity-50">-₫0</span>
        </div>
      )}

      {/* Bottom Row */}
      <div className="flex items-center justify-between px-4 h-12 bg-white">
        <div className="flex items-center gap-2 text-foreground">
          <Checkbox
            id="select-all"
            className="scale-90"
            checked={allSelected}
            onCheckedChange={onToggleAll}
          />
          <label htmlFor="select-all">
            {t("user.cart.footer.selectAll")} ({selectedCount})
          </label>
          <span className="mx-2">|</span>
          <button className="hover:underline">{t("user.cart.footer.delete")}</button>
          <button className="hover:underline">{t("user.cart.footer.removeInactive")}</button>
          <button className="text-red-500 hover:underline">
            {t("user.cart.footer.moveToLikes")}
          </button>
        </div>

        <div className="flex items-center gap-2">
          <div className="text-right text-sm">
            <span className="mr-1">
              {t("user.cart.footer.total")} ({selectedCount} {t("user.cart.footer.items")}{selectedCount > 1 ? "s" : ""}):
            </span>
            <span className="text-red-500 font-medium">
              ₫{total.toLocaleString("vi-VN")}
            </span>
            {totalSaved > 0 && (
              <div className="text-xs text-muted-foreground">
                You saved ₫{totalSaved.toLocaleString("vi-VN")}
              </div>
            )}
          </div>
          <Button className="bg-red-600 text-white px-5 py-1.5 text-sm h-8 rounded-sm">
            Check Out
          </Button>
        </div>
      </div>
    </div>
  );
}
