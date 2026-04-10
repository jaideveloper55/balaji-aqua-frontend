import React from "react";
import {
  HiOutlineExclamationCircle,
  HiOutlineExclamation,
  HiOutlineInformationCircle,
} from "react-icons/hi";
import type { AlertSeverity } from "../../types/Product";
import { SEVERITY_ICON_STYLES } from "../../utils/alertHelpers";

const ICON_MAP = {
  critical: HiOutlineExclamationCircle,
  warning: HiOutlineExclamation,
  info: HiOutlineInformationCircle,
};

interface SeverityIconProps {
  severity: AlertSeverity;
}

const SeverityIcon: React.FC<SeverityIconProps> = ({ severity }) => {
  const Icon = ICON_MAP[severity];
  const style = SEVERITY_ICON_STYLES[severity];

  return (
    <div
      className={`w-7 h-7 rounded-lg ${style.bg} flex items-center justify-center shrink-0`}
    >
      <Icon
        size={15}
        className={`${style.color} ${style.pulse ? "animate-pulse" : ""}`}
      />
    </div>
  );
};

export default SeverityIcon;
