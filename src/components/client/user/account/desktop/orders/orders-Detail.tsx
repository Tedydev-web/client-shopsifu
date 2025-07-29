// "use client";

// import { useEffect, useState } from "react";
// import { useParams } from "next/navigation";
// import { orderService } from "@/services/order.service";
// import { OrderGetByIdResponse } from "@/types/order.interface";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent } from "@/components/ui/card";
// import Image from "next/image";

// export const OrderDetail = () => {
//   const { orderId } = useParams();
//   const [order, setOrder] = useState<OrderGetByIdResponse["data"] | null>(null);

//   useEffect(() => {
//     if (orderId) {
//       orderService.getById(orderId).then((res) => setOrder(res.data));
//     }
//   }, [orderId]);

//   if (!order) return <div>Đang tải...</div>;

//   return (
//     <div className="space-y-6">
//       {/* Tổng quan */}
//       <Card>
//         <CardContent className="flex flex-col gap-4">
//           <div className="flex justify-between items-center">
//             <div>
//               <p className="text-sm text-muted-foreground">
//                 Đơn hàng: <span className="font-semibold">#{order.code}</span>
//               </p>
//               <p className="text-sm text-muted-foreground">
//                 Ngày đặt: {new Date(order.createdAt).toLocaleDateString("vi-VN")}
//               </p>
//             </div>
//             <span className="text-red-500 font-semibold">{order.status}</span>
//           </div>
//           {order.items.map((item) => (
//             <div
//               key={item.id}
//               className="flex items-center gap-3 border p-3 rounded-lg"
//             >
//               <Image
//                 src={item.image}
//                 alt={item.productName}
//                 width={80}
//                 height={80}
//                 className="rounded-md"
//               />
//               <div className="flex-1">
//                 <p className="font-semibold">{item.productName}</p>
//                 <p className="text-muted-foreground text-sm">{item.skuValue}</p>
//               </div>
//               <div className="text-right">
//                 <p className="font-semibold">{item.skuPrice.toLocaleString()}đ</p>
//                 <p className="text-sm text-muted-foreground">
//                   SL: {item.quantity}
//                 </p>
//               </div>
//               <Button variant="outline" size="sm" className="text-red-600 border-red-600">
//                 Mua lại
//               </Button>
//             </div>
//           ))}
//         </CardContent>
//       </Card>

//       {/* Thông tin khách hàng & Thanh toán */}
//       <div className="grid md:grid-cols-2 gap-4">
//         {/* Thông tin khách hàng */}
//         <Card>
//           <CardContent className="space-y-2">
//             <h3 className="font-semibold">Thông tin khách hàng</h3>
//             <p>Họ và tên: {order.recipient}</p>
//             <p>SĐT: {order.phoneNumber}</p>
//             <p>Địa chỉ: {order.address}</p>
//             <p>Ghi chú: {order.note || "-"}</p>
//           </CardContent>
//         </Card>

//         {/* Thanh toán */}
//         <Card>
//           <CardContent className="space-y-2">
//             <h3 className="font-semibold">Thông tin thanh toán</h3>
//             <div className="flex justify-between">
//               <span>Số lượng sản phẩm:</span>
//               <span>{order.items.length}</span>
//             </div>
//             <div className="flex justify-between">
//               <span>Tổng tiền hàng:</span>
//               <span>{order.totalPrice.toLocaleString()}đ</span>
//             </div>
//             <div className="flex justify-between text-green-500">
//               <span>Giảm giá:</span>
//               <span>-{order.discount.toLocaleString()}đ</span>
//             </div>
//             <div className="flex justify-between text-green-500">
//               <span>Phí vận chuyển:</span>
//               <span>{order.shippingFee > 0 ? `${order.shippingFee}đ` : "Miễn phí"}</span>
//             </div>
//             <div className="flex justify-between font-semibold text-lg text-red-500">
//               <span>Tổng số tiền:</span>
//               <span>{order.finalAmount.toLocaleString()}đ</span>
//             </div>
//           </CardContent>
//         </Card>
//       </div>

//       {/* Thông tin hỗ trợ và bảo hành */}
//       <div className="grid md:grid-cols-2 gap-4">
//         <Card>
//           <CardContent>
//             <h3 className="font-semibold mb-2">Thông tin hỗ trợ</h3>
//             <Button variant="outline" className="w-full">
//               Liên hệ hỗ trợ
//             </Button>
//           </CardContent>
//         </Card>
//         <Card>
//           <CardContent>
//             <h3 className="font-semibold mb-2">Trung tâm bảo hành</h3>
//             <div className="space-y-2">
//               <Button variant="outline" className="w-full">
//                 Danh sách trung tâm bảo hành
//               </Button>
//               <Button variant="outline" className="w-full">
//                 Bảo hành tại cửa hàng
//               </Button>
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// };
