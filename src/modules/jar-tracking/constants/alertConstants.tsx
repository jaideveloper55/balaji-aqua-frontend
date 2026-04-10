import React from "react";
import {
  HiOutlineExclamationCircle,
  HiOutlineExclamation,
  HiOutlineInformationCircle,
} from "react-icons/hi";
import type { AlertSeverity } from "../types/JarTracking";

export type SeverityConfig = {
  icon: React.ReactNode;
  bg: string;
  border: string;
  hoverShadow: string;
  iconColor: string;
  iconBg: string;
  badge: string;
  badgeText: string;
  pulse?: boolean;
};

export const SEVERITY_CONFIG: Record<AlertSeverity, SeverityConfig> = {
  critical: {
    icon: <HiOutlineExclamationCircle size={18} />,
    bg: "bg-red-50/60",
    border: "border-red-200",
    hoverShadow: "hover:shadow-red-100/50",
    iconColor: "text-red-500",
    iconBg: "bg-red-100",
    badge: "bg-red-100 text-red-700",
    badgeText: "Critical",
    pulse: true,
  },
  warning: {
    icon: <HiOutlineExclamation size={18} />,
    bg: "bg-amber-50/60",
    border: "border-amber-200",
    hoverShadow: "hover:shadow-amber-100/50",
    iconColor: "text-amber-500",
    iconBg: "bg-amber-100",
    badge: "bg-amber-100 text-amber-700",
    badgeText: "Warning",
  },
  info: {
    icon: <HiOutlineInformationCircle size={18} />,
    bg: "bg-blue-50/60",
    border: "border-blue-200",
    hoverShadow: "hover:shadow-blue-100/50",
    iconColor: "text-blue-500",
    iconBg: "bg-blue-100",
    badge: "bg-blue-100 text-blue-700",
    badgeText: "Info",
  },
};

export const SEVERITY_ORDER: Record<AlertSeverity, number> = {
  critical: 0,
  warning: 1,
  info: 2,
};
