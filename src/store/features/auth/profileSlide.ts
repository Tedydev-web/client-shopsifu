import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../store';

// Define a type for the user profile
export interface UserProfile {
  id: number;
  role: string;
  username: string;
  email: string;
  avatar: string | null;
  isDeviceTrustedInSession: boolean;
}

// Define a type for the slice state
interface ProfileState {
  user: UserProfile | null;
}

// Define the initial state
const initialState: ProfileState = {
  user: null,
};

export const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setProfile: (state, action: PayloadAction<UserProfile>) => {
      state.user = action.payload;
    },
    clearProfile: (state) => {
      state.user = null;
    },
  },
});

// Export actions
export const { setProfile, clearProfile } = profileSlice.actions;

// Selector to get the user profile from the state
export const selectUserProfile = (state: RootState) => state.profile.user;

// Export the reducer
export default profileSlice.reducer;