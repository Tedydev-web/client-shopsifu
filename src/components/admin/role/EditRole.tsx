"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useState, useEffect, useCallback } from "react"
import { toast } from "sonner"
import { RoleResponse, Permission } from "@/types/role.interface"
import { permissionService } from "@/services/permissionService"

interface EditRoleProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  data?: RoleResponse
}

export function EditRole({ open, onOpenChange, data }: EditRoleProps) {
  const [formData, setFormData] = useState({
    name: data?.name || "",
    description: data?.description || "",
    status: data?.status || "active"
  });
  const [loading, setLoading] = useState(false);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

  const loadPermissions = useCallback(async () => {
    try {
      const mockPermissions = [
        { id: "1", name: "COMPANIES", code: "companies", description: "Quản lý công ty", groupName: "System" },
        { id: "2", name: "USERS", code: "users", description: "Quản lý người dùng", groupName: "System" },
        { id: "3", name: "FILES", code: "files", description: "Quản lý tệp tin", groupName: "System" },
        { id: "4", name: "JOBS", code: "jobs", description: "Quản lý công việc", groupName: "System" },
        { id: "5", name: "RESUMES", code: "resumes", description: "Quản lý hồ sơ", groupName: "System" },
      ] as Permission[];
      setPermissions(mockPermissions);
    } catch {
      toast.error("Không thể tải danh sách quyền");
    }
  }, []);

  useEffect(() => {
    if (open) {
      loadPermissions();
      if (data?.permissions) {
        setSelectedPermissions(data.permissions.map(p => p.id));
      }
    }
  }, [open, data, loadPermissions]);

  const handlePermissionChange = (permissionId: string) => {
    setSelectedPermissions(prev => 
      prev.includes(permissionId)
        ? prev.filter(id => id !== permissionId)
        : [...prev, permissionId]
    );
  };

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      toast.error("Vui lòng nhập tên vai trò");
      return;
    }
    
    if (!data?.id) return;
    
    setLoading(true);
    try {
      await permissionService.updateRolePermissions(data.id, selectedPermissions);
      toast.success("Cập nhật quyền thành công");
      onOpenChange(false);
    } catch {
      toast.error("Không thể cập nhật quyền");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle>Tạo mới Role</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name" className="text-sm font-medium">
              Tên Role <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Nhập tên role..."
              className="h-9"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description" className="text-sm font-medium">
              Mô tả
            </Label>
            <Input
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Nhập mô tả vai trò..."
              className="min-h-[80px] resize-none text-sm"
            />
          </div>

          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Trạng thái</Label>
              <Switch
                checked={formData.status === "active"}
                onCheckedChange={(checked: boolean) => 
                  setFormData(prev => ({ ...prev, status: checked ? "active" : "inactive" }))
                }
              />
            </div>
            <div className="text-sm text-muted-foreground">
              {formData.status === "active" ? "Hoạt động" : "Không hoạt động"}
            </div>
          </div>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg">Phân quyền</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-6">
              {Object.entries(
                permissions.reduce<Record<string, Permission[]>>((acc, permission) => {
                  const group = permission.groupName;
                  if (!acc[group]) {
                    acc[group] = [];
                  }
                  acc[group].push(permission);
                  return acc;
                }, {})
              ).map(([groupName, groupPermissions]) => (
                <div key={groupName} className="space-y-4 border rounded-lg p-4">
                  <div className="flex flex-col space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{groupName}</h4>
                      <Switch
                        checked={groupPermissions.every(p => selectedPermissions.includes(p.id))}
                        onCheckedChange={(checked) => {
                          setSelectedPermissions(prev => {
                            const groupIds = groupPermissions.map(p => p.id);
                            if (checked) {
                              return [...new Set([...prev, ...groupIds])];
                            } else {
                              return prev.filter(id => !groupIds.includes(id));
                            }
                          });
                        }}
                      />
                    </div>
                  </div>
                  <div className="grid gap-3">
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
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
          <Button 
            type="submit" 
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Đang lưu..." : "Lưu thay đổi"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
