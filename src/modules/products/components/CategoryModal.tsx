import React, { useState, useEffect } from "react";
import { Button } from "antd";
import { useForm } from "react-hook-form";
import { HiOutlineTag, HiOutlinePencil, HiOutlineCheck } from "react-icons/hi";
import CustomModal from "../../../components/common/CustomModal";
import CustomInput from "../../../components/common/CustomInput";

export interface CategoryFormValues {
  name: string;
  description?: string;
}

export interface CategoryColor {
  color: string;
  bg: string;
  name: string;
}

export const PRESET_COLORS: CategoryColor[] = [
  { color: "#2563eb", bg: "#dbeafe", name: "Blue" },
  { color: "#7c3aed", bg: "#ede9fe", name: "Violet" },
  { color: "#0891b2", bg: "#cffafe", name: "Cyan" },
  { color: "#16a34a", bg: "#dcfce7", name: "Green" },
  { color: "#ca8a04", bg: "#fef9c3", name: "Yellow" },
  { color: "#ea580c", bg: "#ffedd5", name: "Orange" },
  { color: "#dc2626", bg: "#fee2e2", name: "Red" },
  { color: "#db2777", bg: "#fce7f3", name: "Pink" },
  { color: "#475569", bg: "#f1f5f9", name: "Slate" },
];

interface CategoryModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: (
    data: CategoryFormValues & { color: string; bg: string }
  ) => void | Promise<void>;
  /** External loading state (e.g. from a mutation hook) */
  loading?: boolean;
  defaultValues?: Partial<CategoryFormValues> & {
    color?: string;
    bg?: string;
  };
  isEdit?: boolean;
}

const FORM_ID = "category-form";

const CategoryModal: React.FC<CategoryModalProps> = ({
  open,
  onClose,
  onSuccess,
  loading = false,
  defaultValues,
  isEdit = false,
}) => {
  const [selectedColor, setSelectedColor] = useState<CategoryColor>(
    PRESET_COLORS[0]
  );

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isDirty },
  } = useForm<CategoryFormValues>({
    defaultValues: { name: "", description: "" },
  });

  const watchedName = watch("name");

  useEffect(() => {
    if (open) {
      reset({
        name: defaultValues?.name || "",
        description: defaultValues?.description || "",
      });
      const presetMatch =
        PRESET_COLORS.find((p) => p.color === defaultValues?.color) ||
        PRESET_COLORS[0];
      setSelectedColor(presetMatch);
    }
  }, [open, defaultValues, reset]);

  const onSubmit = async (data: CategoryFormValues) => {
    const payload = {
      ...data,
      name: data.name.trim(),
      color: selectedColor.color,
      bg: selectedColor.bg,
    };
    await onSuccess?.(payload);
  };

  // Discard-changes guard
  const beforeClose = async () => {
    if (loading) return false;
    if (isDirty) {
      return window.confirm("Discard your changes?");
    }
    return true;
  };

  const slugPreview = watchedName
    ? watchedName.trim().toLowerCase().replace(/\s+/g, "_")
    : "category_slug";

  return (
    <CustomModal
      open={open}
      onClose={onClose}
      beforeClose={beforeClose}
      title={isEdit ? "Edit Category" : "New Category"}
      subtitle={
        isEdit
          ? "Update category name and color"
          : "Group products under a new category"
      }
      icon={
        isEdit ? (
          <HiOutlinePencil className="w-5 h-5" />
        ) : (
          <HiOutlineTag className="w-5 h-5" />
        )
      }
      iconTone={isEdit ? "amber" : "blue"}
      size="lg"
      footer={
        <div className="flex items-center justify-between gap-3">
          <p className="text-[11px] text-slate-400">
            {isEdit
              ? "Changes apply to all linked products"
              : "Available immediately after creation"}
          </p>
          <div className="flex items-center gap-3">
            <Button
              onClick={onClose}
              disabled={loading}
              className="!rounded-lg"
            >
              Cancel
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              form={FORM_ID}
              loading={loading}
              icon={!loading && <HiOutlineCheck size={14} />}
              className="!bg-blue-600 hover:!bg-blue-700 !rounded-lg !font-semibold !shadow-sm !shadow-blue-500/25 !border-0"
            >
              {isEdit ? "Update Category" : "Create Category"}
            </Button>
          </div>
        </div>
      }
    >
      <form
        id={FORM_ID}
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-5"
      >
        {/* Live Preview */}
        <div className="flex items-center gap-3 p-4 rounded-xl bg-white ring-1 ring-slate-200/60 shadow-sm">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ring-1 ring-white/80 shadow-sm transition-all duration-300"
            style={{
              background: selectedColor.bg,
              color: selectedColor.color,
            }}
          >
            <HiOutlineTag size={18} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">
              Live Preview
            </p>
            <p className="text-[14px] font-semibold text-slate-800 truncate">
              {watchedName?.trim() || "Category Name"}
            </p>
            <p className="text-[10px] font-mono text-slate-400 mt-0.5">
              {slugPreview}
            </p>
          </div>
          <span
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap"
            style={{
              background: selectedColor.bg,
              color: selectedColor.color,
            }}
          >
            <HiOutlineTag size={10} />
            {watchedName?.trim() || "Sample"}
          </span>
        </div>

        {/* Name */}
        <CustomInput
          name="name"
          control={control}
          label="Category Name"
          placeholder="e.g. Dispenser, Spare Parts"
          errors={errors}
          isrequired
          autoFocus
          rules={{
            required: "Category name is required",
            minLength: { value: 2, message: "Min 2 characters" },
            maxLength: { value: 30, message: "Max 30 characters" },
          }}
        />

        {/* Color Picker */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold text-slate-600">
            Badge Color
            <span className="text-slate-400 font-normal ml-1.5">
              ({selectedColor.name})
            </span>
          </label>
          <div className="flex items-center gap-2 flex-wrap p-3 rounded-lg bg-slate-50 ring-1 ring-slate-100">
            {PRESET_COLORS.map((p) => {
              const isSelected = selectedColor.color === p.color;
              return (
                <button
                  key={p.color}
                  type="button"
                  onClick={() => setSelectedColor(p)}
                  title={p.name}
                  className={`relative w-8 h-8 rounded-lg transition-all duration-200 hover:scale-110 ${
                    isSelected
                      ? "ring-2 ring-slate-800 ring-offset-2 ring-offset-slate-50 scale-110"
                      : "ring-1 ring-white hover:ring-slate-300"
                  }`}
                  style={{ backgroundColor: p.color }}
                >
                  {isSelected && (
                    <HiOutlineCheck
                      className="absolute inset-0 m-auto text-white"
                      size={16}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </form>
    </CustomModal>
  );
};

export default CategoryModal;
