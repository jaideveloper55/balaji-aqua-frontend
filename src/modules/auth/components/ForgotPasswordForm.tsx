import React, { useState, useCallback, useMemo } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import {
  HiOutlineExclamationCircle,
  HiOutlineArrowRight,
  HiOutlineArrowLeft,
  HiOutlineCheck,
  HiOutlineMailOpen,
  HiOutlineCheckCircle,
} from "react-icons/hi";
import CustomInput from "../../../components/common/CustomInput";
import OtpInput from "../../../components/common/OtpInput";
import TenantSelector, { IconDroplet } from "./TenantSelector";
import { TENANT_CONFIG } from "../constants/constants";
import type { TenantId } from "../types/Auth";

type Step = "email" | "verify" | "reset" | "success";

interface ResetValues {
  email: string;
  code: string;
  password: string;
  confirmPassword: string;
}

interface ForgotPasswordFormProps {
  tenant: TenantId;
  onTenantChange: (id: TenantId) => void;
}

const getPasswordChecks = (pw: string) => ({
  length: pw.length >= 8,
  upper: /[A-Z]/.test(pw),
  number: /[0-9]/.test(pw),
  special: /[^A-Za-z0-9]/.test(pw),
});

const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({
  tenant,
  onTenantChange,
}) => {
  const config = TENANT_CONFIG[tenant];
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>("email");
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const {
    control,
    handleSubmit: rhfSubmit,
    watch,
    setError,
    formState: { errors },
  } = useForm<ResetValues>({
    defaultValues: { email: "", code: "", password: "", confirmPassword: "" },
    mode: "onSubmit",
  });

  const watched = watch();
  const checks = useMemo(
    () => getPasswordChecks(watched.password || ""),
    [watched.password]
  );
  const strength = Object.values(checks).filter(Boolean).length;

  const onSubmit = useCallback(
    (data: ResetValues) => {
      setSubmitError("");

      if (step === "email") {
        if (!data.email.trim()) return;
        setLoading(true);
        setTimeout(() => {
          setLoading(false);
          setStep("verify");
        }, 1200);
        return;
      }

      if (step === "verify") {
        if (data.code.length < 6) {
          setError("code", { message: "Enter all 6 digits" });
          return;
        }
        setLoading(true);
        setTimeout(() => {
          setLoading(false);
          setStep("reset");
        }, 1000);
        return;
      }

      if (step === "reset") {
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
        setLoading(true);
        setTimeout(() => {
          setLoading(false);
          setStep("success");
        }, 1400);
      }
    },
    [step, setError, strength]
  );

  const handleFormSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      rhfSubmit(onSubmit)(e);
    },
    [rhfSubmit, onSubmit]
  );

  const isDisabled = useMemo(() => {
    if (step === "email") return !watched.email?.trim();
    if (step === "verify") return (watched.code?.length || 0) < 6;
    if (step === "reset") return !watched.password || !watched.confirmPassword;
    return false;
  }, [step, watched]);

  const headings: Record<Step, { title: string; subtitle: React.ReactNode }> = {
    email: {
      title: "Reset your password",
      subtitle: (
        <>Enter your email — we&apos;ll send you a 6-digit verification code.</>
      ),
    },
    verify: {
      title: "Check your email",
      subtitle: (
        <>
          We&apos;ve sent a code to{" "}
          <span className="font-bold text-slate-700">
            {watched.email || "your inbox"}
          </span>
        </>
      ),
    },
    reset: {
      title: "Create new password",
      subtitle: <>Choose a strong password you haven&apos;t used before.</>,
    },
    success: {
      title: "Password updated",
      subtitle: <>You can now sign in with your new password.</>,
    },
  };

  const btnLabel: Record<Exclude<Step, "success">, string> = {
    email: "Send code",
    verify: "Verify code",
    reset: "Update password",
  };

  const goBack = () => {
    setSubmitError("");
    if (step === "verify") setStep("email");
    else if (step === "reset") setStep("verify");
  };

  return (
    <div className="flex flex-col justify-center w-full max-w-[510px] p-10">
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

        {(step === "verify" || step === "reset") && (
          <button
            type="button"
            onClick={goBack}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-700 mb-4 transition-colors"
          >
            <HiOutlineArrowLeft size={12} />
            Back
          </button>
        )}

        <h1
          className="font-black tracking-tight leading-tight text-slate-900"
          style={{ fontSize: "clamp(20px, 2.2vw, 26px)" }}
        >
          {headings[step].title}
        </h1>
        <p className="text-sm mt-1.5 font-medium text-slate-500">
          {headings[step].subtitle}
        </p>

        {/* Progress indicator */}
        {step !== "success" && (
          <div className="flex items-center gap-1.5 mt-4">
            {(["email", "verify", "reset"] as const).map((s) => {
              const active = s === step;
              const done =
                (s === "email" && step !== "email") ||
                (s === "verify" && step === "reset");
              return (
                <div
                  key={s}
                  className="h-1 flex-1 rounded-full transition-colors duration-300"
                  style={{
                    background: done || active ? config.accent : "#e2e8f0",
                    opacity: active ? 1 : done ? 0.55 : 1,
                  }}
                />
              );
            })}
          </div>
        )}
      </div>

      {step === "success" ? (
        <div className="flex flex-col items-center text-center gap-5">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center"
            style={{ background: "#ecfdf5" }}
          >
            <HiOutlineCheckCircle size={36} className="text-emerald-500" />
          </div>
          <p className="text-sm font-medium text-slate-500 max-w-[320px]">
            Your password has been updated successfully. Sign in to continue to
            your {config.shortName} dashboard.
          </p>
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="w-full flex items-center justify-center gap-2.5 py-3.5 px-6 rounded-xl text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
          >
            Continue to sign in
            <HiOutlineArrowRight size={14} />
          </button>
        </div>
      ) : (
        <form
          onSubmit={handleFormSubmit}
          className="flex flex-col gap-4"
          noValidate
        >
          {step === "email" && (
            <TenantSelector value={tenant} onChange={onTenantChange} />
          )}

          <div className="flex flex-col gap-3.5">
            {step === "email" && (
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
            )}

            {step === "verify" && (
              <>
                <div className="flex items-start gap-3 p-4 rounded-xl bg-blue-50 border border-blue-200/50">
                  <HiOutlineMailOpen
                    size={16}
                    className="shrink-0 mt-0.5"
                    style={{ color: config.accent }}
                  />
                  <p className="text-[11px] font-medium leading-relaxed text-slate-600">
                    The code expires in 10 minutes. Didn&apos;t get it? Check
                    spam, or{" "}
                    <button
                      type="button"
                      className="font-bold hover:underline"
                      style={{ color: config.accent }}
                      onClick={() => {
                        setSubmitError("");
                      }}
                    >
                      resend
                    </button>
                    .
                  </p>
                </div>

                <OtpInput
                  name="code"
                  control={control}
                  length={6}
                  errors={errors}
                  label="Verification Code"
                />
              </>
            )}

            {step === "reset" && (
              <>
                <div>
                  <CustomInput
                    name="password"
                    control={control}
                    label="New Password"
                    type="password"
                    placeholder="Create a strong password"
                    errors={errors}
                    iconType="lock"
                    autoFocus
                  />

                  {watched.password ? (
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
                  ) : null}
                </div>

                <CustomInput
                  name="confirmPassword"
                  control={control}
                  label="Confirm Password"
                  type="password"
                  placeholder="Re-enter new password"
                  errors={errors}
                  iconType="lock"
                />
              </>
            )}
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
                : "bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl"
            }`}
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Please wait...
              </>
            ) : (
              <>
                {btnLabel[step as Exclude<Step, "success">]}
                <HiOutlineArrowRight size={14} />
              </>
            )}
          </button>
        </form>
      )}

      {step !== "success" && (
        <div className="text-center mt-6">
          <p className="text-xs font-semibold text-slate-500">
            Remembered it?{" "}
            <Link
              to="/login"
              className="font-bold hover:underline"
              style={{ color: config.accent }}
            >
              Back to sign in
            </Link>
          </p>
        </div>
      )}
    </div>
  );
};

export default ForgotPasswordForm;
