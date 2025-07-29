"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SheetRework } from "@/components/ui/component/sheet-rework";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { Check, ChevronsUpDown, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import axios from "axios";
import { useForm } from "react-hook-form";
import { Switch } from "@/components/ui/switch";
import { useAddress } from "./useAdddress";
import {
  AddAddressRequest,
  UpdateAddressRequest,
} from "@/types/auth/profile.interface";

// Types
interface AddressFormValues {
  id?: string;
  recipient: string;
  phone: string;
  province: string;
  district: string;
  ward: string;
  detail: string;
  label: string;
  isDefault: boolean;
  type: "home" | "office";
}

const locationService = {
  getProvinces: () => axios.get("https://provinces.open-api.vn/api/p/"),
  getDistrictsByProvince: (provinceCode: number) =>
    axios.get(`https://provinces.open-api.vn/api/p/${provinceCode}?depth=2`),
  getWardsByDistrict: (districtCode: number) =>
    axios.get(`https://provinces.open-api.vn/api/d/${districtCode}?depth=2`),
};

export default function AddressBook() {
  const [open, setOpen] = useState(false);
  const [editingAddress, setEditingAddress] =
    useState<AddressFormValues | null>(null);
  const [addresses, setAddresses] = useState<AddressFormValues[]>([]);
  const { getAllAddresses, createAddress, updateAddress, deleteAddress } =
    useAddress();

  const form = useForm<AddressFormValues>({
    defaultValues: {
      recipient: "",
      phone: "",
      province: "",
      district: "",
      ward: "",
      detail: "",
      label: "",
      isDefault: false,
      type: "home",
    },
  });

  const [provinces, setProvinces] = useState<any[]>([]);
  const [districts, setDistricts] = useState<any[]>([]);
  const [wards, setWards] = useState<any[]>([]);

  /* ------------------- LOAD DATA ------------------- */
  const fetchAddresses = async () => {
    const data = await getAllAddresses();
    if (!data) return;

    const mapped = data.map((a) => ({
      id: a.id,
      recipient: a.recipient || "",
      phone: a.phoneNumber || "",
      province: a.province,
      district: a.district,
      ward: a.ward,
      detail: a.street,
      label: a.name,
      isDefault: a.isDefault,
      type: a.addressType.toLowerCase() as "home" | "office",
    }));

    setAddresses(mapped);
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  useEffect(() => {
    if (open) {
      locationService.getProvinces().then((res) => setProvinces(res.data));
    }
  }, [open]);

  /* ------------------- ADD/EDIT HANDLERS ------------------- */
  const handleAdd = () => {
    setEditingAddress(null);
    form.reset();
    setOpen(true);
  };

  const handleEdit = (addr: AddressFormValues) => {
    setEditingAddress(addr);
    form.reset(addr);
    setOpen(true);
  };

  const handleSave = async (data: AddressFormValues) => {
    const basePayload = {
      province: data.province || "",
      district: data.district || "",
      ward: data.ward || "",
      street: data.detail || "",
      addressType: data.type.toUpperCase() as "HOME" | "OFFICE",
      phoneNumber: data.phone || undefined,
      recipient: data.recipient || undefined,
      isDefault: data.isDefault,
    };

    if (editingAddress?.id) {
      // Update
      const updatePayload: UpdateAddressRequest = {
        ...basePayload,
        name: data.label || "", // vẫn required
      };
      await updateAddress(editingAddress.id, updatePayload, () => {
        setOpen(false);
        fetchAddresses();
      });
    } else {
      // Create
      const createPayload: AddAddressRequest = {
        ...basePayload,
        name: data.label || "", // required
      };
      await createAddress(createPayload, () => {
        setOpen(false);
        fetchAddresses();
      });
    }
  };

  const handleDelete = async (addr: AddressFormValues) => {
    if (!addr.id) return;
    await deleteAddress(addr.id, () => fetchAddresses());
  };

  /* ------------------- UTILS ------------------- */
  const formatFullAddress = (data: AddressFormValues) =>
    [data.detail, data.ward, data.district, data.province]
      .filter(Boolean)
      .join(", ");

  const renderSelectField = (
    name: "province" | "district" | "ward",
    label: string,
    options: any[],
    fetchFunc?: (code: number) => Promise<any>,
    setNext?: (data: any[]) => void,
    nextField?: string,
    resetNext?: (data: any[]) => void
  ) => (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                className={cn(
                  "w-full justify-between",
                  !field.value && "text-muted-foreground"
                )}
              >
                {field.value || `Chọn ${label}`}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="max-h-60 overflow-y-auto w-[--radix-popover-trigger-width] p-0">
              <Command>
                <CommandInput placeholder={`Tìm ${label.toLowerCase()}`} />
                <CommandEmpty>Không tìm thấy</CommandEmpty>
                <CommandGroup>
                  {options.map((o) => (
                    <CommandItem
                      key={o.code}
                      value={o.name}
                      onSelect={async () => {
                        field.onChange(o.name);
                        if (fetchFunc && setNext && nextField) {
                          const res = await fetchFunc(o.code);
                          setNext(res.data[nextField + "s"] || []);
                          form.setValue(
                            nextField as keyof AddressFormValues,
                            ""
                          );
                          if (resetNext) resetNext([]);
                        }
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          field.value === o.name ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {o.name}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
        </FormItem>
      )}
    />
  );

  return (
    <div className="bg-white rounded-lg p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="font-semibold text-base text-[#121214]">Sổ địa chỉ</h2>
        <Button
          variant="ghost"
          className="flex items-center gap-2 px-3 py-1.5 text-sm text-[#D70019] hover:text-red-600 hover:bg-red-50 transition"
          onClick={handleAdd}
        >
          <Plus size={18} /> Thêm địa chỉ
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {addresses.map((addr, i) => (
          <div
            key={i}
            className="bg-[#F9F9F9] border rounded-xl p-4 flex flex-col"
          >
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-[#1D1D20]">
                {addr.label || "Địa chỉ"}
              </span>
              {addr.isDefault && (
                <span className="text-xs font-medium px-2 py-0.5 bg-blue-100 text-[#193767] rounded">
                  Mặc định
                </span>
              )}
            </div>
            <div className="text-sm font-semibold text-[#1D1D20] flex flex-wrap gap-1">
              <span>{addr.recipient}</span>
              <span className="text-[#000000]">|</span>
              <span>{addr.phone}</span>
            </div>
            <p className="text-sm text-[#71717A]">{formatFullAddress(addr)}</p>
            <div className="mt-auto pt-4 flex justify-end items-center gap-3 text-sm">
              <button
                onClick={() => handleDelete(addr)}
                className="text-[#1D1D20] hover:underline transition"
              >
                Xoá
              </button>
              <span className="text-gray-300">|</span>
              <button
                onClick={() => handleEdit(addr)}
                className="text-[#3B82F6] hover:underline transition"
              >
                Cập nhật
              </button>
            </div>
          </div>
        ))}
      </div>

      <SheetRework
        open={open}
        onOpenChange={setOpen}
        title={editingAddress ? "Cập nhật địa chỉ" : "Thêm địa chỉ"}
        subtitle="Thay đổi thông tin địa chỉ nhận hàng"
        onCancel={() => setOpen(false)}
        onConfirm={form.handleSubmit(handleSave)}
        confirmText="Lưu"
        cancelText="Hủy"
      >
        <Form {...form}>
          <form className="space-y-4" onSubmit={form.handleSubmit(handleSave)}>
            {renderSelectField(
              "province",
              "Tỉnh/Thành phố",
              provinces,
              locationService.getDistrictsByProvince,
              setDistricts,
              "district",
              setWards
            )}
            {renderSelectField(
              "district",
              "Quận/Huyện",
              districts,
              locationService.getWardsByDistrict,
              setWards,
              "ward",
              () => {}
            )}
            {renderSelectField("ward", "Phường/Xã", wards)}

            {[
              ["detail", "Địa chỉ nhà"],
              ["label", "Tên gợi nhớ"],
              ["recipient", "Người nhận"],
              ["phone", "Số điện thoại"],
            ].map(([name, label]) => (
              <FormField
                key={name}
                control={form.control}
                name={name as keyof AddressFormValues}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{label}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={`Nhập ${label.toLowerCase()}`}
                        value={field.value as string}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        name={field.name}
                        ref={field.ref}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            ))}

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Loại địa chỉ</FormLabel>
                  <div className="flex gap-3 border-b border-gray-200 pb-4">
                    <Button
                      type="button"
                      variant={field.value === "home" ? "default" : "outline"}
                      onClick={() => field.onChange("home")}
                    >
                      Nhà
                    </Button>
                    <Button
                      type="button"
                      variant={field.value === "office" ? "default" : "outline"}
                      onClick={() => field.onChange("office")}
                    >
                      Văn phòng
                    </Button>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isDefault"
              render={({ field }) => (
                <FormItem className="flex items-center gap-3">
                  <FormLabel className="mb-0">
                    Đặt làm địa chỉ mặc định
                  </FormLabel>
                  <FormControl>
                    <Switch
                      checked={!!field.value}
                      onCheckedChange={(checked) => field.onChange(checked)}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </form>
        </Form>
      </SheetRework>
    </div>
  );
}
