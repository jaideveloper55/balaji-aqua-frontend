import React from "react";
import { HiOutlineLockClosed, HiOutlineFingerPrint } from "react-icons/hi";
import CustomTabs, { TabItem } from "../../../components/common/CustomTabs";
import type { AuthTabKey } from "../types/Auth";

interface AuthTabsProps {
  activeTab: AuthTabKey;
  onChange: (key: AuthTabKey) => void;
  accentColor: string;
}

const AUTH_TABS: TabItem[] = [
  {
    key: "password",
    label: "Password",
    icon: <HiOutlineLockClosed size={13} />,
  },
  {
    key: "pin",
    label: "Admin PIN",
    icon: <HiOutlineFingerPrint size={13} />,
  },
];

const AuthTabs: React.FC<AuthTabsProps> = ({
  activeTab,
  onChange,
  accentColor,
}) => {
  return (
    <CustomTabs
      items={AUTH_TABS}
      activeKey={activeTab}
      onChange={(key) => onChange(key as AuthTabKey)}
      accentColor={accentColor}
    />
  );
};

export default AuthTabs;
