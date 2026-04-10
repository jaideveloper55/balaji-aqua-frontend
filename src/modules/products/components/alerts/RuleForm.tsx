import React from "react";
import { useForm } from "react-hook-form";
import { Button, Divider } from "antd";
import { HiOutlineLightningBolt } from "react-icons/hi";
import CustomInput from "../../../../components/common/CustomInput";
import CustomSelect from "../../../../components/common/CustomSelect";
import type { AlertRuleFormValues, AlertTrigger } from "../../types/Product";
import {
  ALERT_TRIGGER_MAP,
  ALERT_CHANNEL_MAP,
  TRIGGER_OPTIONS,
  SEVERITY_OPTIONS,
  CHANNEL_OPTIONS,
  ALERT_CATEGORY_OPTIONS,
} from "../../constants/productConstants";
import { needsThreshold, thresholdLabel } from "../../utils/ruleHelpers";
import { ChannelIcon } from "../../utils/alertHelpers";

const DEFAULT_VALUES: AlertRuleFormValues = {
  name: "",
  trigger: "stock_below_min",
  severity: "warning",
  channels: ["in_app"],
  threshold: "",
  categories: "all",
  recipients: "admin@balajaqua.com",
};

interface RuleFormProps {
  defaultValues?: Partial<AlertRuleFormValues>;
  onSubmit: (data: AlertRuleFormValues) => void;
  onCancel: () => void;
  isEdit?: boolean;
}

const RuleForm: React.FC<RuleFormProps> = ({
  defaultValues,
  onSubmit,
  onCancel,
  isEdit,
}) => {
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<AlertRuleFormValues>({
    defaultValues: { ...DEFAULT_VALUES, ...defaultValues },
  });

  const selectedTrigger = watch("trigger") as AlertTrigger;
  const showThreshold = needsThreshold(selectedTrigger);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <CustomInput
        name="name"
        control={control}
        label="Rule Name"
        placeholder="e.g. Low Stock Warning"
        errors={errors}
        isrequired
        rules={{ required: "Rule name is required" }}
      />

      <CustomSelect
        name="trigger"
        control={control}
        errors={errors}
        label="Trigger Condition"
        placeholder="Select trigger"
        options={TRIGGER_OPTIONS}
        isrequired
        size="middle"
        rules={{ required: "Trigger is required" }}
      />

      {selectedTrigger && (
        <div className="flex items-start gap-2.5 px-3.5 py-3 rounded-xl bg-blue-50 border border-blue-100">
          <div className="w-6 h-6 rounded-lg bg-blue-100 flex items-center justify-center shrink-0 mt-0.5">
            <HiOutlineLightningBolt size={12} className="text-blue-500" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-blue-700">
              {ALERT_TRIGGER_MAP[selectedTrigger].label}
            </p>
            <p className="text-[10px] text-blue-600/70 leading-relaxed">
              {ALERT_TRIGGER_MAP[selectedTrigger].description}
            </p>
          </div>
        </div>
      )}

      {showThreshold && (
        <CustomInput
          name="threshold"
          control={control}
          label={thresholdLabel(selectedTrigger)}
          placeholder="Enter value"
          errors={errors}
          isrequired
          rules={{ required: "Threshold is required" }}
        />
      )}

      <Divider className="!my-0 !border-slate-100" />

      <CustomSelect
        name="severity"
        control={control}
        errors={errors}
        label="Severity Level"
        placeholder="Select severity"
        options={SEVERITY_OPTIONS}
        isrequired
        size="middle"
        rules={{ required: "Severity is required" }}
      />

      <CustomSelect
        name="channels"
        control={control}
        errors={errors}
        label="Notification Channels"
        placeholder="Select channels"
        options={CHANNEL_OPTIONS}
        isrequired
        size="middle"
        mode="multiple"
        rules={{ required: "Select at least one channel" }}
      />

      <CustomSelect
        name="categories"
        control={control}
        errors={errors}
        label="Apply to Categories"
        placeholder="Select categories"
        options={ALERT_CATEGORY_OPTIONS}
        size="middle"
      />

      <CustomInput
        name="recipients"
        control={control}
        label="Recipients (comma-separated)"
        placeholder="admin@company.com, manager@company.com"
        errors={errors}
      />

      {/* Channel reference */}
      <div className="rounded-xl bg-slate-50 border border-slate-100 p-3.5">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2.5">
          Channel Reference
        </p>
        <div className="space-y-1.5">
          {Object.entries(ALERT_CHANNEL_MAP).map(([key, ch]) => (
            <div key={key} className="flex items-center gap-2 text-[11px]">
              <ChannelIcon channel={key} />
              <span className="font-medium text-slate-600">{ch.label}</span>
              <span className="text-slate-400">— {ch.description}</span>
            </div>
          ))}
        </div>
        <p className="text-[9px] text-slate-400 mt-2.5 italic leading-relaxed">
          Email & SMS/WhatsApp channels will be activated in a future update.
          In-app notifications work immediately.
        </p>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-slate-100">
        <p className="text-[10px] text-slate-400">
          {isEdit
            ? "Changes apply immediately"
            : "Rule will start monitoring right away"}
        </p>
        <div className="flex items-center gap-3">
          <Button size="middle" onClick={onCancel} className="!rounded-lg">
            Cancel
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            size="middle"
            className="!bg-blue-600 hover:!bg-blue-700 !rounded-lg !font-semibold !shadow-sm !shadow-blue-200"
          >
            {isEdit ? "Update Rule" : "Create Rule"}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default RuleForm;
