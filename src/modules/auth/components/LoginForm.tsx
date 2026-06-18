import React, { useState, useCallback, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import {
  HiOutlineExclamationCircle,
  HiOutlineArrowRight,
  HiOutlineCheck,
} from "react-icons/hi";
import CustomInput from "../../../components/common/CustomInput";
import TenantSelector, { IconDroplet } from "./TenantSelector";
import { TENANT_CONFIG } from "../constants/constants";
import type { TenantId } from "../types/Auth";
import { loginApi } from "../api/auth.api";
import { useAuthStore } from "../../../store/auth.store";

interface LoginFormValues {
  email: string;
  password: string;
}

interface LoginFormProps {
  tenant: TenantId;
  onTenantChange: (id: TenantId) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ tenant, onTenantChange }) => {
  const config = TENANT_CONFIG[tenant];
  const [remember, setRemember] = useState(false);
  const navigate = useNavigate();

  // Login mutation
  const login = useMutation({
    mutationKey: ["login"],
    mutationFn: (data: { email: string; password: string }) =>
      loginApi(data).then((res) => res.data),
    onSuccess: (data) => {
      useAuthStore.getState().setAuth(data);
      navigate("/admin/dashboard");
    },
  });

  const {
    control,
    handleSubmit: rhfSubmit,
    watch,
    formState: { errors },
  } = useForm<LoginFormValues>({
    defaultValues: { email: "", password: "" },
    mode: "onSubmit",
  });

  const onSubmit = useCallback(
    (data: LoginFormValues) => {
      login.mutate({
        email: data.email.trim(),
        password: data.password,
      });
    },
    [login]
  );

  const handleFormSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      rhfSubmit(onSubmit)(e);
    },
    [rhfSubmit, onSubmit]
  );

  const watched = watch();
  const isDisabled = useMemo(
    () => !watched.email?.trim() || !watched.password,
    [watched]
  );

  const apiErrorMessage = login.isError
    ? (login.error as any)?.message || "Login failed. Please try again."
    : "";

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

      <form
        onSubmit={handleFormSubmit}
        className="flex flex-col gap-4"
        noValidate
      >
        <TenantSelector value={tenant} onChange={onTenantChange} />

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
            <Link
              to="/forgot-password"
              className="text-xs font-bold opacity-85 hover:opacity-100 transition-opacity"
              style={{ color: config.accent }}
            >
              Forgot password?
            </Link>
          </div>
        </div>

        {apiErrorMessage && (
          <div className="flex items-start gap-3 px-4 py-3.5 rounded-xl bg-red-50 border border-red-200/35">
            <HiOutlineExclamationCircle
              size={15}
              className="text-red-500 shrink-0 mt-0.5"
            />
            <p className="text-xs font-semibold leading-relaxed text-red-600">
              {apiErrorMessage}
            </p>
          </div>
        )}

        <button
          type="submit"
          disabled={isDisabled || login.isPending}
          className={`w-full flex items-center justify-center gap-2.5 py-3.5 px-6 rounded-xl text-sm font-semibold mt-1 transition-all duration-200 ${
            isDisabled || login.isPending
              ? "bg-slate-200 text-slate-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl"
          }`}
        >
          {login.isPending ? (
            <>
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Authenticating...
            </>
          ) : (
            <>
              Sign in to {config.shortName}
              <HiOutlineArrowRight size={14} />
            </>
          )}
        </button>
      </form>

      <div className="text-center mt-6">
        <p className="text-xs font-semibold text-slate-500">
          Don&apos;t have an account?{" "}
          <Link
            to="/register"
            className="font-bold hover:underline"
            style={{ color: config.accent }}
          >
            Create one
          </Link>
        </p>
      </div>

      <div className="flex items-center justify-center gap-2 mt-6">
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
