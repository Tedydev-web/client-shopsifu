'use client'
import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from 'lucide-react';

interface UsersModalUpsertProps {
  open: boolean;
  onClose: () => void;
  mode: 'add' | 'edit';
  user?: { id?: string; name: string; email: string; role: string; status: string };
  onSubmit: (user: { id?: string; name: string; email: string; role: string; status: string }) => Promise<void>;
}

const ROLE_OPTIONS = [
  { value: 'user', label: 'User' },
  { value: 'admin', label: 'Admin' },
  { value: 'editor', label: 'Editor' },
];
const STATUS_OPTIONS = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'pending', label: 'Pending' },
];

export default function UsersModalUpsert({ open, onClose, mode, user, onSubmit }: UsersModalUpsertProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("user");
  const [status, setStatus] = useState("active");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (mode === 'edit' && user) {
      setName(user.name || "");
      setEmail(user.email || "");
      setRole(user.role || "user");
      setStatus(user.status || "active");
    } else if (mode === 'add') {
      setName(""); setEmail(""); setRole("user"); setStatus("active");
    }
  }, [mode, user, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await onSubmit({ id: user?.id, name, email, role, status });
    setLoading(false);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{mode === 'add' ? 'Thêm người dùng mới' : 'Chỉnh sửa người dùng'}</DialogTitle>
          <DialogDescription>
            {mode === 'add' ? 'Nhập thông tin người dùng để thêm mới vào hệ thống.' : 'Cập nhật thông tin người dùng.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Tên người dùng</label>
            <Input value={name} onChange={e => setName(e.target.value)} required placeholder="Nhập tên..." />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <Input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="Nhập email..." disabled={mode === 'edit'} />
          </div>
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">Vai trò</label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full flex justify-between items-center">
                    {ROLE_OPTIONS.find(opt => opt.value === role)?.label || 'Chọn vai trò'}
                    <ChevronDown size={16} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-full min-w-[120px]">
                  {ROLE_OPTIONS.map(opt => (
                    <DropdownMenuItem key={opt.value} onClick={() => setRole(opt.value)}>
                      {opt.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">Trạng thái</label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full flex justify-between items-center">
                    {STATUS_OPTIONS.find(opt => opt.value === status)?.label || 'Chọn trạng thái'}
                    <ChevronDown size={16} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-full min-w-[120px]">
                  {STATUS_OPTIONS.map(opt => (
                    <DropdownMenuItem key={opt.value} onClick={() => setStatus(opt.value)}>
                      {opt.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline" disabled={loading} onClick={onClose}>Hủy</Button>
            </DialogClose>
            <Button type="submit" disabled={loading}>
              {loading ? (mode === 'add' ? 'Đang thêm...' : 'Đang cập nhật...') : (mode === 'add' ? 'Thêm mới' : 'Cập nhật')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
} 