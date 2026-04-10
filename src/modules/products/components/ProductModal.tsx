import React, { useState } from "react";
import { HiOutlineX, HiOutlineCube, HiOutlinePencil } from "react-icons/hi";
import ProductForm from "./ProductForm";
import type { ProductFormValues } from "../types/Product";

interface ProductModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  defaultValues?: Partial<ProductFormValues>;
  isEdit?: boolean;
}

const ProductModal: React.FC<ProductModalProps> = ({
  open,
  onClose,
  onSuccess,
  defaultValues,
  isEdit = false,
}) => {
  const [loading, setLoading] = useState(false);
  if (!open) return null;

  const handleSubmit = async (data: ProductFormValues) => {
    setLoading(true);
    try {
      console.log("Product data:", data);
      await new Promise((r) => setTimeout(r, 800));
      onSuccess?.();
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 animate-fadeIn"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden animate-modalIn">
          {/* Header */}
          <div
            className={`flex items-center justify-between px-6 py-4 border-b border-slate-100 border-l-[3px] ${
              isEdit ? "border-l-amber-500" : "border-l-blue-500"
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-transform duration-300 hover:scale-105 ${
                  isEdit
                    ? "bg-amber-50 text-amber-600"
                    : "bg-blue-50 text-blue-600"
                }`}
              >
                {isEdit ? (
                  <HiOutlinePencil className="text-lg" />
                ) : (
                  <HiOutlineCube className="text-lg" />
                )}
              </div>
              <div>
                <h2 className="text-[15px] font-bold text-slate-800">
                  {isEdit ? "Edit Product" : "New Product"}
                </h2>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  {isEdit
                    ? "Update product details and pricing"
                    : "Add a new product to your inventory"}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <HiOutlineX className="text-lg" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto px-6 py-5">
            <ProductForm
              defaultValues={defaultValues}
              onSubmit={handleSubmit}
              onCancel={onClose}
              loading={loading}
              isEdit={isEdit}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductModal;
