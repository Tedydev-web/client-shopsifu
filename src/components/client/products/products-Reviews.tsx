"use client";

import React, { useMemo, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Star } from "lucide-react";
import Image from "next/image";
import { format, isValid } from "date-fns";
import { useProductReview } from "./hooks/useProductReview";
import { Review } from "@/types/review.interface";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import useUploadMedia from "@/hooks/useUploadMedia";

const StarRating = ({
  rating,
  size = 4,
  interactive = false,
  onSelect,
}: {
  rating: number;
  size?: number;
  interactive?: boolean;
  onSelect?: (rating: number) => void;
}) => (
  <div className="flex items-center">
    {[...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`h-${size} w-${size} ${
          i < rating ? "text-red-500 fill-red-500" : "text-gray-300"
        } ${interactive ? "cursor-pointer" : ""}`}
        onClick={() => interactive && onSelect?.(i + 1)}
      />
    ))}
  </div>
);

const ReviewItem = ({ review }: { review: Review }) => {
  const userName = review.user?.name || "Người dùng ẩn danh";
  const userAvatar = review.user?.avatar || "/assets/demo/shop-avatar.png";
  const userFallback = userName.charAt(0).toUpperCase();

  return (
    <div className="py-6 border-b border-gray-200 last:border-b-0">
      <div className="flex items-start space-x-4">
        <Avatar>
          <AvatarImage src={userAvatar} alt={userName} />
          <AvatarFallback>{userFallback}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <p className="font-semibold">{userName}</p>
          <StarRating rating={review.rating} />
          <p className="text-sm text-gray-500 mt-1">
            {review.createdAt && isValid(new Date(review.createdAt))
              ? format(new Date(review.createdAt), "dd/MM/yyyy HH:mm")
              : null}
          </p>
          <p className="mt-3 text-gray-800 whitespace-pre-wrap">
            {review.content}
          </p>
          {review.medias && review.medias.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {review.medias.map((media) => (
                <div
                  key={media.id}
                  className="relative w-24 h-24 cursor-pointer"
                >
                  <Image
                    src={media.url}
                    alt="Review media"
                    fill
                    className="rounded-md object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export const ProductsReviews = ({ productId }: { productId: string }) => {
  const [filter, setFilter] = useState<number | "all" | "media">("all");
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [content, setContent] = useState("");
  const [page, setPage] = useState(1);
  const limit = 5;

  const searchParams = useSearchParams();
  const { reviews, totalItems, loading, error, fetchReviews, createReview } =
    useProductReview(productId);

  // Upload media hook
  const {
    files,
    uploadedUrls,
    isUploading,
    progress,
    handleAddFiles,
    handleRemoveFile,
    handleRemoveAllFiles,
  } = useUploadMedia();

  useEffect(() => {
    if (searchParams.get("showReview") === "true") {
      setIsReviewOpen(true);
    }
  }, [searchParams]);

  useEffect(() => {
    fetchReviews({
      page,
      limit,
      ...(filter !== "all"
        ? filter === "media"
          ? { hasMedia: true }
          : { rating: filter }
        : {}),
    });
  }, [fetchReviews, page, filter]);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    await createReview({
      productId,
      orderId: searchParams.get("orderId") || "",
      rating,
      content,
      medias: uploadedUrls.map((url) => ({
        url,
        type: "IMAGE" as const,
      })),
    });
    setIsReviewOpen(false);
    setRating(5);
    setContent("");
    handleRemoveAllFiles();
    setPage(1);
  };

  const totalPages = Math.ceil(totalItems / limit);

  const summary = useMemo(() => {
    if (!reviews || reviews.length === 0) {
      return {
        average: 0,
        total: totalItems,
        counts: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
        mediaCount: 0,
      };
    }
    const average =
      reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;
    const counts = {
      5: reviews.filter((r) => r.rating === 5).length,
      4: reviews.filter((r) => r.rating === 4).length,
      3: reviews.filter((r) => r.rating === 3).length,
      2: reviews.filter((r) => r.rating === 2).length,
      1: reviews.filter((r) => r.rating === 1).length,
    };
    const mediaCount = reviews.filter(
      (r) => r.medias && r.medias.length > 0
    ).length;
    return { average, total: totalItems, counts, mediaCount };
  }, [reviews, totalItems]);

  const FilterButton = ({
    value,
    label,
    count,
  }: {
    value: number | "all" | "media";
    label: string;
    count: number;
  }) => (
    <Button
      className={
        filter === value
          ? "bg-red-600 text-white hover:bg-red-700"
          : "border border-gray-300 text-gray-700 hover:bg-gray-100"
      }
      variant="outline"
      onClick={() => {
        setFilter(value);
        setPage(1);
      }}
    >
      {label} ({count})
    </Button>
  );

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm font-sans">
      <h2 className="text-xl font-medium mb-4">ĐÁNH GIÁ SẢN PHẨM</h2>

      <div className="bg-neutral-50 p-4 rounded-lg flex flex-col md:flex-row md:items-center md:space-x-8 border">
        <div className="text-center text-red-600 md:pr-8 md:border-r pb-4 md:pb-0">
          <p className="text-lg">
            <span className="font-bold text-3xl">
              {summary.average.toFixed(1)}
            </span>{" "}
            /5
          </p>
          <div className="flex justify-center">
            <StarRating rating={Math.round(summary.average)} size={6} />
          </div>
        </div>
        <div className="flex-1 w-full overflow-hidden">
          <div className="flex items-center gap-2 overflow-x-auto whitespace-nowrap pb-2 -mb-2">
            <FilterButton value="all" label="Tất Cả" count={summary.total} />
            <FilterButton value={5} label="5 Sao" count={summary.counts[5]} />
            <FilterButton value={4} label="4 Sao" count={summary.counts[4]} />
            <FilterButton value={3} label="3 Sao" count={summary.counts[3]} />
            <FilterButton value={2} label="2 Sao" count={summary.counts[2]} />
            <FilterButton value={1} label="1 Sao" count={summary.counts[1]} />
            <FilterButton
              value="media"
              label="Có Hình Ảnh / Video"
              count={summary.mediaCount}
            />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="animate-pulse space-y-4 mt-6">
          <div className="h-6 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      ) : error ? (
        <div className="text-red-500 mt-6">{error}</div>
      ) : (
        <>
          <div className="mt-6 divide-y divide-gray-200">
            {reviews.length > 0 ? (
              reviews.map((review) => (
                <ReviewItem key={review.id} review={review} />
              ))
            ) : (
              <div className="py-8 text-center text-gray-500">
                Chưa có đánh giá nào cho sản phẩm này
              </div>
            )}
          </div>

          {totalPages > 1 && (
            <div className="mt-8">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (page > 1) setPage((p) => p - 1);
                      }}
                      className={
                        page === 1 ? "pointer-events-none opacity-50" : ""
                      }
                    />
                  </PaginationItem>
                  {[...Array(totalPages)].map((_, i) => (
                    <PaginationItem key={i}>
                      <PaginationLink
                        href="#"
                        isActive={page === i + 1}
                        onClick={(e) => {
                          e.preventDefault();
                          setPage(i + 1);
                        }}
                      >
                        {i + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (page < totalPages) setPage((p) => p + 1);
                      }}
                      className={
                        page === totalPages
                          ? "pointer-events-none opacity-50"
                          : ""
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </>
      )}

      <Dialog open={isReviewOpen} onOpenChange={setIsReviewOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Đánh giá sản phẩm</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmitReview} className="space-y-4">
            <div className="space-y-2">
              <Label>Đánh giá của bạn</Label>
              <StarRating
                rating={rating}
                size={6}
                interactive={true}
                onSelect={setRating}
              />
            </div>
            <div className="space-y-2">
              <Label>Nội dung đánh giá</Label>
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Chia sẻ cảm nhận của bạn..."
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Hình ảnh (tùy chọn)</Label>
              <Input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files) handleAddFiles(e.target.files);
                }}
              />

              {/* Preview ảnh */}
              <div className="flex flex-wrap gap-2 mt-2">
                {files.map((file) => (
                  <div
                    key={file.name}
                    className="relative w-20 h-20 border rounded overflow-hidden"
                  >
                    <Image
                      src={file.preview!}
                      alt={file.name}
                      fill
                      className="object-cover"
                    />
                    <button
                      type="button"
                      className="absolute top-0 right-0 bg-black bg-opacity-50 text-white p-1 text-xs"
                      onClick={() => handleRemoveFile(file.name)}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>

              {/* Tiến trình upload */}
              {isUploading && (
                <div className="mt-1 text-sm text-gray-500">
                  Đang tải lên... {progress}%
                </div>
              )}
            </div>
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsReviewOpen(false)}
              >
                Hủy
              </Button>
              <Button
                type="submit"
                className="bg-red-600 hover:bg-red-700 text-white"
                disabled={loading || isUploading}
              >
                {loading ? "Đang gửi..." : "Gửi đánh giá"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductsReviews;
