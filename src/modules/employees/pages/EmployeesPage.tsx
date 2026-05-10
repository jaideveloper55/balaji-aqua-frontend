import { useState } from "react";
import {
  HiOutlineUsers,
  HiOutlineUserCircle,
  HiOutlineTruck,
  HiOutlineOfficeBuilding,
  HiOutlineCalendar,
  HiOutlineDocumentText,
  HiOutlineDownload,
  HiOutlineUserAdd,
} from "react-icons/hi";

import EmployeeStatCards from "../components/EmployeeStatCards";
import type { Employee } from "../types/Employees";
import CustomTabs from "../../../components/common/CustomTabs";
import EmployeeFilterBar from "../components/EmployeeFilterBar";
import EmployeeTable from "../components/Employeetable";
import DriversPanel from "../components/Driverspanel";
import DepartmentsPanel from "../components/Departmentspanel";
import LeavesPanel from "../components/Leavespanel";
import EmployeeFormModal from "../components/Employeeformmodal";
import DocumentsPanel from "../components/Documentspanel";
import EmployeeDetailDrawer from "../components/Employeedetaildrawer";

// Sample data — replace with API in production
const SAMPLE_EMPLOYEES: Employee[] = [
  {
    id: "1",
    employeeId: "EMP-001",
    fullName: "Suresh Murugan",
    phone: "9876543210",
    email: "suresh.m@balajiaqua.com",
    designation: "Senior Driver",
    department: "delivery",
    role: "driver",
    joinedDate: "2024-08-15",
    employmentType: "full_time",
    shift: "morning",
    status: "active",
    salaryType: "monthly",
    baseSalary: 18000,
    drivingLicense: "TN-09-2019-0012345",
    drivingLicenseExpiry: "2027-04-12",
    policeVerified: true,
    vehicleAssigned: "TN 09 AB 1234",
    routeAssigned: "Route A",
    totalDeliveries: 1248,
    onTimePercent: 96,
    rating: 4.8,
    totalLeaveBalance: 8,
  },
  {
    id: "2",
    employeeId: "EMP-002",
    fullName: "Karthik Raja",
    phone: "9876543211",
    email: "karthik.r@balajiaqua.com",
    designation: "Driver",
    department: "delivery",
    role: "driver",
    joinedDate: "2025-01-10",
    employmentType: "full_time",
    shift: "morning",
    status: "active",
    salaryType: "monthly",
    baseSalary: 16000,
    drivingLicense: "TN-09-2020-0098765",
    drivingLicenseExpiry: "2026-06-30",
    policeVerified: true,
    vehicleAssigned: "TN 09 CD 5678",
    routeAssigned: "Route B",
    totalDeliveries: 642,
    onTimePercent: 92,
    rating: 4.5,
    totalLeaveBalance: 5,
    outstandingLoan: 3000,
  },
  {
    id: "3",
    employeeId: "EMP-003",
    fullName: "Vijay Prakash",
    phone: "9876543212",
    designation: "Driver",
    department: "delivery",
    role: "driver",
    joinedDate: "2025-03-22",
    employmentType: "full_time",
    shift: "evening",
    status: "on_leave",
    salaryType: "monthly",
    baseSalary: 16000,
    drivingLicense: "TN-09-2018-0054321",
    drivingLicenseExpiry: "2026-02-15",
    policeVerified: true,
    vehicleAssigned: "TN 09 EF 9012",
    routeAssigned: "Route C",
    totalDeliveries: 318,
    onTimePercent: 88,
    rating: 4.2,
    totalLeaveBalance: 2,
  },
  {
    id: "4",
    employeeId: "EMP-004",
    fullName: "Arun Selvam",
    phone: "9876543213",
    designation: "Loader",
    department: "delivery",
    role: "loader",
    joinedDate: "2025-06-05",
    employmentType: "daily_wage",
    shift: "morning",
    status: "active",
    salaryType: "daily",
    baseSalary: 600,
    totalLeaveBalance: 0,
  },
  {
    id: "5",
    employeeId: "EMP-005",
    fullName: "Rajesh Kumar",
    phone: "9876543214",
    email: "rajesh@balajiaqua.com",
    designation: "Plant Operator",
    department: "plant",
    role: "operator",
    joinedDate: "2024-04-18",
    employmentType: "full_time",
    shift: "morning",
    status: "active",
    salaryType: "monthly",
    baseSalary: 22000,
    totalLeaveBalance: 12,
  },
  {
    id: "6",
    employeeId: "EMP-006",
    fullName: "Divya Bharathi",
    phone: "9876543215",
    email: "divya@balajiaqua.com",
    designation: "Accountant",
    department: "admin",
    role: "accountant",
    joinedDate: "2024-09-01",
    employmentType: "full_time",
    shift: "general",
    status: "active",
    salaryType: "monthly",
    baseSalary: 25000,
    totalLeaveBalance: 14,
  },
];

