import React, { useState, useMemo } from "react";
import {
  HiOutlinePlus,
  HiOutlinePhone,
  HiOutlineMail,
  HiOutlineDocumentText,
  HiOutlineExclamation,
  HiOutlineUserGroup,
  HiOutlineCash,
  HiOutlineExclamationCircle,
  HiOutlineLightningBolt,
  HiOutlineTruck,
  HiOutlineCube,
  HiOutlineArchive,
  HiOutlineOfficeBuilding,
  HiOutlineFolder,
} from "react-icons/hi";
import SearchInput from "../../../components/common/SearchInput";
import { HiOutlineWrench } from "react-icons/hi2";
import { Vendor } from "../types/Expenses";
import { MOCK_VENDORS, VENDOR_STATS } from "../constants/vendorMockData";
import Vendorformmodal, { VendorFormValues } from "./Vendorformmodal";
import { successNotification } from "../../../components/common/Notification";

const inr = (n: number) =>
  `₹${new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(
    n ?? 0
  )}`;

const CATEGORY_STYLE: Record<
  string,
  {
    icon: React.ReactNode;
    color: string;
    bg: string;
    tagBg: string;
    tagText: string;
  }
> = {
  Utilities: {
    icon: <HiOutlineLightningBolt size={22} />,
    color: "#d97706",
    bg: "#fffbeb",
    tagBg: "bg-amber-50",
    tagText: "text-amber-700",
  },
  "Vehicle & Fuel": {
    icon: <HiOutlineTruck size={22} />,
    color: "#2563eb",
    bg: "#eff6ff",
    tagBg: "bg-blue-50",
    tagText: "text-blue-700",
  },
  "Plant Operations": {
    icon: <HiOutlineCube size={22} />,
    color: "#0891b2",
    bg: "#ecfeff",
    tagBg: "bg-cyan-50",
    tagText: "text-cyan-700",
  },
  Packaging: {
    icon: <HiOutlineArchive size={22} />,
    color: "#7c3aed",
    bg: "#f5f3ff",
    tagBg: "bg-violet-50",
    tagText: "text-violet-700",
  },
  "Rent & Lease": {
    icon: <HiOutlineOfficeBuilding size={22} />,
    color: "#4f46e5",
    bg: "#eef2ff",
    tagBg: "bg-indigo-50",
    tagText: "text-indigo-700",
  },
  Repairs: {
    icon: <HiOutlineWrench size={22} />,
    color: "#ea580c",
    bg: "#fff7ed",
    tagBg: "bg-orange-50",
    tagText: "text-orange-700",
  },
  Office: {
    icon: <HiOutlineFolder size={22} />,
    color: "#0d9488",
    bg: "#f0fdfa",
    tagBg: "bg-teal-50",
    tagText: "text-teal-700",
  },
};

interface StatCard {
  label: string;
  value: string;
  sub: string;
  icon: React.ReactNode;
  color: string;
  bg: string;
  alert?: boolean;
}

interface Props {
  onAddVendor?: () => void;
  onVendorClick?: (v: Vendor) => void;
}

