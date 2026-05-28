import React from "react";
import { useForm } from "react-hook-form";
import { Dayjs } from "dayjs";
import dayjs from "dayjs";
import { HiOutlineCalendar } from "react-icons/hi";
import CustomDateRange from "../../../../components/common/CustomDateRange";
import { PERIOD_OPTIONS } from "../../constants/Reports.constants";
import { ReportPeriod } from "../../types/Reports";


interface Props {
  period: ReportPeriod;
  onPeriodChange: (p: ReportPeriod) => void;
  onCustomRange?: (range: [Dayjs | null, Dayjs | null]) => void;
}

interface FilterForm {
  dateRange: [Dayjs | null, Dayjs | null] | null;
}

const ReportFilters: React.FC<Props> = ({
  period,
  onPeriodChange,
  onCustomRange,
}) => {
  const {
    control,
    formState: { errors },
  } = useForm<FilterForm>({
    defaultValues: {
      dateRange: [dayjs().subtract(29, "day"), dayjs()],
    },
  });

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
      <div className="flex flex-col md:flex-row md:items-center gap-3">
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 text-blue-600 flex items-center justify-center">
            <HiOutlineCalendar size={16} />
          </div>
          <div>
            <p className="text-[13px] font-bold text-slate-800 leading-tight">
              Time Period
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Filter all reports below
            </p>
          </div>
        </div>

        <div className="flex-1 flex items-center gap-1 bg-slate-50 p-1 rounded-lg overflow-x-auto">
          {PERIOD_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => onPeriodChange(opt.value)}
              className={`px-3 py-2 rounded-md text-xs font-semibold whitespace-nowrap transition-all ${
                period === opt.value
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {period === "custom" && (
          <div className="w-full md:w-64 shrink-0">
            <CustomDateRange
              name="dateRange"
              control={control}
              errors={errors}
              placeholder={["From", "To"]}
              size="middle"
              onChange={onCustomRange}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportFilters;
