import { useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Table, Switch, Tooltip, Spin } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useForm } from "react-hook-form";
import {
  HiOutlineShieldCheck,
  HiOutlinePencilAlt,
  HiOutlineOfficeBuilding,
  HiOutlineUserAdd,
  HiOutlineTrash,
} from "react-icons/hi";
import CustomPageHeader from "../../components/common/CustomPageHeader";
import CustomSelect from "../../components/common/CustomSelect";
import CustomInput from "../../components/common/CustomInput";
import {
  successNotification,
  errorNotification,
} from "../../components/common/Notification";

import ChangeRoleModal from "./components/Changerolemodal";
import CreateUserModal from "./components/Createusermodal";
import DeleteUserModal from "./components/Deleteusermodal";
import {
  getUsersApi,
  createUserApi,
  updateUserRoleApi,
  updateUserStatusApi,
  deleteUserPermanentlyApi,
} from "./api/uam.api";
import type { CreateUserPayload, UamUser, UserRole } from "./types/Uam";
import { useAuthStore } from "../../store/auth.store";

const ROLE_FILTER_OPTIONS = [
  { value: "ALL", label: "All Roles" },
  { value: "SUPER_ADMIN", label: "Super Admin" },
  { value: "ADMIN", label: "Admin" },
  { value: "STAFF", label: "Staff" },
  { value: "DELIVERY_BOY", label: "Delivery Boy" },
];

const ROLE_STYLES: Record<
  UserRole,
  {
    bg: string;
    text: string;
    label: string;
  }
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
  const queryClient = useQueryClient();
  const currentUserId = useAuthStore((s) => s.user?.id);

  const { control, watch } = useForm({
    defaultValues: { search: "", roleFilter: "ALL" },
  });
  const search = watch("search");
  const roleFilter = watch("roleFilter") as UserRole | "ALL";

  const [editingUser, setEditingUser] = useState<UamUser | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<UamUser | null>(null);

  const {
    data: usersData,
    isLoading: isLoadingUsers,
    isFetching: isFetchingUsers,
  } = useQuery({
    queryKey: ["users"],
    queryFn: () => getUsersApi().then((res) => res.data),
  });

  // Permanent, irreversible delete — separate from the Status switch below,
  // which stays reversible. Blocked server-side (409) if the user has any
  // linked invoices/payments/etc.
  const deleteMutation = useMutation({
    mutationFn: (id: string) =>
      deleteUserPermanentlyApi(id).then((res) => res.data),
    onSuccess: () => {
      successNotification(
        "User Deleted",
        "The account has been permanently removed."
      );
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (err: any) =>
      errorNotification(
        "Delete Failed",
        err?.message ?? "Could not delete this user"
      ),
  });

  const confirmDeleteUser = () => {
    if (!deleteTarget) return;
    deleteMutation.mutate(deleteTarget.id, {
      onSuccess: () => setDeleteTarget(null),
    });
  };

  const allUsers = usersData ?? [];

  const filteredUsers = useMemo(() => {
    let rows = allUsers;
    if (roleFilter !== "ALL") rows = rows.filter((u) => u.role === roleFilter);
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      rows = rows.filter(
        (u) =>
          `${u.firstName} ${u.lastName}`.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q)
      );
    }
    return rows;
  }, [allUsers, roleFilter, search]);

  // ── Create user ──
  const createMutation = useMutation({
    mutationFn: (data: CreateUserPayload) =>
      createUserApi(data).then((res) => res.data),
    onSuccess: (created) => {
      successNotification(
        "User Created",
        `${created.firstName} ${created.lastName} can now log in.`
      );
      setCreateOpen(false);
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (err: any) =>
      errorNotification(
        "Failed to Create User",
        err?.message ?? "Please check all required fields"
      ),
  });

  // ── Change role ──
  const roleMutation = useMutation({
    mutationFn: ({
      id,
      role,
    }: {
      id: string;
      role: Exclude<UserRole, "SUPER_ADMIN">;
    }) => updateUserRoleApi(id, role).then((res) => res.data),
    onSuccess: () => {
      successNotification("Role Updated", "The user's role has been changed.");
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (err: any) =>
      errorNotification(
        "Role Update Failed",
        err?.message ?? "Could not update role"
      ),
  });

  const handleRoleSaved = (id: string, role: UserRole) => {
    if (role === "SUPER_ADMIN") {
      errorNotification(
        "Not Allowed",
        "Super Admin access can't be granted from this screen."
      );
      return;
    }
    roleMutation.mutate({ id, role });
  };

  // ── Toggle active status (reversible — separate from permanent delete) ──
  const statusMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      updateUserStatusApi(id, isActive).then((res) => res.data),
    onSuccess: (_data, variables) => {
      successNotification(
        variables.isActive ? "User Activated" : "User Deactivated",
        "Their access has been updated."
      );
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (err: any) =>
      errorNotification(
        "Update Failed",
        err?.message ?? "Could not update user status"
      ),
  });

  const handleToggleActive = (id: string, isActive: boolean) => {
    statusMutation.mutate({ id, isActive });
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
        u.companies.length === 0 ? (
          <div className="w-full flex justify-center">
            <span className="text-[12px] text-slate-300">
              — platform-wide —
            </span>
          </div>
        ) : (
          <div className="w-full flex flex-wrap justify-center gap-1">
            {u.companies.map((c) => (
              <span
                key={c.id}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-slate-50 border border-slate-200 text-[11px] text-slate-600"
              >
                <HiOutlineOfficeBuilding className="w-3 h-3 text-slate-400" />
                {c.name}
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
            loading={
              statusMutation.isPending && statusMutation.variables?.id === u.id
            }
            onChange={(checked) => handleToggleActive(u.id, checked)}
          />
        </Tooltip>
      ),
    },
    {
      title: "",
      key: "actions",
      width: 110,
      align: "right",
      render: (_, u) => {
        const isSelf = u.id === currentUserId;
        const isSuperAdmin = u.role === "SUPER_ADMIN";
        const canDelete = !isSelf && !isSuperAdmin;

        return (
          <div className="flex items-center justify-end gap-1">
            <Tooltip title="Change role">
              <button
                onClick={() => setEditingUser(u)}
                className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <HiOutlinePencilAlt size={16} className="text-slate-500" />
              </button>
            </Tooltip>

            <Tooltip
              title={
                isSelf
                  ? "You can't delete your own account"
                  : isSuperAdmin
                  ? "Super Admin can't be deleted"
                  : "Permanently delete user"
              }
            >
              <button
                onClick={() => canDelete && setDeleteTarget(u)}
                disabled={!canDelete}
                className="p-2 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-30 disabled:hover:bg-transparent disabled:cursor-not-allowed"
              >
                <HiOutlineTrash size={16} className="text-red-500" />
              </button>
            </Tooltip>
          </div>
        );
      },
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
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <Spin spinning={isLoadingUsers || isFetchingUsers}>
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
        </Spin>
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
        onCreated={(payload) => createMutation.mutate(payload)}
        existingUsers={allUsers}
        isSubmitting={createMutation.isPending}
      />

      <DeleteUserModal
        open={!!deleteTarget}
        user={deleteTarget}
        isDeleting={deleteMutation.isPending}
        onConfirm={confirmDeleteUser}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  );
};

export default UamPage;
