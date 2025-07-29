import { useState } from "react";
import { useDispatch } from "react-redux";
import { addressService } from "@/services/addressService";
import { 
  AddAddressRequest, 
  UpdateAddressRequest,
  AddressGetAllResponse,
  AddressGetByIdResponse,
  DeleteAddressResponse
} from "@/types/auth/profile.interface";
import { showToast } from "@/components/ui/toastify";
import { parseApiError } from "@/utils/error";
import { useGetProfile } from "@/hooks/useGetProfile";

export const useAddress = () => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const { fetchProfile } = useGetProfile();

  /* ------------------- GET ALL ------------------- */
  const getAllAddresses = async (
    params?: Record<string, any>
  ): Promise<AddressGetAllResponse["data"] | null> => {
    setLoading(true);
    try {
      const { data } = await addressService.getAll(params);
      return data;
    } catch (error) {
      showToast(parseApiError(error), "error");
      return null;
    } finally {
      setLoading(false);
    }
  };

  /* ------------------- GET BY ID ------------------- */
  const getAddressById = async (
    id: string
  ): Promise<AddressGetByIdResponse["data"] | null> => {
    setLoading(true);
    try {
      const { data } = await addressService.getById(id);
      return data;
    } catch (error) {
      showToast(parseApiError(error), "error");
      return null;
    } finally {
      setLoading(false);
    }
  };

  /* ------------------- CREATE ------------------- */
  const createAddress = async (
    payload: AddAddressRequest, 
    onSuccess?: () => void
  ) => {
    setLoading(true);
    try {
      const { message } = await addressService.create(payload);
      showToast(message || "Thêm địa chỉ thành công", "success");
      await fetchProfile();
      onSuccess?.();
    } catch (error) {
      showToast(parseApiError(error), "error");
    } finally {
      setLoading(false);
    }
  };

  /* ------------------- UPDATE ------------------- */
  const updateAddress = async (
    id: string, 
    payload: UpdateAddressRequest, 
    onSuccess?: () => void
  ) => {
    setLoading(true);
    try {
      const { message } = await addressService.update(id, payload);
      showToast(message || "Cập nhật địa chỉ thành công", "success");
      await fetchProfile();
      onSuccess?.();
    } catch (error) {
      showToast(parseApiError(error), "error");
    } finally {
      setLoading(false);
    }
  };

  /* ------------------- DELETE ------------------- */
  const deleteAddress = async (id: string, onSuccess?: () => void) => {
    setLoading(true);
    try {
      const { message }: DeleteAddressResponse = await addressService.delete(id);
      showToast(message || "Xóa địa chỉ thành công", "success");
      await fetchProfile();
      onSuccess?.();
    } catch (error) {
      showToast(parseApiError(error), "error");
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    getAllAddresses,
    getAddressById,
    createAddress,
    updateAddress,
    deleteAddress,
  };
};
