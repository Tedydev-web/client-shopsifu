// ✅ ProductReviewsMobile.tsx
"use client";

interface Review {
  user: string;
  rating: number;
  comment: string;
}

export default function ProductReviewsMobile({ reviews }: { reviews: Review[] }) {
  return (
    <div className="bg-white p-4 mt-2">
      <h2 className="text-sm font-semibold mb-3">Đánh giá sản phẩm</h2>
      <div className="space-y-3">
        {reviews.map((review, idx) => (
          <div key={idx} className="text-sm border-b pb-2">
            <div className="font-medium">{review.user}</div>
            <div className="text-yellow-500 text-xs">
              {"⭐".repeat(review.rating)}
            </div>
            <div className="mt-1">{review.comment}</div>
          </div>
        ))}
      </div>
    </div>
  );
}