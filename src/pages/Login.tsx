import React, {
  useState,
  useCallback,
  useEffect,
  useRef,
  useMemo,
} from "react";
import {
  HiOutlineMail,
  HiOutlineLockClosed,
  HiOutlineEye,
  HiOutlineEyeOff,
  HiOutlineChevronDown,
  HiOutlineCheck,
  HiOutlineShieldCheck,
  HiArrowRight,
  HiOutlineExclamationCircle,
  HiOutlineFingerPrint,
} from "react-icons/hi";
import { RiWaterFlashLine, RiLoader4Line } from "react-icons/ri";

// ─── Types ────────────────────────────────────────────────────────────────────

type AuthTab = "password" | "pin";

interface TenantConfig {
  id: string;
  name: string;
  tagline: string;
  accent: string;
  accentLight: string;
  gradientFrom: string;
  gradientTo: string;
  description: string;
  features: { icon: string; text: string }[];
}

// ─── Tenant Configuration ─────────────────────────────────────────────────────

const TENANT_CONFIG: Record<string, TenantConfig> = {
  "balaji-aqua": {
    id: "balaji-aqua",
    name: "Balaji Aqua",
    tagline: "Premium Water Solutions",
    accent: "#2563eb",
    accentLight: "#dbeafe",
    gradientFrom: "#0f2554",
    gradientTo: "#1d4ed8",
    description:
      "End-to-end water delivery management — billing, routing, and customer ops in one platform.",
    features: [
      { icon: "🚚", text: "Real-time delivery tracking" },
      { icon: "💧", text: "Smart route optimization" },
      { icon: "📊", text: "Automated billing & invoicing" },
      { icon: "📱", text: "Customer self-service portal" },
    ],
  },
  "balaji-beverage": {
    id: "balaji-beverage",
    name: "Balaji Beverage",
    tagline: "Refreshing Drinks Division",
    accent: "#059669",
    accentLight: "#d1fae5",
    gradientFrom: "#032e20",
    gradientTo: "#047857",
    description:
      "Complete beverage distribution system — inventory, dispatch, and real-time delivery tracking.",
    features: [
      { icon: "🍶", text: "Multi-SKU inventory control" },
      { icon: "📦", text: "Dispatch & fleet management" },
      { icon: "📈", text: "Sales analytics dashboard" },
      { icon: "🤝", text: "Dealer & distributor network" },
    ],
  },
};

const TENANT_LIST = Object.values(TENANT_CONFIG);

// ─── Live Clock (compact) ─────────────────────────────────────────────────────

const LiveClock: React.FC<{ accent: string }> = () => {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const time = now.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
  const seconds = now
    .toLocaleTimeString("en-IN", { second: "2-digit" })
    .slice(-2);
  const date = now.toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <div
      className="flex items-center justify-between py-3.5 px-5 rounded-2xl border border-white/[0.08]"
      style={{ background: "rgba(255,255,255,0.05)" }}
    >
      <div className="flex items-baseline gap-1">
        <span
          className="text-2xl font-black text-white tabular-nums leading-none"
          style={{ fontFamily: "'Sora', sans-serif" }}
        >
          {time}
        </span>
        <span className="text-xs font-bold text-white/30 tabular-nums">
          {seconds}s
        </span>
      </div>
      <span className="text-[11px] font-semibold text-white/35">{date}</span>
    </div>
  );
};

// ─── Feature List (compact) ───────────────────────────────────────────────────

const FeatureList: React.FC<{ features: { icon: string; text: string }[] }> = ({
  features,
}) => (
  <div className="grid grid-cols-2 gap-2">
    {features.map((f, i) => (
      <div
        key={i}
        className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl border border-white/[0.06]"
        style={{ background: "rgba(255,255,255,0.04)" }}
      >
        <span className="text-[15px] leading-none">{f.icon}</span>
        <span className="text-[11px] font-semibold text-white/60 leading-tight">
          {f.text}
        </span>
      </div>
    ))}
  </div>
);

// ─── Form Input ───────────────────────────────────────────────────────────────

interface FormInputProps {
  icon: React.ReactNode;
  label: string;
  type?: "text" | "email" | "password";
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  autoFocus?: boolean;
  accentColor?: string;
}

