'use client'
import dynamic from "next/dynamic";
import { VoucherUseCase } from "@/components/admin/voucher/hook/useNewVoucher";

interface VoucherFormWrapperProps {
  useCase: VoucherUseCase;
  onCreateSuccess?: () => void;
}

const VoucherFormDynamic = dynamic(
  () => import("./new-Index"),
  { ssr: false }
);

export default function VoucherFormWrapper({ useCase, onCreateSuccess }: VoucherFormWrapperProps) {
  return (
    <VoucherFormDynamic 
      useCase={useCase}
      onCreateSuccess={onCreateSuccess}
    />
  );
}
