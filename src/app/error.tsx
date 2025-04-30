'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Lỗi tại route:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white text-[#D0201C] p-6">
      <h1 className="text-4xl font-bold mb-4">Đã có lỗi xảy ra</h1>
      <p className="mb-4 text-center max-w-md">
        Đã xảy ra lỗi trong quá trình tải trang. Vui lòng thử lại hoặc quay về trang chủ.
      </p>
      <div className="flex gap-4">
        <button
          onClick={() => reset()}
          className="px-6 py-2 border border-[#D0201C] text-[#D0201C] hover:bg-[#D0201C] hover:text-white transition rounded"
        >
          Thử lại
        </button>
        <a
          href="/"
          className="px-6 py-2 border border-[#D0201C] text-[#D0201C] hover:bg-[#D0201C] hover:text-white transition rounded"
        >
          Trang chủ
        </a>
      </div>
    </div>
  );
}