const FormInput: React.FC<FormInputProps> = ({
  icon,
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  error,
  disabled,
  autoFocus,
  accentColor = "#2563eb",
}) => {
  const [focused, setFocused] = useState(false);
  const [reveal, setReveal] = useState(false);
  const isPassword = type === "password";
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex flex-col gap-1">
      <label className="text-[12px] font-semibold text-slate-500">
        {label}
      </label>
      <div
        onClick={() => inputRef.current?.focus()}
        style={{
          borderColor: error ? "#f87171" : focused ? accentColor : "#e8ecf1",
          boxShadow: error
            ? "0 0 0 3px rgba(248,113,113,0.1)"
            : focused
            ? `0 0 0 3px ${accentColor}14`
            : "none",
          background: focused ? "#fff" : "#f8fafc",
        }}
        className="flex items-center gap-2.5 rounded-xl border px-3.5 py-2.5 cursor-text transition-all duration-150"
      >
        <span
          className="flex-shrink-0 transition-colors duration-150"
          style={{ color: focused ? accentColor : "#a0aec0" }}
        >
          {icon}
        </span>
        <input
          ref={inputRef}
          type={isPassword && !reveal ? "password" : "text"}
          value={value}
          disabled={disabled}
          autoFocus={autoFocus}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="flex-1 text-[14px] text-slate-800 placeholder-slate-400 outline-none bg-transparent disabled:opacity-50 font-medium"
          autoComplete={
            isPassword ? "current-password" : type === "email" ? "email" : "off"
          }
        />
        {isPassword && value && (
          <button
            type="button"
            onClick={() => setReveal(!reveal)}
            className="p-0.5 text-slate-400 hover:text-slate-600 transition-colors"
            tabIndex={-1}
          >
            {reveal ? (
              <HiOutlineEyeOff size={16} />
            ) : (
              <HiOutlineEye size={16} />
            )}
          </button>
        )}
      </div>
      {error && (
        <p className="text-[11px] text-red-500 flex items-center gap-1 font-semibold mt-0.5">
          <HiOutlineExclamationCircle size={12} />
          {error}
        </p>
      )}
    </div>
  );
};

// ─── PIN Input ────────────────────────────────────────────────────────────────

const PinField: React.FC<{
  value: string;
  onChange: (val: string) => void;
  length?: number;
  error?: string;
  accentColor: string;
}> = ({ value, onChange, length = 6, error, accentColor }) => {
  const digits = useMemo(
    () => value.split("").concat(Array(length).fill("")).slice(0, length),
    [value, length]
  );
  const refs = useRef<(HTMLInputElement | null)[]>([]);
  const focusAt = (i: number) => refs.current[i]?.focus();

  const handleChange = (i: number, val: string) => {
    if (!/^\d?$/.test(val)) return;
    const arr = [...digits];
    arr[i] = val;
    onChange(arr.join("").replace(/[^\d]/g, ""));
    if (val && i < length - 1) setTimeout(() => focusAt(i + 1), 10);
  };

  const handleKeyDown = (
    i: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !digits[i] && i > 0) {
      e.preventDefault();
      const arr = [...digits];
      arr[i - 1] = "";
      onChange(arr.join("").replace(/[^\d]/g, ""));
      setTimeout(() => focusAt(i - 1), 10);
    }
    if (e.key === "ArrowLeft" && i > 0) focusAt(i - 1);
    if (e.key === "ArrowRight" && i < length - 1) focusAt(i + 1);
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, length);
    onChange(pasted);
    setTimeout(() => focusAt(Math.min(pasted.length, length - 1)), 10);
  };

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[12px] font-semibold text-slate-500">
        Admin PIN
      </label>
      <div className="flex gap-2 justify-center py-1">
        {digits.map((d, i) => (
          <input
            key={i}
            ref={(el) => {
              refs.current[i] = el;
            }}
            type="password"
            inputMode="numeric"
            maxLength={1}
            value={d || ""}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            onPaste={i === 0 ? handlePaste : undefined}
            style={
              d
                ? {
                    borderColor: accentColor,
                    backgroundColor: `${accentColor}08`,
                    boxShadow: `0 0 0 3px ${accentColor}12`,
                  }
                : error
                ? {
                    borderColor: "#fca5a5",
                    boxShadow: "0 0 0 2px rgba(252,165,165,0.15)",
                  }
                : {}
            }
            className="w-11 h-12 text-center text-lg font-bold rounded-xl border-2 border-slate-200 outline-none bg-slate-50/80 hover:border-slate-300 transition-all duration-150"
          />
        ))}
      </div>
      {error && (
        <p className="text-[11px] text-red-500 text-center flex items-center justify-center gap-1 font-semibold">
          <HiOutlineExclamationCircle size={12} />
          {error}
        </p>
      )}
    </div>
  );
};

// ─── Tenant Selector ──────────────────────────────────────────────────────────

