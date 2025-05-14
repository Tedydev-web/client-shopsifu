"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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

export type { AddNewRoleProps }

export default function AddNewRole({ open, onOpenChange }: AddNewRoleProps) {
  const router = useRouter()
  const [avatar, setAvatar] = useState<string | null>(null)
  const [permissions, setPermissions] = useState<Permission[]>([])
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([])
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({})

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const imageUrl = URL.createObjectURL(file)
      setAvatar(imageUrl)
    }
  }

  const toggleGroup = (groupName: string) => {
    setExpandedGroups(prev => ({
      ...prev,
      [groupName]: !prev[groupName]
    }))
  }

  const handlePermissionChange = (permissionId: string) => {
    setSelectedPermissions(prev => 
      prev.includes(permissionId)
        ? prev.filter(id => id !== permissionId)
        : [...prev, permissionId]
    )
  }

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
      ] as Permission[]
      setPermissions(mockPermissions)
    } catch {
      toast.error("Không thể tải danh sách quyền")
    }
  }, [])

  useEffect(() => {
    loadPermissions()
  }, [loadPermissions])

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent 
        side="right" 
        className="w-full lg:max-w-[580px] sm:max-w-[480px] h-full bg-background border-l flex flex-col p-0"
      >
        <div className="flex-1 overflow-y-auto">
          <div className="p-3 sm:p-4">
            <SheetHeader className="border-b pb-4 mb-4">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-primary/10">
                  <ClipboardList className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <SheetTitle className="text-xl font-semibold">Thêm vai trò mới</SheetTitle>
                  <SheetDescription className="text-sm text-muted-foreground">
                    Tạo và cấu hình một vai trò mới trong hệ thống
                  </SheetDescription>
                </div>
              </div>
            </SheetHeader>

            <div className="space-y-4">
              <div className="space-y-3">
                <h3 className="text-base font-medium">Thông tin cơ bản</h3>
                <div className="p-4 border rounded-lg space-y-4">
                  <div>
                    <Label className="text-sm font-medium mb-1.5 block">
                      Ảnh đại diện
                    </Label>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-16 w-16 border-2 border-muted">
                        <AvatarImage src={avatar || ""} />
                        <AvatarFallback className="bg-primary/10">
                          <UserRound className="h-8 w-8 text-primary" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col gap-1.5">
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={handleAvatarChange}
                          className="hidden"
                          id="avatar-upload"
                        />
                        <Label
                          htmlFor="avatar-upload"
                          className="inline-flex h-8 cursor-pointer items-center justify-center gap-1.5 rounded-md bg-primary text-primary-foreground px-3 py-1.5 text-sm font-medium hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                        >
                          <Upload className="h-3.5 w-3.5" />
                          Tải ảnh lên
                        </Label>
                        <p className="text-xs text-muted-foreground">
                          JPG, GIF hoặc PNG. Tối đa 2MB
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-1.5">
                      <Label htmlFor="fullName" className="text-sm font-medium">
                        Họ và tên
                      </Label>
                      <div className="relative">
                        <UserRound className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="fullName"
                          placeholder="Nhập họ và tên..."
                          className="pl-8 h-9"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="role" className="text-sm font-medium">
                        Tên vai trò
                      </Label>
                      <div className="relative">
                        <ClipboardList className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground z-10" />
                        <Select>
                          <SelectTrigger className="w-full pl-8 h-9">
                            <SelectValue placeholder="Chọn vai trò" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="admin">Quản trị viên (Admin)</SelectItem>
                            <SelectItem value="seller">Người bán hàng</SelectItem>
                            <SelectItem value="customer">Người mua hàng</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="status" className="text-sm font-medium">
                        Trạng thái
                      </Label>
                      <div className="relative">
                        <AlertCircle className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground z-10" />
                        <Select>
                          <SelectTrigger className="w-full pl-8 h-9">
                            <SelectValue placeholder="Chọn trạng thái" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="active">
                              <div className="flex items-center">
                                <div className="h-1.5 w-1.5 rounded-full bg-green-500 mr-1.5" />
                                Hoạt động
                              </div>
                            </SelectItem>
                            <SelectItem value="inactive">
                              <div className="flex items-center">
                                <div className="h-1.5 w-1.5 rounded-full bg-red-500 mr-1.5" />  
                                Không hoạt động
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="description" className="text-sm font-medium">
                        Mô tả
                      </Label>
                      <div className="relative">
                        <Input
                          id="description"
                          placeholder="Nhập mô tả vai trò..."
                          className="h-9"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-base font-medium">Phân quyền</h3>
                <Card className="border rounded-lg">
                  <CardHeader 
                    className="flex flex-row items-center justify-between space-y-0 py-2 px-3 cursor-pointer hover:bg-muted/50 transition-colors rounded-t-lg"
                    onClick={() => toggleGroup("main")}
                  >
                    <div className="flex items-center gap-1.5">
                      {expandedGroups["main"] ? (
                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      )}
                      <CardTitle className="text-base font-medium">Danh sách quyền</CardTitle>
                    </div>
                  </CardHeader>
                  {expandedGroups["main"] && (
                    <CardContent className="grid gap-4 pt-3">
                      {Object.entries(
                        permissions.reduce<Record<string, Permission[]>>((acc, permission) => {
                          const group = permission.groupName
                          if (!acc[group]) acc[group] = []
                          acc[group].push(permission)
                          return acc
                        }, {})
                      ).map(([groupName, groupPermissions]) => (
                        <div key={groupName} className="space-y-3 border rounded-lg p-3 hover:bg-muted/50 transition-colors">
                          <div className="flex flex-col space-y-3">
                            <div 
                              className="flex items-center justify-between cursor-pointer"
                              onClick={(e) => {
                                e.stopPropagation()
                                toggleGroup(groupName)
                              }}
                            >
                              <div className="flex items-center gap-1.5">
                                {expandedGroups[groupName] ? (
                                  <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                                ) : (
                                  <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
                                )}
                                <h4 className="text-sm font-medium">{groupName}</h4>
                              </div>
                              <Switch
                                checked={groupPermissions.every(p => selectedPermissions.includes(p.id))}
                                onCheckedChange={(checked) => {
                                  setSelectedPermissions(prev => {
                                    const groupIds = groupPermissions.map(p => p.id)
                                    return checked
                                      ? [...new Set([...prev, ...groupIds])]
                                      : prev.filter(id => !groupIds.includes(id))
                                  })
                                }}
                              />
                            </div>
                          </div>
                          {expandedGroups[groupName] && (
                            <div className="grid gap-2 pl-5">
                              {groupPermissions.map((permission) => (
                                <div key={permission.id} className="flex items-center justify-between py-1.5 px-2 rounded-md hover:bg-muted">
                                  <div className="space-y-0.5">
                                    <p className="text-sm font-medium">{permission.name}</p>
                                    <p className="text-xs text-muted-foreground">{permission.description}</p>
                                  </div>
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
            </div>
          </div>
        </div>
        
        <div className="sticky bottom-0 border-t bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="p-3 flex flex-col-reverse sm:flex-row sm:justify-end gap-2">
            <SheetClose asChild>
              <Button variant="outline" size="sm" className="sm:w-20">
                Hủy
              </Button>
            </SheetClose>
            <Button type="submit" size="sm" className="sm:w-20">
              Lưu
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
