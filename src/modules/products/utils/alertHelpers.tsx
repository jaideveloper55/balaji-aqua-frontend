import React from "react";
import {
  HiOutlineBell,
  HiOutlineMail,
  HiOutlineDeviceMobile,
  HiOutlineChatAlt2,
} from "react-icons/hi";
import type { IconType } from "react-icons";
import type { AlertSeverity } from "../types/Product";

export const timeAgo = (dateStr: string): string => {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
  });
};

const CHANNEL_ICONS: { [key: string]: IconType } = {
  in_app: HiOutlineBell,
  email: HiOutlineMail,
  sms: HiOutlineDeviceMobile,
  whatsapp: HiOutlineChatAlt2,
};

export const ChannelIcon: React.FC<{ channel: string; size?: number }> = ({
  channel,
  size = 11,
}) => {
  const Icon = CHANNEL_ICONS[channel] || HiOutlineBell;
  return <Icon size={size} />;
};

export const SEVERITY_ICON_STYLES: {
  [K in AlertSeverity]: { bg: string; color: string; pulse?: boolean };
} = {
  critical: { bg: "bg-red-100", color: "text-red-500", pulse: true },
  warning: { bg: "bg-amber-100", color: "text-amber-500" },
  info: { bg: "bg-blue-100", color: "text-blue-500" },
};
