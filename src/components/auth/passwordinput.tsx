import { Input } from "@/components/ui/input"
import { Eye, EyeOff } from "lucide-react"
import { useState, InputHTMLAttributes } from "react"
import { cn } from "@/lib/utils"

interface PasswordInputProps extends InputHTMLAttributes<HTMLInputElement> {}

export function PasswordInput({ className, ...props }: PasswordInputProps) {
  const [show, setShow] = useState(false)

  return (
    <div className="relative">
      <Input
        {...props}
        type={show ? "text" : "password"}
        className={cn("h-14 pr-10", className)}
      />
      <button
        type="button"
        onClick={() => setShow((prev) => !prev)}
        className="absolute inset-y-0 right-3 flex items-center text-muted-foreground"
        tabIndex={-1}
      >
        {show ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
      </button>
    </div>
  )
}