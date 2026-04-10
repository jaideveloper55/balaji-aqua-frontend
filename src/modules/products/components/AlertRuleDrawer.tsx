import React, { useState } from "react";
import {
  HiOutlineX,
  HiOutlineBell,
  HiOutlinePlus,
  HiOutlineChevronLeft,
} from "react-icons/hi";
import type {
  AlertRule,
  AlertRuleFormValues,
  ProductCategory,
} from "../types/Product";
import { generateRuleId } from "../utils/ruleHelpers";
import RuleCard from "./alerts/RuleCard";
import RuleForm from "./alerts/RuleForm";
import RulesEmptyState from "./alerts/RulesEmptyState";

type DrawerView = "list" | "create" | "edit";

interface AlertRuleDrawerProps {
  open: boolean;
  onClose: () => void;
  rules: AlertRule[];
  onUpdateRules: (rules: AlertRule[]) => void;
}

const normalizeChannels = (channels: AlertRuleFormValues["channels"]) =>
  Array.isArray(channels) ? channels : [channels];

const normalizeCategories = (
  categories: AlertRuleFormValues["categories"]
): "all" | ProductCategory[] =>
  categories === "all" ? "all" : [categories as ProductCategory];

const normalizeRecipients = (recipients: string) =>
  recipients
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

const AlertRuleDrawer: React.FC<AlertRuleDrawerProps> = ({
  open,
  onClose,
  rules,
  onUpdateRules,
}) => {
  const [view, setView] = useState<DrawerView>("list");
  const [editingRule, setEditingRule] = useState<AlertRule | null>(null);

  if (!open) return null;

  const handleToggle = (id: string, enabled: boolean) => {
    onUpdateRules(
      rules.map((r) =>
        r.id === id
          ? { ...r, enabled, status: enabled ? "active" : "paused" }
          : r
      )
    );
  };

  const handleDelete = (id: string) => {
    onUpdateRules(rules.filter((r) => r.id !== id));
  };

  const handleEdit = (rule: AlertRule) => {
    setEditingRule(rule);
    setView("edit");
  };

  const goBack = () => {
    setView("list");
    setEditingRule(null);
  };

  const handleSubmitCreate = (data: AlertRuleFormValues) => {
    const newRule: AlertRule = {
      id: generateRuleId(rules.length),
      name: data.name,
      trigger: data.trigger,
      severity: data.severity,
      channels: normalizeChannels(data.channels),
      enabled: true,
      status: "active",
      threshold: data.threshold ? Number(data.threshold) : undefined,
      categories: normalizeCategories(data.categories),
      recipients: normalizeRecipients(data.recipients),
      createdAt: new Date().toISOString(),
      triggerCount: 0,
    };
    onUpdateRules([...rules, newRule]);
    goBack();
  };

  const handleSubmitEdit = (data: AlertRuleFormValues) => {
    if (!editingRule) return;
    onUpdateRules(
      rules.map((r) =>
        r.id === editingRule.id
          ? {
              ...r,
              name: data.name,
              trigger: data.trigger,
              severity: data.severity,
              channels: normalizeChannels(data.channels),
              threshold: data.threshold ? Number(data.threshold) : undefined,
              categories: normalizeCategories(data.categories),
              recipients: normalizeRecipients(data.recipients),
            }
          : r
      )
    );
    goBack();
  };

  const enabledCount = rules.filter((r) => r.enabled).length;

  const headerTitle =
    view === "list"
      ? "Alert Rules"
      : view === "create"
      ? "New Alert Rule"
      : "Edit Alert Rule";

  const headerSubtitle =
    view === "list"
      ? `${enabledCount} active of ${rules.length} rules`
      : "Configure when and how to get notified";

  return (
    <>
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 animate-fadeIn"
        onClick={onClose}
      />

      <div className="fixed right-0 top-0 h-full w-full max-w-[520px] bg-white z-50 shadow-2xl flex flex-col overflow-hidden animate-slideIn">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/80">
          <div className="flex items-center gap-3">
            {view !== "list" && (
              <button
                onClick={goBack}
                className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors mr-1"
                aria-label="Go back"
              >
                <HiOutlineChevronLeft size={16} />
              </button>
            )}
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <HiOutlineBell className="text-lg" />
            </div>
            <div>
              <h2 className="text-[14px] font-bold text-slate-800">
                {headerTitle}
              </h2>
              <p className="text-[11px] text-slate-400">{headerSubtitle}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
            aria-label="Close drawer"
          >
            <HiOutlineX className="text-lg" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {view === "list" && (
            <div className="space-y-3">
              <button
                onClick={() => setView("create")}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl border-2 border-dashed border-slate-200 text-[12px] font-semibold text-slate-500 hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50/30 transition-all duration-200"
              >
                <HiOutlinePlus size={15} /> Add New Alert Rule
              </button>

              {rules.length === 0 ? (
                <RulesEmptyState />
              ) : (
                rules.map((rule) => (
                  <RuleCard
                    key={rule.id}
                    rule={rule}
                    onEdit={handleEdit}
                    onToggle={handleToggle}
                    onDelete={handleDelete}
                  />
                ))
              )}
            </div>
          )}

          {view === "create" && (
            <RuleForm onSubmit={handleSubmitCreate} onCancel={goBack} />
          )}

          {view === "edit" && editingRule && (
            <RuleForm
              defaultValues={{
                name: editingRule.name,
                trigger: editingRule.trigger,
                severity: editingRule.severity,
                channels: editingRule.channels,
                threshold: editingRule.threshold ?? "",
                categories:
                  editingRule.categories === "all"
                    ? "all"
                    : (editingRule.categories as string[])[0] ?? "all",
                recipients: editingRule.recipients.join(", "),
              }}
              onSubmit={handleSubmitEdit}
              onCancel={goBack}
              isEdit
            />
          )}
        </div>
      </div>
    </>
  );
};

export default AlertRuleDrawer;
