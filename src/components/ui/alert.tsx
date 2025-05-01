import React from "react";

interface AlertProps {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const Alert: React.FC<AlertProps> = ({ message, onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg p-6 w-[300px]">
        <p className="text-gray-800 text-sm mb-4">{message}</p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
          >
            Không
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Có
          </button>
        </div>
      </div>
    </div>
  );
};

export default Alert;
