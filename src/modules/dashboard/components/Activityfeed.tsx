import React from "react";
import { Button } from "antd";
import {
  HiOutlineClock,
  HiOutlineArrowSmRight,
  HiOutlineEye,
} from "react-icons/hi";
import { ActivityItem } from "../types/Dashboard";
import SectionCard from "./SectionCard";

interface Props {
  items: ActivityItem[];
  onViewAll?: () => void;
}

const ActivityFeed: React.FC<Props> = ({ items, onViewAll }) => (
  <SectionCard
    title="Recent Activity"
    subtitle="Live updates from across your operation"
    icon={<HiOutlineClock size={16} />}
    iconBg="bg-gradient-to-br from-slate-50 to-slate-100"
    iconColor="text-slate-600"
    action={
      onViewAll && (
        <Button
          size="small"
          type="text"
          onClick={onViewAll}
          className="!text-[11px] !text-blue-600 !font-semibold"
        >
          View all <HiOutlineArrowSmRight size={12} />
        </Button>
      )
    }
  >
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
      {items.map((item) => (
        <div
          key={item.id}
          className="flex items-start gap-3 p-3 rounded-xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50/50 transition-all duration-200 cursor-pointer group relative"
        >
          <div
            className={`w-9 h-9 rounded-xl ${item.bg} ${item.color} flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform`}
          >
            {item.icon}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[12px] font-semibold text-slate-700 leading-tight truncate">
              {item.title}
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5 truncate">
              {item.customer}
            </p>
            <p className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
              <HiOutlineClock size={9} />
              {item.time}
            </p>
          </div>
          <button
            className="opacity-0 group-hover:opacity-100 absolute top-2 right-2 w-7 h-7 rounded-lg bg-white border border-slate-200 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600 flex items-center justify-center text-slate-400 transition-all"
            onClick={(e) => e.stopPropagation()}
            title="View details"
          >
            <HiOutlineEye size={12} />
          </button>
        </div>
      ))}
    </div>
  </SectionCard>
);

export default ActivityFeed;
