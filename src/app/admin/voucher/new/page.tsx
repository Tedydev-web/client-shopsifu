"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import VoucherFormWrapper from "@/components/admin/voucher/new/voucher-form-Wrapper";
import { VoucherUseCase } from "@/components/admin/voucher/hook/useNewVoucher";

export default function NewVoucherPage() {
  const router = useRouter();
  const t = useTranslations("admin.PageVoucher.New");
  const searchParams = useSearchParams();
  const useCase = parseInt(searchParams.get('useCase') || '1', 10) as VoucherUseCase;

  const getTitle = () => {
    switch (useCase) {
      case VoucherUseCase.PRODUCT:
        return t('title_product');
      case VoucherUseCase.PRIVATE:
        return t('title_private');
      default:
        return t('title_shop');
    }
  };

  return (
    <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 p-4 md:p-10">
      <div className="mx-auto grid w-full max-w-7xl gap-2">
        <div className="flex items-center gap-2">
          <Breadcrumb className="hidden md:flex">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/admin/voucher">{t("breadcrumb.vouchers")}</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{t("breadcrumb.newPage")}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <div>
          <h1 className="text-3xl font-semibold">
            {getTitle()}
          </h1>
        </div>
      </div>

      <div className="mx-auto grid w-full max-w-7xl items-start gap-6">
        <VoucherFormWrapper
          useCase={useCase}
          onCreateSuccess={() => {
            router.push(`/admin/voucher`);
          }}
        />
      </div>
    </main>
  );
}