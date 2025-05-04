import React from "react";

interface AlertProps {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const Alert: React.FC<AlertProps> = ({ message, onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="w-[360px] bg-white rounded-2xl border-t-[4px] border-[#e63946]">

        {/* Header */}
        <div className="flex justify-between items-center bg-[#e63946] text-white px-5 py-3 rounded-t-xl">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            {/* Header Icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v2m0 4h.01M4.93 19h14.14a1 1 0 00.92-1.38l-7.07-14a1 1 0 00-1.78 0l-7.07 14a1 1 0 00.86 1.38z"
              />
            </svg>
            Cảnh báo
          </h3>
          <button
            onClick={onCancel}
            className="text-2xl font-bold hover:scale-110 transition"
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div className="px-5 py-4 text-gray-800 flex gap-3">
          {/* Body Icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6 text-[#e63946] flex-shrink-0 mt-0.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v2m0 4h.01M4.93 19h14.14a1 1 0 00.92-1.38l-7.07-14a1 1 0 00-1.78 0l-7.07 14a1 1 0 00.86 1.38z"
            />
          </svg>
          <p className="text-sm leading-relaxed">{message}</p>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 px-5 py-3 bg-gray-50 rounded-b-xl">
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-full bg-[#e63946] text-white font-semibold hover:bg-red-600 transition"
          >
            Có
          </button>
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-full border border-gray-300 text-gray-700 font-semibold hover:bg-gray-100 transition"
          >
            Không
          </button>
        </div>
      </div>
    </div>
  );
};

export default Alert;
