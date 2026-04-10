import React from "react";
import { Modal } from "antd";
import { useForm } from "react-hook-form";
import { HiOutlineX } from "react-icons/hi";
import { BsArrowRepeat } from "react-icons/bs";
import { Dayjs } from "dayjs";
import { ModalHeader } from "../Deliveryshared";
import type { Delivery } from "../../types/delivery";
import CustomDateRange from "../../../../components/common/CustomDateRange";
import CustomInput from "../../../../components/common/CustomInput";

interface RescheduleFormValues {
  rescheduleDate: [Dayjs | null, Dayjs | null] | null;
  reason: string;
}

interface RescheduleModalProps {
  open: boolean;
  onClose: () => void;
  delivery: Delivery | null;
}

const RescheduleModal: React.FC<RescheduleModalProps> = ({
  open,
  onClose,
  delivery,
}) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RescheduleFormValues>({
    defaultValues: { rescheduleDate: null, reason: "" },
  });

  const handleClose = () => {
    reset();
    onClose();
  };

  const onSubmit = (data: RescheduleFormValues) => {
    console.log("Reschedule:", delivery?.id, data);
    handleClose();
  };

  if (!delivery) return null;

  return (
    <Modal
      open={open}
      onCancel={handleClose}
      footer={null}
      title={null}
      width={440}
      centered
      destroyOnClose
      closeIcon={<HiOutlineX className="w-5 h-5 text-slate-400" />}
    >
      <div>
        <ModalHeader
          icon={<BsArrowRepeat className="w-5 h-5 text-purple-600" />}
          iconBg="bg-purple-100"
          title="Reschedule Delivery"
          subtitle={`${delivery.id} · ${delivery.customer}`}
          accentBorder="border-l-purple-500"
        />

        <div className="space-y-3">
          <CustomDateRange
            name="rescheduleDate"
            control={control}
            errors={errors}
            label="New Date"
            size="large"
            isrequired
            rules={{ required: "New date is required" }}
          />
          <CustomInput
            name="reason"
            control={control}
            label="Reason for reschedule"
            placeholder="Enter reason..."
            errors={errors}
            size="large"
          />
        </div>

        <div className="flex items-center justify-between gap-2 mt-5 pt-4 border-t border-slate-100">
          <p className="text-[10px] text-slate-400">
            Customer will be notified of the change
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={handleClose}
              className="px-4 py-2 text-[13px] font-medium text-slate-500 hover:bg-slate-50 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit(onSubmit)}
              className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white text-[13px] font-semibold rounded-xl transition-colors shadow-sm shadow-purple-200"
            >
              Reschedule
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default RescheduleModal;
