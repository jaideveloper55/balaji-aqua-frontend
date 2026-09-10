import { useState, useMemo } from "react";
import { Table, Switch, Tooltip } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useForm } from "react-hook-form";
import {
  HiOutlineShieldCheck,
  HiOutlinePencilAlt,
  HiOutlineOfficeBuilding,
  HiOutlineUserAdd,
} from "react-icons/hi";
import CustomPageHeader from "../../components/common/CustomPageHeader";
import CustomSelect from "../../components/common/CustomSelect";
import CustomInput from "../../components/common/CustomInput";
import { successNotification } from "../../components/common/Notification";

import ChangeRoleModal from "./components/Changerolemodal";
import CreateUserModal from "./components/Createusermodal";
import { CreateUserPayload, UamUser, UserRole } from "./types/Uam";
import { DUMMY_COMPANIES, DUMMY_USERS } from "./constants/DummyUsers";

const ROLE_FILTER_OPTIONS = [
  { value: "ALL", label: "All Roles" },
  { value: "SUPER_ADMIN", label: "Super Admin" },
  { value: "ADMIN", label: "Admin" },
  { value: "STAFF", label: "Staff" },
  { value: "DELIVERY_BOY", label: "Delivery Boy" },
];

const ROLE_STYLES: Record<
  UserRole,
  { bg: string; text: string; label: string }
> = {
  SUPER_ADMIN: {
    bg: "bg-purple-50",
    text: "text-purple-700",
    label: "Super Admin",
  },
  ADMIN: {
    bg: "bg-blue-50",
    text: "text-blue-700",
    label: "Admin",
  },
  STAFF: {
    bg: "bg-slate-100",
    text: "text-slate-700",
    label: "Staff",
  },
  DELIVERY_BOY: {
    bg: "bg-amber-50",
    text: "text-amber-700",
    label: "Delivery Boy",
  },
};

const initials = (first: string, last: string) =>
  `${first?.[0] ?? ""}${last?.[0] ?? ""}`.toUpperCase();

