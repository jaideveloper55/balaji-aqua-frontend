// ─────────────────────────────────────────────────────────────────────────────
// CompaniesPage.tsx
// Place this at: src/modules/companies/CompaniesPage.tsx
// Pure UI layout — wire up real API calls later
// Uses: Tailwind CSS + react-icons (ri set)
// ─────────────────────────────────────────────────────────────────────────────

import { useState } from "react";
import {
  RiBuilding2Line,
  RiAddLine,
  RiSearchLine,
  RiFilterLine,
  RiMoreLine,
  RiEditLine,
  RiDeleteBinLine,
  RiEyeLine,
  RiDropLine,
  RiFlaskLine,
  RiCheckboxCircleLine,
  RiCloseCircleLine,
  RiArrowLeftLine,
  RiArrowRightLine,
  RiCloseLine,
  RiMapPinLine,
  RiMailLine,
  RiPhoneLine,
  RiFileTextLine,
  RiShieldLine,
  RiAlertLine,
  RiRefreshLine,
  RiDownloadLine,
} from "react-icons/ri";

// ─── Types ────────────────────────────────────────────────────────────────────
type CompanyType = "WATER_PLANT" | "BEVERAGE";
type CompanyStatus = "ACTIVE" | "INACTIVE";
type ModalMode = "create" | "edit" | "view" | "delete" | null;

interface Company {
  id: string;
  name: string;
  type: CompanyType;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  gstNumber: string;
  status: CompanyStatus;
  createdAt: string;
  userCount: number;
}

// ─── Mock Data (replace with API call later) ──────────────────────────────────
const MOCK_COMPANIES: Company[] = [
  {
    id: "1",
    name: "Krishna Water Plant",
    type: "WATER_PLANT",
    email: "info@krishnawater.com",
    phone: "+91-9876543210",
    address: "12 Gandhi Street, RS Puram",
    city: "Coimbatore",
    state: "Tamil Nadu",
    gstNumber: "33AABCU9603R1ZX",
    status: "ACTIVE",
    createdAt: "2024-01-15",
    userCount: 12,
  },
  {
    id: "2",
    name: "Kaveri Beverages Pvt Ltd",
    type: "BEVERAGE",
    email: "ops@kaveribev.in",
    phone: "+91-9123456789",
    address: "45 Industrial Estate",
    city: "Chennai",
    state: "Tamil Nadu",
    gstNumber: "33BBCDE1234F2GH",
    status: "ACTIVE",
    createdAt: "2024-02-20",
    userCount: 8,
  },
  {
    id: "3",
    name: "Nilgiri Pure Water",
    type: "WATER_PLANT",
    email: "contact@nilgiriwater.com",
    phone: "+91-9988776655",
    address: "7 Hills Road, Ooty",
    city: "Ooty",
    state: "Tamil Nadu",
    gstNumber: "33CCFGH5678I3JK",
    status: "INACTIVE",
    createdAt: "2024-03-10",
    userCount: 5,
  },
  {
    id: "4",
    name: "Sakthi Drinks Co",
    type: "BEVERAGE",
    email: "hello@sakthidrinks.com",
    phone: "+91-9977665544",
    address: "100 SIDCO Nagar",
    city: "Madurai",
    state: "Tamil Nadu",
    gstNumber: "33DDIJK9012L4MN",
    status: "ACTIVE",
    createdAt: "2024-04-05",
    userCount: 15,
  },
  {
    id: "5",
    name: "Vaigai Water Solutions",
    type: "WATER_PLANT",
    email: "info@vaigaiwater.in",
    phone: "+91-9866554433",
    address: "23 KK Nagar",
    city: "Trichy",
    state: "Tamil Nadu",
    gstNumber: "33EELMO3456P5QR",
    status: "ACTIVE",
    createdAt: "2024-04-18",
    userCount: 9,
  },
];

const INDIAN_STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
];

// ─── Small helper components ─────────────────────────────────────────────────

function TypeBadge({ type }: { type: CompanyType }) {
  if (type === "WATER_PLANT") {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100">
        <RiDropLine size={11} />
        Water Plant
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">
      <RiFlaskLine size={11} />
      Beverage
    </span>
  );
}

function StatusBadge({ status }: { status: CompanyStatus }) {
  if (status === "ACTIVE") {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-green-50 text-green-700 border border-green-100">
        <RiCheckboxCircleLine size={11} />
        Active
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-600 border border-red-100">
      <RiCloseCircleLine size={11} />
      Inactive
    </span>
  );
}

