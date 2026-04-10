import React from "react";
import { HiOutlineMap, HiOutlineLocationMarker } from "react-icons/hi";

const RouteMapPlaceholder: React.FC = () => (
  <div className="bg-white rounded-2xl border border-slate-100 shadow-sm shadow-slate-100/50 overflow-hidden">
    <div className="px-5 py-3.5 border-b border-slate-100 flex items-center gap-2.5">
      <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center">
        <HiOutlineMap className="w-4 h-4 text-indigo-600" />
      </div>
      <div>
        <h3 className="text-[13.5px] font-bold text-slate-800 leading-tight">
          Route Map View
        </h3>
        <p className="text-[11px] text-slate-400">
          Visualize routes & track drivers live
        </p>
      </div>
      <span className="ml-auto px-2.5 py-[3px] rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-500 border border-indigo-100">
        Coming Soon
      </span>
    </div>
    <div className="h-40 bg-gradient-to-br from-slate-50 to-indigo-50/30 flex flex-col items-center justify-center gap-2">
      <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center">
        <HiOutlineLocationMarker className="w-6 h-6 text-slate-300" />
      </div>
      <p className="text-[12px] text-slate-400 font-medium">
        Route visualization & live driver tracking
      </p>
      <p className="text-[10px] text-slate-300">
        Google Maps integration coming in Phase 2
      </p>
    </div>
  </div>
);

export default RouteMapPlaceholder;
