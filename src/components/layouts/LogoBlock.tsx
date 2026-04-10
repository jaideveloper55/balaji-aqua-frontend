import React from "react";
import type { OrgConfig } from "../../config/orgConfig";

interface LogoBlockProps {
  config: OrgConfig;
  showText: boolean;
  onClick?: () => void;
}

const LogoBlock: React.FC<LogoBlockProps> = ({ config, showText, onClick }) => {
  const LogoIcon = config.logoIcon;
  const { theme } = config;

  return (
    <div className="flex items-center gap-3 cursor-pointer" onClick={onClick}>
      <div
        className={`w-9 h-9 bg-gradient-to-br ${theme.gradientFrom} ${theme.gradientTo} rounded-xl flex items-center justify-center shrink-0 shadow-md`}
        style={{ boxShadow: `0 4px 12px ${theme.primary}33` }}
      >
        <LogoIcon className="text-white" size={17} />
      </div>
      <div
        className="overflow-hidden whitespace-nowrap"
        style={{
          opacity: showText ? 1 : 0,
          maxWidth: showText ? 180 : 0,
          transition: "opacity 0.2s ease, max-width 0.25s ease",
        }}
      >
        <p className="text-sm font-bold text-gray-900 leading-tight">
          {config.name}
        </p>
        <p
          className={`text-[10px] ${theme.accentText} font-semibold tracking-wide`}
        >
          {config.subtitle}
        </p>
      </div>
    </div>
  );
};

export default LogoBlock;
