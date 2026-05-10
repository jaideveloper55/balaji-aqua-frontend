// src/modules/expenses/components/VendorsPanel.tsx

import { useState } from "react";
import { Input } from "antd";
import {
  HiOutlineSearch,
  HiOutlinePlus,
  HiOutlinePhone,
  HiOutlineMail,
  HiOutlineDocumentText,
  HiOutlineExclamation,
  HiOutlinePencilAlt,
  HiOutlineEye,
} from "react-icons/hi";
import { CATEGORY_META } from "../constants/Expenses.constants";
import VendorFormModal from "./Vendorformmodal";

interface VendorRow {
  id: string;
  name: string;
  category: string;
  phone?: string;
  email?: string;
  gstin?: string;
  totalPaidYTD: number;
  lastPaymentDate?: string;
  outstanding: number;
  transactionCount: number;
  isActive: boolean;
}

const INITIAL_VENDORS: VendorRow[] = [
  {
    id: "V-001",
    name: "TN Electricity Board",
    category: "utilities",
    phone: "1912",
    gstin: "33AAACT2727Q1ZW",
    totalPaidYTD: 145000,
    lastPaymentDate: "2026-05-04",
    outstanding: 0,
    transactionCount: 12,
    isActive: true,
  },
  {
    id: "V-002",
    name: "Indian Oil Pump",
    category: "vehicle",
    phone: "9876543220",
    totalPaidYTD: 64500,
    lastPaymentDate: "2026-05-04",
    outstanding: 0,
    transactionCount: 38,
    isActive: true,
  },
  {
    id: "V-003",
    name: "Murugan Salt Suppliers",
    category: "plant_ops",
    phone: "9876543221",
    gstin: "33ABCDE1234F1Z5",
    totalPaidYTD: 38000,
    lastPaymentDate: "2026-05-03",
    outstanding: 4500,
    transactionCount: 8,
    isActive: true,
  },
  {
    id: "V-004",
    name: "Saravanan Caps & Seals",
    category: "packaging",
    phone: "9876543222",
    email: "saravanan@capsseals.in",
    gstin: "33XYZAB5678C2D3",
    totalPaidYTD: 28500,
    lastPaymentDate: "2026-05-03",
    outstanding: 2800,
    transactionCount: 11,
    isActive: true,
  },
  {
    id: "V-005",
    name: "Sundaram Property",
    category: "rent",
    phone: "9876543223",
    totalPaidYTD: 48000,
    lastPaymentDate: "2026-05-01",
    outstanding: 0,
    transactionCount: 4,
    isActive: true,
  },
  {
    id: "V-006",
    name: "Plant Maintenance — Kumar",
    category: "repairs",
    phone: "9876543224",
    totalPaidYTD: 18500,
    lastPaymentDate: "2026-05-02",
    outstanding: 0,
    transactionCount: 7,
    isActive: true,
  },
  {
    id: "V-007",
    name: "Local Stationery",
    category: "office",
    totalPaidYTD: 4200,
    lastPaymentDate: "2026-04-30",
    outstanding: 0,
    transactionCount: 14,
    isActive: true,
  },
];

const formatINR = (n: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);

