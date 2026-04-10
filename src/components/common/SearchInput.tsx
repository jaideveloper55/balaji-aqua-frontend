import { HiOutlineSearch } from "react-icons/hi";
import { useState } from "react";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  expandOnFocus?: boolean;
}

const SearchInput = ({
  value,
  onChange,
  placeholder = "Search...",
  className = "",
  expandOnFocus = true,
}: SearchInputProps) => {
  const [focused, setFocused] = useState(false);

  return (
    <div
      className={`relative transition-all duration-300 ${
        expandOnFocus ? (focused ? "w-72" : "w-64") : "w-full"
      } ${className}`}
    >
      <HiOutlineSearch
        className={`absolute left-3 top-1/2 -translate-y-1/2 text-sm transition-colors ${
          focused ? "text-blue-500" : "text-slate-400"
        }`}
      />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className="w-full pl-9 pr-3 py-[7px] rounded-xl border border-slate-200 text-[12px] text-slate-700 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all"
      />
    </div>
  );
};

export default SearchInput;
