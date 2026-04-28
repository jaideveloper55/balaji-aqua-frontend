import { ReactNode } from "react";
import { Button } from "antd";

type EmptyTone = "blue" | "slate" | "amber" | "red" | "green";

interface CustomEmptyProps {
  icon: ReactNode;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  actionIcon?: ReactNode;
  tone?: EmptyTone;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const TONE_MAP: Record<EmptyTone, string> = {
  blue: "bg-blue-50 text-blue-600",
  slate: "bg-slate-100 text-slate-500",
  amber: "bg-amber-50 text-amber-600",
  red: "bg-red-50 text-red-600",
  green: "bg-emerald-50 text-emerald-600",
};

const SIZE_MAP = {
  sm: { wrapper: "py-10", icon: "w-12 h-12", iconSize: 22, title: "text-sm" },
  md: { wrapper: "py-16", icon: "w-14 h-14", iconSize: 26, title: "text-base" },
  lg: { wrapper: "py-20", icon: "w-16 h-16", iconSize: 30, title: "text-lg" },
};

const CustomEmpty = ({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  actionIcon,
  tone = "blue",
  size = "md",
  className = "",
}: CustomEmptyProps) => {
  const s = SIZE_MAP[size];

  return (
    <div className={`flex flex-col items-center ${s.wrapper} ${className}`}>
      <div
        className={`${s.icon} rounded-full ${TONE_MAP[tone]} flex items-center justify-center mb-4`}
      >
        {icon}
      </div>

      <h3 className={`${s.title} font-semibold text-slate-900`}>{title}</h3>

      {description && (
        <p className="text-sm text-slate-500 mt-1.5 mb-5 max-w-sm text-center px-4">
          {description}
        </p>
      )}

      {actionLabel && onAction && (
        <Button
          type="primary"
          size="large"
          icon={actionIcon}
          onClick={onAction}
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default CustomEmpty;