const TenantSelector: React.FC<{
  value: string;
  onChange: (id: string) => void;
  tenants: TenantConfig[];
}> = ({ value, onChange, tenants }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const selected = TENANT_CONFIG[value];

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <label className="text-[12px] font-semibold text-slate-500 block mb-1">
        Company
      </label>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        style={{
          borderColor: open ? selected?.accent : "#e8ecf1",
          boxShadow: open ? `0 0 0 3px ${selected?.accent}14` : "none",
          background: open ? "#fff" : "#f8fafc",
        }}
        className="w-full flex items-center gap-3 rounded-xl border px-3.5 py-2.5 text-left transition-all duration-150"
      >
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{
            background: `linear-gradient(135deg, ${selected?.gradientFrom}, ${selected?.gradientTo})`,
          }}
        >
          <RiWaterFlashLine size={16} className="text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[13px] font-bold text-slate-800 truncate leading-tight">
            {selected?.name}
          </p>
          <p className="text-[11px] text-slate-400 truncate mt-0.5 font-medium">
            {selected?.tagline}
          </p>
        </div>
        <HiOutlineChevronDown
          size={15}
          className="text-slate-400 flex-shrink-0"
          style={{
            transform: open ? "rotate(180deg)" : "rotate(0)",
            transition: "transform 0.2s",
          }}
        />
      </button>

      {open && (
        <div
          className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-slate-100 rounded-xl overflow-hidden z-50"
          style={{
            boxShadow:
              "0 16px 40px -8px rgba(15,23,42,0.12), 0 0 0 1px rgba(15,23,42,0.04)",
          }}
        >
          {tenants.map((t) => {
            const tc = TENANT_CONFIG[t.id];
            const isActive = t.id === value;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => {
                  onChange(t.id);
                  setOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3.5 py-3 text-left transition-colors ${
                  isActive ? "bg-slate-50" : "hover:bg-slate-50/60"
                }`}
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{
                    background: isActive
                      ? `linear-gradient(135deg, ${tc.gradientFrom}, ${tc.gradientTo})`
                      : "#f1f5f9",
                  }}
                >
                  <RiWaterFlashLine
                    size={14}
                    className={isActive ? "text-white" : "text-slate-500"}
                  />
                </div>
                <div className="flex-1">
                  <p
                    className={`text-[12px] font-bold ${
                      isActive ? "text-slate-800" : "text-slate-600"
                    }`}
                  >
                    {t.name}
                  </p>
                  <p className="text-[10px] text-slate-400 font-medium">
                    {t.tagline}
                  </p>
                </div>
                {isActive && (
                  <HiOutlineCheck
                    size={15}
                    style={{ color: tc.accent }}
                    strokeWidth={3}
                  />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

// ─── Auth Tabs ────────────────────────────────────────────────────────────────

const AUTH_TABS = [
  {
    key: "password" as AuthTab,
    label: "Password",
    icon: <HiOutlineLockClosed size={13} />,
  },
  {
    key: "pin" as AuthTab,
    label: "Admin PIN",
    icon: <HiOutlineFingerPrint size={13} />,
  },
];

const AuthTabs: React.FC<{
  activeTab: AuthTab;
  onChange: (key: AuthTab) => void;
  accentColor: string;
}> = ({ activeTab, onChange, accentColor }) => {
  const activeIndex = AUTH_TABS.findIndex((t) => t.key === activeTab);
  return (
    <div
      className="relative flex rounded-xl p-[3px] gap-0.5"
      style={{ background: "#eef2f7" }}
    >
      <div
        className="absolute top-[3px] bottom-[3px] rounded-[9px] bg-white"
        style={{
          left: `calc(${activeIndex * 50}% + 3px)`,
          width: `calc(50% - 6px)`,
          transition: "left 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)",
          boxShadow:
            "0 1px 3px rgba(15,23,42,0.06), 0 0 0 1px rgba(15,23,42,0.03)",
        }}
      />
      {AUTH_TABS.map((tab) => (
        <button
          key={tab.key}
          type="button"
          onClick={() => onChange(tab.key)}
          className="relative z-10 flex-1 flex items-center justify-center gap-1.5 py-2 px-2 rounded-[9px] text-[11px] font-bold tracking-wide transition-colors duration-200"
          style={{ color: activeTab === tab.key ? accentColor : "#94a3b8" }}
        >
          {tab.icon}
          {tab.label}
        </button>
      ))}
    </div>
  );
};

// ─── Info Panel ───────────────────────────────────────────────────────────────

const InfoPanel: React.FC<{ tenant: string }> = ({ tenant }) => {
  const config = TENANT_CONFIG[tenant];
  return (
    <div
      className="hidden lg:flex flex-col p-9 xl:p-10 relative overflow-hidden min-h-full"
      style={{
        background: `linear-gradient(155deg, ${config.gradientFrom} 0%, ${config.accent} 55%, ${config.gradientTo} 100%)`,
        transition: "background 0.7s ease",
      }}
    >
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-white/[0.12] flex items-center justify-center border border-white/[0.08]">
          <RiWaterFlashLine size={20} className="text-white" />
        </div>
        <div>
          <h2 className="text-white text-[15px] font-extrabold tracking-tight leading-tight">
            {config.name}
          </h2>
          <p className="text-white/40 text-[11px] font-semibold">
            {config.tagline}
          </p>
        </div>
      </div>

      {/* Middle — flex-1 + justify-center keeps content vertically centered */}
      <div className="flex flex-col justify-center flex-1 gap-5 my-20">
        <LiveClock accent={config.accent} />
        <div>
          <h3 className="text-white text-[24px] xl:text-[28px] font-black leading-[1.12] tracking-tight mb-2.5">
            Smart Billing for Modern Delivery Operations
          </h3>
          <p className="text-white/35 text-[12px] leading-relaxed max-w-[300px] font-medium">
            {config.description}
          </p>
        </div>
        <FeatureList features={config.features} />
      </div>
    </div>
  );
};

// ─── Login Form ───────────────────────────────────────────────────────────────

const LoginForm: React.FC<{
  tenant: string;
  onTenantChange: (id: string) => void;
}> = ({ tenant, onTenantChange }) => {
  const config = TENANT_CONFIG[tenant];
  const [tab, setTab] = useState<AuthTab>("password");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState("");

  const handleTabChange = useCallback((key: AuthTab) => {
    setTab(key);
    setErrors({});
    setSubmitError("");
  }, []);

  const validate = useCallback((): boolean => {
    const e: Record<string, string> = {};
    if (tab === "password") {
      if (!email.trim()) e.email = "Email address is required";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
        e.email = "Please enter a valid email";
      if (!password) e.password = "Password is required";
      else if (password.length < 6)
        e.password = "Must be at least 6 characters";
    } else if (tab === "pin") {
      if (pin.length < 6) e.pin = "Enter all 6 digits";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }, [tab, email, password, pin]);

  const isDisabled = useMemo(() => {
    if (tab === "password") return !email.trim() || !password;
    if (tab === "pin") return pin.length < 6;
    return true;
  }, [tab, email, password, pin]);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      setSubmitError("");
      if (!validate()) return;
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        setSubmitError(
          "Invalid credentials — please verify your details and try again."
        );
      }, 2200);
    },
    [validate]
  );

  const btnLabel = useMemo(() => {
    const suffix = config.name.split(" ").pop();
    return tab === "password" ? `Sign in to ${suffix}` : "Authenticate";
  }, [tab, config.name]);

  return (
    <div className="flex flex-col justify-center px-7 sm:px-9 md:px-10 lg:px-11 xl:px-14 py-8 lg:py-10 w-full max-w-[460px] mx-auto lg:mx-0">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2.5 mb-4 lg:hidden">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{
              background: `linear-gradient(135deg, ${config.gradientFrom}, ${config.gradientTo})`,
            }}
          >
            <RiWaterFlashLine size={16} className="text-white" />
          </div>
          <span className="font-extrabold text-slate-800 text-[14px]">
            {config.name}
          </span>
        </div>
        <h1 className="text-[22px] font-black text-slate-900 tracking-tight leading-tight">
          Welcome back
        </h1>
        <p className="text-[13px] text-slate-500 mt-1 font-medium">
          Sign in to your{" "}
          <span className="font-bold" style={{ color: config.accent }}>
            {config.name}
          </span>{" "}
          dashboard
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-3.5"
        noValidate
      >
        <TenantSelector
          value={tenant}
          onChange={onTenantChange}
          tenants={TENANT_LIST}
        />
        <AuthTabs
          activeTab={tab}
          onChange={handleTabChange}
          accentColor={config.accent}
        />

        {/* Panels */}
        <div className="min-h-[180px] pt-0.5">
          {tab === "password" && (
            <div className="flex flex-col gap-3">
              <FormInput
                icon={<HiOutlineMail size={17} />}
                label="Email Address"
                type="email"
                value={email}
                onChange={setEmail}
                placeholder="you@company.com"
                error={errors.email}
                accentColor={config.accent}
                autoFocus
              />
              <FormInput
                icon={<HiOutlineLockClosed size={16} />}
                label="Password"
                type="password"
                value={password}
                onChange={setPassword}
                placeholder="Enter your password"
                error={errors.password}
                accentColor={config.accent}
              />
              <div className="flex items-center justify-between mt-0.5">
                <label
                  className="flex items-center gap-2 cursor-pointer select-none"
                  onClick={() => setRemember(!remember)}
                >
                  <div
                    className="w-4 h-4 rounded flex items-center justify-center border-[1.5px] transition-all duration-150"
                    style={
                      remember
                        ? {
                            background: config.accent,
                            borderColor: config.accent,
                          }
                        : { background: "#fff", borderColor: "#cbd5e1" }
                    }
                  >
                    {remember && (
                      <HiOutlineCheck
                        size={10}
                        className="text-white"
                        strokeWidth={3}
                      />
                    )}
                  </div>
                  <span className="text-[11px] text-slate-500 font-semibold">
                    Keep me signed in
                  </span>
                </label>
                <button
                  type="button"
                  className="text-[11px] font-bold hover:opacity-70 transition-opacity"
                  style={{ color: config.accent }}
                >
                  Reset password
                </button>
              </div>
            </div>
          )}
          {tab === "pin" && (
            <div className="flex flex-col gap-4">
              <div
                className="flex items-start gap-2.5 p-3.5 rounded-xl border"
                style={{
                  background: "#fffbeb",
                  borderColor: "rgba(253,230,138,0.5)",
                }}
              >
                <HiOutlineShieldCheck
                  size={16}
                  className="text-amber-600 mt-0.5 flex-shrink-0"
                />
                <div>
                  <p className="text-[11px] font-bold text-amber-900">
                    Restricted Access
                  </p>
                  <p className="text-[10px] text-amber-700/60 mt-0.5 leading-relaxed">
                    Admin PIN is for authorized administrators only. Attempts
                    are monitored.
                  </p>
                </div>
              </div>
              <PinField
                value={pin}
                onChange={setPin}
                error={errors.pin}
                accentColor={config.accent}
              />
            </div>
          )}
        </div>

        {/* Error */}
        {submitError && (
          <div
            className="flex items-start gap-2.5 px-3.5 py-3 rounded-xl border"
            style={{
              background: "#fef2f2",
              borderColor: "rgba(252,165,165,0.4)",
            }}
          >
            <HiOutlineExclamationCircle
              size={15}
              className="text-red-500 flex-shrink-0 mt-0.5"
            />
            <p className="text-[11px] text-red-600 font-semibold leading-relaxed">
              {submitError}
            </p>
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={isDisabled || loading}
          className="w-full flex items-center justify-center gap-2 py-3 px-5 rounded-xl text-[13px] font-bold transition-all duration-200 active:scale-[0.985] mt-0.5"
          style={
            isDisabled || loading
              ? {
                  background: "#e2e8f0",
                  color: "#94a3b8",
                  cursor: "not-allowed",
                }
              : {
                  background: `linear-gradient(135deg, ${config.gradientFrom}, ${config.accent})`,
                  color: "#fff",
                  boxShadow: `0 6px 20px -4px ${config.accent}40`,
                }
          }
        >
          {loading ? (
            <>
              <RiLoader4Line size={16} className="animate-spin" />
              Authenticating...
            </>
          ) : (
            <>
              {btnLabel}
              <HiArrowRight size={14} />
            </>
          )}
        </button>
      </form>

      <div className="flex items-center justify-center gap-1.5 mt-6">
        <div
          className="w-1 h-1 rounded-full transition-colors duration-500"
          style={{ background: config.accent }}
        />
        <p className="text-[10px] text-slate-400 font-semibold">
          Need access? Contact your system administrator
        </p>
      </div>
    </div>
  );
};

const LoginPage: React.FC = () => {
  const [tenant, setTenant] = useState<string>("balaji-aqua");
  return (
    <div className="min-h-screen flex items-center justify-center p-3 sm:p-5">
      <div
        className="w-full max-w-[1020px] bg-white rounded-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-[1fr_1.05fr] min-h-[620px] enter-anim"
        style={{
          boxShadow:
            "0 12px 48px -10px rgba(15,23,42,0.12), 0 0 0 1px rgba(15,23,42,0.04)",
        }}
      >
        <LoginForm tenant={tenant} onTenantChange={setTenant} />
        <InfoPanel tenant={tenant} />
      </div>
    </div>
  );
};

export default LoginPage;
