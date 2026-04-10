import React from "react";
import {
  HiOutlineExclamationCircle,
  HiOutlineExclamation,
} from "react-icons/hi";

interface AlertSeverityStatsProps {
  criticalCount: number;
  warningCount: number;
}

const AlertSeverityStats: React.FC<AlertSeverityStatsProps> = ({
  criticalCount,
  warningCount,
}) => {
  if (criticalCount === 0 && warningCount === 0) return null;

  return (
    <div className="flex items-center gap-3 mb-1">
      {criticalCount > 0 && (
        <span className="flex items-center gap-1.5 text-[11px] font-bold text-red-600 bg-red-50 px-2.5 py-1 rounded-full ring-1 ring-red-100 animate-pulse">
          <HiOutlineExclamationCircle size={13} />
          {criticalCount} Critical
        </span>
      )}
      {warningCount > 0 && (
        <span className="flex items-center gap-1.5 text-[11px] font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full ring-1 ring-amber-100">
          <HiOutlineExclamation size={13} />
          {warningCount} Warning{warningCount > 1 ? "s" : ""}
        </span>
      )}
    </div>
  );
};

export default AlertSeverityStats;
