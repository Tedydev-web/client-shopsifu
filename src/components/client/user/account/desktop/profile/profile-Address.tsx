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
import {
  Check,
  ChevronsUpDown,
  Plus,
  Home,
  Building2,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import axios from "axios";
import { useForm } from "react-hook-form";
import { Switch } from "@/components/ui/switch";
import { useAddress } from "./useAdddress";
import {
  AddAddressRequest,
  UpdateAddressRequest,
} from "@/types/auth/profile.interface";
import { Badge } from "@/components/ui/badge";
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { useResponsive } from "@/hooks/useResponsive";

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
  const [loading, setLoading] = useState(false);
  const [editingAddress, setEditingAddress] =
    useState<AddressFormValues | null>(null);
  const [addresses, setAddresses] = useState<AddressFormValues[]>([]);
  const { getAllAddresses, createAddress, updateAddress, deleteAddress } =
    useAddress();
  const { isMobile } = useResponsive();

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

  // cache provinces
  const [cachedProvinces, setCachedProvinces] = useState<any[]>([]);
  const [districts, setDistricts] = useState<any[]>([]);
  const [wards, setWards] = useState<any[]>([]);
  const [loadingDistricts, setLoadingDistricts] = useState(false);
  const [loadingWards, setLoadingWards] = useState(false);

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
      type: (a.addressType || "HOME").toLowerCase() as "home" | "office",
    }));

    setAddresses(mapped);
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  useEffect(() => {
    if (cachedProvinces.length === 0) {
      locationService
        .getProvinces()
        .then((res) => setCachedProvinces(res.data));
    }
  }, []);

  useEffect(() => {
    if (editingAddress && cachedProvinces.length > 0) {
      const provinceObj = cachedProvinces.find(
        (p) => p.name === editingAddress.province
      );
      if (provinceObj) {
        locationService.getDistrictsByProvince(provinceObj.code).then((res) => {
          const ds = res.data.districts || [];
          setDistricts(ds);

          const districtObj = ds.find(
            (d: any) => d.name === editingAddress.district
          );
          if (districtObj) {
            locationService
              .getWardsByDistrict(districtObj.code)
              .then((res2) => {
                setWards(res2.data.wards || []);
              });
          }
        });
      }
    }
  }, [editingAddress, cachedProvinces]);

  const handleAdd = () => {
    setEditingAddress(null);
    form.reset();
    setDistricts([]);
    setWards([]);
    setOpen(true);
  };

  const handleEdit = (addr: AddressFormValues) => {
    setEditingAddress(addr);
    form.reset(addr);
    setOpen(true);
  };

  const handleSave = async (data: AddressFormValues) => {
    setLoading(true);
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

    try {
      if (editingAddress?.id) {
        const updatePayload: UpdateAddressRequest = {
          ...basePayload,
          name: data.label || "",
        };
        await updateAddress(editingAddress.id, updatePayload, afterSave);
      } else {
        const createPayload: AddAddressRequest = {
          ...basePayload,
          name: data.label || "",
        };
        await createAddress(createPayload, afterSave);
      }
    } finally {
      setLoading(false);
    }
  };

  const afterSave = () => {
    setOpen(false);
    fetchAddresses();
  };

  const handleDelete = async (addr: AddressFormValues) => {
    if (!addr.id) return;
    setLoading(true);
    await deleteAddress(addr.id, () => {
      fetchAddresses();
      setLoading(false);
    });
  };

  const formatFullAddress = (data: AddressFormValues) =>
    [data.detail, data.ward, data.district, data.province]
      .filter(Boolean)
      .join(", ");

  const DropdownSelect = ({
    name,
    label,
    options,
    loading,
    onSelect,
  }: {
    name: keyof AddressFormValues;
    label: string;
    options: any[];
    loading: boolean;
    onSelect?: (item: any) => void;
  }) => (
    <FormField
      control={form.control}
      name={name}
      rules={{ required: `Vui lòng chọn ${label}` }}
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
            <PopoverContent className="w-[var(--radix-popover-trigger-width)] max-h-60 p-0 overflow-y-auto">
              <Command>
                <CommandInput placeholder={`Tìm ${label.toLowerCase()}`} />
                <CommandEmpty>Không tìm thấy</CommandEmpty>
                {loading ? (
                  <div className="p-2 space-y-2">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="h-8 bg-gray-200 animate-pulse rounded"
                      />
                    ))}
                  </div>
                ) : (
                  <CommandGroup>
                    {options.map((o) => (
                      <CommandItem
                        key={String(o.code)}
                        value={o.name} // <-- Quan trọng: value chính là text để filter
                        onSelect={() => {
                          field.onChange(o.name);
                          if (onSelect) onSelect(o);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            field.value === o.name ? "opacity-100" : "opacity-0"
                          )}
                        />
                        <span>{o.name}</span>{" "}
                        {/* <-- text hiển thị, đồng bộ với value */}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                )}
              </Command>
            </PopoverContent>
          </Popover>
        </FormItem>
      )}
    />
  );

  const formContent = (
    <Form {...form}>
      <form className="space-y-4" onSubmit={form.handleSubmit(handleSave)}>
        <DropdownSelect
          name="province"
          label="Tỉnh/Thành phố"
          options={cachedProvinces}
          loading={false}
          onSelect={async (province) => {
            setLoadingDistricts(true);
            const res = await locationService.getDistrictsByProvince(
              province.code
            );
            setDistricts(res.data.districts || []);
            setLoadingDistricts(false);
            form.setValue("district", "");
            setWards([]);
          }}
        />
        <DropdownSelect
          name="district"
          label="Quận/Huyện"
          options={districts}
          loading={loadingDistricts}
          onSelect={async (district) => {
            setLoadingWards(true);
            const res = await locationService.getWardsByDistrict(district.code);
            setWards(res.data.wards || []);
            setLoadingWards(false);
            form.setValue("ward", "");
          }}
        />
        <DropdownSelect
          name="ward"
          label="Phường/Xã"
          options={wards}
          loading={loadingWards}
        />

        {[
          ["detail", "Địa chỉ nhà", "required"],
          ["label", "Tên gợi nhớ"],
          ["recipient", "Người nhận", "required"],
        ].map(([name, label, required]) => (
          <FormField
            key={String(name)}
            control={form.control}
            name={name as keyof AddressFormValues}
            rules={
              required
                ? { required: `${label} không được bỏ trống` }
                : undefined
            }
            render={({ field }) => (
              <FormItem>
                <FormLabel>{label}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={`Nhập ${label.toLowerCase()}`}
                    {...field}
                    value={typeof field.value === "string" ? field.value : ""}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        ))}

        <FormField
          control={form.control}
          name="phone"
          rules={{
            required: "Số điện thoại bắt buộc",
            pattern: {
              value: /^(0|\+84)\d{9}$/,
              message: "Số điện thoại không hợp lệ",
            },
          }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Số điện thoại</FormLabel>
              <FormControl>
                <Input
                  placeholder="Nhập số điện thoại"
                  {...field}
                  value={typeof field.value === "string" ? field.value : ""}
                />
              </FormControl>
            </FormItem>
          )}
        />

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
              <FormLabel className="mb-0">Đặt làm địa chỉ mặc định</FormLabel>
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
  );

  return (
    <div className="bg-white rounded-lg p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="font-semibold text-base text-[#121214]">Sổ địa chỉ</h2>
        <Button
          variant="ghost"
          className="flex items-center gap-2 text-[#D70019]"
          onClick={handleAdd}
        >
          <Plus size={18} /> Thêm địa chỉ
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {addresses.map((addr, i) => (
          <div
            key={i}
            className="bg-[#F9F9F9] border rounded-xl p-4 flex flex-col space-y-2"
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2 text-sm font-medium">
                {addr.type === "home" ? (
                  <Home size={16} />
                ) : (
                  <Building2 size={16} />
                )}
                {addr.label || "Địa chỉ"}
              </div>
              {addr.isDefault && (
                <Badge variant="outline" className="bg-blue-100 text-[#193767]">
                  Mặc định
                </Badge>
              )}
            </div>
            <div className="text-sm font-semibold flex flex-wrap gap-1">
              <span>{addr.recipient}</span>
              <span className="text-[#000000]">|</span>
              <span>{addr.phone}</span>
            </div>
            <p className="text-sm text-[#71717A]">{formatFullAddress(addr)}</p>
            <div className="mt-auto pt-2 flex justify-end items-center gap-3 text-sm">
              <button
                disabled={loading}
                onClick={() => handleDelete(addr)}
                className="text-[#1D1D20] hover:underline"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Xoá"}
              </button>
              <span className="text-gray-300">|</span>
              <button
                onClick={() => handleEdit(addr)}
                className="text-[#3B82F6] hover:underline"
              >
                Cập nhật
              </button>
            </div>
          </div>
        ))}
      </div>

      {isMobile ? (
        <Drawer open={open} onOpenChange={setOpen}>
          <DrawerContent className="p-0">
            <DrawerHeader>
              <DrawerTitle>
                {editingAddress ? "Cập nhật địa chỉ" : "Thêm địa chỉ"}
              </DrawerTitle>
            </DrawerHeader>

            {/* Vùng nội dung cuộn */}
            <div className="px-4 overflow-y-auto max-h-[calc(80vh-100px)]">
              {formContent}
            </div>

            <DrawerFooter className="flex justify-end gap-2 mt-4">
              <Button
                onClick={form.handleSubmit(handleSave)}
                disabled={loading}
              >
                {loading ? "Đang lưu..." : "Lưu"}
              </Button>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      ) : (
        <SheetRework
          open={open}
          onOpenChange={setOpen}
          title={editingAddress ? "Cập nhật địa chỉ" : "Thêm địa chỉ"}
          subtitle="Thay đổi thông tin địa chỉ nhận hàng"
          onCancel={() => setOpen(false)}
          onConfirm={form.handleSubmit(handleSave)}
          confirmText={loading ? "Đang lưu..." : "Lưu"}
          cancelText="Hủy"
        >
          {formContent}
        </SheetRework>
      )}
    </div>
  );
}
