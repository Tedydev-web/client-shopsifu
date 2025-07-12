interface Review {
  user: string;
  rating: number;
  comment: string;
}

export default function ProductReviews({ reviews }: { reviews: Review[] }) {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-3">Đánh giá sản phẩm</h2>
      <div className="space-y-4">
        {reviews.map((review, index) => (
          <div key={index} className="border p-3 rounded">
            <div className="text-sm font-medium">{review.user}</div>
            <div className="text-xs text-yellow-500">{"⭐".repeat(review.rating)}</div>
            <p className="text-sm mt-2">{review.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
