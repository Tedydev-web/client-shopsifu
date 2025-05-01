// app/test/page.tsx (hoặc pages/test.tsx nếu dùng `pages` directory)
'use client'; // Nếu dùng App Router trong Next.js 13+

import React, { useState } from "react";
import Alert from "@/components/ui/alert"; // Cập nhật path đúng theo dự án của bạn

const TestPage = () => {
  const [showAlert, setShowAlert] = useState(false);

  return (
    <div className="p-10">
      <button
        onClick={() => setShowAlert(true)}
        className="px-4 py-2 bg-blue-500 text-white rounded"
      >
        Hiện Alert
      </button>

      {showAlert && (
        <Alert
          message="Bạn có chắc chắn muốn xóa không?"
          onConfirm={() => {
            alert("Đã xác nhận!");
            setShowAlert(false);
          }}
          onCancel={() => {
            alert("Đã hủy!");
            setShowAlert(false);
          }}
        />
      )}
    </div>
  );
};

export default TestPage;
