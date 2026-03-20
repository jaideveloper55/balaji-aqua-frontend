import React, { useState, useCallback, useMemo } from "react";
import { useForm } from "react-hook-form";
import {
  HiOutlineShieldCheck,
  HiOutlineExclamationCircle,
  HiOutlineArrowRight,
  HiOutlineCheck,
} from "react-icons/hi";
import CustomInput from "../../../components/common/CustomInput";
import OtpInput from "../../../components/common/OtpInput";
import AuthTabs from "./AuthTabs";
import TenantSelector, { IconDroplet } from "./TenantSelector";
import { TENANT_CONFIG } from "./constants";
import type { TenantId, AuthTabKey } from "../types/Auth";

interface LoginFormValues {
  email: string;
  password: string;
  pin: string;
}

interface LoginFormProps {
  tenant: TenantId;
  onTenantChange: (id: TenantId) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ tenant, onTenantChange }) => {
  const config = TENANT_CONFIG[tenant];
  const [tab, setTab] = useState<AuthTabKey>("password");
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const {
    control,
    handleSubmit: rhfSubmit,
    watch,
    clearErrors,
    setError,
    formState: { errors },
  } = useForm<LoginFormValues>({
    defaultValues: { email: "", password: "", pin: "" },
    mode: "onSubmit",
  });

  const handleTabChange = useCallback(
    (key: AuthTabKey) => {
      setTab(key);
      setSubmitError("");
      clearErrors();
    },
    [clearErrors],
  );

  const onSubmit = useCallback(
    (data: LoginFormValues) => {
      setSubmitError("");

      if (tab === "pin" && data.pin.length < 6) {
        setError("pin", { message: "Enter all 6 digits" });
        return;
      }

      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        setSubmitError(
          "Invalid credentials — please verify your details and try again.",
        );
      }, 2200);
    },
    [tab, setError],
  );

  const handleFormSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      rhfSubmit(onSubmit)(e);
    },
    [rhfSubmit, onSubmit],
  );

  const watched = watch();

  const isDisabled = useMemo(() => {
    if (tab === "password") return !watched.email?.trim() || !watched.password;
    if (tab === "pin") return (watched.pin?.length || 0) < 6;
    return true;
  }, [tab, watched]);

  const btnLabel =
    tab === "password" ? `Sign in to ${config.shortName}` : "Authenticate";

  return (
    <div
      className="flex flex-col justify-center w-full max-w-[480px]"
      style={{ padding: "clamp(28px, 4vw, 56px) clamp(24px, 5vw, 60px)" }}
    >
      <div className="mb-7">
        <div className="flex items-center gap-2.5 mb-5 lg:hidden">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{
              background: `linear-gradient(135deg, ${config.gradientFrom}, ${config.gradientTo})`,
            }}
          >
            <IconDroplet size={16} className="text-white" />
          </div>
          <span className="font-extrabold text-sm text-slate-800">
            {config.name}
          </span>
        </div>
        <h1
          className="font-black tracking-tight leading-tight text-slate-900"
          style={{ fontSize: "clamp(20px, 2.2vw, 26px)" }}
        >
          Welcome back
        </h1>
        <p className="text-sm mt-1.5 font-medium text-slate-500">
          Sign in to your{" "}
          <span className="font-bold" style={{ color: config.accent }}>
            {config.name}
          </span>{" "}
          dashboard
        </p>
      </div>

      {/* Form */}
      <form
        onSubmit={handleFormSubmit}
        className="flex flex-col gap-4"
        noValidate
      >
        <TenantSelector value={tenant} onChange={onTenantChange} />

        <AuthTabs
          activeTab={tab}
          onChange={handleTabChange}
          accentColor={config.accent}
        />

        {/* Tab panels */}
        <div className="min-h-[190px]">
          {tab === "password" && (
            <div className="flex flex-col gap-3.5">
              <CustomInput
                name="email"
                control={control}
                label="Email Address"
                type="email"
                placeholder="you@company.com"
                errors={errors}
                iconType="mail"
                autoFocus
              />

              <CustomInput
                name="password"
                control={control}
                label="Password"
                type="password"
                placeholder="Enter your password"
                errors={errors}
                iconType="lock"
              />

              {/* Remember + Reset */}
              <div className="flex items-center justify-between mt-1">
                <label
                  className="flex items-center gap-2 cursor-pointer select-none"
                  onClick={() => setRemember((r) => !r)}
                >
                  <div
                    className="w-[18px] h-[18px] rounded-[5px] flex items-center justify-center border-2 transition-all duration-150"
                    style={{
                      borderColor: remember ? config.accent : "#cbd5e1",
                      background: remember ? config.accent : "#fff",
                    }}
                  >
                    {remember && (
                      <HiOutlineCheck size={10} className="text-white" />
                    )}
                  </div>
                  <span className="text-xs font-semibold text-slate-500">
                    Keep me signed in
                  </span>
                </label>
                <button
                  type="button"
                  className="text-xs font-bold opacity-85 hover:opacity-100 transition-opacity"
                  style={{ color: config.accent }}
                >
                  Reset password
                </button>
              </div>
            </div>
          )}

          {tab === "pin" && (
            <div className="flex flex-col gap-4">
              {/* Restricted access notice */}
              <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-50 border border-amber-200/50">
                <HiOutlineShieldCheck
                  size={16}
                  className="text-amber-600 shrink-0 mt-0.5"
                />
                <div>
                  <p className="text-xs font-bold text-amber-900">
                    Restricted Access
                  </p>
                  <p className="text-[10px] font-medium mt-0.5 leading-relaxed text-amber-900/55">
                    Admin PIN is for authorized administrators only. Attempts
                    are monitored and logged.
                  </p>
                </div>
              </div>

              <OtpInput
                name="pin"
                control={control}
                length={6}
                errors={errors}
                label="Admin PIN"
              />
            </div>
          )}
        </div>

        {/* Submit error */}
        {submitError && (
          <div className="flex items-start gap-3 px-4 py-3.5 rounded-xl bg-red-50 border border-red-200/35">
            <HiOutlineExclamationCircle
              size={15}
              className="text-red-500 shrink-0 mt-0.5"
            />
            <p className="text-xs font-semibold leading-relaxed text-red-600">
              {submitError}
            </p>
          </div>
        )}

        {/* Submit button */}
        <button
          type="submit"
          disabled={isDisabled || loading}
          className={`
    w-full flex items-center justify-center gap-2.5
    py-3.5 px-6 rounded-xl text-sm font-semibold mt-1
    transition-all duration-200

    ${
      isDisabled || loading
        ? "bg-slate-200 text-slate-400 cursor-not-allowed"
        : "bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl"
    }
  `}
        >
          {loading ? (
            <>
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Authenticating...
            </>
          ) : (
            <>
              {btnLabel}
              <HiOutlineArrowRight size={14} />
            </>
          )}
        </button>
      </form>

      {/* Footer */}
      <div className="flex items-center justify-center gap-2 mt-7">
        <div
          className="w-1 h-1 rounded-full transition-colors duration-500"
          style={{ background: config.accent }}
        />
        <p className="text-[10px] font-semibold text-slate-400">
          Need access? Contact your system administrator
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
