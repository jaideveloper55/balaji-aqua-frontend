import { useState, useMemo } from "react";
import { Button, message } from "antd";
import { useForm } from "react-hook-form";
import { HiOutlineDownload, HiOutlinePlus } from "react-icons/hi";
import { Company, CompanyType, CreateCompanyDto } from "../types/company";
import { SEED_COMPANIES } from "../constants/companyMeta";
import CompanyFormModal from "../components/CompanyFormModal";
import CompanyStats from "../components/CompanyStats";
import CompanyFilters, { FilterFormValues } from "../components/CompanyFilters";
import CompanyTable from "../components/CompanyTable";
import ViewCompanyModal from "../components/ViewCompanyModal";
import DeactivateCompanyModal from "../components/DeactivateCompanyModal";

const Companies = () => {
  const [companies, setCompanies] = useState<Company[]>(SEED_COMPANIES);

  const [formOpen, setFormOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [viewingCompany, setViewingCompany] = useState<Company | null>(null);
  const [deactivatingCompany, setDeactivatingCompany] =
    useState<Company | null>(null);

  // Filter form
  const {
    control: filterControl,
    watch,
    formState: { errors: filterErrors },
  } = useForm<FilterFormValues>({
    defaultValues: { search: "", type: "", status: "" },
  });

  const search = watch("search") || "";
  const typeFilter = watch("type") || "";
  const statusFilter = watch("status") || "";

  // ---- derived ---------------------------------------------------
  const stats = useMemo(
    () => ({
      total: companies.length,
      active: companies.filter((c) => c.isActive).length,
      inactive: companies.filter((c) => !c.isActive).length,
      waterPlants: companies.filter((c) => c.type === "WATER_PLANT").length,
    }),
    [companies]
  );

  const filtered = useMemo(() => {
    return companies.filter((c) => {
      const q = search.toLowerCase();
      const matchSearch =
        !search ||
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.gstNumber.toLowerCase().includes(q) ||
        c.phone.includes(search);

      const matchType = !typeFilter || c.type === typeFilter;
      const matchStatus =
        !statusFilter || (statusFilter === "active" ? c.isActive : !c.isActive);

      return matchSearch && matchType && matchStatus;
    });
  }, [companies, search, typeFilter, statusFilter]);

  const hasActiveFilters = !!(search || typeFilter || statusFilter);

  const handleCreate = () => {
    setEditingCompany(null);
    setFormOpen(true);
  };

  const handleEdit = (company: Company) => {
    setEditingCompany(company);
    setFormOpen(true);
  };

  const confirmDeactivate = () => {
    if (!deactivatingCompany) return;
    setCompanies((prev) =>
      prev.map((c) =>
        c.id === deactivatingCompany.id ? { ...c, isActive: false } : c
      )
    );
    message.success(`${deactivatingCompany.name} deactivated`);
    setDeactivatingCompany(null);
  };

  const handleSubmit = (data: CreateCompanyDto) => {
    const type = data.type as CompanyType;

    if (editingCompany) {
      setCompanies((prev) =>
        prev.map((c) =>
          c.id === editingCompany.id
            ? { ...c, ...data, type, updatedAt: new Date().toISOString() }
            : c
        )
      );
      message.success("Company updated");
    } else {
      setCompanies((prev) => [
        {
          ...data,
          type,
          id: String(Date.now()),
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        ...prev,
      ]);
      message.success("Company created");
    }
    setFormOpen(false);
    setEditingCompany(null);
  };

  const handleExport = () => {
    message.info("Exporting CSV…");
  };

  return (
    <div className="">
      <div className="">
        {/* Page header */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Companies
            </h1>
            <p className="mt-1 text-slate-500 text-sm">
              Manage all companies on the Sri Balaji Aqua platform
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              size="large"
              icon={<HiOutlineDownload />}
              onClick={handleExport}
            >
              Export
            </Button>
            <Button
              type="primary"
              size="large"
              icon={<HiOutlinePlus />}
              onClick={handleCreate}
            >
              Add Company
            </Button>
          </div>
        </div>

        <CompanyStats stats={stats} />

        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          <CompanyFilters control={filterControl} errors={filterErrors} />

          <CompanyTable
            data={filtered}
            hasActiveFilters={hasActiveFilters}
            onView={setViewingCompany}
            onEdit={handleEdit}
            onDeactivate={setDeactivatingCompany}
            onCreate={handleCreate}
          />
        </div>
      </div>

      {/* Modals */}
      <CompanyFormModal
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setEditingCompany(null);
        }}
        onSubmit={handleSubmit}
        initialData={editingCompany}
      />

      <ViewCompanyModal
        company={viewingCompany}
        onClose={() => setViewingCompany(null)}
        onEdit={(c) => {
          setViewingCompany(null);
          handleEdit(c);
        }}
      />

      <DeactivateCompanyModal
        company={deactivatingCompany}
        onClose={() => setDeactivatingCompany(null)}
        onConfirm={confirmDeactivate}
      />
    </div>
  );
};

export default Companies;
