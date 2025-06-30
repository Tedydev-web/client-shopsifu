"use client";
import * as React from "react";
import { Input } from "@/components/ui/input";
import { Search as SearchIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  value?: string;
  onValueChange?: (value: string) => void;
  onSearch?: (value: string) => void; // Gọi khi nhấn Enter hoặc icon search
  placeholder?: string;
  debounce?: number; // ms, nếu muốn debounce onChange/onSearch
  icon?: React.ReactNode; // Cho phép custom icon
  className?: string;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  value: controlledValue,
  onValueChange,
  onSearch,
  placeholder = "Tìm kiếm...",
  debounce = 0,
  icon,
  className,
  onChange,
  ...rest
}) => {
  const [internalValue, setInternalValue] = React.useState(controlledValue || "");
  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : internalValue;
  const debounceTimeout = React.useRef<NodeJS.Timeout | null>(null);

  // Đồng bộ giá trị khi controlledValue thay đổi
  React.useEffect(() => {
    if (isControlled) setInternalValue(controlledValue!);
    // eslint-disable-next-line
  }, [controlledValue]);

  // Xử lý thay đổi input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (!isControlled) setInternalValue(newValue);
    if (debounce > 0) {
      if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
      debounceTimeout.current = setTimeout(() => {
        onValueChange?.(newValue);
      }, debounce);
    } else {
      onValueChange?.(newValue);
    }
    onChange?.(e);
  };

  // Xử lý khi nhấn Enter hoặc icon search
  const handleSearch = () => {
    onSearch?.(value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className={cn("relative flex items-center", className)}>
      <Input
        type="text"
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="pl-10 pr-4"
        {...rest}
      />
      <button
        type="button"
        className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary focus:outline-none"
        tabIndex={-1}
        onClick={handleSearch}
      >
        {icon || <SearchIcon size={18} />}
      </button>
    </div>
  );
};

export default SearchInput;
