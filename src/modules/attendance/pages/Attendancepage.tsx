import { useState } from "react";
import {
  HiOutlineClock,
  HiOutlineCalendar,
  HiOutlineFingerPrint,
  HiOutlineLightningBolt,
  HiOutlineDocumentReport,
  HiOutlineDownload,
  HiOutlinePlus,
} from "react-icons/hi";
import AttendanceStatCards from "../components/Attendancestatcards";
import CustomTabs from "../../../components/common/CustomTabs";
import TodayPanel from "../components/Todaypanel";
import MarkAttendancePanel from "../components/Markattendancepanel";
import CalendarPanel from "../components/Calendarpanel";
import OvertimePanel from "../components/Overtimepanel";
import ReportsPanel from "../components/Reportspanel";

const TABS = [
  { key: "today", label: "Today", icon: <HiOutlineClock size={14} /> },
  {
    key: "mark",
    label: "Mark Attendance",
    icon: <HiOutlineFingerPrint size={14} />,
  },
  {
    key: "calendar",
    label: "Calendar",
    icon: <HiOutlineCalendar size={14} />,
  },
  {
    key: "overtime",
    label: "Overtime",
    icon: <HiOutlineLightningBolt size={14} />,
  },
  {
    key: "reports",
    label: "Reports",
    icon: <HiOutlineDocumentReport size={14} />,
  },
];

const AttendancePage = () => {
  const [activeTab, setActiveTab] = useState("today");

  return (
    <div className="min-h-screen bg-slate-50/50">
      <div className=" space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-2xl bg-blue-500 shadow-lg ">
              <HiOutlineFingerPrint className="w-7 h-7 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                Attendance Center
              </h2>
              <p className="text-sm text-slate-500 mt-0.5">
                Track punch-ins, shifts, leaves, and overtime in real-time
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 text-sm font-medium hover:bg-slate-50 hover:border-slate-300 transition-all"
            >
              <HiOutlineDownload className="w-4 h-4" />
              Export
            </button>
            <button
              type="button"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-500 text-white text-sm font-semibold shadow-md  hover:shadow-lg hover:-translate-y-0.5 transition-all"
            >
              <HiOutlinePlus className="w-4 h-4" />
              Quick Mark
            </button>
          </div>
        </div>

        {/* ============ Stat Cards ============ */}
        <AttendanceStatCards />

        {/* ============ Tabs ============ */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
          <div className="max-w-3xl">
            <CustomTabs
              items={TABS}
              activeKey={activeTab}
              onChange={setActiveTab}
              accentColor="#0891b2"
            />
          </div>
        </div>

        {/* ============ Tab Content ============ */}
        <div>
          {activeTab === "today" && <TodayPanel />}
          {activeTab === "mark" && <MarkAttendancePanel />}
          {activeTab === "calendar" && <CalendarPanel />}
          {activeTab === "overtime" && <OvertimePanel />}
          {activeTab === "reports" && <ReportsPanel />}
        </div>
      </div>
    </div>
  );
};

export default AttendancePage;
