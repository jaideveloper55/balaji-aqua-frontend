import React, { useMemo } from "react";
import type { JarAlert } from "../types/JarTracking";
import { SEVERITY_ORDER } from "../constants/alertConstants";
import AlertsEmptyState from "./alerts/AlertsEmptyState";
import AlertSeverityStats from "./alerts/AlertSeverityStats";
import AlertItem from "./alerts/AlertItem";

interface AlertsSectionProps {
  alerts: JarAlert[];
  onAlertClick?: (alert: JarAlert) => void;
}

const AlertsSection: React.FC<AlertsSectionProps> = ({
  alerts,
  onAlertClick,
}) => {
  const { sorted, criticalCount, warningCount } = useMemo(() => {
    const sortedAlerts = [...alerts].sort(
      (a, b) => SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity]
    );
    return {
      sorted: sortedAlerts,
      criticalCount: alerts.filter((a) => a.severity === "critical").length,
      warningCount: alerts.filter((a) => a.severity === "warning").length,
    };
  }, [alerts]);

  if (alerts.length === 0) {
    return <AlertsEmptyState />;
  }

  return (
    <div className="flex flex-col gap-3">
      <AlertSeverityStats
        criticalCount={criticalCount}
        warningCount={warningCount}
      />

      <div className="flex flex-col gap-2">
        {sorted.map((alert) => (
          <AlertItem key={alert.id} alert={alert} onClick={onAlertClick} />
        ))}
      </div>
    </div>
  );
};

export default AlertsSection;
