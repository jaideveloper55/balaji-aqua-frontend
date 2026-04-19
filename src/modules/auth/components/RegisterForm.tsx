import React, { useState, useCallback, useMemo } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import {
  HiOutlineExclamationCircle,
  HiOutlineArrowRight,
  HiOutlineCheck,
} from "react-icons/hi";
import CustomInput from "../../../components/common/CustomInput";
import TenantSelector, { IconDroplet } from "./TenantSelector";
import { TENANT_CONFIG } from "../constants/constants";
import type { TenantId } from "../types/Auth";

interface RegisterFormValues {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

interface RegisterFormProps {
  tenant: TenantId;
  onTenantChange: (id: TenantId) => void;
}

const getPasswordChecks = (pw: string) => ({
  length: pw.length >= 8,
  upper: /[A-Z]/.test(pw),
  number: /[0-9]/.test(pw),
  special: /[^A-Za-z0-9]/.test(pw),
});

const strengthColors = ["#e2e8f0", "#ef4444", "#f59e0b", "#3b82f6", "#10b981"];
const strengthLabels = ["", "Weak", "Fair", "Good", "Strong"];

const RegisterForm: React.FC<RegisterFormProps> = ({
  tenant,
  onTenantChange,
}) => {
  const config = TENANT_CONFIG[tenant];
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const {
    control,
    handleSubmit: rhfSubmit,
    watch,
    setError,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    },
    mode: "onSubmit",
  });

  const watched = watch();
  const checks = useMemo(
    () => getPasswordChecks(watched.password || ""),
    [watched.password]
  );
  const strength = Object.values(checks).filter(Boolean).length;

  const onSubmit = useCallback(
    (data: RegisterFormValues) => {
      setSubmitError("");

      if (data.password !== data.confirmPassword) {
        setError("confirmPassword", { message: "Passwords do not match" });
        return;
      }
      if (strength < 3) {
        setError("password", {
          message: "Choose a stronger password (meet at least 3 rules)",
        });
        return;
      }
      if (!agree) {
        setSubmitError("Please accept the Terms of Service to continue.");
        return;
      }

      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        setSubmitError(
          "Registration is currently by invitation only. Please contact your administrator."
        );
      }, 1800);
    },
    [strength, agree, setError]
  );

  const handleFormSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      rhfSubmit(onSubmit)(e);
    },
    [rhfSubmit, onSubmit]
  );

  const isDisabled =
    !watched.fullName?.trim() ||
    !watched.email?.trim() ||
    !watched.password ||
    !watched.confirmPassword;

  return (
    <div className="flex flex-col justify-center w-full max-w-[510px] p-10">
      <div className="mb-6">
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
          Create your account
        </h1>
        <p className="text-sm mt-1.5 font-medium text-slate-500">
          Join the{" "}
          <span className="font-bold" style={{ color: config.accent }}>
            {config.name}
          </span>{" "}
          team portal
        </p>
      </div>

      <form
        onSubmit={handleFormSubmit}
        className="flex flex-col gap-4"
        noValidate
      >
        <TenantSelector value={tenant} onChange={onTenantChange} />

        <div className="flex flex-col gap-3.5">
          <CustomInput
            name="fullName"
            control={control}
            label="Full Name"
            type="text"
            placeholder="e.g. Jai Kumar"
            errors={errors}
            autoFocus
          />

          <CustomInput
            name="email"
            control={control}
            label="Work Email"
            type="email"
            placeholder="you@company.com"
            errors={errors}
            iconType="mail"
          />

          <CustomInput
            name="phone"
            control={control}
            label="Mobile Number"
            type="text"
            placeholder="+91 98765 43210"
            errors={errors}
          />

          <div>
            <CustomInput
              name="password"
              control={control}
              label="Password"
              type="password"
              placeholder="Create a strong password"
              errors={errors}
              iconType="lock"
            />

            {watched.password ? (
              <>
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex-1 flex gap-1">
                    {[0, 1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="h-1 flex-1 rounded-full transition-colors duration-200"
                        style={{
                          background:
                            i < strength ? strengthColors[strength] : "#e2e8f0",
                        }}
                      />
                    ))}
                  </div>
                  <span
                    className="text-[10px] font-bold w-10 text-right"
                    style={{ color: strengthColors[strength] || "#94a3b8" }}
                  >
                    {strengthLabels[strength]}
                  </span>
                </div>

                <ul className="grid grid-cols-2 gap-x-3 gap-y-1 mt-2.5">
                  {[
                    { k: "length", label: "8+ characters" },
                    { k: "upper", label: "Uppercase" },
                    { k: "number", label: "Number" },
                    { k: "special", label: "Symbol" },
                  ].map(({ k, label }) => {
                    const ok = checks[k as keyof typeof checks];
                    return (
                      <li
                        key={k}
                        className="flex items-center gap-1.5 text-[10px] font-semibold"
                        style={{ color: ok ? "#10b981" : "#94a3b8" }}
                      >
                        <HiOutlineCheck
                          size={11}
                          className={ok ? "opacity-100" : "opacity-40"}
                        />
                        {label}
                      </li>
                    );
                  })}
                </ul>
              </>
            ) : null}
          </div>

          <CustomInput
            name="confirmPassword"
            control={control}
            label="Confirm Password"
            type="password"
            placeholder="Re-enter your password"
            errors={errors}
            iconType="lock"
          />

          <label
            className="flex items-start gap-2.5 cursor-pointer select-none mt-1"
            onClick={() => setAgree((a) => !a)}
          >
            <div
              className="w-[18px] h-[18px] rounded-[5px] flex items-center justify-center border-2 transition-all duration-150 shrink-0 mt-0.5"
              style={{
                borderColor: agree ? config.accent : "#cbd5e1",
                background: agree ? config.accent : "#fff",
              }}
            >
              {agree && <HiOutlineCheck size={10} className="text-white" />}
            </div>
            <span className="text-xs font-semibold text-slate-500 leading-relaxed">
              I agree to the{" "}
              <span className="font-bold" style={{ color: config.accent }}>
                Terms of Service
              </span>{" "}
              and{" "}
              <span className="font-bold" style={{ color: config.accent }}>
                Privacy Policy
              </span>
              .
            </span>
          </label>
        </div>

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

        <button
          type="submit"
          disabled={isDisabled || loading}
          className={`w-full flex items-center justify-center gap-2.5 py-3.5 px-6 rounded-xl text-sm font-semibold mt-1 transition-all duration-200 ${
            isDisabled || loading
              ? "bg-slate-200 text-slate-400 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600 text-white shadow-lg hover:shadow-xl"
          }`}
        >
          {loading ? (
            <>
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Creating account...
            </>
          ) : (
            <>
              Create account
              <HiOutlineArrowRight size={14} />
            </>
          )}
        </button>
      </form>

      <div className="text-center mt-6">
        <p className="text-xs font-semibold text-slate-500">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-bold hover:underline"
            style={{ color: config.accent }}
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterForm;
