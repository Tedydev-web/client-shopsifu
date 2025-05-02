import React from "react";

interface AlertProps {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const Alert: React.FC<AlertProps> = ({ message, onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="rounded-2xl bg-[#fff3ed] border-[3px] border-b-[6px] border-[#9b1c1c] shadow-xl w-[340px]">
        
        {/* Header */}
        <div className="flex justify-between items-center bg-gradient-to-r from-[#ff7b5c] to-[#ff3300] px-4 py-2 rounded-t-xl">
          <h3 className="text-lg font-bold text-white flex items-center gap-1">⚠️ Cảnh báo</h3>
          <button
            className="text-white text-xl font-bold hover:scale-110 transition"
            onClick={onCancel}
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="px-4 py-4 flex items-start gap-3 text-[#9b1c1c]">
          <div className="text-2xl">!</div>
          <p className="text-[15px] leading-snug">{message}</p>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3 px-4 py-3">
          <button
            onClick={onConfirm}
            className="px-5 py-2 rounded-3xl border-2 border-[#9b1c1c] bg-gradient-to-br from-[#ffb199] to-[#ff7b5c] font-bold text-[#9b1c1c] hover:brightness-110 hover:scale-105 transition"
          >
            Có
          </button>
          <button
            onClick={onCancel}
            className="px-5 py-2 rounded-3xl border-2 border-[#9b1c1c] bg-gradient-to-br from-[#ff7b5c] to-[#ffb199] font-bold text-[#9b1c1c] hover:brightness-110 hover:scale-105 transition"
          >
            Không
          </button>
        </div>
      </div>
    </div>
  );
};

export default Alert;
