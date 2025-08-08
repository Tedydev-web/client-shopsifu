"use client";

import { useNewVoucher, VoucherUseCase } from '../hook/useNewVoucher';
import VoucherBasicInfo from './new-BasicInfo';
import VoucherDiscountSettings from './new-SettingsVoucher';
import VoucherShowSettings from './new-ShowVoucher';

interface VoucherNewIndexProps {
  useCase: VoucherUseCase;
  onCreateSuccess?: () => void;
}

export function VoucherNewIndex({ useCase, onCreateSuccess }: VoucherNewIndexProps) {
  const { formData, updateFormData, errors, voucherType } = useNewVoucher({ useCase, onCreateSuccess });

  return (
    <div className="space-y-6">
      <VoucherBasicInfo formData={formData} updateFormData={updateFormData} errors={errors} />
      <VoucherDiscountSettings formData={formData} updateFormData={updateFormData} errors={errors} useCase={useCase} voucherType={voucherType} />
      <VoucherShowSettings formData={formData} updateFormData={updateFormData} errors={errors} useCase={useCase} voucherType={voucherType} />
    </div>
  );
}

export default VoucherNewIndex;