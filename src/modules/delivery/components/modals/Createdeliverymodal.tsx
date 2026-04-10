import React from "react";
import { Modal, Divider } from "antd";
import { useForm } from "react-hook-form";
import { HiOutlinePlus, HiOutlineX } from "react-icons/hi";
import { DeliveryFormValues } from "../../types/delivery";
import { ModalHeader, SectionLabel } from "../Deliveryshared";
import CustomInput from "../../../../components/common/CustomInput";
import CustomSelect from "../../../../components/common/CustomSelect";
import { PRODUCT_OPTIONS } from "../../constants/Deliveryconstants";
import { DRIVER_OPTIONS, ROUTE_OPTIONS } from "../../data/delivery";
import CustomDateRange from "../../../../components/common/CustomDateRange";

interface CreateDeliveryModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: DeliveryFormValues) => void;
}

const CreateDeliveryModal: React.FC<CreateDeliveryModalProps> = ({
  open,
  onClose,
  onSubmit,
}) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<DeliveryFormValues>({
    defaultValues: {
      customer: "",
      product: "",
      quantity: "",
      deliveryDate: null,
      route: "",
      driver: "",
      address: "",
      phone: "",
      notes: "",
    },
  });

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleFormSubmit = (data: DeliveryFormValues) => {
    onSubmit(data);
    reset();
  };

  return (
    <Modal
      open={open}
      onCancel={handleClose}
      footer={null}
      title={null}
      width={580}
      centered
      destroyOnClose
      closeIcon={<HiOutlineX className="w-5 h-5 text-slate-400" />}
    >
      <ModalHeader
        icon={<HiOutlinePlus className="w-5 h-5 text-indigo-600" />}
        iconBg="bg-indigo-100"
        title="Create New Delivery"
        subtitle="Schedule a new delivery for a customer"
        accentBorder="border-l-indigo-500"
      />

      <form
        onSubmit={handleSubmit(handleFormSubmit)}
        className="flex flex-col gap-5"
      >
        {/* Section: Customer Details */}
        <div>
          <SectionLabel>Customer Details</SectionLabel>
          <div className="grid grid-cols-2 gap-3">
            <CustomInput
              name="customer"
              control={control}
              label="Customer Name"
              placeholder="Enter customer name"
              errors={errors}
              size="large"
              isrequired
              rules={{ required: "Customer name is required" }}
            />
            <CustomInput
              name="phone"
              control={control}
              label="Phone Number"
              placeholder="Enter phone"
              errors={errors}
              size="large"
              isrequired
              rules={{ required: "Phone is required" }}
            />
          </div>
          <div className="mt-3">
            <CustomInput
              name="address"
              control={control}
              label="Delivery Address"
              placeholder="Enter full address"
              errors={errors}
              size="large"
              isrequired
              rules={{ required: "Address is required" }}
            />
          </div>
        </div>

        <Divider className="!my-0 !border-slate-100" />

        {/* Section: Product & Quantity */}
        <div>
          <SectionLabel>Product & Quantity</SectionLabel>
          <div className="grid grid-cols-2 gap-3">
            <CustomSelect
              name="product"
              control={control}
              label="Product"
              placeholder="Select product"
              errors={errors}
              options={PRODUCT_OPTIONS}
              size="large"
              showSearch
              isrequired
              rules={{ required: "Product is required" }}
            />
            <CustomInput
              name="quantity"
              control={control}
              label="Quantity"
              placeholder="Enter qty"
              errors={errors}
              size="large"
              isrequired
              rules={{ required: "Quantity is required" }}
            />
          </div>
        </div>

        <Divider className="!my-0 !border-slate-100" />

        {/* Section: Route & Driver */}
        <div>
          <SectionLabel>Route & Assignment</SectionLabel>
          <div className="grid grid-cols-2 gap-3">
            <CustomSelect
              name="route"
              control={control}
              label="Route"
              placeholder="Select route"
              errors={errors}
              options={ROUTE_OPTIONS}
              size="large"
              showSearch
              isrequired
              rules={{ required: "Route is required" }}
            />
            <CustomSelect
              name="driver"
              control={control}
              label="Driver"
              placeholder="Assign driver"
              errors={errors}
              options={DRIVER_OPTIONS}
              size="large"
              showSearch
            />
          </div>
          <div className="mt-3">
            <CustomDateRange
              name="deliveryDate"
              control={control}
              errors={errors}
              label="Delivery Date"
              size="large"
              isrequired
              rules={{ required: "Delivery date is required" }}
            />
          </div>
        </div>

        <Divider className="!my-0 !border-slate-100" />

        {/* Section: Notes */}
        <div>
          <CustomInput
            name="notes"
            control={control}
            label="Notes (optional)"
            placeholder="Special delivery instructions..."
            errors={errors}
            size="large"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <p className="text-[10px] text-slate-400">
            Delivery will appear in the pending queue
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-[13px] font-medium text-slate-500 hover:text-slate-700 hover:bg-slate-50 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-[13px] font-semibold rounded-xl transition-colors shadow-sm shadow-indigo-200"
            >
              Create Delivery
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default CreateDeliveryModal;
