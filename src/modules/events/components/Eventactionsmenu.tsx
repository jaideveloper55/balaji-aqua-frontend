import { Dropdown, MenuProps } from "antd";
import {
  HiOutlineEye,
  HiOutlinePencil,
  HiOutlineCheck,
  HiOutlineX,
  HiOutlineDotsVertical,
  HiOutlinePrinter,
  HiOutlineTrash,
} from "react-icons/hi";
import { EventOrder } from "../types/Events";
import { useAuthStore } from "../../../store/auth.store";

interface Props {
  event: EventOrder;
  onView: (e: EventOrder) => void;
  onEdit: (e: EventOrder) => void;
  onCancel: (e: EventOrder) => void;
  onDelete: (e: EventOrder) => void;
  onComplete: (e: EventOrder) => void;
  onPrint: (e: EventOrder) => void;
}

const EventActionsMenu = ({
  event,
  onView,
  onEdit,
  onCancel,
  onComplete,
  onPrint,
  onDelete,
}: Props) => {
  const { user } = useAuthStore();
  const isSuperAdmin = user?.role === "SUPER_ADMIN";
  const isLocked = event.status === "CANCELLED" || event.status === "COMPLETED";

  const items: MenuProps["items"] = [
    {
      key: "view",
      label: (
        <div className="flex items-center gap-2 py-0.5">
          <HiOutlineEye className="text-slate-500" /> View Details
        </div>
      ),
      onClick: () => onView(event),
    },
    {
      key: "edit",
      label: (
        <div className="flex items-center gap-2 py-0.5">
          <HiOutlinePencil className="text-slate-500" /> Edit
        </div>
      ),
      disabled: isLocked,
      onClick: () => onEdit(event),
    },
    {
      key: "print",
      label: (
        <div className="flex items-center gap-2 py-0.5">
          <HiOutlinePrinter className="text-slate-500" /> Print Order
        </div>
      ),
      onClick: () => onPrint(event),
    },
    { type: "divider" },
    {
      key: "complete",
      label: (
        <div className="flex items-center gap-2 py-0.5 text-emerald-600">
          <HiOutlineCheck /> Mark as Completed
        </div>
      ),
      disabled: isLocked,
      onClick: () => onComplete(event),
    },
    {
      key: "cancel",
      label: (
        <div className="flex items-center gap-2 py-0.5 text-red-600">
          <HiOutlineX /> Cancel Event
        </div>
      ),
      disabled: isLocked,
      onClick: () => onCancel(event),
    },

    ...(isSuperAdmin
      ? [
          { type: "divider" as const },
          {
            key: "delete",
            label: (
              <div className="flex items-center gap-2 py-0.5 text-red-600">
                <HiOutlineTrash /> Delete Event
              </div>
            ),
            onClick: () => onDelete(event),
          },
        ]
      : []),
  ];

  return (
    <Dropdown
      menu={{
        items,
        onClick: ({ domEvent }) => domEvent.stopPropagation(),
      }}
      trigger={["click"]}
      placement="bottomRight"
    >
      <button
        className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition"
        onClick={(e) => e.stopPropagation()}
      >
        <HiOutlineDotsVertical className="w-5 h-5" />
      </button>
    </Dropdown>
  );
};

export default EventActionsMenu;
