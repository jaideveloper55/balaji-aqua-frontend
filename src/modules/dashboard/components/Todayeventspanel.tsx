import React from "react";
import { Button } from "antd";
import {
  HiOutlineCalendar,
  HiOutlineLocationMarker,
  HiOutlineArrowSmRight,
} from "react-icons/hi";
import { TodayEvent } from "../types/Dashboard";

interface Props {
  events: TodayEvent[];
  onViewAll?: () => void;
}

const TYPE_STYLES: Record<
  TodayEvent["type"],
  { bg: string; text: string; emoji: string }
> = {
  Wedding: { bg: "bg-pink-50", text: "text-pink-700", emoji: "💒" },
  Corporate: { bg: "bg-blue-50", text: "text-blue-700", emoji: "🏢" },
  Engagement: { bg: "bg-rose-50", text: "text-rose-700", emoji: "💍" },
  Birthday: { bg: "bg-amber-50", text: "text-amber-700", emoji: "🎂" },
  "House Warming": {
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    emoji: "🏠",
  },
};

const TodayEventsPanel: React.FC<Props> = ({ events, onViewAll }) => (
  <div className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden">
    <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100/80">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-pink-50 to-pink-100 text-pink-600 flex items-center justify-center">
          <HiOutlineCalendar size={16} />
        </div>
        <div>
          <h3 className="text-[13px] font-bold text-slate-800 leading-tight">
            Today's Events
          </h3>
          <p className="text-[11px] text-slate-400 mt-0.5">
            {events.length} scheduled
          </p>
        </div>
      </div>
      {onViewAll && (
        <Button
          size="small"
          type="text"
          onClick={onViewAll}
          className="!text-[11px] !text-blue-600 !font-semibold"
        >
          All <HiOutlineArrowSmRight size={12} />
        </Button>
      )}
    </div>

    <div className="p-3 flex flex-col gap-2">
      {events.length === 0 && (
        <div className="text-center py-8 text-slate-400 text-xs">
          No events scheduled today 🎉
        </div>
      )}
      {events.map((e) => {
        const style = TYPE_STYLES[e.type];
        return (
          <div
            key={e.id}
            className="flex items-start gap-3 p-3 rounded-xl border border-slate-100 hover:border-pink-200 hover:bg-pink-50/30 transition-all cursor-pointer"
          >
            <div
              className={`w-10 h-10 rounded-xl ${style.bg} flex items-center justify-center text-lg shrink-0`}
            >
              {style.emoji}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-[12px] font-bold text-slate-800 truncate">
                  {e.customer}
                </p>
                <span
                  className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${style.bg} ${style.text}`}
                >
                  {e.type}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-500">
                <span className="font-semibold tabular-nums">{e.time}</span>
                <span className="text-slate-300">·</span>
                <span className="flex items-center gap-1 truncate">
                  <HiOutlineLocationMarker size={10} />
                  {e.venue}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  </div>
);

export default TodayEventsPanel;
