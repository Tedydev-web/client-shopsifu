"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { UserRound, ClipboardList, AlertCircle, Upload, ChevronDown, ChevronRight } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useState, useCallback, useEffect } from "react"
import { toast } from "sonner"
import { Permission } from "@/types/role.interface"

interface AddNewRoleProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddNewRole({ open, onOpenChange }: AddNewRoleProps) {
  const [avatar, setAvatar] = useState<string | null>(null);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setAvatar(imageUrl);
    }
  };

  const toggleGroup = (groupName: string) => {
    setExpandedGroups(prev => ({
      ...prev,
      [groupName]: !prev[groupName]
    }));
  };

  const handlePermissionChange = (permissionId: string) => {
    setSelectedPermissions(prev => 
      prev.includes(permissionId)
        ? prev.filter(id => id !== permissionId)
        : [...prev, permissionId]
    );
  };

  const loadPermissions = useCallback(async () => {
    try {
      const mockPermissions = [
        // System permissions
        { id: "1", name: "COMPANIES", code: "companies", description: "Quản lý công ty", groupName: "System" },
        { id: "2", name: "USERS", code: "users", description: "Quản lý người dùng", groupName: "System" },
        { id: "3", name: "FILES", code: "files", description: "Quản lý tệp tin", groupName: "System" },
        { id: "4", name: "JOBS", code: "jobs", description: "Quản lý công việc", groupName: "System" },
        { id: "5", name: "RESUMES", code: "resumes", description: "Quản lý hồ sơ", groupName: "System" },
        // Product permissions
        { id: "6", name: "PRODUCTS", code: "products", description: "Quản lý sản phẩm", groupName: "Product" },
        { id: "7", name: "CATEGORIES", code: "categories", description: "Quản lý danh mục", groupName: "Product" },
        { id: "8", name: "INVENTORY", code: "inventory", description: "Quản lý tồn kho", groupName: "Product" },
        { id: "9", name: "PRICES", code: "prices", description: "Quản lý giá", groupName: "Product" },
        { id: "10", name: "DISCOUNTS", code: "discounts", description: "Quản lý giảm giá", groupName: "Product" },
        // Order permissions
        { id: "11", name: "ORDERS", code: "orders", description: "Quản lý đơn hàng", groupName: "Order" },
        { id: "12", name: "SHIPMENTS", code: "shipments", description: "Quản lý vận chuyển", groupName: "Order" },
        { id: "13", name: "PAYMENTS", code: "payments", description: "Quản lý thanh toán", groupName: "Order" },
        { id: "14", name: "REFUNDS", code: "refunds", description: "Quản lý hoàn tiền", groupName: "Order" },
        { id: "15", name: "TRANSACTIONS", code: "transactions", description: "Quản lý giao dịch", groupName: "Order" },
      ] as Permission[];
      setPermissions(mockPermissions);
    } catch {
      toast.error("Không thể tải danh sách quyền");
    }
  }, []);

  useEffect(() => {
    if (open) {
      loadPermissions();
    }
  }, [open, loadPermissions]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-[450px] overflow-y-auto px-6">
        <SheetHeader className="mb-5 space-y-2">
          <SheetTitle className="text-xl font-semibold">Thêm vai trò mới</SheetTitle>
          <SheetDescription>
            Thêm một vai trò mới vào hệ thống
          </SheetDescription>
        </SheetHeader>
        
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              Ảnh đại diện
            </Label>
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={avatar || ""} />
                <AvatarFallback>
                  <UserRound className="h-8 w-8 text-muted-foreground" />
                </AvatarFallback>
              </Avatar>
              <div className="relative">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                  id="avatar-upload"
                />
                <Label
                  htmlFor="avatar-upload"
                  className="inline-flex h-9 cursor-pointer items-center justify-center gap-2 rounded-md border border-input bg-background px-4 py-2 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <Upload className="h-4 w-4" />
                  Tải ảnh lên
                </Label>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="fullName" className="text-sm font-medium">
              Họ và tên
            </Label>
            <div className="relative">
              <UserRound className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="fullName"
                placeholder="Nhập họ và tên..."
                className="pl-8 h-9"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="role" className="text-sm font-medium">
              Tên vai trò
            </Label>
            <div className="relative">
              <ClipboardList className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground z-10" />
              <Select>
                <SelectTrigger className="w-full pl-8 h-9">
                  <SelectValue className="text-sm" placeholder="Chọn vai trò" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin" className="text-sm">Quản trị viên (Admin)</SelectItem>
                  <SelectItem value="seller" className="text-sm">Người bán hàng</SelectItem>
                  <SelectItem value="customer" className="text-sm">Người mua hàng</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status" className="text-sm font-medium">
              Trạng thái
            </Label>
            <div className="relative">
              <AlertCircle className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground z-10" />
              <Select>
                <SelectTrigger className="w-full pl-8 h-9">
                  <SelectValue className="text-sm" placeholder="Chọn trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active" className="text-sm">
                    <span className="flex items-center">
                      <span className="h-2 w-2 rounded-full bg-green-500 mr-2" />
                      Hoạt động
                    </span>
                  </SelectItem>
                  <SelectItem value="inactive" className="text-sm">
                    <span className="flex items-center">
                      <span className="h-2 w-2 rounded-full bg-red-500 mr-2" />
                      Không hoạt động
                    </span>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium">
              Mô tả
            </Label>
            <div className="relative">
              <Input
                id="description"
                placeholder="Nhập mô tả vai trò..."
                className="min-h-[80px] resize-none text-sm"
              />
            </div>
          </div>

          <Card>
            <CardHeader 
              className="flex flex-row items-center justify-between space-y-0 pb-2 cursor-pointer"
              onClick={() => toggleGroup("main")}
            >
              <div className="flex items-center gap-2">
                {expandedGroups["main"] ? (
                  <ChevronDown className="h-5 w-5" />
                ) : (
                  <ChevronRight className="h-5 w-5" />
                )}
                <CardTitle className="text-lg">Phân quyền</CardTitle>
              </div>
            </CardHeader>
            {expandedGroups["main"] && (
              <CardContent className="grid gap-6">
                {Object.entries(
                  permissions.reduce<Record<string, Permission[]>>((acc, permission) => {
                    const group = permission.groupName;
                    if (!acc[group]) acc[group] = [];
                    acc[group].push(permission);
                    return acc;
                  }, {})
                ).map(([groupName, groupPermissions]) => (
                  <div key={groupName} className="space-y-4 border rounded-lg p-4">
                    <div className="flex flex-col space-y-4">
                      <div 
                        className="flex items-center justify-between cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleGroup(groupName);
                        }}
                      >
                        <div className="flex items-center gap-2">
                          {expandedGroups[groupName] ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                          <h4 className="font-medium">{groupName}</h4>
                        </div>
                        <Switch
                          checked={groupPermissions.every(p => selectedPermissions.includes(p.id))}
                          onCheckedChange={(checked) => {
                            setSelectedPermissions(prev => {
                              const groupIds = groupPermissions.map(p => p.id);
                              return checked
                                ? [...new Set([...prev, ...groupIds])]
                                : prev.filter(id => !groupIds.includes(id));
                            });
                          }}
                        />
                      </div>
                    </div>
                    {expandedGroups[groupName] && (
                      <div className="grid gap-3 pl-6">
                        {groupPermissions.map((permission) => (
                          <div key={permission.id} className="flex items-center justify-between">
                            <span className="text-sm font-medium">{permission.name}</span>
                            <Switch
                              checked={selectedPermissions.includes(permission.id)}
                              onCheckedChange={() => handlePermissionChange(permission.id)}
                              className="scale-75"
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </CardContent>
            )}
          </Card>
        </div>

        <SheetFooter className="flex flex-col gap-2 sm:flex-row sm:justify-end">
          <SheetClose asChild>
            <Button variant="outline" className="sm:w-24 h-9">
              Hủy
            </Button>
          </SheetClose>
          <Button type="submit" className="sm:w-24 h-9">
            Lưu
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
