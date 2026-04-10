import React from "react";
import { Tooltip } from "antd";
import { STATUS_MAP } from "../constants/Deliveryconstants";
import type { DeliveryStatus } from "../types/delivery";

interface StatusPillProps {
  status: DeliveryStatus | string;
}

export const StatusPill: React.FC<StatusPillProps> = ({ status }) => {
  const cfg = STATUS_MAP[status as DeliveryStatus];
  if (!cfg) return null;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-[3px] rounded-full text-[11px] font-semibold leading-none ${cfg.color} ${cfg.bg}`}
    >
      <span
        className={`w-[5px] h-[5px] rounded-full ${cfg.dot} ${
          status === "out" ? "animate-pulse" : ""
        }`}
      />
      {cfg.label}
    </span>
  );
};

/*  DriverAvatar*/

type AvatarSize = "sm" | "md" | "lg";

const AVATAR_SIZE_CLASSES: Record<AvatarSize, string> = {
  sm: "w-6 h-6 text-[9px]",
  md: "w-8 h-8 text-[10px]",
  lg: "w-10 h-10 text-xs",
};

interface DriverAvatarProps {
  name: string;
  size?: AvatarSize;
  showTooltip?: boolean;
}

export const DriverAvatar: React.FC<DriverAvatarProps> = ({
  name,
  size = "sm",
  showTooltip = false,
}) => {
  const initials = name
    .trim()
    .split(/\s+/)
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const avatar = (
    <div
      className={`${AVATAR_SIZE_CLASSES[size]} rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center shrink-0 transition-transform duration-200 hover:scale-110`}
      aria-label={name}
    >
      {initials}
    </div>
  );

  return showTooltip ? <Tooltip title={name}>{avatar}</Tooltip> : avatar;
};

/* ------------------------------------------------------------------ */
/*  SectionLabel                                                      */
/* ------------------------------------------------------------------ */

interface SectionLabelProps {
  children: React.ReactNode;
}

export const SectionLabel: React.FC<SectionLabelProps> = ({ children }) => (
  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">
    {children}
  </p>
);

/* ------------------------------------------------------------------ */
/*  ModalHeader                                                       */
/* ------------------------------------------------------------------ */

interface ModalHeaderProps {
  icon: React.ReactNode;
  iconBg: string;
  title: string;
  subtitle: string;
  accentBorder?: string;
}

export const ModalHeader: React.FC<ModalHeaderProps> = ({
  icon,
  iconBg,
  title,
  subtitle,
  accentBorder,
}) => (
  <div
    className={`flex items-center gap-3.5 mb-5 ${
      accentBorder ? `pl-4 border-l-[3px] ${accentBorder}` : ""
    }`}
  >
    <div
      className={`w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center shrink-0 transition-transform duration-300 hover:scale-105`}
    >
      {icon}
    </div>
    <div>
      <h3 className="text-[15px] font-bold text-slate-800">{title}</h3>
      <p className="text-[11px] text-slate-400 leading-relaxed">{subtitle}</p>
    </div>
  </div>
);
