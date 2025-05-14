import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface AddNewRoleProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddNewRole({ open, onOpenChange }: AddNewRoleProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Thêm vai trò mới</DialogTitle>
          <DialogDescription>
            Thêm một vai trò mới vào hệ thống. Vai trò này sẽ được gán cho người dùng.
          </DialogDescription>
        </DialogHeader>

        {/* Add your form content here */}
      </DialogContent>
    </Dialog>
  )
}
