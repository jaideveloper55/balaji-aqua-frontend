import React from "react";
import { Switch, Tooltip } from "antd";
import { HiOutlinePencil, HiOutlineTrash } from "react-icons/hi";
import type { AlertRule } from "../../types/Product";
import {
  ALERT_TRIGGER_MAP,
  ALERT_SEVERITY_MAP,
  ALERT_CHANNEL_MAP,
} from "../../constants/productConstants";
import { thresholdSuffix, formatCategories } from "../../utils/ruleHelpers";
import { ChannelIcon } from "../../utils/alertHelpers";

interface RuleCardProps {
  rule: AlertRule;
  onEdit: (rule: AlertRule) => void;
  onToggle: (id: string, enabled: boolean) => void;
  onDelete: (id: string) => void;
}

const RuleCard: React.FC<RuleCardProps> = ({
  rule,
  onEdit,
  onToggle,
  onDelete,
}) => {
  const trigger = ALERT_TRIGGER_MAP[rule.trigger];
  const severity = ALERT_SEVERITY_MAP[rule.severity];

  return (
    <div
      className={`rounded-2xl border p-4 transition-all duration-200 ${
        rule.enabled
          ? "bg-white border-slate-200 hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5"
          : "bg-slate-50/50 border-slate-100 opacity-60"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <span className="text-lg mt-0.5">{trigger.icon}</span>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="text-[12px] font-bold text-slate-800 truncate">
                {rule.name}
              </h4>
              <span
                className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-[2px] rounded-md"
                style={{ background: severity.bg, color: severity.color }}
              >
                {severity.label}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              {trigger.description}
            </p>

            {rule.threshold !== undefined && (
              <p className="text-[10px] text-slate-400 mt-1.5 font-mono bg-slate-50 px-2 py-0.5 rounded inline-block">
                Threshold:{" "}
                <span className="text-slate-600 font-semibold">
                  {rule.threshold}
                </span>
                {thresholdSuffix(rule.trigger)}
              </p>
            )}

            <div className="flex items-center gap-1 mt-2">
              {rule.channels.map((ch) => (
                <span
                  key={ch}
                  className="inline-flex items-center gap-1 text-[9px] font-medium text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded-md"
                >
                  <ChannelIcon channel={ch} />
                  {ALERT_CHANNEL_MAP[ch].label}
                </span>
              ))}
            </div>

            <p className="text-[10px] text-slate-400 mt-1.5">
              Applies to:{" "}
              <span className="font-semibold text-slate-500">
                {formatCategories(rule.categories)}
              </span>
            </p>

            <div className="flex items-center gap-3 mt-2">
              <span className="text-[10px] text-slate-400">
                Triggered{" "}
                <span className="font-bold text-slate-600 tabular-nums">
                  {rule.triggerCount}
                </span>{" "}
                times
              </span>
              {rule.lastTriggeredAt && (
                <span className="text-[10px] text-slate-400 tabular-nums">
                  Last:{" "}
                  {new Date(rule.lastTriggeredAt).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                  })}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end gap-2 shrink-0">
          <Switch
            size="small"
            checked={rule.enabled}
            onChange={(checked) => onToggle(rule.id, checked)}
          />
          <div className="flex items-center gap-1">
            <Tooltip title="Edit rule">
              <button
                onClick={() => onEdit(rule)}
                className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-blue-600 transition-colors"
              >
                <HiOutlinePencil size={13} />
              </button>
            </Tooltip>
            <Tooltip title="Delete rule">
              <button
                onClick={() => onDelete(rule.id)}
                className="p-1.5 rounded-xl hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors"
              >
                <HiOutlineTrash size={13} />
              </button>
            </Tooltip>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RuleCard;
