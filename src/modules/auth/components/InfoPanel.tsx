import React from "react";
import { TENANT_CONFIG } from "./constants";
import { IconDroplet } from "./TenantSelector";
import LiveClock from "../components/Liveclock";
import FeatureList from "../components/Featurelist";
import type { TenantId } from "../types/Auth";

interface InfoPanelProps {
  tenant: TenantId;
}

const InfoPanel: React.FC<InfoPanelProps> = ({ tenant }) => {
  const config = TENANT_CONFIG[tenant];

  return (
    <div
      className="hidden lg:flex flex-col relative overflow-hidden transition-all duration-700 p-[clamp(28px,4vw,44px)]"
      style={{
        background: `linear-gradient(160deg, ${config.gradientFrom} 0%, ${config.accent} 50%, ${config.gradientTo} 100%)`,
      }}
    >
      {/* Dot pattern */}
      <div className="absolute inset-0 opacity-[0.04] bg-[radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] bg-[length:28px_28px]" />
      <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-white opacity-[0.06]" />
      <div className="absolute -bottom-32 -left-16 w-72 h-72 rounded-full bg-white opacity-[0.04]" />

      {/* Header */}
      <div className="relative flex items-center gap-3">
        <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-white/[0.12] border border-white/10">
          <IconDroplet size={20} className="text-white" />
        </div>
        <div>
          <h2 className="text-white text-base font-extrabold tracking-tight leading-tight">
            {config.name}
          </h2>
          <p className="text-xs font-semibold text-white/40">
            {config.tagline}
          </p>
        </div>
      </div>

      {/* Body */}
      <div className="relative flex flex-col justify-center flex-1 gap-6 my-12">
        <LiveClock />
        <div>
          <h3 className="text-white font-black leading-tight tracking-tight text-[clamp(22px,2.4vw,30px)]">
            Smart Billing for Modern Delivery Operations
          </h3>
          <p className="text-xs leading-relaxed font-medium mt-3 text-white/35 max-w-xs">
            {config.description}
          </p>
        </div>
        <FeatureList features={config.features} />
      </div>
    </div>
  );
};

export default InfoPanel;