// ─── Stats Cards ──────────────────────────────────────────────────────────────
function StatsCards({ companies }: { companies: Company[] }) {
  const total = companies.length;
  const active = companies.filter((c) => c.status === "ACTIVE").length;
  const waterPlants = companies.filter((c) => c.type === "WATER_PLANT").length;
  const beverages = companies.filter((c) => c.type === "BEVERAGE").length;

  const cards = [
    {
      label: "Total Companies",
      value: total,
      icon: RiBuilding2Line,
      color: "bg-slate-50 text-slate-600 border-slate-100",
      valueColor: "text-slate-800",
    },
    {
      label: "Active",
      value: active,
      icon: RiCheckboxCircleLine,
      color: "bg-green-50 text-green-600 border-green-100",
      valueColor: "text-green-700",
    },
    {
      label: "Water Plants",
      value: waterPlants,
      icon: RiDropLine,
      color: "bg-blue-50 text-blue-600 border-blue-100",
      valueColor: "text-blue-700",
    },
    {
      label: "Beverages",
      value: beverages,
      icon: RiFlaskLine,
      color: "bg-emerald-50 text-emerald-600 border-emerald-100",
      valueColor: "text-emerald-700",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {cards.map((card) => (
        <div
          key={card.label}
          className="bg-white rounded-2xl border border-slate-100 p-4 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow"
        >
          <div
            className={`w-11 h-11 rounded-xl flex items-center justify-center border ${card.color}`}
          >
            <card.icon size={20} />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">{card.label}</p>
            <p className={`text-2xl font-bold ${card.valueColor}`}>
              {card.value}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Company Card (grid view) ─────────────────────────────────────────────────
function CompanyCard({
  company,
  onView,
  onEdit,
  onDelete,
}: {
  company: Company;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 overflow-hidden group">
      {/* Card top accent line */}
      <div
        className={`h-1 w-full ${
          company.type === "WATER_PLANT" ? "bg-blue-500" : "bg-emerald-500"
        }`}
      />

      <div className="p-5">
        {/* Header row */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg ${
                company.type === "WATER_PLANT"
                  ? "bg-blue-50 text-blue-600"
                  : "bg-emerald-50 text-emerald-600"
              }`}
            >
              {company.name.charAt(0)}
            </div>
            <div>
              <h3 className="font-semibold text-slate-800 text-sm leading-tight">
                {company.name}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                {company.city}, {company.state}
              </p>
            </div>
          </div>

          {/* 3-dot menu */}
          <div className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
            >
              <RiMoreLine size={18} />
            </button>
            {menuOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setMenuOpen(false)}
                />
                <div className="absolute right-0 top-9 z-20 bg-white border border-slate-100 rounded-xl shadow-xl w-40 py-1.5 overflow-hidden">
                  <button
                    onClick={() => {
                      onView();
                      setMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-3.5 py-2 text-sm text-slate-600 hover:bg-slate-50 transition-colors"
                  >
                    <RiEyeLine size={15} /> View Details
                  </button>
                  <button
                    onClick={() => {
                      onEdit();
                      setMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-3.5 py-2 text-sm text-slate-600 hover:bg-slate-50 transition-colors"
                  >
                    <RiEditLine size={15} /> Edit
                  </button>
                  <div className="my-1 border-t border-slate-100" />
                  <button
                    onClick={() => {
                      onDelete();
                      setMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-3.5 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors"
                  >
                    <RiDeleteBinLine size={15} /> Deactivate
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Badges */}
        <div className="flex items-center gap-2 mb-4">
          <TypeBadge type={company.type} />
          <StatusBadge status={company.status} />
        </div>

        {/* Info rows */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <RiMailLine size={13} className="text-slate-400 flex-shrink-0" />
            <span className="truncate">{company.email}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <RiPhoneLine size={13} className="text-slate-400 flex-shrink-0" />
            <span>{company.phone}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <RiFileTextLine
              size={13}
              className="text-slate-400 flex-shrink-0"
            />
            <span className="font-mono">{company.gstNumber}</span>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between">
          <span className="text-xs text-slate-400">
            {company.userCount} users
          </span>
          <span className="text-xs text-slate-400">
            Since{" "}
            {new Date(company.createdAt).toLocaleDateString("en-IN", {
              month: "short",
              year: "numeric",
            })}
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── Table Row (list view) ────────────────────────────────────────────────────
function TableRow({
  company,
  onView,
  onEdit,
  onDelete,
}: {
  company: Company;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <tr className="hover:bg-slate-50 transition-colors group">
      <td className="px-5 py-3.5">
        <div className="flex items-center gap-3">
          <div
            className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold text-sm flex-shrink-0 ${
              company.type === "WATER_PLANT"
                ? "bg-blue-50 text-blue-600"
                : "bg-emerald-50 text-emerald-600"
            }`}
          >
            {company.name.charAt(0)}
          </div>
          <div>
            <p className="text-sm font-medium text-slate-800">{company.name}</p>
            <p className="text-xs text-slate-400">{company.city}</p>
          </div>
        </div>
      </td>
      <td className="px-5 py-3.5">
        <TypeBadge type={company.type} />
      </td>
      <td className="px-5 py-3.5 text-sm text-slate-600">{company.email}</td>
      <td className="px-5 py-3.5 text-sm text-slate-600 font-mono text-xs">
        {company.gstNumber}
      </td>
      <td className="px-5 py-3.5">
        <StatusBadge status={company.status} />
      </td>
      <td className="px-5 py-3.5">
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={onView}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-blue-50 hover:text-blue-600 transition-colors"
            title="View"
          >
            <RiEyeLine size={15} />
          </button>
          <button
            onClick={onEdit}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-amber-50 hover:text-amber-600 transition-colors"
            title="Edit"
          >
            <RiEditLine size={15} />
          </button>
          <button
            onClick={onDelete}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-500 transition-colors"
            title="Deactivate"
          >
            <RiDeleteBinLine size={15} />
          </button>
        </div>
      </td>
    </tr>
  );
}

// ─── Create / Edit Modal (Slide-over) ────────────────────────────────────────
function CompanyFormModal({
  mode,
  company,
  onClose,
  onSubmit,
}: {
  mode: "create" | "edit";
  company?: Company;
  onClose: () => void;
  onSubmit: (data: Partial<Company>) => void;
}) {
  const [form, setForm] = useState({
    name: company?.name || "",
    type: company?.type || ("WATER_PLANT" as CompanyType),
    email: company?.email || "",
    phone: company?.phone || "",
    address: company?.address || "",
    city: company?.city || "",
    state: company?.state || "Tamil Nadu",
    gstNumber: company?.gstNumber || "",
  });

  const handleChange = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-30 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Slide-over panel */}
      <div className="fixed inset-y-0 right-0 z-40 w-full max-w-lg bg-white shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-slate-800">
              {mode === "create" ? "Add New Company" : "Edit Company"}
            </h2>
            <p className="text-sm text-slate-400 mt-0.5">
              {mode === "create"
                ? "Register a new tenant on the platform"
                : `Editing: ${company?.name}`}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-xl bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors"
          >
            <RiCloseLine size={18} />
          </button>
        </div>

        {/* Form body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          {/* Company Type selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-2 uppercase tracking-wide">
              Company Type <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              {(["WATER_PLANT", "BEVERAGE"] as CompanyType[]).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => handleChange("type", type)}
                  className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                    form.type === type
                      ? type === "WATER_PLANT"
                        ? "border-blue-500 bg-blue-50 text-blue-700"
                        : "border-emerald-500 bg-emerald-50 text-emerald-700"
                      : "border-slate-100 bg-white text-slate-500 hover:border-slate-300"
                  }`}
                >
                  {type === "WATER_PLANT" ? (
                    <RiDropLine size={24} />
                  ) : (
                    <RiFlaskLine size={24} />
                  )}
                  <span className="text-xs font-semibold">
                    {type === "WATER_PLANT" ? "Water Plant" : "Beverage"}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Company Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
              Company Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <RiBuilding2Line
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                value={form.name}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder="e.g. Krishna Water Plant"
                className="w-full pl-10 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all placeholder:text-slate-300"
              />
            </div>
          </div>

          {/* Email + Phone */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
                Email <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <RiMailLine
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  placeholder="info@company.com"
                  className="w-full pl-10 pr-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all placeholder:text-slate-300"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
                Phone <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <RiPhoneLine
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  placeholder="+91-98765..."
                  className="w-full pl-10 pr-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all placeholder:text-slate-300"
                />
              </div>
            </div>
          </div>

          {/* Address */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
              Address <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <RiMapPinLine
                size={16}
                className="absolute left-3.5 top-3 text-slate-400"
              />
              <textarea
                value={form.address}
                onChange={(e) => handleChange("address", e.target.value)}
                placeholder="Street address"
                rows={2}
                className="w-full pl-10 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all placeholder:text-slate-300 resize-none"
              />
            </div>
          </div>

          {/* City + State */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
                City <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.city}
                onChange={(e) => handleChange("city", e.target.value)}
                placeholder="Coimbatore"
                className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all placeholder:text-slate-300"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
                State <span className="text-red-500">*</span>
              </label>
              <select
                value={form.state}
                onChange={(e) => handleChange("state", e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all bg-white"
              >
                {INDIAN_STATES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* GST Number */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
              GST Number <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <RiShieldLine
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                value={form.gstNumber}
                onChange={(e) =>
                  handleChange("gstNumber", e.target.value.toUpperCase())
                }
                placeholder="33AABCU9603R1ZX"
                maxLength={15}
                className="w-full pl-10 pr-4 py-2.5 text-sm font-mono border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all placeholder:text-slate-300 uppercase"
              />
            </div>
            <p className="text-xs text-slate-400 mt-1">
              15-character GST Identification Number
            </p>
          </div>
        </div>

        {/* Footer actions */}
        <div className="px-6 py-4 border-t border-slate-100 flex items-center gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 px-4 rounded-xl text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => onSubmit(form)}
            className={`flex-1 py-2.5 px-4 rounded-xl text-sm font-semibold text-white transition-colors ${
              mode === "create"
                ? "bg-blue-600 hover:bg-blue-700 active:bg-blue-800"
                : "bg-amber-500 hover:bg-amber-600 active:bg-amber-700"
            }`}
          >
            {mode === "create" ? "Create Company" : "Save Changes"}
          </button>
        </div>
      </div>
    </>
  );
}

// ─── View Details Modal ───────────────────────────────────────────────────────
function ViewCompanyModal({
  company,
  onClose,
  onEdit,
}: {
  company: Company;
  onClose: () => void;
  onEdit: () => void;
}) {
  return (
    <>
      <div
        className="fixed inset-0 z-30 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
          {/* Header with type color */}
          <div
            className={`px-6 py-5 ${
              company.type === "WATER_PLANT" ? "bg-blue-600" : "bg-emerald-600"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center text-white font-bold text-xl">
                  {company.name.charAt(0)}
                </div>
                <div>
                  <h2 className="text-white font-bold text-lg leading-tight">
                    {company.name}
                  </h2>
                  <div className="flex items-center gap-1.5 mt-1">
                    {company.type === "WATER_PLANT" ? (
                      <RiDropLine size={13} className="text-white/70" />
                    ) : (
                      <RiFlaskLine size={13} className="text-white/70" />
                    )}
                    <span className="text-white/70 text-xs">
                      {company.type === "WATER_PLANT"
                        ? "Water Plant"
                        : "Beverage"}
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/20 text-white hover:bg-white/30 transition-colors"
              >
                <RiCloseLine size={16} />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="px-6 py-5 space-y-3">
            {[
              { icon: RiMailLine, label: "Email", value: company.email },
              { icon: RiPhoneLine, label: "Phone", value: company.phone },
              {
                icon: RiMapPinLine,
                label: "Address",
                value: `${company.address}, ${company.city}, ${company.state}`,
              },
              {
                icon: RiFileTextLine,
                label: "GST Number",
                value: company.gstNumber,
                mono: true,
              },
              {
                icon: RiCheckboxCircleLine,
                label: "Status",
                value: company.status,
              },
            ].map((row) => (
              <div
                key={row.label}
                className="flex items-start gap-3 py-2 border-b border-slate-50 last:border-0"
              >
                <row.icon
                  size={16}
                  className="text-slate-400 mt-0.5 flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-slate-400 font-medium">
                    {row.label}
                  </p>
                  <p
                    className={`text-sm text-slate-700 mt-0.5 ${
                      row.mono ? "font-mono" : ""
                    }`}
                  >
                    {row.value}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="px-6 pb-5 flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
            >
              Close
            </button>
            <button
              onClick={onEdit}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white bg-amber-500 hover:bg-amber-600 transition-colors flex items-center justify-center gap-2"
            >
              <RiEditLine size={15} /> Edit Company
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

// ─── Delete Confirm Modal ─────────────────────────────────────────────────────
function DeleteConfirmModal({
  company,
  onClose,
  onConfirm,
}: {
  company: Company;
  onClose: () => void;
  onConfirm: () => void;
}) {
  return (
    <>
      <div
        className="fixed inset-0 z-30 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
          <div className="p-6 text-center">
            <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-4">
              <RiAlertLine size={28} className="text-red-500" />
            </div>
            <h2 className="text-lg font-bold text-slate-800 mb-2">
              Deactivate Company?
            </h2>
            <p className="text-sm text-slate-500 leading-relaxed">
              <span className="font-semibold text-slate-700">
                {company.name}
              </span>{" "}
              will be deactivated. All users of this company will lose access.
            </p>
          </div>
          <div className="px-6 pb-6 flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white bg-red-500 hover:bg-red-600 transition-colors"
            >
              Deactivate
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

// ─── MAIN PAGE COMPONENT ──────────────────────────────────────────────────────
export default function CompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>(MOCK_COMPANIES);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<"ALL" | CompanyType>("ALL");
  const [filterStatus, setFilterStatus] = useState<"ALL" | CompanyStatus>(
    "ALL"
  );
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [modal, setModal] = useState<{ mode: ModalMode; company?: Company }>({
    mode: null,
  });

  // ── Filtered list ───────────────────────────────────────────────────────────
  const filtered = companies.filter((c) => {
    const matchSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.city.toLowerCase().includes(search.toLowerCase());
    const matchType = filterType === "ALL" || c.type === filterType;
    const matchStatus = filterStatus === "ALL" || c.status === filterStatus;
    return matchSearch && matchType && matchStatus;
  });

  // ── Handlers (wire up real API calls here later) ────────────────────────────
  const handleCreate = (data: Partial<Company>) => {
    const newCompany: Company = {
      id: String(Date.now()),
      name: data.name || "",
      type: data.type || "WATER_PLANT",
      email: data.email || "",
      phone: data.phone || "",
      address: data.address || "",
      city: data.city || "",
      state: data.state || "",
      gstNumber: data.gstNumber || "",
      status: "ACTIVE",
      createdAt: new Date().toISOString(),
      userCount: 0,
    };
    setCompanies((prev) => [newCompany, ...prev]);
    setModal({ mode: null });
  };

  const handleEdit = (data: Partial<Company>) => {
    setCompanies((prev) =>
      prev.map((c) => (c.id === modal.company?.id ? { ...c, ...data } : c))
    );
    setModal({ mode: null });
  };

  const handleDelete = () => {
    setCompanies((prev) =>
      prev.map((c) =>
        c.id === modal.company?.id ? { ...c, status: "INACTIVE" } : c
      )
    );
    setModal({ mode: null });
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ── Page Header ─────────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2.5">
              <RiBuilding2Line className="text-blue-600" size={26} />
              Companies
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Manage all tenant companies on the platform
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 transition-colors">
              <RiDownloadLine size={15} /> Export
            </button>
            <button
              onClick={() => setModal({ mode: null })}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 transition-colors"
              title="Refresh"
            >
              <RiRefreshLine size={15} />
            </button>
            <button
              onClick={() => setModal({ mode: "create" })}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 transition-colors shadow-sm shadow-blue-200"
            >
              <RiAddLine size={16} /> Add Company
            </button>
          </div>
        </div>

        {/* ── Stats ───────────────────────────────────────────────────────── */}
        <StatsCards companies={companies} />

        {/* ── Filters bar ─────────────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm px-4 py-3 mb-5 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <RiSearchLine
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, email or city..."
              className="w-full pl-10 pr-4 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all placeholder:text-slate-300"
            />
          </div>

          {/* Type filter */}
          <div className="flex items-center gap-1.5">
            <RiFilterLine size={14} className="text-slate-400" />
            {(["ALL", "WATER_PLANT", "BEVERAGE"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setFilterType(t)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  filterType === t
                    ? "bg-blue-600 text-white"
                    : "text-slate-500 hover:bg-slate-100"
                }`}
              >
                {t === "ALL"
                  ? "All Types"
                  : t === "WATER_PLANT"
                  ? "Water Plant"
                  : "Beverage"}
              </button>
            ))}
          </div>

          {/* Status filter */}
          <div className="flex items-center gap-1.5">
            {(["ALL", "ACTIVE", "INACTIVE"] as const).map((s) => (
              <button
                key={s}
                onClick={() => setFilterStatus(s)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  filterStatus === s
                    ? s === "ACTIVE"
                      ? "bg-green-600 text-white"
                      : s === "INACTIVE"
                      ? "bg-red-500 text-white"
                      : "bg-slate-700 text-white"
                    : "text-slate-500 hover:bg-slate-100"
                }`}
              >
                {s === "ALL" ? "All Status" : s}
              </button>
            ))}
          </div>

          {/* View toggle */}
          <div className="flex items-center gap-1 bg-slate-100 rounded-xl p-1">
            <button
              onClick={() => setViewMode("grid")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                viewMode === "grid"
                  ? "bg-white text-slate-800 shadow-sm"
                  : "text-slate-500"
              }`}
            >
              Grid
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                viewMode === "list"
                  ? "bg-white text-slate-800 shadow-sm"
                  : "text-slate-500"
              }`}
            >
              List
            </button>
          </div>
        </div>

        {/* ── Results count ────────────────────────────────────────────────── */}
        <p className="text-xs text-slate-400 mb-4">
          Showing{" "}
          <span className="font-semibold text-slate-600">
            {filtered.length}
          </span>{" "}
          of{" "}
          <span className="font-semibold text-slate-600">
            {companies.length}
          </span>{" "}
          companies
        </p>

        {/* ── Grid View ───────────────────────────────────────────────────── */}
        {viewMode === "grid" && (
          <>
            {filtered.length === 0 ? (
              <div className="text-center py-20 text-slate-400">
                <RiBuilding2Line
                  size={40}
                  className="mx-auto mb-3 opacity-40"
                />
                <p className="font-medium">No companies found</p>
                <p className="text-sm mt-1">Try adjusting your filters</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filtered.map((company) => (
                  <CompanyCard
                    key={company.id}
                    company={company}
                    onView={() => setModal({ mode: "view", company })}
                    onEdit={() => setModal({ mode: "edit", company })}
                    onDelete={() => setModal({ mode: "delete", company })}
                  />
                ))}
              </div>
            )}
          </>
        )}

        {/* ── List View ───────────────────────────────────────────────────── */}
        {viewMode === "list" && (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            {filtered.length === 0 ? (
              <div className="text-center py-20 text-slate-400">
                <RiBuilding2Line
                  size={40}
                  className="mx-auto mb-3 opacity-40"
                />
                <p className="font-medium">No companies found</p>
              </div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/60">
                    {[
                      "Company",
                      "Type",
                      "Email",
                      "GST Number",
                      "Status",
                      "Actions",
                    ].map((h) => (
                      <th
                        key={h}
                        className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filtered.map((company) => (
                    <TableRow
                      key={company.id}
                      company={company}
                      onView={() => setModal({ mode: "view", company })}
                      onEdit={() => setModal({ mode: "edit", company })}
                      onDelete={() => setModal({ mode: "delete", company })}
                    />
                  ))}
                </tbody>
              </table>
            )}

            {/* Pagination */}
            <div className="px-5 py-3.5 border-t border-slate-100 flex items-center justify-between">
              <p className="text-xs text-slate-400">
                {filtered.length} results
              </p>
              <div className="flex items-center gap-1">
                <button className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 disabled:opacity-40 transition-colors">
                  <RiArrowLeftLine size={15} />
                </button>
                <button className="w-8 h-8 flex items-center justify-center rounded-lg text-xs font-semibold bg-blue-600 text-white">
                  1
                </button>
                <button className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 transition-colors">
                  <RiArrowRightLine size={15} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Modals ──────────────────────────────────────────────────────────── */}
      {modal.mode === "create" && (
        <CompanyFormModal
          mode="create"
          onClose={() => setModal({ mode: null })}
          onSubmit={handleCreate}
        />
      )}
      {modal.mode === "edit" && modal.company && (
        <CompanyFormModal
          mode="edit"
          company={modal.company}
          onClose={() => setModal({ mode: null })}
          onSubmit={handleEdit}
        />
      )}
      {modal.mode === "view" && modal.company && (
        <ViewCompanyModal
          company={modal.company}
          onClose={() => setModal({ mode: null })}
          onEdit={() => setModal({ mode: "edit", company: modal.company })}
        />
      )}
      {modal.mode === "delete" && modal.company && (
        <DeleteConfirmModal
          company={modal.company}
          onClose={() => setModal({ mode: null })}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
}
