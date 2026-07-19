import React from "react";
import { useNavigate } from "react-router-dom";
import { HiOutlineExclamationCircle, HiChevronRight } from "react-icons/hi";

export interface DueCustomer {
  id: string;
  name: string;
  customerCode: string;
  type: string;
  outstandingBalance: number;
  overdueDays: number;
}

interface Props {
  customers: DueCustomer[];
  totalWithDues: number;
}

const inr = (n: number) =>
  `₹${new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(
    n ?? 0
  )}`;

const initials = (name: string) =>
  name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

const riskTone = (days: number) => {
  if (days > 15)
    return {
      avatar: "bg-rose-50 text-rose-600",
      badge: "bg-rose-50 text-rose-600",
    };
  if (days > 0)
    return {
      avatar: "bg-amber-50 text-amber-600",
      badge: "bg-amber-50 text-amber-600",
    };
  return {
    avatar: "bg-slate-100 text-slate-500",
    badge: "bg-slate-100 text-slate-500",
  };
};

const Outstandingcustomerspanel: React.FC<Props> = ({
  customers,
  totalWithDues,
}) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-rose-50 flex items-center justify-center">
            <HiOutlineExclamationCircle size={16} className="text-rose-600" />
          </div>
          <div>
            <h3 className="text-[14px] font-semibold text-slate-900">
              Customers with Dues
            </h3>
            <p className="text-[12px] text-slate-500">
              {totalWithDues} customer{totalWithDues === 1 ? "" : "s"} pending
            </p>
          </div>
        </div>
        <button
          onClick={() => navigate("/admin/billing-pos")}
          className="text-[12px] font-medium text-blue-600 hover:underline flex items-center gap-0.5"
        >
          View all <HiChevronRight size={13} />
        </button>
      </div>

      {customers.length === 0 ? (
        <div className="text-center py-8 text-[13px] text-slate-400">
          No outstanding dues — all clear.
        </div>
      ) : (
        <div className="divide-y divide-slate-100">
          {customers.map((c) => {
            const tone = riskTone(c.overdueDays);
            return (
              <div
                key={c.id}
                className="flex items-center justify-between py-2.5"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center text-[12px] font-semibold ${tone.avatar}`}
                  >
                    {initials(c.name)}
                  </div>
                  <div>
                    <p className="text-[13px] font-semibold text-slate-800">
                      {c.name}
                    </p>
                    <p className="text-[11px] text-slate-500">
                      {c.customerCode} · {c.overdueDays}d overdue
                    </p>
                  </div>
                </div>
                <span
                  className={`text-[12px] font-bold px-2.5 py-1 rounded-full ${tone.badge}`}
                >
                  {inr(c.outstandingBalance)}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Outstandingcustomerspanel;
