import { createSlice, PayloadAction, createSelector } from '@reduxjs/toolkit';
import { RootState } from '../../store';
import { OrderCreateRequest, ProductInfo } from '@/types/order.interface';

// --- Interfaces cho State ---

// Thông tin chung cho toàn bộ đơn hàng
interface CommonOrderInfo {
  receiver: {
    name: string;
    phone: string;
    address: string;
  } | null;
  paymentGateway: string | null;
  amount: number;
}

// Thông tin riêng cho từng shop
// Thông tin riêng cho từng shop
interface ShopOrderInfo {
  shopId: string;
  cartItemIds: string[];
  discountCodes: string[];
}



// Cấu trúc state tổng thể cho slice này
// Cấu trúc state tổng thể cho slice này
interface CheckoutState {
  commonInfo: CommonOrderInfo;
  shopOrders: ShopOrderInfo[];
  shopProducts: Record<string, ProductInfo[]>; // Key là shopId
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;

}

// --- Initial State ---

const initialState: CheckoutState = {
  commonInfo: {
    receiver: null,
    paymentGateway: null,
    amount: 0,
  },
  shopOrders: [],
  shopProducts: {},
  status: 'idle',
  error: null,
};

// --- Slice Definition ---

const checkoutSlice = createSlice({
  name: 'checkout',
  initialState,
  reducers: {
    // Cập nhật thông tin chung (người nhận, cổng thanh toán)
    setCommonInfo(state, action: PayloadAction<Partial<CommonOrderInfo>>) {
      state.commonInfo = { ...state.commonInfo, ...action.payload };
    },
    // Thiết lập danh sách các đơn hàng theo shop
    // Thiết lập thông tin sản phẩm chi tiết cho các shop
    setShopProducts(state, action: PayloadAction<Record<string, ProductInfo[]>>) {
      state.shopProducts = action.payload;
    },
    // Thiết lập danh sách các đơn hàng theo shop
    setShopOrders(state, action: PayloadAction<ShopOrderInfo[]>) {
      state.shopOrders = action.payload;
    },
    // Cập nhật mã giảm giá cho một shop cụ thể
    updateDiscountForShop(state, action: PayloadAction<{ shopId: string; discountCodes: string[] }>) {
      const { shopId, discountCodes } = action.payload;
      const shopIndex = state.shopOrders.findIndex(order => order.shopId === shopId);
      if (shopIndex !== -1) {
        state.shopOrders[shopIndex].discountCodes = discountCodes;
      }
    },
    // Reset state về ban đầu (sau khi thanh toán thành công hoặc hủy bỏ)
    clearCheckoutState: () => initialState,
  },
});

// --- Actions ---
export const {
  setCommonInfo,
  setShopProducts,
  setShopOrders,
  updateDiscountForShop,
  clearCheckoutState,
} = checkoutSlice.actions;

// --- Selectors ---

const selectCheckoutState = (state: RootState) => state.checkout;

// Selector để lấy thông tin chung
export const selectCommonOrderInfo = createSelector(
  [selectCheckoutState],
  (checkout) => checkout.commonInfo
);

// Selector để lấy thông tin các đơn hàng theo shop
// Selector để lấy thông tin sản phẩm theo shop
export const selectShopProducts = createSelector(
  [selectCheckoutState],
  (checkout) => checkout.shopProducts
);

// Selector để lấy thông tin các đơn hàng theo shop
export const selectShopOrders = createSelector(
  [selectCheckoutState],
  (checkout) => checkout.shopOrders
);

// ** Selector quan trọng: Tự động tạo request body cho API từ state **
export const selectOrderCreateRequest = createSelector(
  [selectCommonOrderInfo, selectShopOrders],
  (commonInfo, shopOrders): OrderCreateRequest | null => {
    // Chỉ tạo request khi có đủ thông tin cần thiết
    if (!commonInfo.receiver || !commonInfo.paymentGateway || shopOrders.length === 0) {
      return null;
    }

    return shopOrders.map((shopOrder: ShopOrderInfo) => ({
      shopId: shopOrder.shopId,
      cartItemIds: shopOrder.cartItemIds,
      receiver: commonInfo.receiver!,
      discountCodes: shopOrder.discountCodes,
      paymentGateway: commonInfo.paymentGateway!,
    }));
  }
);

// --- Reducer ---
export default checkoutSlice.reducer;