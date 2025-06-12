import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../store';

// Define a type for the user profile
export interface UserProfile {
  id: number;
  email: string;
  role: string;
  status: string;
  twoFactorEnabled: boolean;
  googleId: string | null;
  firstName: string;
  lastName: string;
  username: string;
  phoneNumber: string | null;
  avatar: string | null;
  isDeviceTrustedInSession?: boolean;
  createdAt: string; // Make optional to preserve value during partial updates
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
    setProfile: (state, action: PayloadAction<Partial<UserProfile>>) => {
      // Merge new data into existing user state, or set new user if null
      state.user = state.user ? { ...state.user, ...action.payload } : action.payload as UserProfile;
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