const TABS = [
  { key: "all", label: "All Employees", icon: <HiOutlineUsers size={14} /> },
  { key: "drivers", label: "Drivers", icon: <HiOutlineTruck size={14} /> },
  {
    key: "departments",
    label: "Departments",
    icon: <HiOutlineOfficeBuilding size={14} />,
  },
  { key: "leaves", label: "Leaves", icon: <HiOutlineCalendar size={14} /> },
  {
    key: "documents",
    label: "Documents",
    icon: <HiOutlineDocumentText size={14} />,
  },
];

const EmployeesPage = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [employees] = useState<Employee[]>(SAMPLE_EMPLOYEES);

  // filters
  const [search, setSearch] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [employmentTypeFilter, setEmploymentTypeFilter] = useState<
    string | null
  >(null);

  // modal & drawer state
  const [formOpen, setFormOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [detailEmployee, setDetailEmployee] = useState<Employee | null>(null);

  const filteredEmployees = employees.filter((e) => {
    if (search) {
      const q = search.toLowerCase();
      const match =
        e.fullName.toLowerCase().includes(q) ||
        e.phone.includes(q) ||
        e.employeeId.toLowerCase().includes(q);
      if (!match) return false;
    }
    if (departmentFilter && e.department !== departmentFilter) return false;
    if (statusFilter && e.status !== statusFilter) return false;
    if (employmentTypeFilter && e.employmentType !== employmentTypeFilter)
      return false;
    return true;
  });

  const handleAdd = () => {
    setEditingEmployee(null);
    setFormOpen(true);
  };

  const handleEdit = (employee: Employee) => {
    setEditingEmployee(employee);
    setFormOpen(true);
  };

  const handleView = (employee: Employee) => {
    setDetailEmployee(employee);
  };

  return (
    <div className="min-h-screen bg-slate-50/50">
      <div className="space-y-6">
        {/* ============ Title Bar with Actions ============ */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-2xl bg-blue-500 shadow-lg">
              <HiOutlineUserCircle className="w-7 h-7 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                Workforce Hub
              </h2>
              <p className="text-sm text-slate-500 mt-0.5">
                Manage your team, drivers, leaves & documents
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 text-sm font-medium hover:bg-slate-50 hover:border-slate-300 transition-all"
            >
              <HiOutlineDownload className="w-4 h-4" />
              Export
            </button>
            <button
              type="button"
              onClick={handleAdd}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-500 text-white text-sm font-semibold shadow-md  hover:shadow-lg hover:-translate-y-0.5 transition-all"
            >
              <HiOutlineUserAdd className="w-4 h-4" />
              Add Employee
            </button>
          </div>
        </div>

        {/* ============ Stat Cards ============ */}
        <EmployeeStatCards employees={employees} />

        {/* ============ Tabs ============ */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
          <div className="max-w-3xl">
            <CustomTabs
              items={TABS}
              activeKey={activeTab}
              onChange={setActiveTab}
            />
          </div>
        </div>

        {/* ============ Tab Content ============ */}
        <div className="space-y-4">
          {activeTab === "all" && (
            <>
              <EmployeeFilterBar
                search={search}
                setSearch={setSearch}
                departmentFilter={departmentFilter}
                setDepartmentFilter={setDepartmentFilter}
                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter}
                employmentTypeFilter={employmentTypeFilter}
                setEmploymentTypeFilter={setEmploymentTypeFilter}
                resultCount={filteredEmployees.length}
                totalCount={employees.length}
              />
              <EmployeeTable
                employees={filteredEmployees}
                onView={handleView}
                onEdit={handleEdit}
              />
            </>
          )}

          {activeTab === "drivers" && (
            <DriversPanel
              employees={employees.filter((e) => e.role === "driver")}
              onView={handleView}
              onEdit={handleEdit}
            />
          )}

          {activeTab === "departments" && (
            <DepartmentsPanel employees={employees} />
          )}

          {activeTab === "leaves" && <LeavesPanel employees={employees} />}

          {activeTab === "documents" && (
            <DocumentsPanel employees={employees} />
          )}
        </div>
      </div>

      {/* ============ Modals & Drawers ============ */}
      <EmployeeFormModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        employee={editingEmployee}
      />

      <EmployeeDetailDrawer
        employee={detailEmployee}
        onClose={() => setDetailEmployee(null)}
        onEdit={(emp) => {
          setDetailEmployee(null);
          handleEdit(emp);
        }}
      />
    </div>
  );
};

export default EmployeesPage;
