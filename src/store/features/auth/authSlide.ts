import { createAction, createSlice } from '@reduxjs/toolkit';
import { AppDispatch } from '@/store/store';

export const revertAll = createAction('REVERT_ALL');

export interface AuthState {
  user: { id: string; name: string } | null;
  token: string;
}

const initialState: AuthState = {
  user: null,
  token: '',
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    logOut: (state) => {
      state.user = null;
      state.token = '';
    },
  },
  extraReducers: (builder) => {
    builder.addCase(revertAll, () => initialState);
  },
});

export const { setCredentials, logOut } = authSlice.actions;

export const logOutAndRevertAll = () => (dispatch: AppDispatch) => {
  dispatch(logOut());
  dispatch(revertAll());
};

export default authSlice.reducer;
