import React, { useState } from "react";
import LoginForm from "../components/LoginForm";
import InfoPanel from "../components/InfoPanel";
import type { TenantId } from "../types/Auth";

const LoginPage: React.FC = () => {
  const [tenant, setTenant] = useState<TenantId>("sri-balaji-aqua");

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-slate-100">
      <div className="w-full max-w-[1040px] bg-white rounded-[20px] overflow-hidden grid grid-cols-1 lg:grid-cols-[1fr_1.05fr] min-h-[640px] shadow-[0_16px_56px_-12px_rgba(15,23,42,0.12),0_0_0_1px_rgba(15,23,42,0.04)] animate-fadeUp">
        <LoginForm tenant={tenant} onTenantChange={setTenant} />
        <InfoPanel tenant={tenant} />
      </div>

      <footer className="mt-6 text-center text-xs text-slate-400">
        <p>
          Developed by <span className="font-semibold text-slate-500">Jai</span>
        </p>
      </footer>
    </div>
  );
};

export default LoginPage;
