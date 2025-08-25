import React, { useEffect } from "react";
import { useOrderInfo } from "./useOrderInfo";

interface OrderInfoProps {
  orderCode: string;
}

const OrderInfo: React.FC<OrderInfoProps> = ({ orderCode }) => {
  const { orderInfo, fetchOrderInfo, loading } = useOrderInfo();

  useEffect(() => {
    if (orderCode) {
      fetchOrderInfo(orderCode);
    }
  }, [orderCode, fetchOrderInfo]);

  if (loading) return <p>Đang tải thông tin đơn hàng...</p>;
  if (!orderInfo) return <p>Không tìm thấy thông tin đơn hàng</p>;

  return (
    <div className="p-4 border rounded-md shadow-sm">
      <h2 className="text-lg font-bold mb-2">Thông tin đơn hàng</h2>
      <p><span className="font-semibold">Mã đơn:</span> {orderInfo.order_code}</p>
      <p><span className="font-semibold">Trạng thái:</span> {orderInfo.status}</p>
      <p><span className="font-semibold">Người nhận:</span> {orderInfo.to_name}</p>
      <p><span className="font-semibold">Địa chỉ:</span> {orderInfo.to_address}</p>
      <p><span className="font-semibold">SĐT:</span> {orderInfo.to_phone}</p>
      {/* thêm các field khác nếu cần */}
    </div>
  );
};

export default OrderInfo;
