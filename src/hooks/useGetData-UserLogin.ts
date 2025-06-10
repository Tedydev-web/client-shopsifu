import { useSelector } from 'react-redux';
import { selectUserProfile } from '@/store/features/auth/profileSlide';
import { RootState } from '@/store/store';

/**
 * Custom hook to get user data from the Redux store.
 * @returns The user profile object or null if not logged in.
 */
export const useUserData = () => {
  const user = useSelector((state: RootState) => selectUserProfile(state));
  return user;
};
