import React from "react";
import { Button } from "antd";
import { HiOutlineCube, HiOutlinePencil, HiOutlineEye } from "react-icons/hi";
import CustomModal from "../../../components/common/CustomModal";
import ProductForm from "./ProductForm";
import { useCreateProduct, useUpdateProduct } from "../hooks/Useproducts";
import type {
  CreateProductPayload,
  UpdateProductPayload,
  ProductFormValues,
} from "../types/Product";

export type ProductModalMode = "create" | "edit" | "view";

interface ProductModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  defaultValues?: Partial<ProductFormValues>;
  mode?: ProductModalMode;
  editId?: string;
  onSwitchToEdit?: () => void;
}

const FORM_ID = "product-form";

const MODE_CONFIG: Record<
  ProductModalMode,
  {
    title: string;
    subtitle: string;
    icon: React.ReactNode;
    iconTone: "blue" | "amber" | "slate";
  }
> = {
  create: {
    title: "New Product",
    subtitle: "Add a new product to your inventory",
    icon: <HiOutlineCube className="w-5 h-5" />,
    iconTone: "blue",
  },
  edit: {
    title: "Edit Product",
    subtitle: "Update product details and pricing",
    icon: <HiOutlinePencil className="w-5 h-5" />,
    iconTone: "amber",
  },
  view: {
    title: "Product Details",
    subtitle: "Read-only view of product information",
    icon: <HiOutlineEye className="w-5 h-5" />,
    iconTone: "slate",
  },
};

const ProductModal: React.FC<ProductModalProps> = ({
  open,
  onClose,
  onSuccess,
  defaultValues,
  mode = "create",
  editId,
  onSwitchToEdit,
}) => {
  const createMutation = useCreateProduct();
  const updateMutation = useUpdateProduct();

  const loading = createMutation.isPending || updateMutation.isPending;
  const config = MODE_CONFIG[mode];
  const isView = mode === "view";

  const toPayload = (data: ProductFormValues): CreateProductPayload => ({
    name: data.name.trim(),
    sku: data.sku.trim().toUpperCase(),
    categoryId: data.categoryId,
    unit: data.unit,
    hsn: data.hsn || undefined,
    description: data.description || undefined,
    basePrice: Number(data.basePrice) || 0,
    costPrice: Number(data.costPrice) || 0,
    gstRate: Number(data.gstRate) || 0,
    stock: Number(data.stock) || 0,
    minStock: Number(data.minStock) || 0,
  });

  const handleSubmit = async (data: ProductFormValues) => {
    if (isView) return;

    const payload = toPayload(data);
    try {
      if (mode === "edit" && editId) {
        await updateMutation.mutateAsync({
          id: editId,
          payload: payload as UpdateProductPayload,
        });
      } else {
        await createMutation.mutateAsync(payload);
      }
      onSuccess?.();
      onClose();
    } catch {
      // toast already shown by hook's onError
    }
  };

  // ─── Footer changes per mode ───
  const renderFooter = () => {
    if (isView) {
      return (
        <div className="flex items-center justify-between gap-3">
          <p className="text-[11px] text-slate-400">
            Read-only view — switch to edit to make changes
          </p>
          <div className="flex items-center gap-3">
            <Button onClick={onClose} className="!rounded-lg">
              Close
            </Button>
            {onSwitchToEdit && (
              <Button
                type="primary"
                icon={<HiOutlinePencil size={14} />}
                onClick={onSwitchToEdit}
                className="!bg-amber-500 hover:!bg-amber-600 !rounded-lg !font-semibold !shadow-sm !shadow-amber-500/25 !border-0"
              >
                Edit Product
              </Button>
            )}
          </div>
        </div>
      );
    }

    return (
      <div className="flex items-center justify-between gap-3">
        <p className="text-[11px] text-slate-400">
          {mode === "edit"
            ? "Changes will update immediately"
            : "Product will be added to inventory"}
        </p>
        <div className="flex items-center gap-3">
          <Button onClick={onClose} disabled={loading} className="!rounded-lg">
            Cancel
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            form={FORM_ID}
            loading={loading}
            className="!bg-blue-600 hover:!bg-blue-700 !rounded-lg !font-semibold !shadow-sm !shadow-blue-500/25 !border-0"
          >
            {mode === "edit" ? "Update Product" : "Add Product"}
          </Button>
        </div>
      </div>
    );
  };

  return (
    <CustomModal
      open={open}
      onClose={onClose}
      title={config.title}
      subtitle={config.subtitle}
      icon={config.icon}
      iconTone={config.iconTone}
      size="2xl"
      footer={renderFooter()}
    >
      <ProductForm
        formId={FORM_ID}
        hideActions
        readOnly={isView}
        defaultValues={defaultValues}
        onSubmit={handleSubmit}
        loading={loading}
        isEdit={mode === "edit"}
      />
    </CustomModal>
  );
};

export default ProductModal;
