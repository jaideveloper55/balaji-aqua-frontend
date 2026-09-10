import { useEffect, useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { Switch } from "antd";
import { HiOutlineShieldCheck, HiOutlineMenuAlt2 } from "react-icons/hi";
import CustomModal from "../../../components/common/CustomModal";
import CustomSelect from "../../../components/common/CustomSelect";
import { successNotification } from "../../../components/common/Notification";
import { getOrgConfig } from "../../../config/orgConfig";
import type { MenuItem } from "../../../config/orgConfig";
import type { UamUser, UserRole } from "../types/Uam";

interface Props {
  user: UamUser | null;
  open: boolean;
  onClose: () => void;
  onSaved: (userId: string, role: UserRole) => void;
}

const ROLE_OPTIONS = [
  { value: "SUPER_ADMIN", label: "Super Admin — full platform access" },
  { value: "ADMIN", label: "Admin — owns their company" },
  { value: "STAFF", label: "Staff — limited office access" },
  { value: "DELIVERY_BOY", label: "Delivery Boy — assigned deliveries only" },
];

interface FormValues {
  role: UserRole;
}

// An item with no `roles` restriction is visible to everyone today — that
// counts as "allowed" by default when we first show the checklist for a role.
const computeDefaultAllowedIds = (role: UserRole, items: MenuItem[]) =>
  items
    .filter((item) => !item.roles || item.roles.includes(role))
    .map((i) => i.id);

const ChangeRoleModal = ({ user, open, onClose, onSaved }: Props) => {
  const { control, handleSubmit, reset, watch } = useForm<FormValues>({
    defaultValues: { role: "STAFF" },
  });
  const [isSaving, setIsSaving] = useState(false);
  const [allowedMenuIds, setAllowedMenuIds] = useState<string[]>([]);

  const selectedRole = watch("role");

  // ⚠️ SIMPLIFICATION: sourced from the Water Plant org's menu set specifically,
  // since that's the org currently active in this app. A user belonging to a
  // BEVERAGE-type company (e.g. Chennai Beverages Co) would actually see a
  // different menu — once real per-company menu resolution exists, this
  // should key off THAT company's config instead of a hardcoded org id.
  const menuItems = useMemo(() => getOrgConfig("balaji-aqua").menuItems, []);

  const groupedMenuItems = useMemo(() => {
    const groups = new Map<string, MenuItem[]>();
    for (const item of menuItems) {
      if (!groups.has(item.group)) groups.set(item.group, []);
      groups.get(item.group)!.push(item);
    }
    return Array.from(groups.entries());
  }, [menuItems]);

  useEffect(() => {
    if (open && user) reset({ role: user.role });
  }, [open, user, reset]);

  // Re-derives the checklist every time the selected role changes — including
  // right when the modal opens. This intentionally OVERWRITES any manual
  // toggles if the role dropdown is changed afterward, trading a small
  // amount of "lost edits" risk for a much simpler, more predictable model:
  // switching roles always shows that role's real current defaults, not a
  // half-edited mix carried over from whichever role was selected before.
  useEffect(() => {
    if (open)
      setAllowedMenuIds(computeDefaultAllowedIds(selectedRole, menuItems));
  }, [open, selectedRole, menuItems]);

  if (!user) return null;

  const isSuperAdminSelected = selectedRole === "SUPER_ADMIN";
  const isNoOp = selectedRole === user.role;

  const toggleMenuItem = (id: string) => {
    if (isSuperAdminSelected) return; // guarded — see note above render
    setAllowedMenuIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const submit = (values: FormValues) => {
    setIsSaving(true);
    // TEMP: only the role itself is actually persisted right now (via
    // onSaved, into UamPage's dummy-data state). The menu-access toggles
    // above are interactive and correct, but there's no backend model yet
    // to save THOSE against — that needs a real RolePermission table plus
    // an API call here once the dummy-data phase is done.
    setTimeout(() => {
      onSaved(user.id, values.role);
      successNotification(
        "Role Updated",
        `${user.firstName} is now ${values.role
          .replace("_", " ")
          .toLowerCase()} — ${
          allowedMenuIds.length
        } menu item(s) enabled for this role.`
      );
      setIsSaving(false);
      onClose();
    }, 500);
  };

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
        disabled={isSaving || isNoOp}
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

        {isSuperAdminSelected && (
          <div className="rounded-lg bg-blue-50 border border-blue-100 px-3 py-2 text-xs text-blue-700">
            Super Admin can see and manage every company on the platform — grant
            this carefully.
          </div>
        )}

        {/* ── Menu Access ─────────────────────────────────────────────
            Applies to the whole ROLE, not just this one person — flagged
            explicitly so nobody mistakes this for a per-user override. */}
        <div className="border-t border-slate-100 pt-4">
          <div className="flex items-center gap-2 mb-1">
            <HiOutlineMenuAlt2 className="text-slate-400" size={16} />
            <p className="text-sm font-semibold text-slate-700">
              Menu Access for "
              {
                ROLE_OPTIONS.find((r) => r.value === selectedRole)?.label.split(
                  " —"
                )[0]
              }
              "
            </p>
          </div>
          <p className="text-[11px] text-slate-400 mb-3">
            These toggles apply to everyone with this role, not just{" "}
            {user.firstName}.
            {isSuperAdminSelected &&
              " Super Admin always has full access and can't be restricted here."}
          </p>

          <div className="max-h-64 overflow-y-auto pr-1 flex flex-col gap-4">
            {groupedMenuItems.map(([group, items]) => (
              <div key={group}>
                <p className="text-[10px] font-bold tracking-wider text-slate-400 uppercase mb-1.5">
                  {group}
                </p>
                <div className="flex flex-col gap-1.5">
                  {items.map((item) => {
                    const Icon = item.icon;
                    const checked =
                      isSuperAdminSelected || allowedMenuIds.includes(item.id);
                    return (
                      <div
                        key={item.id}
                        className="flex items-center justify-between px-3 py-2 rounded-lg bg-slate-50 border border-slate-100"
                      >
                        <div className="flex items-center gap-2">
                          <Icon className="text-slate-400" size={15} />
                          <span className="text-[13px] text-slate-700">
                            {item.label}
                          </span>
                        </div>
                        <Switch
                          size="small"
                          checked={checked}
                          disabled={isSuperAdminSelected}
                          onChange={() => toggleMenuItem(item.id)}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </CustomModal>
  );
};

export default ChangeRoleModal;
