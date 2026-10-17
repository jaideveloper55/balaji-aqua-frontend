import { Dropdown } from "antd";
import type { MenuProps } from "antd";
import {
  HiOutlineBan,
  HiOutlineDotsVertical,
  HiOutlinePencil,
  HiOutlinePhone,
} from "react-icons/hi";
import type { Order } from "../types/Orders";

interface Props {
  order: Order;
  onEdit: (order: Order) => void;
  onCancel: (order: Order) => void;
}

const Orderactionsmenu = ({ order, onEdit, onCancel }: Props) => {
  const pending = order.status === "PENDING";

  const items: MenuProps["items"] = [
    ...(pending
      ? [
          {
            key: "edit",
            icon: <HiOutlinePencil className="h-4 w-4" />,
            label: "Edit order",
            onClick: () => onEdit(order),
          },
        ]
      : []),
    {
      key: "call",
      icon: <HiOutlinePhone className="h-4 w-4" />,
      // a normal link: on a phone it dials, on a laptop it opens the calling app
      label: <a href={`tel:${order.customer.phone}`}>Call customer</a>,
    },
    ...(pending
      ? [
          { type: "divider" as const },
          {
            key: "cancel",
            icon: <HiOutlineBan className="h-4 w-4" />,
            label: "Cancel order",
            danger: true,
            onClick: () => onCancel(order),
          },
        ]
      : []),
  ];

  return (
    <Dropdown trigger={["click"]} placement="bottomRight" menu={{ items }}>
      <button
        type="button"
        aria-label={`Actions for ${order.orderNo}`}
        className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
      >
        <HiOutlineDotsVertical className="h-5 w-5" />
      </button>
    </Dropdown>
  );
};

export default Orderactionsmenu;
