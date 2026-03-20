import React from "react";
import {
  HiOutlineTruck,
  HiOutlineChartBar,
  HiOutlineDeviceMobile,
  HiOutlineCube,
  HiOutlineTrendingUp,
} from "react-icons/hi";
import {
  IoWaterOutline,
  IoGiftOutline,
  IoPeopleOutline,
} from "react-icons/io5";
import type { TenantFeature } from "../types/Auth";

const ICON_MAP: Record<string, React.ReactNode> = {
  truck: <HiOutlineTruck size={20} />,
  droplet: <IoWaterOutline size={20} />,
  chart: <HiOutlineChartBar size={20} />,
  phone: <HiOutlineDeviceMobile size={20} />,
  cube: <HiOutlineCube size={20} />,
  package: <IoGiftOutline size={20} />,
  trending: <HiOutlineTrendingUp size={20} />,
  handshake: <IoPeopleOutline size={20} />,
};

interface FeatureListProps {
  features: TenantFeature[];
}

const FeatureList: React.FC<FeatureListProps> = ({ features }) => (
  <div className="grid grid-cols-2 gap-2.5">
    {features.map((f, i) => (
      <div
        key={i}
        className="flex flex-col gap-1.5 px-4 py-3.5 rounded-xl bg-white/5 border border-white/[0.07] transition-all duration-300"
      >
        <span className="text-white/70">{ICON_MAP[f.icon] ?? null}</span>
        <div>
          <p className="text-xs font-bold text-white/80 leading-tight">
            {f.title}
          </p>
          <p className="text-[10px] font-medium text-white/35 mt-0.5">
            {f.desc}
          </p>
        </div>
      </div>
    ))}
  </div>
);

export default FeatureList;
