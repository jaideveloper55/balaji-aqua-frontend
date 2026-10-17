import { Dropdown, Spin } from "antd";
import type { MenuProps } from "antd";
import {
  HiCheck,
  HiOutlineChevronDown,
  HiOutlineUserAdd,
} from "react-icons/hi";
import { initials } from "../constants/Orderconstants";
import type { DeliveryBoy, Order } from "../types/Orders";

interface Props {
  order: Order;
  boys: DeliveryBoy[];
  saving?: boolean;
  onAssign: (order: Order, boyId: string | null) => void;
}

const Avatar = ({ name }: { name: string }) => (
  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-[11px] font-bold text-emerald-700">
    {initials(name)}
  </span>
);

const Assigndropdown = ({ order, boys, saving, onAssign }: Props) => {
  const current = order.assignedTo;

  // Finished orders: plain text, nothing to click.
  if (order.status !== "PENDING") {
    return current ? (
      <span className="flex items-center gap-2 whitespace-nowrap text-sm font-medium text-slate-700">
        <Avatar name={current.name} />
        {current.name}
      </span>
    ) : (
      <span className="text-sm text-slate-400">—</span>
    );
  }

  const items: MenuProps["items"] = [
    {
      type: "group",
      label: "Assign to",
      children:
        boys.length === 0
          ? [{ key: "_none", label: "No delivery boys found", disabled: true }]
          : boys.map((b) => ({
              key: b.id,
              label: (
                <span className="flex items-center gap-2">
                  <Avatar name={b.name} />
                  <span className="flex-1 font-medium">{b.name}</span>
                  {current?.id === b.id && (
                    <HiCheck className="h-4 w-4 text-blue-600" />
                  )}
                </span>
              ),
            })),
    },
    ...(current
      ? [
          { type: "divider" as const },
          { key: "_unassign", label: "Un-assign", danger: true },
        ]
      : []),
  ];

  return (
    <Dropdown
      trigger={["click"]}
      disabled={saving}
      menu={{
        items,
        onClick: ({ key }) => {
          if (key === "_none") return;
          onAssign(order, key === "_unassign" ? null : key);
        },
      }}
    >
      {current ? (
        <button
          type="button"
          className="-ml-2 flex items-center gap-2 whitespace-nowrap rounded-lg px-2 py-1 text-sm font-medium text-slate-700 hover:bg-slate-100"
        >
          <Avatar name={current.name} />
          {current.name}
          {saving ? (
            <Spin size="small" />
          ) : (
            <HiOutlineChevronDown className="h-3.5 w-3.5 text-slate-400" />
          )}
        </button>
      ) : (
        <button
          type="button"
          className="flex items-center gap-1.5 rounded-lg border border-dashed border-amber-300 bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700 hover:bg-amber-100"
        >
          {saving ? (
            <Spin size="small" />
          ) : (
            <HiOutlineUserAdd className="h-4 w-4" />
          )}
          Assign
        </button>
      )}
    </Dropdown>
  );
};

export default Assigndropdown;
