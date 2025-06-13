import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../store';
import { UserProfile } from '@/types/auth/profile.interface';

// Define a type for the slice state
interface ProfileState {
  data: UserProfile | null;
}

// Define the initial state
const initialState: ProfileState = {
  data: null,
};

export const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setProfile: (state, action: PayloadAction<Partial<UserProfile>>) => {
      // Merge new data into existing user state, or set new user if null
      state.data = state.data ? { ...state.data, ...action.payload } : action.payload as UserProfile;
    },
    clearProfile: (state) => {
      state.data = null;
    },
  },
});

// Export actions
export const { setProfile, clearProfile } = profileSlice.actions;

// Selector to get the user profile from the state
export const selectUserProfile = (state: RootState) => state.profile.data;

// Export the reducer
export default profileSlice.reducer;