import React from "react";
import { useForm } from "react-hook-form";
import { HiOutlinePlus } from "react-icons/hi";
import { TbBuildingFactory2 } from "react-icons/tb";
import CustomModal from "../../../../components/common/CustomModal";
import CustomInput from "../../../../components/common/CustomInput";
import CustomSelect from "../../../../components/common/CustomSelect";
import { PRODUCT_OPTIONS, SHIFT_OPTIONS } from "../../constants/Production.constants";

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit?: (data: any) => void;
}

const AddProductionBatchModal: React.FC<Props> = ({
  open,
  onClose,
  onSubmit,
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const submit = (data: any) => {
    onSubmit?.(data);
    reset();
    onClose();
  };

  return (
    <CustomModal
      open={open}
      onClose={onClose}
      title="New Production Batch"
      subtitle="Start a new batch and track its production"
      icon={<TbBuildingFactory2 size={22} />}
      iconTone="cyan"
      size="3xl"
      footer={
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit(submit)}
            className="px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg hover:opacity-90 transition flex items-center gap-2 shadow-sm"
          >
            <HiOutlinePlus /> Create Batch
          </button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Section: Batch info */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 rounded-md bg-cyan-100 text-cyan-700 flex items-center justify-center text-xs font-bold">
              1
            </div>
            <h4 className="text-sm font-bold text-slate-800">
              Batch Information
            </h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <CustomInput
              name="batchNo"
              control={control}
              label="Batch No."
              placeholder="e.g. BATCH-2026-0142"
              isrequired
              errors={errors}
              rules={{ required: "Batch number is required" }}
            />
            <CustomSelect
              name="product"
              control={control}
              errors={errors}
              label="Product"
              placeholder="Select product"
              isrequired
              options={PRODUCT_OPTIONS}
              rules={{ required: "Product is required" }}
            />
            <CustomSelect
              name="shift"
              control={control}
              errors={errors}
              label="Shift"
              placeholder="Select shift"
              isrequired
              options={SHIFT_OPTIONS}
              rules={{ required: "Shift is required" }}
            />
            <CustomInput
              name="operator"
              control={control}
              label="Operator"
              placeholder="Operator name"
              isrequired
              errors={errors}
              rules={{ required: "Operator is required" }}
            />
          </div>
        </div>

        {/* Section: Production targets */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 rounded-md bg-cyan-100 text-cyan-700 flex items-center justify-center text-xs font-bold">
              2
            </div>
            <h4 className="text-sm font-bold text-slate-800">
              Production Targets
            </h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <CustomInput
              name="targetUnits"
              control={control}
              label="Target Units"
              type="text"
              placeholder="500"
              isrequired
              errors={errors}
              rules={{ required: "Target is required" }}
            />
            <CustomInput
              name="inputLitres"
              control={control}
              label="Input Water (L)"
              placeholder="10000"
              isrequired
              errors={errors}
              rules={{ required: "Input is required" }}
            />
            <CustomInput
              name="expectedYield"
              control={control}
              label="Expected Yield %"
              placeholder="95"
              errors={errors}
            />
          </div>
        </div>

        {/* Section: Cost inputs */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 rounded-md bg-cyan-100 text-cyan-700 flex items-center justify-center text-xs font-bold">
              3
            </div>
            <h4 className="text-sm font-bold text-slate-800">
              Estimated Costs (Optional)
            </h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <CustomInput
              name="electricityCost"
              control={control}
              label="Electricity (₹)"
              placeholder="0"
              errors={errors}
            />
            <CustomInput
              name="laborCost"
              control={control}
              label="Labor (₹)"
              placeholder="0"
              errors={errors}
            />
            <CustomInput
              name="packagingCost"
              control={control}
              label="Packaging (₹)"
              placeholder="0"
              errors={errors}
            />
          </div>
        </div>
      </div>
    </CustomModal>
  );
};

export default AddProductionBatchModal;
