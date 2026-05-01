import { HiOutlineMail, HiOutlineShieldCheck } from "react-icons/hi";
import type { User } from "../../auth/types/Auth";

interface ProfileHeaderProps {
  user: User;
}

const ROLE_COLORS: Record<string, { bg: string; text: string; label: string }> =
  {
    SUPER_ADMIN: {
      bg: "bg-purple-50",
      text: "text-purple-700",
      label: "Super Admin",
    },
    ADMIN: { bg: "bg-blue-50", text: "text-blue-700", label: "Admin" },
    STAFF: { bg: "bg-green-50", text: "text-green-700", label: "Staff" },
    DELIVERY_BOY: {
      bg: "bg-amber-50",
      text: "text-amber-700",
      label: "Delivery",
    },
  };

export const ProfileHeader = ({ user }: ProfileHeaderProps) => {
  const initials = `${user.firstName?.[0] ?? ""}${
    user.lastName?.[0] ?? ""
  }`.toUpperCase();
  const fullName = `${user.firstName} ${user.lastName}`.trim();
  const roleStyle = ROLE_COLORS[user.role] ?? ROLE_COLORS.STAFF;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/70 p-6 shadow-sm">
      <div className="flex items-center gap-5">
        {/* Avatar */}
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-bold text-2xl shadow-md">
          {initials || "U"}
        </div>

        {/* Name + meta */}
        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-bold text-slate-900 truncate">
            {fullName || "User"}
          </h1>
          <div className="flex flex-wrap items-center gap-3 mt-1.5">
            <div className="flex items-center gap-1.5 text-sm text-slate-500">
              <HiOutlineMail size={14} />
              <span className="truncate">{user.email}</span>
            </div>
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${roleStyle.bg} ${roleStyle.text}`}
            >
              <HiOutlineShieldCheck size={12} />
              {roleStyle.label}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
