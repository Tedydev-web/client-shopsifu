'use client';

import React, { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { reviewService } from '@/services/reviewService';
import { Review } from '@/types/review.interface';
import { Star, ThumbsUp } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { format, isValid } from 'date-fns';

// Helper component for displaying star ratings
const StarRating = ({ rating, size = 4 }: { rating: number; size?: number }) => (
  <div className="flex items-center">
    {[...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`h-${size} w-${size} ${i < rating ? 'text-red-500 fill-red-500' : 'text-gray-300'}`}
      />
    ))}
  </div>
);

// Component for a single review item
const ReviewItem = ({ review }: { review: Review }) => {
  // Defensive coding: Provide fallback values if user data is missing
  const userName = review.user?.name || 'Người dùng ẩn danh';
  const userAvatar = review.user?.avatar || '/assets/demo/shop-avatar.png';
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
              ? format(new Date(review.createdAt), 'yyyy-MM-dd HH:mm')
              : null}
          </p>
          <p className="mt-3 text-gray-800 whitespace-pre-wrap">{review.content}</p>
          {review.medias && review.medias.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {review.medias.map((media) => (
                <div key={media.id} className="relative w-24 h-24 cursor-pointer">
                  <Image
                    src={media.url}
                    alt="Review media"
                    layout="fill"
                    objectFit="cover"
                    className="rounded-md"
                  />
                </div>
              ))}
            </div>
          )}
          <div className="flex items-center text-gray-500 mt-3">
             <ThumbsUp className="h-4 w-4 mr-1" />
             <span className="text-sm">{/* Like count placeholder */}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main component for displaying product reviews
export const ProductsReviews = ({ productId }: { productId: string }) => {
  const [filter, setFilter] = useState<number | 'all' | 'media'>('all');

    const { data, isLoading, error } = useQuery({
    queryKey: ['reviews', productId],
    queryFn: () => reviewService.getReviewsByProductId(productId, { limit: 100 }),
    enabled: !!productId, // Only fetch if productId is available
  });

  const reviews: Review[] = data?.data?.data?.map((reviewWrapper: any) => reviewWrapper.data) || [];

  const summary = useMemo(() => {
    if (!reviews || reviews.length === 0) {
      return {
        average: 0,
        total: 0,
        counts: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
        mediaCount: 0,
      };
    }
    const total = reviews.length;
    const average = reviews.reduce((acc, r) => acc + r.rating, 0) / total;
    const counts = {
      5: reviews.filter((r) => r.rating === 5).length,
      4: reviews.filter((r) => r.rating === 4).length,
      3: reviews.filter((r) => r.rating === 3).length,
      2: reviews.filter((r) => r.rating === 2).length,
      1: reviews.filter((r) => r.rating === 1).length,
    };
    const mediaCount = reviews.filter((r) => r.medias && r.medias.length > 0).length;
    return { average, total, counts, mediaCount };
  }, [reviews]);

  const filteredReviews = useMemo(() => {
    if (filter === 'all') return reviews;
    if (filter === 'media') return reviews.filter((r) => r.medias && r.medias.length > 0);
    return reviews.filter((r) => r.rating === filter);
  }, [reviews, filter]);

  if (isLoading) return <div className="p-6">Loading reviews...</div>;
  if (error) return <div className="p-6 text-red-500">Error loading reviews.</div>;

  const FilterButton = ({ value, label, count }: { value: number | 'all' | 'media', label: string, count: number }) => (
    <Button
      className={filter === value ? 'bg-red-600 text-white hover:bg-red-700' : 'border border-gray-300 text-gray-700 hover:bg-gray-100'}
      variant="outline"
      onClick={() => setFilter(value)}
    >
      {label} ({count})
    </Button>
  )

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm font-sans">
      <h2 className="text-xl font-medium mb-4">ĐÁNH GIÁ SẢN PHẨM</h2>
      <div className="bg-neutral-50 p-4 rounded-lg flex items-center space-x-8 border">
        <div className="text-center text-red-600 pr-8 border-r">
          <p className="text-lg"><span className="font-bold text-3xl">{summary.average.toFixed(1)}</span> trên 5</p>
          <StarRating rating={Math.round(summary.average)} size={6} />
        </div>
        <div className="flex flex-wrap gap-2">
          <FilterButton value="all" label="Tất Cả" count={summary.total} />
          <FilterButton value={5} label="5 Sao" count={summary.counts[5]} />
          <FilterButton value={4} label="4 Sao" count={summary.counts[4]} />
          <FilterButton value={3} label="3 Sao" count={summary.counts[3]} />
          <FilterButton value={2} label="2 Sao" count={summary.counts[2]} />
          <FilterButton value={1} label="1 Sao" count={summary.counts[1]} />
          <FilterButton value="media" label="Có Hình Ảnh / Video" count={summary.mediaCount} />
        </div>
      </div>

      <div className="mt-6">
        {filteredReviews.length > 0 ? (
          filteredReviews.map((review, index) => <ReviewItem key={`${review.id}-${index}`} review={review} />)
        ) : (
          <p className="text-center text-gray-500 py-8">Chưa có đánh giá nào phù hợp.</p>
        )}
      </div>
    </div>
  );
};

export default ProductsReviews;
