import { Table, Dropdown, Tooltip } from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  HiOutlinePhone,
  HiOutlineMail,
  HiOutlineDotsVertical,
  HiOutlineEye,
  HiOutlinePencilAlt,
  HiOutlineTrash,
  HiOutlineCash,
  HiOutlineExclamation,
} from "react-icons/hi";

import {
  STATUS_META,
  DEPT_META,
  EMPLOYMENT_TYPES,
} from "../constants/Employees.constants";
import type { Employee } from "../types/Employees";

interface Props {
  employees: Employee[];
  onView: (e: Employee) => void;
  onEdit: (e: Employee) => void;
}

const formatINR = (n: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);

const formatDate = (s: string) => {
  const d = new Date(s);
  return d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

// initials avatar
const Avatar = ({ name }: { name: string }) => {
  const initial = name?.charAt(0)?.toUpperCase() || "?";
  // deterministic color from name
  const colors = [
    "from-blue-500 to-indigo-600",
    "from-emerald-500 to-teal-600",
    "from-purple-500 to-pink-600",
    "from-amber-500 to-orange-600",
    "from-rose-500 to-red-600",
    "from-cyan-500 to-sky-600",
  ];
  const idx = name.charCodeAt(0) % colors.length;

  return (
    <div
      className={`w-10 h-10 rounded-xl bg-gradient-to-br ${colors[idx]} text-white font-bold flex items-center justify-center shadow-md shadow-slate-200`}
    >
      {initial}
    </div>
  );
};

const EmployeeTable = ({ employees, onView, onEdit }: Props) => {
  const columns: ColumnsType<Employee> = [
    {
      title: "Employee",
      key: "employee",
      width: 280,
      render: (_, record) => (
        <div className="flex items-center gap-3">
          <Avatar name={record.fullName} />
          <div className="min-w-0">
            <div className="font-semibold text-slate-900 truncate flex items-center gap-2">
              {record.fullName}
              {record.policeVerified && (
                <Tooltip title="Police Verified">
                  <span className="text-emerald-500 text-xs">✓</span>
                </Tooltip>
              )}
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-500 mt-0.5">
              <span className="flex items-center gap-1">
                <HiOutlinePhone className="w-3 h-3" />
                {record.phone}
              </span>
              {record.email && (
                <span className="flex items-center gap-1 truncate">
                  <HiOutlineMail className="w-3 h-3" />
                  {record.email}
                </span>
              )}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "ID",
      key: "id",
      width: 110,
      render: (_, r) => (
        <span className="px-2.5 py-1 rounded-md bg-slate-100 border border-slate-200 text-slate-700 text-xs font-mono font-semibold">
          {r.employeeId}
        </span>
      ),
    },
    {
      title: "Role",
      key: "role",
      width: 200,
      render: (_, r) => {
        const dept = DEPT_META[r.department];
        return (
          <div>
            <div className="text-sm font-medium text-slate-900">
              {r.designation}
            </div>
            <div
              className={`inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-md border text-xs font-medium ${dept.bg} ${dept.color}`}
            >
              <span>{dept.icon}</span> {dept.label}
            </div>
          </div>
        );
      },
    },
    {
      title: "Type",
      dataIndex: "employmentType",
      width: 130,
      render: (t: string) => {
        const meta = EMPLOYMENT_TYPES.find((x) => x.value === t);
        return (
          <span className="text-xs font-medium text-slate-600 px-2 py-1 rounded bg-slate-50 border border-slate-200">
            {meta?.label || t}
          </span>
        );
      },
    },
    {
      title: "Salary",
      dataIndex: "baseSalary",
      width: 140,
      sorter: (a, b) => a.baseSalary - b.baseSalary,
      render: (n: number, r) => (
        <div>
          <div className="text-sm font-semibold text-slate-900 flex items-center gap-1">
            <HiOutlineCash className="w-3.5 h-3.5 text-slate-400" />
            {formatINR(n)}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">
            {r.salaryType === "monthly"
              ? "/month"
              : r.salaryType === "daily"
              ? "/day"
              : "/delivery"}
          </div>
        </div>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      width: 130,
      filters: Object.keys(STATUS_META).map((k) => ({
        text: STATUS_META[k].label,
        value: k,
      })),
      onFilter: (value, record) => record.status === value,
      render: (s: string) => {
        const meta = STATUS_META[s];
        return (
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-medium ${meta.bg} ${meta.color}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${meta.dot}`} />
            {meta.label}
          </span>
        );
      },
    },
    {
      title: "Joined",
      dataIndex: "joinedDate",
      width: 130,
      sorter: (a, b) =>
        new Date(a.joinedDate).getTime() - new Date(b.joinedDate).getTime(),
      render: (d: string) => (
        <span className="text-xs text-slate-600">{formatDate(d)}</span>
      ),
    },
    {
      title: "Alerts",
      key: "alerts",
      width: 100,
      render: (_, r) => {
        const alerts = [];
        if (r.drivingLicenseExpiry) {
          const expiry = new Date(r.drivingLicenseExpiry);
          const now = new Date();
          const days = Math.floor(
            (expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
          );
          if (days < 60) {
            alerts.push({
              tooltip: `Driving license expires in ${days} days`,
              color: days < 30 ? "text-red-500" : "text-amber-500",
            });
          }
        }
        if (r.outstandingLoan && r.outstandingLoan > 0) {
          alerts.push({
            tooltip: `Outstanding loan: ${formatINR(r.outstandingLoan)}`,
            color: "text-amber-500",
          });
        }
        if (alerts.length === 0)
          return <span className="text-slate-300 text-xs">—</span>;
        return (
          <div className="flex items-center gap-1">
            {alerts.map((a, i) => (
              <Tooltip key={i} title={a.tooltip}>
                <HiOutlineExclamation className={`w-4 h-4 ${a.color}`} />
              </Tooltip>
            ))}
          </div>
        );
      },
    },
    {
      title: "",
      key: "actions",
      width: 50,
      fixed: "right",
      render: (_, record) => (
        <Dropdown
          trigger={["click"]}
          menu={{
            items: [
              {
                key: "view",
                label: "View Details",
                icon: <HiOutlineEye />,
                onClick: () => onView(record),
              },
              {
                key: "edit",
                label: "Edit",
                icon: <HiOutlinePencilAlt />,
                onClick: () => onEdit(record),
              },
              { type: "divider" },
              {
                key: "delete",
                label: "Delete",
                icon: <HiOutlineTrash />,
                danger: true,
              },
            ],
          }}
        >
          <button className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors">
            <HiOutlineDotsVertical className="w-4 h-4 text-slate-400" />
          </button>
        </Dropdown>
      ),
    },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <Table<Employee>
        rowKey="id"
        columns={columns}
        dataSource={employees}
        scroll={{ x: 1200 }}
        onRow={(record) => ({
          onClick: () => onView(record),
          style: { cursor: "pointer" },
        })}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          pageSizeOptions: ["10", "20", "50"],
          showTotal: (t, [s, e]) => `Showing ${s}–${e} of ${t} employees`,
        }}
      />
    </div>
  );
};

export default EmployeeTable;
