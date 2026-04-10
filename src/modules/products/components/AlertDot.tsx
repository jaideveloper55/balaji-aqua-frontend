import React from "react";

type AlertSeverity = "critical" | "warning" | "info";

const SEVERITY_COLORS: { [K in AlertSeverity]: string } = {
  critical: "bg-red-500",
  warning: "bg-amber-400",
  info: "bg-blue-400",
};

interface AlertDotProps {
  severity: AlertSeverity;
}

const AlertDot: React.FC<AlertDotProps> = ({ severity }) => {
  const color = SEVERITY_COLORS[severity];

  return (
    <span className="relative flex h-2.5 w-2.5">
      <span
        className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${color}`}
      />
      <span
        className={`relative inline-flex rounded-full h-2.5 w-2.5 ${color}`}
      />
    </span>
  );
};

export default AlertDot;
