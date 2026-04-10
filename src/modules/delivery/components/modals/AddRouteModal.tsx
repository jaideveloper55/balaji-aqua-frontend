import React from "react";
import { Modal } from "antd";
import { useForm } from "react-hook-form";
import { HiOutlineX } from "react-icons/hi";
import { RiRouteLine } from "react-icons/ri";
import { ModalHeader } from "../Deliveryshared";
import { DRIVER_OPTIONS } from "../../data/delivery";
import CustomInput from "../../../../components/common/CustomInput";
import CustomSelect from "../../../../components/common/CustomSelect";

interface AddRouteFormValues {
  routeName: string;
  area: string;
  driver: string;
}

interface AddRouteModalProps {
  open: boolean;
  onClose: () => void;
}

const AddRouteModal: React.FC<AddRouteModalProps> = ({ open, onClose }) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AddRouteFormValues>({
    defaultValues: { routeName: "", area: "", driver: "" },
  });

  const handleClose = () => {
    reset();
    onClose();
  };

  const onSubmit = (data: AddRouteFormValues) => {
    console.log("Add route:", data);
    handleClose();
  };

  return (
    <Modal
      open={open}
      onCancel={handleClose}
      footer={null}
      title={null}
      width={480}
      centered
      destroyOnClose
      closeIcon={<HiOutlineX className="w-5 h-5 text-slate-400" />}
    >
      <ModalHeader
        icon={<RiRouteLine className="w-5 h-5 text-indigo-600" />}
        iconBg="bg-indigo-100"
        title="Add New Route"
        subtitle="Create a new delivery route"
        accentBorder="border-l-indigo-500"
      />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5">
        <CustomInput
          name="routeName"
          control={control}
          label="Route Name"
          placeholder="e.g. Route E"
          errors={errors}
          size="large"
          isrequired
          rules={{ required: "Route name is required" }}
        />
        <CustomInput
          name="area"
          control={control}
          label="Area Coverage"
          placeholder="e.g. Sector 10, Main Street"
          errors={errors}
          size="large"
          isrequired
          rules={{ required: "Area is required" }}
        />
        <CustomSelect
          name="driver"
          control={control}
          label="Assign Driver"
          placeholder="Select driver"
          errors={errors}
          options={DRIVER_OPTIONS}
          size="large"
          showSearch
          isrequired
          rules={{ required: "Driver is required" }}
        />

        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <p className="text-[10px] text-slate-400">
            Route will be available for assignment immediately
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-[13px] font-medium text-slate-500 hover:bg-slate-50 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-[13px] font-semibold rounded-xl transition-colors shadow-sm shadow-indigo-200"
            >
              Add Route
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default AddRouteModal;
