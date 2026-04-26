import React from "react";
import { Modal, Select, Divider } from "antd";
import {
  HiOutlineUser,
  HiOutlinePhone,
  HiOutlineMail,
  HiOutlineLocationMarker,
  HiOutlineCheckCircle,
} from "react-icons/hi";
import { HiUserPlus } from "react-icons/hi2";
import Field from "../Field";
import { QuickAddData } from "../../types/billing";

interface Props {
  open: boolean;
  data: QuickAddData;
  errors: Record<string, string>;
  onChange: (data: QuickAddData) => void;
  onSubmit: () => void;
  onClose: () => void;
}

const QuickAddCustomerModal: React.FC<Props> = ({
  open,
  data,
  errors,
  onChange,
  onSubmit,
  onClose,
}) => (
  <Modal
    open={open}
    onCancel={onClose}
    title={
      <div className="flex items-center gap-2">
        <HiUserPlus className="w-5 h-5 text-emerald-600" />
        <span>Quick Add Customer</span>
      </div>
    }
    footer={null}
    width={480}
  >
    <div className="space-y-3.5">
      <Field
        label="Customer Name"
        value={data.name}
        onChange={(v) => onChange({ ...data, name: v })}
        placeholder="Full name"
        required
        autoFocus
        error={errors.name}
        icon={<HiOutlineUser className="w-3.5 h-3.5" />}
      />
      <Field
        label="Phone Number"
        value={data.phone}
        onChange={(v) => onChange({ ...data, phone: v })}
        placeholder="+91 ..."
        type="tel"
        required
        error={errors.phone}
        icon={<HiOutlinePhone className="w-3.5 h-3.5" />}
      />
      <Field
        label="Email (optional)"
        value={data.email}
        onChange={(v) => onChange({ ...data, email: v })}
        placeholder="email@example.com"
        type="email"
        error={errors.email}
        icon={<HiOutlineMail className="w-3.5 h-3.5" />}
      />

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-slate-600">
          Customer Type <span className="text-red-500">*</span>
        </label>
        <Select
          value={data.type}
          onChange={(v) => onChange({ ...data, type: v })}
          size="middle"
          options={[
            { value: "Residential", label: "🏠 Residential" },
            { value: "Commercial", label: "🏢 Commercial" },
            { value: "Industrial", label: "🏭 Industrial" },
          ]}
        />
      </div>

      <Field
        label="Address (optional)"
        value={data.address}
        onChange={(v) => onChange({ ...data, address: v })}
        placeholder="Door no, street, area..."
        icon={<HiOutlineLocationMarker className="w-3.5 h-3.5" />}
      />

      <Divider className="!my-2" />

      <div className="flex gap-2">
        <button
          onClick={onClose}
          className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-[13px] font-medium hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          onClick={onSubmit}
          className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-[13px] font-semibold flex items-center justify-center gap-2 shadow-lg shadow-emerald-200"
        >
          <HiOutlineCheckCircle className="w-4 h-4" /> Add & Select
        </button>
      </div>
    </div>
  </Modal>
);

export default QuickAddCustomerModal;
