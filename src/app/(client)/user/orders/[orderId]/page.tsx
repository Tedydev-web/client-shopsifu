import OrderDetail from "@/components/client/user/account/desktop/orders/orders-Detail";

export default function OrderDetailPage({ params }: { params: { orderId: string } }) {
  return <OrderDetail orderId={params.orderId} />;
}
