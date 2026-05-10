import {
  HiOutlineDocumentText,
  HiOutlineUpload,
  HiOutlineExclamation,
  HiOutlineCheckCircle,
  HiOutlineCloudUpload,
} from "react-icons/hi";
import type { Employee } from "../types/Employees";

interface Props {
  employees: Employee[];
}

interface DocStatus {
  label: string;
  emoji: string;
  hasField: (e: Employee) => boolean;
  expiry?: (e: Employee) => string | undefined;
}

const DOC_TYPES: DocStatus[] = [
  {
    label: "Aadhaar",
    emoji: "🪪",
    hasField: (e) => !!e.aadhaar,
  },
  { label: "PAN", emoji: "🆔", hasField: (e) => !!e.pan },
  {
    label: "Driving License",
    emoji: "🚗",
    hasField: (e) => !!e.drivingLicense,
    expiry: (e) => e.drivingLicenseExpiry,
  },
  {
    label: "Police Verification",
    emoji: "👮",
    hasField: (e) => !!e.policeVerified,
  },
];

const daysUntil = (date: string) => {
  const d = new Date(date);
  const now = new Date();
  return Math.floor((d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
};

const DocumentsPanel = ({ employees }: Props) => {
  // count doc completion
  const totalSlots = employees.length * DOC_TYPES.length;
  let filled = 0;
  let expiringSoon: { name: string; doc: string; days: number }[] = [];

  employees.forEach((e) => {
    DOC_TYPES.forEach((d) => {
      if (d.hasField(e)) filled++;
      if (d.expiry) {
        const expiry = d.expiry(e);
        if (expiry) {
          const days = daysUntil(expiry);
          if (days < 90) {
            expiringSoon.push({
              name: e.fullName,
              doc: d.label,
              days,
            });
          }
        }
      }
    });
  });

  const completion = totalSlots > 0 ? (filled / totalSlots) * 100 : 0;

  return (
    <div className="space-y-4">
      {/* Top summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 border border-blue-100 rounded-2xl p-5">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="text-xs font-semibold text-blue-700 uppercase tracking-wider">
                Compliance Score
              </div>
              <div className="text-3xl font-bold text-slate-900 mt-1">
                {completion.toFixed(0)}%
              </div>
              <div className="text-xs text-slate-600 mt-1">
                {filled} of {totalSlots} documents collected
              </div>
            </div>
            <div className="p-3 rounded-xl bg-white shadow-sm">
              <HiOutlineDocumentText className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="h-2 rounded-full bg-white/60 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-700"
              style={{ width: `${completion}%` }}
            />
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <HiOutlineExclamation className="w-5 h-5 text-amber-500" />
            <span className="text-sm font-semibold text-slate-900">
              Expiring Soon
            </span>
          </div>
          {expiringSoon.length === 0 ? (
            <div className="text-xs text-slate-500 flex items-center gap-1.5">
              <HiOutlineCheckCircle className="w-4 h-4 text-emerald-500" />
              All documents are valid
            </div>
          ) : (
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {expiringSoon.slice(0, 4).map((item, i) => (
                <div
                  key={i}
                  className={`text-xs p-2 rounded-lg border ${
                    item.days < 30
                      ? "bg-red-50 border-red-200 text-red-700"
                      : "bg-amber-50 border-amber-200 text-amber-700"
                  }`}
                >
                  <div className="font-semibold">{item.name}</div>
                  <div className="opacity-80">
                    {item.doc} • {item.days} days left
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Employee Document Grid */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-900">
            Document Status by Employee
          </h3>
          <button className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700">
            <HiOutlineCloudUpload className="w-4 h-4" />
            Bulk Upload
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider bg-slate-50/50 border-b border-slate-200">
                <th className="px-4 py-3">Employee</th>
                {DOC_TYPES.map((d) => (
                  <th key={d.label} className="px-4 py-3 text-center">
                    {d.emoji} {d.label}
                  </th>
                ))}
                <th className="px-4 py-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((e) => (
                <tr
                  key={e.id}
                  className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50 transition-colors"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-slate-400 to-slate-600 text-white text-xs font-bold flex items-center justify-center">
                        {e.fullName.charAt(0)}
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-slate-900">
                          {e.fullName}
                        </div>
                        <div className="text-xs text-slate-500">
                          {e.employeeId}
                        </div>
                      </div>
                    </div>
                  </td>
                  {DOC_TYPES.map((d) => {
                    const hasIt = d.hasField(e);
                    const expiry = d.expiry?.(e);
                    const expiringSoon = expiry && daysUntil(expiry) < 60;

                    return (
                      <td key={d.label} className="px-4 py-3 text-center">
                        {hasIt ? (
                          expiringSoon ? (
                            <div className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-amber-50 border border-amber-200 text-amber-700 text-[11px] font-semibold">
                              <HiOutlineExclamation className="w-3 h-3" />
                              {daysUntil(expiry!)}d
                            </div>
                          ) : (
                            <HiOutlineCheckCircle className="w-5 h-5 text-emerald-500 mx-auto" />
                          )
                        ) : (
                          <span className="text-slate-300 text-xs">—</span>
                        )}
                      </td>
                    );
                  })}
                  <td className="px-4 py-3 text-center">
                    <button className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold text-blue-600 hover:bg-blue-50 transition-colors">
                      <HiOutlineUpload className="w-3.5 h-3.5" />
                      Upload
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DocumentsPanel;