const Vendorspanel: React.FC<Props> = ({ onAddVendor, onVendorClick }) => {
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Vendor | null>(null);

  const handleSubmit = (values: VendorFormValues) => {
    successNotification(
      editTarget ? "Vendor Updated" : "Vendor Added",
      `${values.name} · ${values.category}`
    );
    setModalOpen(false);
  };

  const vendors = useMemo(() => {
    if (!search.trim()) return MOCK_VENDORS;
    const q = search.toLowerCase();
    return MOCK_VENDORS.filter((v) => v.name.toLowerCase().includes(q));
  }, [search]);

  const stats: StatCard[] = [
    {
      label: "Total Vendors",
      value: String(VENDOR_STATS.totalVendors),
      sub: "All active suppliers",
      icon: <HiOutlineUserGroup size={20} />,
      color: "#2563eb",
      bg: "#eff6ff",
    },
    {
      label: "Paid YTD",
      value: inr(VENDOR_STATS.paidYtd),
      sub: "2026 to date",
      icon: <HiOutlineCash size={20} />,
      color: "#059669",
      bg: "#ecfdf5",
    },
    {
      label: "Total Outstanding",
      value: inr(VENDOR_STATS.totalOutstanding),
      sub: "Pending payments",
      icon: <HiOutlineExclamationCircle size={20} />,
      color: "#d97706",
      bg: "#fffbeb",
      alert: true,
    },
    {
      label: "Need Payment",
      value: String(VENDOR_STATS.needPayment),
      sub: "Vendors with dues",
      icon: <HiOutlineExclamation size={20} />,
      color: "#dc2626",
      bg: "#fef2f2",
    },
  ];

  const openAdd = () => {
    setEditTarget(null);
    setModalOpen(true);
    onAddVendor?.();
  };

  const openEdit = (v: Vendor) => {
    setEditTarget(v);
    setModalOpen(true);
  };

  return (
    <div className="space-y-5">
      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className={`bg-white rounded-2xl border p-5 ${
              s.alert ? "border-amber-200" : "border-slate-200"
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: s.bg, color: s.color }}
              >
                {s.icon}
              </div>
            </div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wide mb-1">
              {s.label}
            </p>
            <p
              className="text-[26px] font-extrabold leading-none"
              style={{ color: s.alert ? "#d97706" : "#0f172a" }}
            >
              {s.value}
            </p>
            <p className="text-[12px] text-slate-500 mt-1.5">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Search + Add */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 flex items-center gap-3">
        <div className="flex-1">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search vendor by name..."
            expandOnFocus={false}
          />
        </div>
        <button
          onClick={openAdd}
          className="inline-flex items-center gap-2 px-4 h-10 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-[13px] font-semibold shrink-0"
        >
          <HiOutlinePlus size={16} /> Add Vendor
        </button>
      </div>

      {/* Vendor cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {vendors.map((v) => {
          const st = CATEGORY_STYLE[v.category] ?? CATEGORY_STYLE["Office"];
          const hasDues = v.outstanding > 0;
          return (
            <div
              key={v.id}
              onClick={() => {
                onVendorClick?.(v);
                openEdit(v);
              }}
              className={`bg-white rounded-2xl border p-5 cursor-pointer transition-all hover:shadow-md ${
                hasDues ? "border-amber-300" : "border-slate-200"
              }`}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: st.bg, color: st.color }}
                  >
                    {st.icon}
                  </div>
                  <div>
                    <h3 className="text-[15px] font-bold text-slate-900 leading-tight">
                      {v.name}
                    </h3>
                    <span
                      className={`inline-block mt-1 px-2 py-0.5 rounded-md text-[11px] font-semibold ${st.tagBg} ${st.tagText}`}
                    >
                      {v.category}
                    </span>
                  </div>
                </div>
                {hasDues && (
                  <HiOutlineExclamation
                    size={20}
                    className="text-amber-500 shrink-0"
                  />
                )}
              </div>

              {/* Contact */}
              <div className="space-y-1.5 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2 text-[13px] text-slate-600">
                  <HiOutlinePhone size={14} className="text-slate-400" />{" "}
                  {v.phone}
                </div>
                {v.email && (
                  <div className="flex items-center gap-2 text-[13px] text-slate-600">
                    <HiOutlineMail size={14} className="text-slate-400" />{" "}
                    {v.email}
                  </div>
                )}
                {v.gstin && (
                  <div className="flex items-center gap-2 text-[13px] text-slate-500 font-mono">
                    <HiOutlineDocumentText
                      size={14}
                      className="text-slate-400"
                    />{" "}
                    {v.gstin}
                  </div>
                )}
              </div>

              {/* Paid / Outstanding */}
              <div className="grid grid-cols-2 gap-2 mt-3">
                <div className="bg-slate-50 rounded-lg px-3 py-2">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-0.5">
                    Paid YTD
                  </p>
                  <p className="text-[14px] font-bold text-emerald-600">
                    {inr(v.totalPaidYTD)}
                  </p>
                </div>
                <div
                  className={`rounded-lg px-3 py-2 ${
                    hasDues ? "bg-amber-50" : "bg-slate-50"
                  }`}
                >
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-0.5">
                    Outstanding
                  </p>
                  <p
                    className={`text-[14px] font-bold ${
                      hasDues ? "text-amber-600" : "text-slate-400"
                    }`}
                  >
                    {hasDues ? inr(v.outstanding) : "Nil"}
                  </p>
                </div>
              </div>

              {/* Footer */}
              <p className="text-[12px] text-slate-500 mt-3">
                <span className="font-semibold text-slate-700">
                  {v.transactions}
                </span>{" "}
                transactions · last{" "}
                {new Date(v.lastTransaction).toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </p>
            </div>
          );
        })}
      </div>

      {/* Add / Edit vendor modal — managed internally */}
      <Vendorformmodal
        open={modalOpen}
        editVendor={editTarget}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default Vendorspanel;
