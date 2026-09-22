import { HiOutlineTrash, HiOutlineExclamationCircle } from "react-icons/hi";
import CustomModal from "../../../components/common/CustomModal";
import type { UamUser } from "../types/Uam";

interface Props {
  open: boolean;
  user: UamUser | null;
  isDeleting: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

const DeleteUserModal = ({
  open,
  user,
  isDeleting,
  onConfirm,
  onClose,
}: Props) => {
  // Same defensive pattern as the rest of the app's modals: nothing to
  // render if there's no target yet, rather than rendering a modal shell
  // around a `null` user and crashing on `user.firstName`.
  if (!user) return null;

  const fullName = `${user.firstName} ${user.lastName}`;

  const footer = (
    <div className="flex justify-end gap-2">
      <button
        onClick={onClose}
        disabled={isDeleting}
        className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium text-sm transition disabled:opacity-50"
      >
        Cancel
      </button>
      <button
        onClick={onConfirm}
        disabled={isDeleting}
        className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold text-sm transition shadow-sm shadow-red-500/25 disabled:opacity-50 flex items-center gap-2"
      >
        <HiOutlineTrash size={16} />
        {isDeleting ? "Deleting..." : "Delete Permanently"}
      </button>
    </div>
  );

  return (
    <CustomModal
      open={open}
      onClose={onClose}
      title="Delete User"
      subtitle={`${fullName} — this cannot be undone`}
      icon={<HiOutlineTrash size={22} />}
      iconTone="red"
      size="md"
      footer={footer}
      closeOnOverlayClick={!isDeleting}
      closeOnEsc={!isDeleting}
      showCloseButton={!isDeleting}
    >
      <div className="flex flex-col gap-5">
        <div className="flex items-start gap-3 bg-red-50 border border-red-100 rounded-xl p-4">
          <HiOutlineExclamationCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
          <p className="text-[13px] text-red-700 leading-relaxed">
            Permanently delete <b>{fullName}</b>? This action cannot be undone.
          </p>
        </div>

        <div>
          <p className="text-[11px] font-bold tracking-wider text-slate-400 uppercase mb-2">
            This Will
          </p>
          <div className="flex flex-col divide-y divide-slate-100 border border-slate-100 rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 bg-white">
              <span className="text-[13px] text-slate-600">
                Revoke login access
              </span>
              <span className="text-[13px] font-semibold text-slate-800">
                Immediately
              </span>
            </div>
            <div className="flex items-center justify-between px-4 py-3 bg-white">
              <span className="text-[13px] text-slate-600">
                Remove their account record
              </span>
              <span className="text-[13px] font-semibold text-slate-800">
                Permanently
              </span>
            </div>
          </div>
        </div>

        <p className="text-[12px] text-slate-500 leading-relaxed">
          If <b>{user.firstName}</b> has created any invoices, payments, or
          orders, deletion will be blocked automatically instead — their history
          can't be silently erased.
        </p>
      </div>
    </CustomModal>
  );
};

export default DeleteUserModal;
