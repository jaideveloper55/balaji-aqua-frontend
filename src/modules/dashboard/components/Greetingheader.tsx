import React from "react";
import { Button, Tooltip } from "antd";
import {
  HiOutlineCalendar,
  HiOutlineRefresh,
  HiOutlineBell,
  HiOutlineDownload,
} from "react-icons/hi";
import { WeatherInfo } from "../types/Dashboard";

interface Props {
  userName: string;
  attentionCount: number;
  weather: WeatherInfo;
  refreshing: boolean;
  onRefresh: () => void;
  rightSlot?: React.ReactNode;
}

const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
};

const GreetingHeader: React.FC<Props> = ({
  userName,
  attentionCount,
  weather,
  refreshing,
  onRefresh,
  rightSlot,
}) => {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div className="flex-1 min-w-[280px]">
        <div className="flex items-center gap-2 flex-wrap">
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">
            {getGreeting()}, {userName}
          </h1>
          <span className="px-2 py-0.5 text-[10px] font-bold text-emerald-700 bg-emerald-50 rounded-full ring-1 ring-emerald-100 inline-flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            LIVE
          </span>
          <span className="text-[18px]">👋</span>
        </div>
        <p className="text-xs text-slate-500 mt-1 flex items-center gap-2 flex-wrap">
          <span className="flex items-center gap-1.5">
            <HiOutlineCalendar size={12} />
            {new Date().toLocaleDateString("en-IN", {
              weekday: "long",
              day: "2-digit",
              month: "long",
              year: "numeric",
            })}
          </span>
          {attentionCount > 0 && (
            <>
              <span className="text-slate-300">·</span>
              <span>
                You have{" "}
                <span className="text-red-600 font-bold">
                  {attentionCount} {attentionCount === 1 ? "thing" : "things"}
                </span>{" "}
                needing attention
              </span>
            </>
          )}
        </p>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        {/* Weather widget */}
        <div className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-blue-50 to-violet-50 rounded-xl border border-blue-100">
          <span className="text-xl leading-none">{weather.emoji}</span>
          <div className="leading-tight">
            <p className="text-[12px] font-bold text-slate-800">
              {weather.temp}°C {weather.city}
            </p>
            <p className="text-[10px] text-slate-500">
              {weather.condition}
              {weather.delayRisk === "none" && " · No delays"}
              {weather.delayRisk === "low" && " · Minor delays"}
              {weather.delayRisk === "high" && " · Plan around weather"}
            </p>
          </div>
        </div>

        {rightSlot}

        <Tooltip title="Refresh data">
          <Button
            icon={
              <HiOutlineRefresh
                size={15}
                className={refreshing ? "animate-spin" : ""}
              />
            }
            onClick={onRefresh}
            className="!rounded-xl !h-9"
          />
        </Tooltip>
        <Button icon={<HiOutlineBell size={15} />} className="!rounded-xl !h-9">
          Alerts
        </Button>
        <Button
          icon={<HiOutlineDownload size={15} />}
          className="!rounded-xl !h-9"
        >
          Export
        </Button>
      </div>
    </div>
  );
};

export default GreetingHeader;
