"use client";

import { useCallback, useState } from "react";
import { reviewService } from "@/services/reviewService";
import {
  CreateReviewRequest,
  UpdateReviewRequest,
  Review,
  GetReviewsResponse,
} from "@/types/review.interface";
import { PaginationRequest } from "@/types/base.interface";
import { AxiosError } from "axios";

export const useProductReview = (productId: string) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Lấy danh sách review theo productId
  const fetchReviews = useCallback(
    async (params?: PaginationRequest) => {
      if (!productId) return; // tránh gọi API khi chưa có productId
      try {
        setLoading(true);
        setError(null);
        const res = await reviewService.getReviewsByProductId(
          productId,
          params
        );
        const data: GetReviewsResponse = res.data;
        setReviews(data.data || []);
        setTotalItems(data.metadata?.totalItems ?? 0);
      } catch (err) {
        const axiosError = err as AxiosError<{ message?: string }>;
        setError(
          axiosError.response?.data?.message ||
            "Không thể tải danh sách đánh giá"
        );
      } finally {
        setLoading(false);
      }
    },
    [productId]
  );

  // Tạo review mới
  const createReview = useCallback(
    async (payload: CreateReviewRequest) => {
      try {
        setLoading(true);
        setError(null);
        await reviewService.createReview(payload);
        await fetchReviews(); // refetch sau khi tạo
      } catch (err) {
        const axiosError = err as AxiosError<{ message?: string }>;
        setError(
          axiosError.response?.data?.message || "Không thể tạo đánh giá mới"
        );
      } finally {
        setLoading(false);
      }
    },
    [fetchReviews]
  );

  // Cập nhật review
  const updateReview = useCallback(
    async (reviewId: string, payload: UpdateReviewRequest) => {
      try {
        setLoading(true);
        setError(null);
        await reviewService.updateReview(reviewId, payload);
        await fetchReviews(); // refetch sau khi update
      } catch (err) {
        const axiosError = err as AxiosError<{ message?: string }>;
        setError(
          axiosError.response?.data?.message || "Không thể cập nhật đánh giá"
        );
      } finally {
        setLoading(false);
      }
    },
    [fetchReviews]
  );

  // Xóa review
  const deleteReview = useCallback(
    async (reviewId: string) => {
      try {
        setLoading(true);
        setError(null);
        await reviewService.deleteReview(reviewId);
        await fetchReviews(); // refetch sau khi xóa
      } catch (err) {
        const axiosError = err as AxiosError<{ message?: string }>;
        setError(
          axiosError.response?.data?.message || "Không thể xóa đánh giá"
        );
      } finally {
        setLoading(false);
      }
    },
    [fetchReviews]
  );

  return {
    reviews,
    totalItems,
    loading,
    error,
    fetchReviews,
    createReview,
    updateReview,
    deleteReview,
  };
};
