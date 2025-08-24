"use client";

import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { 
  ShoppingCart, 
  DollarSign, 
  TrendingUp, 
  Package, 
  Users, 
  CheckCircle, 
  Clock, 
  CreditCard,
  Calendar,
  Info
} from "lucide-react";
import type { ManageOrder } from "@/types/order.interface";

interface OrdersStatsProps {
  orders: ManageOrder[];
}

export function OrdersStats({ orders }: OrdersStatsProps) {
  const stats = useMemo(() => {
    if (!orders || orders.length === 0) {
      return {
        totalOrders: 0,
        revenue: 0,
        aov: 0,
        productsSold: 0,
        uniqueCustomers: 0,
        deliveryRate: 0,
        pendingPickup: 0,
        paymentMethods: {},
        newOrders24h: 0
      };
    }

    // Tổng đơn hàng
    const totalOrders = orders.length;

    // Doanh thu tạm tính (không bao gồm phí ship/giảm giá)
    const revenue = orders.reduce((sum, order) => {
      return sum + order.items.reduce((itemSum, item) => 
        itemSum + (item.skuPrice * item.quantity), 0
      );
    }, 0);

    //   (Average Order Value)
    const aov = totalOrders > 0 ? revenue / totalOrders : 0;

    // Tổng sản phẩm đã bán
    const productsSold = orders.reduce((sum, order) => {
      return sum + order.items.reduce((itemSum, item) => itemSum + item.quantity, 0);
    }, 0);

    // Khách hàng duy nhất
    const uniqueCustomers = new Set(orders.map(order => order.userId)).size;

    // Tỷ lệ giao thành công
    const deliveredOrders = orders.filter(order => order.status === 'DELIVERED').length;
    const deliveryRate = totalOrders > 0 ? (deliveredOrders / totalOrders) * 100 : 0;

    // Đơn chờ lấy hàng
    const pendingPickup = orders.filter(order => order.status === 'PENDING_PICKUP').length;

    // Phân bổ phương thức thanh toán
    const paymentMethods = orders.reduce((acc, order) => {
      const paymentId = order.paymentId;
      acc[paymentId] = (acc[paymentId] || 0) + 1;
      return acc;
    }, {} as Record<number, number>);

    // Đơn mới 24h qua
    const now = new Date();
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const newOrders24h = orders.filter(order => 
      new Date(order.createdAt) >= yesterday
    ).length;

    return {
      totalOrders,
      revenue,
      aov,
      productsSold,
      uniqueCustomers,
      deliveryRate,
      pendingPickup,
      paymentMethods,
      newOrders24h
    };
  }, [orders]);

  const paymentMethodLabels: Record<number, { label: string; color: string }> = {
    1: { label: 'COD', color: 'bg-green-100 text-green-700' },
    2: { label: 'VNPay', color: 'bg-blue-100 text-blue-700' },
    3: { label: 'MoMo', color: 'bg-pink-100 text-pink-700' },
    4: { label: 'Bank Transfer', color: 'bg-purple-100 text-purple-700' },
  };

  return (
    <TooltipProvider>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-6">
        {/* Tổng đơn hàng */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Card className="cursor-help">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                  Tổng đơn hàng
                  <Info className="h-3 w-3" />
                </CardTitle>
                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalOrders.toLocaleString()}</div>
              </CardContent>
            </Card>
          </TooltipTrigger>
          <TooltipContent>
            <p>Tổng số đơn hàng mà khách hàng đã đặt</p>
          </TooltipContent>
        </Tooltip>

        {/* Doanh thu tạm tính */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Card className="cursor-help">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                  Doanh thu (tạm tính)
                  <Info className="h-3 w-3" />
                </CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {stats.revenue.toLocaleString()}₫
                </div>
              </CardContent>
            </Card>
          </TooltipTrigger>
          <TooltipContent>
            <p>Tổng số tiền bán được từ tất cả đơn hàng</p>
            <p className="text-xs text-muted-foreground mt-1">Chưa bao gồm phí ship và giảm giá từ voucher</p>
          </TooltipContent>
        </Tooltip>

      {/* AOV */}
      {/* <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            AOV (TB/đơn)
          </CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">
            {stats.aov.toLocaleString()}₫
          </div>
        </CardContent>
      </Card> */}

        {/* Sản phẩm đã bán */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Card className="cursor-help">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                  Sản phẩm đã bán
                  <Info className="h-3 w-3" />
                </CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.productsSold.toLocaleString()}</div>
              </CardContent>
            </Card>
          </TooltipTrigger>
          <TooltipContent>
            <p>Tổng số sản phẩm đã bán được cho khách hàng</p>
          </TooltipContent>
        </Tooltip>

        {/* Khách hàng duy nhất */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Card className="cursor-help">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                  Khách hàng duy nhất
                  <Info className="h-3 w-3" />
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.uniqueCustomers.toLocaleString()}</div>
              </CardContent>
            </Card>
          </TooltipTrigger>
          <TooltipContent>
            <p>Có bao nhiêu khách hàng khác nhau đã mua hàng</p>
          </TooltipContent>
        </Tooltip>

        {/* Tỷ lệ giao thành công */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Card className="cursor-help">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                  Tỷ lệ giao thành công
                  <Info className="h-3 w-3" />
                </CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-emerald-600">
                  {stats.deliveryRate.toFixed(1)}%
                </div>
              </CardContent>
            </Card>
          </TooltipTrigger>
          <TooltipContent>
            <p>Tỷ lệ đơn hàng giao thành công tới khách</p>
            <p className="text-xs text-muted-foreground mt-1">Dựa trên số đơn có trạng thái "Đã giao"</p>
          </TooltipContent>
        </Tooltip>

        {/* Đơn chờ lấy hàng */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Card className="cursor-help">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                  Chờ lấy hàng
                  <Info className="h-3 w-3" />
                </CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">
                  {stats.pendingPickup.toLocaleString()}
                </div>
              </CardContent>
            </Card>
          </TooltipTrigger>
          <TooltipContent>
            <p>Số đơn hàng đã chuẩn bị xong, chờ shipper đến lấy</p>
          </TooltipContent>
        </Tooltip>

        {/* Đơn mới 24h */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Card className="cursor-help">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                  Đơn mới 24h
                  <Info className="h-3 w-3" />
                </CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">
                  {stats.newOrders24h.toLocaleString()}
                </div>
              </CardContent>
            </Card>
          </TooltipTrigger>
          <TooltipContent>
            <p>Số đơn hàng mới nhận được trong 24 giờ vừa qua</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
}