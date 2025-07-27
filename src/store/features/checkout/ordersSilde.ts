import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../store';

// TODO: Replace 'any' with actual interfaces for these types
interface ProductInfo {
  items: any[]; 
}

interface DiscountInfo {
  code: string | null;
  amount: number;
}

interface DeliveryInfo {
  address: string | null;
  recipientName: string | null;
  phone: string | null;
}

// Define a type for the slice state
interface OrderState {
  product: ProductInfo;
  discount: DiscountInfo;
  deliveryInfo: DeliveryInfo;
}

// Define the initial state
const initialState: OrderState = {
  product: {
    items: [],
  },
  discount: {
    code: null,
    amount: 0,
  },
  deliveryInfo: {
    address: null,
    recipientName: null,
    phone: null,
  },
};

export const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    setProductInfo: (state, action: PayloadAction<Partial<ProductInfo>>) => {
      state.product = { ...state.product, ...action.payload };
    },
    setDiscountInfo: (state, action: PayloadAction<Partial<DiscountInfo>>) => {
      state.discount = { ...state.discount, ...action.payload };
    },
    setDeliveryInfo: (state, action: PayloadAction<Partial<DeliveryInfo>>) => {
      state.deliveryInfo = { ...state.deliveryInfo, ...action.payload };
    },
    clearOrder: (state) => {
      state.product = initialState.product;
      state.discount = initialState.discount;
      state.deliveryInfo = initialState.deliveryInfo;
    },
  },
});

// Export actions
export const { setProductInfo, setDiscountInfo, setDeliveryInfo, clearOrder } = orderSlice.actions;

// Selectors
export const selectProductInfo = (state: RootState) => state.order.product;
export const selectDiscountInfo = (state: RootState) => state.order.discount;
export const selectDeliveryInfo = (state: RootState) => state.order.deliveryInfo;

// Export the reducer
export default orderSlice.reducer;