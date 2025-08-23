import { createSlice, PayloadAction, createSelector } from '@reduxjs/toolkit';
import { RootState } from '../../store';
import { OrderCreateRequest, ProductInfo, AppliedVoucherInfo } from '@/types/order.interface';

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
  shipping: {
    provinceId: string;
    districtId: string;
    wardCode: string;
    provinceName?: string;
    districtName?: string;
    wardName?: string;
  } | null;
}

// Thông tin riêng cho từng shop
// Thông tin riêng cho từng shop
interface ShopOrderInfo {
  shopId: string;
  cartItemIds: string[];
  discountCodes: string[];
  shopAddress?: {
    provinceId: number;
    districtId: number;
    wardCode: string;
    province: string;
    district: string;
    ward: string;
    street: string;
    name: string;
  } | null;
}

// Cấu trúc state tổng thể cho slice này
interface CheckoutState {
  commonInfo: CommonOrderInfo;
  shopOrders: ShopOrderInfo[];
  shopProducts: Record<string, ProductInfo[]>; // Key là shopId
  appliedVouchers: Record<string, AppliedVoucherInfo>; // Key là shopId
  appliedPlatformVoucher: AppliedVoucherInfo | null; // For platform-wide voucher
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

// --- Initial State ---

const initialState: CheckoutState = {
  commonInfo: {
    receiver: null,
    paymentGateway: null,
    amount: 0,
    shipping: null,
  },
  shopOrders: [],
  shopProducts: {},
  appliedVouchers: {},
  appliedPlatformVoucher: null,
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
    // Cập nhật thông tin shipping
    setShippingInfo(state, action: PayloadAction<{
      provinceId: string;
      districtId: string;
      wardCode: string;
      provinceName?: string;
      districtName?: string;
      wardName?: string;
    }>) {
      state.commonInfo.shipping = action.payload;
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

    // Cập nhật địa chỉ cho một shop cụ thể
    updateShopAddress(state, action: PayloadAction<{ 
      shopId: string; 
      address: {
        provinceId: number;
        districtId: number;
        wardCode: string;
        province: string;
        district: string;
        ward: string;
        street: string;
        name: string;
      }
    }>) {
      const { shopId, address } = action.payload;
      const shopIndex = state.shopOrders.findIndex(order => order.shopId === shopId);
      if (shopIndex !== -1) {
        // Nếu shop đã tồn tại, cập nhật địa chỉ
        state.shopOrders[shopIndex].shopAddress = address;
      } else {
        // Nếu shop chưa tồn tại, tạo một bản ghi mới
        state.shopOrders.push({
          shopId,
          cartItemIds: [], // Khởi tạo rỗng, sẽ được cập nhật sau
          discountCodes: [], // Khởi tạo rỗng
          shopAddress: address,
        });
      }
    },

    // Reset state về ban đầu (sau khi thanh toán thành công hoặc hủy bỏ)
    clearCheckoutState: () => initialState,

    // Áp dụng voucher cho một shop cụ thể
    applyVoucher(state, action: PayloadAction<{ shopId: string; voucherInfo: AppliedVoucherInfo }>) {
      const { shopId, voucherInfo } = action.payload;
      state.appliedVouchers[shopId] = voucherInfo;
    },

    // Xóa voucher cho một shop cụ thể
    removeVoucher(state, action: PayloadAction<{ shopId: string }>) {
      delete state.appliedVouchers[action.payload.shopId];
    },

    // Áp dụng voucher cho toàn sàn
    applyPlatformVoucher(state, action: PayloadAction<AppliedVoucherInfo | null>) {
      state.appliedPlatformVoucher = action.payload;
    },

    // Xóa voucher của sàn
    removePlatformVoucher(state) {
      state.appliedPlatformVoucher = null;
    },
  },
});

// --- Actions ---
export const {
  setCommonInfo,
  setShippingInfo,
  setShopProducts,
  setShopOrders,
  updateDiscountForShop,
  updateShopAddress,
  clearCheckoutState,
  applyVoucher,
  removeVoucher,
  applyPlatformVoucher,
  removePlatformVoucher,
} = checkoutSlice.actions;

// --- Selectors ---

const selectCheckoutState = (state: RootState) => state.orders;

// Selector để lấy voucher của sàn đã áp dụng
export const selectAppliedPlatformVoucher = createSelector(
  [selectCheckoutState],
  (checkout) => checkout.appliedPlatformVoucher
);



// Selector để lấy thông tin chung
export const selectCommonOrderInfo = createSelector(
  [selectCheckoutState],
  (checkout) => checkout.commonInfo
);

// Selector để lấy thông tin shipping
export const selectShippingInfo = createSelector(
  [selectCheckoutState],
  (checkout) => checkout.commonInfo.shipping
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

// Selector để lấy địa chỉ của một shop cụ thể
export const selectShopAddress = (shopId: string) => createSelector(
  [selectCheckoutState],
  (checkout) => {
    const shopOrder = checkout.shopOrders.find(order => order.shopId === shopId);
    return shopOrder?.shopAddress || null;
  }
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

// Selector để lấy các voucher đã áp dụng
export const selectAppliedVouchers = createSelector(
  [selectCheckoutState],
  (checkout) => checkout.appliedVouchers
);

// Selector để tính tổng số tiền giảm giá từ tất cả các voucher (shop và platform)
export const selectTotalDiscountAmount = createSelector(
  [selectAppliedVouchers, selectAppliedPlatformVoucher],
  (appliedVouchers, appliedPlatformVoucher) => {
    let totalDiscount = 0;

    // Tính tổng giảm giá từ voucher của các shop
    totalDiscount += Object.values(appliedVouchers).reduce((total, voucher) => {
      if (voucher && typeof voucher.discountAmount === 'number') {
        return total + voucher.discountAmount;
      }
      return total;
    }, 0);

    // Cộng thêm giảm giá từ voucher của sàn nếu có
    if (appliedPlatformVoucher && typeof appliedPlatformVoucher.discountAmount === 'number') {
      totalDiscount += appliedPlatformVoucher.discountAmount;
    }

    return totalDiscount;
  }
);

// --- Reducer ---
export default checkoutSlice.reducer;