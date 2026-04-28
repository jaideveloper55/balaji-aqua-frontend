import { Avatar, Button, Dropdown, Table, Tag, Tooltip, message } from "antd";
import type { ColumnsType } from "antd/es/table";
import type { MenuProps } from "antd";
import {
  HiOutlineCheckCircle,
  HiOutlineDotsVertical,
  HiOutlineEye,
  HiOutlineLocationMarker,
  HiOutlineMail,
  HiOutlineOfficeBuilding,
  HiOutlinePencil,
  HiOutlinePhone,
  HiOutlinePlus,
  HiOutlineSearch,
  HiOutlineTrash,
} from "react-icons/hi";

import CustomEmpty from "../../../components/common/CustomEmpty";
import { Company } from "../types/company";
import { TYPE_META, getInitials } from "../constants/companyMeta";

interface Props {
  data: Company[];
  hasActiveFilters: boolean;
  onView: (c: Company) => void;
  onEdit: (c: Company) => void;
  onDeactivate: (c: Company) => void;
  onCreate: () => void;
}

const CompanyTable = ({
  data,
  hasActiveFilters,
  onView,
  onEdit,
  onDeactivate,
  onCreate,
}: Props) => {
  const columns: ColumnsType<Company> = [
    {
      title: "Company",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
      render: (_, record) => (
        <div className="flex items-center gap-3">
          <Avatar
            size={40}
            style={{
              background: "linear-gradient(135deg,#3b82f6,#1d4ed8)",
              fontWeight: 600,
            }}
          >
            {getInitials(record.name)}
          </Avatar>
          <div className="min-w-0">
            <div className="font-semibold text-slate-900 truncate">
              {record.name}
            </div>
            <Tag
              color={TYPE_META[record.type].color}
              className="!m-0 !mt-1 text-xs"
              bordered={false}
            >
              {TYPE_META[record.type].label}
            </Tag>
          </div>
        </div>
      ),
    },
    {
      title: "Contact",
      key: "contact",
      render: (_, record) => (
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-sm text-slate-700">
            <HiOutlineMail className="text-slate-400 flex-shrink-0" />
            <span className="truncate">{record.email}</span>
          </div>
          <div className="flex items-center gap-1.5 text-sm text-slate-500">
            <HiOutlinePhone className="text-slate-400 flex-shrink-0" />
            {record.phone}
          </div>
        </div>
      ),
    },
    {
      title: "Location",
      key: "location",
      render: (_, record) => (
        <div className="flex items-start gap-1.5 text-sm">
          <HiOutlineLocationMarker className="text-slate-400 mt-0.5 flex-shrink-0" />
          <div>
            <div className="text-slate-900">{record.city}</div>
            <div className="text-slate-500 text-xs">{record.state}</div>
          </div>
        </div>
      ),
    },
    {
      title: "GSTIN",
      dataIndex: "gstNumber",
      key: "gstNumber",
      render: (gst: string) => (
        <Tooltip title="Click to copy">
          <code
            className="text-xs bg-slate-100 px-2 py-1 rounded font-mono cursor-pointer hover:bg-slate-200 transition"
            onClick={() => {
              navigator.clipboard.writeText(gst);
              message.success("GST copied");
            }}
          >
            {gst}
          </code>
        </Tooltip>
      ),
    },
    {
      title: "Status",
      dataIndex: "isActive",
      key: "isActive",
      filters: [
        { text: "Active", value: true },
        { text: "Inactive", value: false },
      ],
      onFilter: (value, record) => record.isActive === value,
      render: (active: boolean) =>
        active ? (
          <Tag
            color="success"
            bordered={false}
            icon={<HiOutlineCheckCircle className="inline mr-1" />}
          >
            Active
          </Tag>
        ) : (
          <Tag color="default" bordered={false}>
            Inactive
          </Tag>
        ),
    },
    {
      title: "",
      key: "actions",
      width: 60,
      align: "center",
      render: (_, record) => {
        const items: MenuProps["items"] = [
          {
            key: "view",
            label: "View Details",
            icon: <HiOutlineEye />,
            onClick: () => onView(record),
          },
          {
            key: "edit",
            label: "Edit",
            icon: <HiOutlinePencil />,
            onClick: () => onEdit(record),
          },
          { type: "divider" },
          {
            key: "delete",
            label: "Deactivate",
            icon: <HiOutlineTrash />,
            danger: true,
            disabled: !record.isActive,
            onClick: () => onDeactivate(record),
          },
        ];

        return (
          <Dropdown
            menu={{ items }}
            trigger={["click"]}
            placement="bottomRight"
          >
            <Button
              type="text"
              icon={<HiOutlineDotsVertical />}
              className="!flex !items-center !justify-center"
            />
          </Dropdown>
        );
      },
    },
  ];

  return (
    <Table<Company>
      columns={columns}
      dataSource={data}
      rowKey="id"
      pagination={{
        pageSize: 10,
        showSizeChanger: true,
        showTotal: (total, range) =>
          `${range[0]}–${range[1]} of ${total} companies`,
      }}
      locale={{
        emptyText: hasActiveFilters ? (
          <CustomEmpty
            icon={<HiOutlineSearch size={26} />}
            title="No matches found"
            description="Try adjusting your filters or search term to find what you're looking for."
            tone="slate"
          />
        ) : (
          <CustomEmpty
            icon={<HiOutlineOfficeBuilding size={26} />}
            title="No companies yet"
            description="Create your first company to get started managing the platform."
            actionLabel="Create Company"
            actionIcon={<HiOutlinePlus />}
            onAction={onCreate}
            tone="blue"
          />
        ),
      }}
    />
  );
};

export default CompanyTable;
