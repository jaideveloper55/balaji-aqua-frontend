import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Switch, Spin } from "antd";
import { HiOutlineShieldCheck, HiOutlineMenuAlt2 } from "react-icons/hi";
import CustomModal from "../../../components/common/CustomModal";
import CustomSelect from "../../../components/common/CustomSelect";
import { errorNotification } from "../../../components/common/Notification";
import {
  getRolePermissionsApi,
  updateRolePermissionsApi,
} from "../api/uam.api";

import type { MenuKey, MenuPermission, UamUser, UserRole } from "../types/Uam";
import {
  ALL_MENU_KEYS,
  GROUPED_MENU_KEYS,
  MENU_KEY_META,
} from "../constants/menuKeyMeta";

type AssignableRole = Exclude<UserRole, "SUPER_ADMIN">;

interface Props {
  user: UamUser | null;
  open: boolean;
  onClose: () => void;
  onSaved: (userId: string, role: UserRole) => void;
}

const ROLE_OPTIONS: { value: AssignableRole; label: string }[] = [
  { value: "ADMIN", label: "Admin — owns their company" },
  { value: "STAFF", label: "Staff — limited office access" },
  { value: "DELIVERY_BOY", label: "Delivery Boy — assigned deliveries only" },
];

const ROLE_LABEL: Record<AssignableRole, string> = {
  ADMIN: "Admin",
  STAFF: "Staff",
  DELIVERY_BOY: "Delivery Boy",
};

interface FormValues {
  role: AssignableRole;
}

const ChangeRoleModal = ({ user, open, onClose, onSaved }: Props) => {
  const queryClient = useQueryClient();
  const { control, handleSubmit, reset, watch } = useForm<FormValues>({
    defaultValues: { role: "STAFF" },
  });
  const selectedRole = watch("role");

  const [permissionMap, setPermissionMap] = useState<
    Partial<Record<MenuKey, boolean>>
  >({});

  useEffect(() => {
    if (open && user && user.role !== "SUPER_ADMIN") {
      reset({ role: user.role as AssignableRole });
    }
  }, [open, user, reset]);

  const { data: permissionsData, isLoading: isLoadingPermissions } = useQuery({
    queryKey: ["role-permissions", selectedRole],
    queryFn: () =>
      getRolePermissionsApi(selectedRole).then(
        (res) => res.data as MenuPermission[]
      ),
    enabled: open && !!user && user.role !== "SUPER_ADMIN",
  });

  useEffect(() => {
    if (permissionsData) {
      const map: Partial<Record<MenuKey, boolean>> = {};
      permissionsData.forEach((p) => {
        map[p.menuKey] = p.isEnabled;
      });
      setPermissionMap(map);
    }
  }, [permissionsData]);

  const permissionsMutation = useMutation({
    mutationFn: ({
      role,
      items,
    }: {
      role: AssignableRole;
      items: MenuPermission[];
    }) => updateRolePermissionsApi(role, items).then((res) => res.data),
  });

  if (!user) return null;

  if (user.role === "SUPER_ADMIN") {
    return (
      <CustomModal
        open={open}
        onClose={onClose}
        title="Change User Role"
        subtitle={`${user.firstName} ${user.lastName} · ${user.email}`}
        icon={<HiOutlineShieldCheck size={22} />}
        iconTone="blue"
      >
        <div className="rounded-lg bg-slate-50 border border-slate-200 px-4 py-3 text-sm text-slate-600">
          Super Admin accounts have full platform access by default and aren't
          managed from this screen.
        </div>
      </CustomModal>
    );
  }

  const toggleMenuItem = (menuKey: MenuKey) => {
    setPermissionMap((prev) => ({ ...prev, [menuKey]: !prev[menuKey] }));
  };

  const submit = (values: FormValues) => {
    const items: MenuPermission[] = ALL_MENU_KEYS.map((menuKey) => ({
      menuKey,
      isEnabled: permissionMap[menuKey] ?? false,
    }));

    permissionsMutation.mutate(
      { role: values.role, items },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ["role-permissions", values.role],
          });
          onSaved(user.id, values.role);
          onClose();
        },
        onError: (err: any) =>
          errorNotification(
            "Save Failed",
            err?.message ?? "Could not save menu access for this role"
          ),
      }
    );
  };

  const isSaving = permissionsMutation.isPending;

  const footer = (
    <div className="flex justify-end gap-2">
      <button
        onClick={onClose}
        disabled={isSaving}
        className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium text-sm transition disabled:opacity-50"
      >
        Cancel
      </button>
      <button
        onClick={handleSubmit(submit)}
        disabled={isSaving || isLoadingPermissions}
        className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition shadow-sm shadow-blue-500/25 disabled:opacity-50"
      >
        {isSaving ? "Saving..." : "Save Role"}
      </button>
    </div>
  );

  return (
    <CustomModal
      open={open}
      onClose={onClose}
      title="Change User Role"
      subtitle={`${user.firstName} ${user.lastName} · ${user.email}`}
      icon={<HiOutlineShieldCheck size={22} />}
      iconTone="blue"
      size="xl"
      footer={footer}
      closeOnOverlayClick={!isSaving}
      closeOnEsc={!isSaving}
      showCloseButton={!isSaving}
    >
      <div className="flex flex-col gap-5">
        <CustomSelect
          label="Role"
          name="role"
          control={control}
          errors={{}}
          placeholder="Select a role"
          options={ROLE_OPTIONS}
          isrequired
        />

        <div className="border-t border-slate-100 pt-4">
          <div className="flex items-center gap-2 mb-1">
            <HiOutlineMenuAlt2 className="text-slate-400" size={16} />
            <p className="text-sm font-semibold text-slate-700">
              Menu Access for "{ROLE_LABEL[selectedRole]}"
            </p>
          </div>
          <p className="text-[11px] text-slate-400 mb-3">
            These toggles apply to everyone with this role, not just{" "}
            {user.firstName}.
          </p>

          {isLoadingPermissions ? (
            <div className="flex justify-center py-10">
              <Spin size="small" />
            </div>
          ) : (
            <div className="max-h-64 overflow-y-auto pr-1 flex flex-col gap-4">
              {GROUPED_MENU_KEYS.map(([group, keys]) => (
                <div key={group}>
                  <p className="text-[10px] font-bold tracking-wider text-slate-400 uppercase mb-1.5">
                    {group}
                  </p>
                  <div className="flex flex-col gap-1.5">
                    {keys.map((menuKey) => {
                      const meta = MENU_KEY_META[menuKey];
                      const Icon = meta.icon;
                      const checked = permissionMap[menuKey] ?? false;
                      return (
                        <div
                          key={menuKey}
                          className="flex items-center justify-between px-3 py-2 rounded-lg bg-slate-50 border border-slate-100"
                        >
                          <div className="flex items-center gap-2">
                            <Icon className="text-slate-400" size={15} />
                            <span className="text-[13px] text-slate-700">
                              {meta.label}
                            </span>
                          </div>
                          <Switch
                            size="small"
                            checked={checked}
                            onChange={() => toggleMenuItem(menuKey)}
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </CustomModal>
  );
};

export default ChangeRoleModal;