const UamPage = () => {
  const { control, watch } = useForm({
    defaultValues: { roleFilter: "ALL", search: "" },
  });
  const search = watch("search");

  const [users, setUsers] = useState<UamUser[]>(DUMMY_USERS);
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [editingUser, setEditingUser] = useState<UamUser | null>(null);
  const [createOpen, setCreateOpen] = useState(false);

  const filteredUsers = useMemo(() => {
    let rows = users;
    if (roleFilter !== "ALL") rows = rows.filter((u) => u.role === roleFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      rows = rows.filter(
        (u) =>
          `${u.firstName} ${u.lastName}`.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q)
      );
    }
    return rows;
  }, [users, roleFilter, search]);

  const handleToggleActive = (id: string, isActive: boolean) => {
    const target = users.find((u) => u.id === id);
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, isActive } : u)));
    successNotification(
      isActive ? "User Activated" : "User Deactivated",
      `${target?.firstName ?? "User"}'s access has been updated.`
    );
  };

  const handleRoleSaved = (id: string, role: UserRole) => {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, role } : u)));
  };

  const handleUserCreated = (payload: CreateUserPayload) => {
    const company = payload.companyId
      ? DUMMY_COMPANIES.find((c) => c.id === payload.companyId)
      : undefined;

    const newUser: UamUser = {
      id: `u${Date.now()}`,
      firstName: payload.firstName,
      lastName: payload.lastName,
      email: payload.email,
      phone: payload.phone,
      role: payload.role,
      isActive: true,
      createdAt: new Date().toISOString(),
      userCompanies: company ? [{ company }] : [],
    };

    setUsers((prev) => [newUser, ...prev]);
  };

  const columns: ColumnsType<UamUser> = [
    {
      title: "User",
      key: "user",
      width: 200,
      render: (_, u) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs shrink-0">
            {initials(u.firstName, u.lastName)}
          </div>
          <div className="min-w-0">
            <div className="font-semibold text-slate-800 truncate">
              {u.firstName} {u.lastName}
            </div>
            <div className="text-[11px] text-slate-500 truncate">{u.email}</div>
          </div>
        </div>
      ),
    },
    {
      title: "Company",
      key: "company",
      width: 220,
      align: "center",
      render: (_, u) =>
        u.userCompanies.length === 0 ? (
          <div className="w-full flex justify-center">
            <span className="text-[12px] text-slate-300">
              — platform-wide —
            </span>
          </div>
        ) : (
          <div className="w-full flex flex-wrap justify-center gap-1">
            {u.userCompanies.map(({ company }) => (
              <span
                key={company.id}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-slate-50 border border-slate-200 text-[11px] text-slate-600"
              >
                <HiOutlineOfficeBuilding className="w-3 h-3 text-slate-400" />
                {company.name}
              </span>
            ))}
          </div>
        ),
    },
    {
      title: "Role",
      key: "role",
      align: "center",
      width: 140,
      render: (_, u) => {
        const style = ROLE_STYLES[u.role];
        return (
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${style.bg} ${style.text}`}
          >
            {style.label}
          </span>
        );
      },
    },
    {
      title: "Status",
      key: "status",
      align: "center",
      width: 110,
      render: (_, u) => (
        <Tooltip
          title={u.isActive ? "Click to deactivate" : "Click to activate"}
        >
          <Switch
            size="small"
            checked={u.isActive}
            onChange={(checked) => handleToggleActive(u.id, checked)}
          />
        </Tooltip>
      ),
    },
    {
      title: "",
      key: "actions",
      width: 80,
      align: "right",
      render: (_, u) => (
        <Tooltip title="Change role">
          <button
            onClick={() => setEditingUser(u)}
            className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <HiOutlinePencilAlt size={16} className="text-slate-500" />
          </button>
        </Tooltip>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <CustomPageHeader
        icon={<HiOutlineShieldCheck className="text-white" size={20} />}
        title="User Access Management"
        subtitle="Manage roles and access across every company on the platform"
        iconBg="bg-blue-600"
        actions={
          <button
            onClick={() => setCreateOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm transition flex items-center gap-2 shadow-sm"
          >
            <HiOutlineUserAdd className="w-5 h-5" /> Add User
          </button>
        }
      />

      <div className="flex items-center gap-6 flex-wrap">
        <div className="flex-1 min-w-[240px] max-w-md">
          <CustomInput
            name="search"
            control={control}
            errors={{}}
            iconType="search"
            placeholder="Search by name or email..."
          />
        </div>

        <div className="w-48">
          <CustomSelect
            name="roleFilter"
            control={control}
            errors={{}}
            placeholder="Filter by role"
            options={ROLE_FILTER_OPTIONS}
            value={roleFilter}
            onChange={(v) => setRoleFilter(v)}
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <Table<UamUser>
          rowKey="id"
          columns={columns}
          dataSource={filteredUsers}
          pagination={{
            pageSize: 15,
            showTotal: (total, range) =>
              `Showing ${range[0]}–${range[1]} of ${total} users`,
          }}
          locale={{
            emptyText: (
              <div className="py-16 text-center">
                <div className="w-16 h-16 rounded-2xl bg-purple-50 flex items-center justify-center mx-auto mb-4">
                  <HiOutlineShieldCheck className="w-8 h-8 text-purple-400" />
                </div>
                <div className="font-semibold text-slate-700">
                  No users found
                </div>
                <div className="text-sm text-slate-500 mt-1">
                  Try a different search or role filter.
                </div>
              </div>
            ),
          }}
        />
      </div>

      <ChangeRoleModal
        user={editingUser}
        open={!!editingUser}
        onClose={() => setEditingUser(null)}
        onSaved={handleRoleSaved}
      />

      <CreateUserModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreated={handleUserCreated}
        existingUsers={users}
      />
    </div>
  );
};

export default UamPage;
