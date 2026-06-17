import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Spin } from "antd";
import {
  HiOutlineUser,
  HiOutlineLockClosed,
  HiOutlineOfficeBuilding,
} from "react-icons/hi";
import { useAuthStore } from "../../../store/auth.store";
import { getMeApi } from "../../auth/api/auth.api";

import ProfileHeader from "../components/ProfileHeader";
import ProfileInfoForm from "../components/ProfileInfoForm";
import ChangePasswordForm from "../components/ChangePasswordForm";
import MyCompaniesList from "../components/MyCompaniesList";

type TabId = "info" | "password" | "companies";

const TABS: Array<{
  id: TabId;
  label: string;
  icon: React.ComponentType<{ size?: number }>;
}> = [
  { id: "info", label: "Personal Info", icon: HiOutlineUser },
  { id: "password", label: "Change Password", icon: HiOutlineLockClosed },
  { id: "companies", label: "My Companies", icon: HiOutlineOfficeBuilding },
];

const ProfilePage = () => {
  const storeUser = useAuthStore((s) => s.user);
  const [activeTab, setActiveTab] = useState<TabId>("info");

  // ─── Fetch fresh profile data ──────────────────────────────────────────────
  const { data: me, isLoading } = useQuery({
    queryKey: ["getMe"],
    queryFn: () => getMeApi().then((res) => res.data),
    refetchOnWindowFocus: false,
  });

  // Prefer fresh server data, fall back to store
  const user = me ?? storeUser;

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-3">
        <Spin size="large" />
        <p className="text-sm text-slate-500">Loading profile...</p>
      </div>
    );
  }

  return (
    <Spin spinning={isLoading && !me}>
      <div className="max-w-4xl mx-auto pb-10">
        {/* Page title */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            My Profile
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage your account settings and preferences
          </p>
        </div>

        {/* Header card */}
        <ProfileHeader user={user} />

        {/* Tabs */}
        <div className="mt-6 bg-white rounded-2xl border border-slate-200/70 shadow-sm overflow-hidden">
          <div className="flex border-b border-slate-200 overflow-x-auto">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-5 py-3.5 text-sm font-semibold whitespace-nowrap transition-all
                    ${
                      isActive
                        ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50/30"
                        : "text-slate-500 hover:text-slate-700 border-b-2 border-transparent"
                    }`}
                >
                  <Icon size={16} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab content */}
        <div className="mt-6">
          {activeTab === "info" && <ProfileInfoForm user={user as any} />}
          {activeTab === "password" && <ChangePasswordForm />}
          {activeTab === "companies" && <MyCompaniesList />}
        </div>
      </div>
    </Spin>
  );
};

export default ProfilePage;
