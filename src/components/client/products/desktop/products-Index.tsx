"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";

import ProductGallery from "./products-Gallery";
import ProductInfo from "./products-Info";
import ProductSpecs from "./products-Spec";
import ProductReviews from "./products-Reviews";
import ProductSuggestions from "./products-Suggestion";
import { productMock } from "./mockData";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
} from "@/components/ui/breadcrumb";

interface Props {
  slug: string;
}

export default function ProductDetail({ slug }: Props) {
  // ✅ An toàn khi đọc variations
  const sizes =
    productMock?.variations?.find((v) => v.name === "Kích thước")?.options ||
    [];
  const colors =
    productMock?.variations?.find((v) => v.name === "Màu sắc")?.options || [];

  const product = {
    ...productMock,
    sizes,
    colors,
  };

  // ✅ Nếu không có shop hoặc shipping hoặc warranty
  if (!product?.shop || !product.shipping || !product.warranty) {
    return (
      <div className="p-4 text-red-500">
        Dữ liệu sản phẩm không đầy đủ để hiển thị chi tiết.
      </div>
    );
  }

  return (
    <div className="bg-[#f5f5f5] py-4">
      {/* ✅ Breadcrumb */}
      <div className="max-w-[1200px] mx-auto px-4 mb-3">
        <Breadcrumb className="mb-3 flex flex-wrap items-center text-sm text-muted-foreground">
          <BreadcrumbItem className="flex items-center gap-1">
            <BreadcrumbLink asChild>
              <Link href="/" className="text-black hover:underline">
                Trang chủ
              </Link>
            </BreadcrumbLink>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </BreadcrumbItem>

          <BreadcrumbItem className="flex items-center gap-1">
            <BreadcrumbLink asChild>
              <Link href="/products" className="text-black hover:underline">
                Sản phẩm
              </Link>
            </BreadcrumbLink>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </BreadcrumbItem>

          <BreadcrumbItem>
            <span className="text-foreground font-medium line-clamp-1">
              {product.name}
            </span>
          </BreadcrumbItem>
        </Breadcrumb>
      </div>

      {/* ✅ Khối chi tiết sản phẩm */}
      <div className="max-w-[1200px] mx-auto bg-white p-4 rounded">
        <div className="flex flex-col md:flex-row gap-6">
          <ProductGallery images={product.images} />
          <ProductInfo product={product} />
        </div>

        {/* ✅ Video */}
        {product.video && (
          <div className="mt-6">
            <video
              controls
              className="w-full max-h-[500px] rounded-lg border"
              src={product.video}
            />
          </div>
        )}

        {/* ✅ Thông số kỹ thuật */}
        <div className="mt-6">
          <ProductSpecs product={product} />
        </div>

        {/* ✅ Đánh giá */}
        <div className="mt-6">
          <ProductReviews reviews={product.reviews} />
        </div>

        {/* ✅ Sản phẩm gợi ý */}
        <div className="mt-6">
          <ProductSuggestions products={product.suggestions} />
        </div>

        {/* ✅ Thông tin shop + vận chuyển */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Shop info */}
          <div className="p-4 border rounded-lg">
            <h4 className="font-semibold mb-2 text-sm">Thông tin Shop</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>Tên shop: {product.shop.name}</li>
              <li>Địa chỉ: {product.shop.address}</li>
              <li>Rating: {product.shop.rating}⭐</li>
              <li>Người theo dõi: {product.shop.followers.toLocaleString()}</li>
              <li>Tham gia: {product.shop.joinDate}</li>
            </ul>
          </div>

          {/* Shipping info */}
          <div className="p-4 border rounded-lg">
            <h4 className="font-semibold mb-2 text-sm">Thông tin vận chuyển</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>Gửi từ: {product.shipping.from}</li>
              <li>
                Phí vận chuyển:{" "}
                {product.shipping.fee === 0
                  ? "Miễn phí"
                  : `${product.shipping.fee.toLocaleString()}₫`}
              </li>
              <li>Giao hàng dự kiến: {product.shipping.estimatedDelivery}</li>
              <li>
                Phương thức: {product.shipping.shippingMethods.join(", ")}
              </li>
            </ul>
          </div>
        </div>

        {/* ✅ Chính sách bảo hành */}
        <div className="mt-6 p-4 border rounded-lg">
          <h4 className="font-semibold mb-2 text-sm">Bảo hành</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>Hình thức: {product.warranty.type}</li>
            <li>Thời hạn: {product.warranty.duration}</li>
            <li>Chính sách: {product.warranty.policy}</li>
          </ul>
        </div>

        {/* ✅ Nhãn sản phẩm */}
        {product.labels?.length > 0 && (
          <div className="mt-6">
            <h4 className="font-semibold mb-2 text-sm">Nhãn nổi bật</h4>
            <div className="flex flex-wrap gap-2">
              {product.labels.map((label, index) => (
                <span
                  key={index}
                  className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-full"
                >
                  {label}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