const formatDate = (s: string) =>
  new Date(s).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const VendorsPanel = () => {
  const [vendors, setVendors] = useState<VendorRow[]>(INITIAL_VENDORS);
  const [search, setSearch] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editingVendor, setEditingVendor] = useState<VendorRow | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const filtered = vendors.filter((v) =>
    search ? v.name.toLowerCase().includes(search.toLowerCase()) : true
  );

  const totalOutstanding = vendors.reduce((s, v) => s + v.outstanding, 0);
  const totalPaid = vendors.reduce((s, v) => s + v.totalPaidYTD, 0);
  const vendorsWithDues = vendors.filter((v) => v.outstanding > 0).length;

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleAdd = () => {
    setEditingVendor(null);
    setFormOpen(true);
  };

  const handleEdit = (vendor: VendorRow) => {
    setEditingVendor(vendor);
    setFormOpen(true);
  };

  const handleSave = (data: any) => {
    if (editingVendor) {
      setVendors((prev) =>
        prev.map((v) => (v.id === editingVendor.id ? { ...v, ...data } : v))
      );
      showToast(`✓ Vendor "${data.name}" updated`);
    } else {
      setVendors((prev) => [
        {
          ...data,
          totalPaidYTD: 0,
          outstanding: 0,
          transactionCount: 0,
          isActive: true,
        },
        ...prev,
      ]);
      showToast(`✓ Vendor "${data.name}" added`);
    }
  };

  return (
    <>
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl bg-slate-900 text-white text-sm font-semibold shadow-2xl animate-in slide-in-from-bottom-4">
          {toast}
        </div>
      )}

      <div className="space-y-4">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-white border border-slate-200 rounded-2xl p-4">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Vendors
            </div>
            <div className="text-2xl font-bold text-slate-900 mt-1">
              {vendors.length}
            </div>
            <div className="text-xs text-slate-500 mt-1">
              All active suppliers
            </div>
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl p-4">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Paid YTD
            </div>
            <div className="text-2xl font-bold text-emerald-700 mt-1">
              {formatINR(totalPaid)}
            </div>
            <div className="text-xs text-slate-500 mt-1">2026 to date</div>
          </div>
          <div
            className={`border rounded-2xl p-4 ${
              totalOutstanding > 0
                ? "bg-amber-50 border-amber-200"
                : "bg-white border-slate-200"
            }`}
          >
            <div
              className={`text-xs font-semibold uppercase tracking-wider ${
                totalOutstanding > 0 ? "text-amber-700" : "text-slate-500"
              }`}
            >
              Total Outstanding
            </div>
            <div
              className={`text-2xl font-bold mt-1 ${
                totalOutstanding > 0 ? "text-amber-800" : "text-slate-900"
              }`}
            >
              {formatINR(totalOutstanding)}
            </div>
            <div
              className={`text-xs mt-1 ${
                totalOutstanding > 0 ? "text-amber-700" : "text-slate-500"
              }`}
            >
              Pending payments
            </div>
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl p-4">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Need Payment
            </div>
            <div className="text-2xl font-bold text-rose-700 mt-1">
              {vendorsWithDues}
            </div>
            <div className="text-xs text-slate-500 mt-1">Vendors with dues</div>
          </div>
        </div>

        {/* Search + Add */}
        <div className="bg-white rounded-2xl border border-slate-200 p-3 shadow-sm flex items-center gap-3">
          <Input
            size="large"
            placeholder="Search vendor by name..."
            prefix={<HiOutlineSearch className="text-slate-400" />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            allowClear
            className="flex-1"
          />
          <button
            type="button"
            onClick={handleAdd}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-rose-600 text-white text-sm font-semibold shadow-md hover:bg-rose-700 active:scale-95 transition-all whitespace-nowrap"
          >
            <HiOutlinePlus className="w-4 h-4" />
            Add Vendor
          </button>
        </div>

        {/* Vendor cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
          {filtered.map((v) => {
            const meta = CATEGORY_META[v.category];
            const hasOutstanding = v.outstanding > 0;

            return (
              <div
                key={v.id}
                className={`group bg-white rounded-2xl border overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer ${
                  hasOutstanding ? "border-amber-200" : "border-slate-200"
                }`}
              >
                <div className="p-4">
                  {/* Header */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`w-12 h-12 rounded-xl ${meta.iconBg} border flex items-center justify-center text-2xl shrink-0`}
                      >
                        {meta.icon}
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold text-slate-900 truncate">
                          {v.name}
                        </div>
                        <span
                          className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold mt-0.5 ${meta.bg} ${meta.color}`}
                        >
                          {meta.label}
                        </span>
                      </div>
                    </div>
                    {hasOutstanding && (
                      <div
                        className="shrink-0"
                        title={`Outstanding: ${formatINR(v.outstanding)}`}
                      >
                        <HiOutlineExclamation className="w-5 h-5 text-amber-500" />
                      </div>
                    )}
                  </div>

                  {/* Contact */}
                  <div className="space-y-1.5 mb-3 pb-3 border-b border-dashed border-slate-200">
                    {v.phone && (
                      <div className="flex items-center gap-2 text-xs text-slate-600">
                        <HiOutlinePhone className="w-3.5 h-3.5 text-slate-400" />
                        {v.phone}
                      </div>
                    )}
                    {v.email && (
                      <div className="flex items-center gap-2 text-xs text-slate-600 truncate">
                        <HiOutlineMail className="w-3.5 h-3.5 text-slate-400" />
                        {v.email}
                      </div>
                    )}
                    {v.gstin && (
                      <div className="flex items-center gap-2 text-xs text-slate-600">
                        <HiOutlineDocumentText className="w-3.5 h-3.5 text-slate-400" />
                        <span className="font-mono">{v.gstin}</span>
                      </div>
                    )}
                    {!v.phone && !v.email && !v.gstin && (
                      <div className="text-xs text-slate-400 italic">
                        No contact info added
                      </div>
                    )}
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <div className="bg-slate-50 rounded-lg p-2">
                      <div className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">
                        Paid YTD
                      </div>
                      <div className="text-sm font-bold text-emerald-700 mt-0.5">
                        {formatINR(v.totalPaidYTD)}
                      </div>
                    </div>
                    <div
                      className={`rounded-lg p-2 ${
                        hasOutstanding ? "bg-amber-50" : "bg-slate-50"
                      }`}
                    >
                      <div
                        className={`text-[10px] font-semibold uppercase tracking-wider ${
                          hasOutstanding ? "text-amber-700" : "text-slate-500"
                        }`}
                      >
                        Outstanding
                      </div>
                      <div
                        className={`text-sm font-bold mt-0.5 ${
                          hasOutstanding ? "text-amber-800" : "text-slate-700"
                        }`}
                      >
                        {hasOutstanding ? formatINR(v.outstanding) : "Nil"}
                      </div>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">
                      <span className="font-bold text-slate-900">
                        {v.transactionCount}
                      </span>{" "}
                      transactions
                      {v.lastPaymentDate && (
                        <> · last {formatDate(v.lastPaymentDate)}</>
                      )}
                    </span>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        type="button"
                        className="p-1.5 rounded hover:bg-slate-100 text-slate-500 hover:text-slate-700"
                        title="View"
                      >
                        <HiOutlineEye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(v);
                        }}
                        className="p-1.5 rounded hover:bg-slate-100 text-slate-500 hover:text-slate-700"
                        title="Edit"
                      >
                        <HiOutlinePencilAlt className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {filtered.length === 0 && (
            <div className="md:col-span-2 xl:col-span-3 bg-white rounded-2xl border border-slate-200 p-12 text-center">
              <div className="inline-flex p-4 rounded-2xl bg-slate-50 mb-3">
                <HiOutlineDocumentText className="w-7 h-7 text-slate-400" />
              </div>
              <h3 className="text-base font-semibold text-slate-700">
                No vendors found
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Try adjusting your search or add a new vendor.
              </p>
              <button
                type="button"
                onClick={handleAdd}
                className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-rose-600 text-white text-sm font-semibold hover:bg-rose-700 transition-colors"
              >
                <HiOutlinePlus className="w-4 h-4" />
                Add First Vendor
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Form modal */}
      <VendorFormModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleSave}
        initialData={editingVendor}
      />
    </>
  );
};

export default VendorsPanel;
