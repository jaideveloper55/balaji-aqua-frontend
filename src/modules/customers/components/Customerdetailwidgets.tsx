import React from "react";
import { Button, Skeleton, Tooltip } from "antd";
import { HiOutlineArrowLeft, HiOutlineExclamationCircle } from "react-icons/hi";

interface InfoRowProps {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}
export const InfoRow: React.FC<InfoRowProps> = ({ icon, label, value }) => (
  <div className="flex items-start gap-3 py-3">
    <span className="text-slate-400 mt-0.5 shrink-0">{icon}</span>
    <div className="flex-1 min-w-0">
      <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
        {label}
      </p>
      <p className="text-[13px] font-medium text-slate-700 mt-0.5 leading-relaxed">
        {value}
      </p>
    </div>
  </div>
);

interface MetricProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: string;
  tooltip?: string;
  alert?: boolean;
}
export const Metric: React.FC<MetricProps> = ({
  icon,
  label,
  value,
  color,
  tooltip,
  alert = false,
}) => {
  const card = (
    <div
      className={`group relative bg-white rounded-2xl border overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 cursor-default ${
        alert
          ? "border-red-200/60 hover:shadow-red-100/50"
          : "border-slate-100 hover:shadow-slate-200/50"
      }`}
    >
      <div
        className="absolute top-0 left-0 right-0 h-[2.5px] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ backgroundColor: color }}
      />
      <div className="flex flex-col items-center gap-2.5 py-5 px-4">
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
          style={{ backgroundColor: `${color}15`, color }}
        >
          {icon}
        </div>
        <span className="text-[22px] font-extrabold text-slate-800 tabular-nums leading-none tracking-tight">
          {value}
        </span>
        <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">
          {label}
        </span>
      </div>
    </div>
  );
  return tooltip ? (
    <Tooltip title={tooltip} placement="bottom">
      {card}
    </Tooltip>
  ) : (
    card
  );
};

interface InfoSectionProps {
  title: string;
  children: React.ReactNode;
}
export const InfoSection: React.FC<InfoSectionProps> = ({
  title,
  children,
}) => (
  <div className="bg-slate-50/50 rounded-2xl p-5 border border-slate-100 shadow-sm shadow-slate-100/50">
    <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2">
      {title}
    </h4>
    <div className="divide-y divide-slate-100">{children}</div>
  </div>
);

export const DetailSkeleton: React.FC = () => (
  <div className="p-6 max-w-[1400px] mx-auto space-y-6">
    <Skeleton active paragraph={{ rows: 2 }} />
    <div className="grid grid-cols-4 gap-4">
      {[1, 2, 3, 4].map((i) => (
        <Skeleton.Node key={i} active className="!w-full !h-24 !rounded-2xl" />
      ))}
    </div>
    <Skeleton active paragraph={{ rows: 8 }} />
  </div>
);

interface NotFoundProps {
  onBack?: () => void;
}
export const NotFound: React.FC<NotFoundProps> = ({ onBack }) => (
  <div className="p-6 max-w-[1400px] mx-auto flex flex-col items-center justify-center py-24 gap-4">
    <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center">
      <HiOutlineExclamationCircle className="w-8 h-8 text-slate-300" />
    </div>
    <div className="text-center">
      <p className="text-[15px] font-bold text-slate-600">Customer not found</p>
      <p className="text-[12px] text-slate-400 mt-1">
        The customer may have been removed or the ID is invalid
      </p>
    </div>
    <Button
      icon={<HiOutlineArrowLeft size={14} />}
      onClick={onBack}
      className="!rounded-xl mt-2"
    >
      Go Back
    </Button>
  </div>
);
