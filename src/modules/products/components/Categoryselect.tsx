import React, { useState, useMemo } from "react";
import { Select, Tooltip } from "antd";
import { Controller, Control, FieldErrors, get } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import { HiOutlinePlus, HiOutlineTag, HiOutlineCheck } from "react-icons/hi";

interface CategoryOption {
  value: string;
  label: string;
  color?: string;
  bg?: string;
}

interface CategorySelectProps {
  name: string;
  control: Control<any>;
  errors: FieldErrors;
  label?: string;
  placeholder?: string;
  isrequired?: boolean;
  rules?: any;
  options: CategoryOption[];
  onCreate?: (name: string) => Promise<CategoryOption> | CategoryOption;
  size?: "large" | "middle" | "small";
}

const PRESET_COLORS = [
  { color: "#2563eb", bg: "#dbeafe" },
  { color: "#7c3aed", bg: "#ede9fe" },
  { color: "#0891b2", bg: "#cffafe" },
  { color: "#16a34a", bg: "#dcfce7" },
  { color: "#ca8a04", bg: "#fef9c3" },
  { color: "#ea580c", bg: "#ffedd5" },
  { color: "#db2777", bg: "#fce7f3" },
];

/**
 * Smart category select with inline "+ Create" option.
 * Pattern inspired by GitHub labels / Linear / Notion.
 */
const CategorySelect: React.FC<CategorySelectProps> = ({
  name,
  control,
  errors,
  label,
  placeholder = "Select or create category",
  isrequired,
  rules,
  options: initialOptions,
  onCreate,
  size = "large",
}) => {
  const [searchValue, setSearchValue] = useState("");
  const [options, setOptions] = useState<CategoryOption[]>(initialOptions);
  const [creating, setCreating] = useState(false);
  const errorMessage = get(errors, name)?.message;

  // Show "+ Create '<value>'" only if search doesn't match an existing option
  const showCreateOption = useMemo(() => {
    const trimmed = searchValue.trim();
    if (!trimmed) return false;
    return !options.some(
      (o) => o.label.toLowerCase() === trimmed.toLowerCase()
    );
  }, [searchValue, options]);

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field: { onChange, value } }) => {
        const handleCreate = async () => {
          const newName = searchValue.trim();
          if (!newName) return;
          setCreating(true);
          try {
            const preset = PRESET_COLORS[options.length % PRESET_COLORS.length];
            const fallback: CategoryOption = {
              value: newName.toLowerCase().replace(/\s+/g, "_"),
              label: newName,
              ...preset,
            };
            const newOpt = onCreate ? await onCreate(newName) : fallback;
            setOptions((prev) => [...prev, newOpt]);
            onChange(newOpt.value);
            setSearchValue("");
          } finally {
            setCreating(false);
          }
        };

        return (
          <div className="flex flex-col gap-1.5 w-full">
            {label && (
              <label
                htmlFor={name}
                className={`text-xs font-semibold ${
                  errorMessage ? "text-red-500" : "text-slate-600"
                }`}
              >
                {label}
                {isrequired && <span className="text-red-500 ml-0.5">*</span>}
              </label>
            )}

            <Tooltip
              placement="bottom"
              color="#fd8484"
              title={errorMessage || null}
            >
              <Select
                id={name}
                showSearch
                value={value || undefined}
                size={size}
                placeholder={placeholder}
                searchValue={searchValue}
                onSearch={setSearchValue}
                onChange={(v) => {
                  onChange(v);
                  setSearchValue("");
                }}
                status={errorMessage ? "error" : undefined}
                allowClear
                filterOption={(input, opt) =>
                  (opt?.label as string)
                    ?.toLowerCase()
                    .includes(input.toLowerCase())
                }
                className="w-full"
                suffixIcon={<HiOutlineTag className="text-slate-400" />}
                getPopupContainer={(t) => t.parentElement || document.body}
                optionRender={(option) => {
                  const opt = options.find((o) => o.value === option.value);
                  return (
                    <div className="flex items-center gap-2 py-0.5">
                      <span
                        className="w-2.5 h-2.5 rounded-full ring-2 ring-white shadow-sm shrink-0"
                        style={{ backgroundColor: opt?.color || "#94a3b8" }}
                      />
                      <span className="text-[12px] font-medium">
                        {option.label}
                      </span>
                    </div>
                  );
                }}
                options={options.map((o) => ({
                  value: o.value,
                  label: o.label,
                }))}
                dropdownRender={(menu) => (
                  <div>
                    {menu}
                    {showCreateOption && (
                      <>
                        <div className="h-px bg-slate-100 mx-2 my-1" />
                        <button
                          type="button"
                          onClick={handleCreate}
                          disabled={creating}
                          className="w-full flex items-center gap-2 px-3 py-2 text-left text-[12px] font-semibold text-blue-600 hover:bg-blue-50 transition-colors duration-150 rounded-md disabled:opacity-50"
                        >
                          {creating ? (
                            <HiOutlineCheck size={14} />
                          ) : (
                            <HiOutlinePlus size={14} />
                          )}
                          Create{" "}
                          <span className="px-1.5 py-0.5 bg-blue-100 rounded text-blue-700 font-mono text-[11px]">
                            {searchValue.trim()}
                          </span>
                        </button>
                      </>
                    )}
                  </div>
                )}
                notFoundContent={
                  <div className="py-3 text-center text-[12px] text-slate-400">
                    Type to create a new category
                  </div>
                }
              />
            </Tooltip>

            <ErrorMessage
              errors={errors}
              name={name}
              render={({ message }) => (
                <p className="text-xs text-red-500 font-medium">{message}</p>
              )}
            />
          </div>
        );
      }}
    />
  );
};

export default CategorySelect;
