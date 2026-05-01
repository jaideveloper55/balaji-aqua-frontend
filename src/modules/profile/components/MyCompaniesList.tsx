import { HiOutlineCheckCircle, HiOutlineOfficeBuilding } from "react-icons/hi";
import { useAuthStore } from "../../../store/auth.store";
import { successNotification } from "../../../components/common/Notification";

const COMPANY_TYPE_LABELS: Record<string, { label: string; color: string }> = {
  WATER_PLANT: {
    label: "Water Plant",
    color: "bg-blue-50 text-blue-700",
  },
  BEVERAGE: {
    label: "Beverage",
    color: "bg-emerald-50 text-emerald-700",
  },
};

const MyCompaniesList = () => {
  const companies = useAuthStore((s) => s.companies);
  const activeCompanyId = useAuthStore((s) => s.activeCompanyId);
  const setActiveCompany = useAuthStore((s) => s.setActiveCompany);

  const handleSwitch = (id: string, name: string) => {
    if (id === activeCompanyId) return;
    setActiveCompany(id);
    successNotification("Company switched", `Now viewing ${name}`);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/70 p-6 shadow-sm">
      <div className="mb-5">
        <h2 className="text-base font-bold text-slate-900">My Companies</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Companies you have access to. Click any company to switch context.
        </p>
      </div>

      <div className="space-y-3">
        {companies.length === 0 && (
          <div className="text-center py-8 text-sm text-slate-500">
            You don't have access to any companies yet.
          </div>
        )}

        {companies.map((company) => {
          const isActive = company.id === activeCompanyId;
          const typeStyle = COMPANY_TYPE_LABELS[company.type] ?? {
            label: company.type,
            color: "bg-slate-100 text-slate-700",
          };

          return (
            <button
              key={company.id}
              onClick={() => handleSwitch(company.id, company.name)}
              className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left
                ${
                  isActive
                    ? "border-blue-500 bg-blue-50/50"
                    : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                }`}
            >
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center
                ${isActive ? "bg-blue-100" : "bg-slate-100"}`}
              >
                <HiOutlineOfficeBuilding
                  size={22}
                  className={isActive ? "text-blue-600" : "text-slate-500"}
                />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-sm text-slate-900 truncate">
                    {company.name}
                  </h3>
                  {isActive && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-600 text-white">
                      <HiOutlineCheckCircle size={10} />
                      ACTIVE
                    </span>
                  )}
                </div>
                <span
                  className={`inline-block mt-1 px-2 py-0.5 rounded-md text-[11px] font-semibold ${typeStyle.color}`}
                >
                  {typeStyle.label}
                </span>
              </div>

              {!isActive && (
                <span className="text-xs font-semibold text-blue-600 hover:underline">
                  Switch
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default MyCompaniesList;
