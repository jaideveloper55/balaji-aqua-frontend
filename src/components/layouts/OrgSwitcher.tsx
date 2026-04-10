import React from "react";
import { BsArrowLeftRight } from "react-icons/bs";
import type { OrgConfig } from "../../config/orgConfig";

interface OrgSwitcherProps {
  orgs: OrgConfig[];
  onSwitch: (orgId: string) => void;
  variant?: "dropdown" | "drawer";
}

const OrgSwitcher: React.FC<OrgSwitcherProps> = ({
  orgs,
  onSwitch,
  variant = "dropdown",
}) => {
  if (orgs.length === 0) return null;

  const showHeading = variant === "dropdown";

  return (
    <div
      className={
        variant === "dropdown" ? "p-1.5 border-b border-gray-100" : "px-3 pb-1"
      }
    >
      {showHeading && (
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-3 pt-1.5 pb-1">
          Switch Organization
        </p>
      )}
      {orgs.map((org) => {
        const OrgLogo = org.logoIcon;
        return (
          <button
            key={org.id}
            onClick={() => onSwitch(org.id)}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition-colors"
          >
            <div
              className={`w-8 h-8 bg-gradient-to-br ${org.theme.gradientFrom} ${org.theme.gradientTo} rounded-lg flex items-center justify-center shrink-0`}
            >
              <OrgLogo className="text-white" size={14} />
            </div>
            <div className="text-left flex-1 min-w-0">
              <p className="font-medium text-gray-700 truncate leading-tight">
                {variant === "drawer" ? `Switch to ${org.name}` : org.name}
              </p>
              <p className="text-[10px] text-gray-400 truncate">
                {org.subtitle}
              </p>
            </div>
            <BsArrowLeftRight className="w-3.5 h-3.5 text-gray-300 shrink-0" />
          </button>
        );
      })}
    </div>
  );
};

export default OrgSwitcher;
