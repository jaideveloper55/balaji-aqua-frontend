import {
  HiOutlineOfficeBuilding,
  HiOutlineCheckCircle,
  HiOutlineXCircle,
} from "react-icons/hi";
import CustomerStatCard from "../../../components/common/CustomerStatCard";

interface Stats {
  total: number;
  active: number;
  inactive: number;
  waterPlants: number;
}

interface Props {
  stats: Stats;
}

const CompanyStats = ({ stats }: Props) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
    <CustomerStatCard
      icon={<HiOutlineOfficeBuilding size={20} />}
      label="Total Companies"
      value={stats.total}
      color="#2563eb"
      bg="#eff6ff"
      tooltip="All companies on the platform"
    />
    <CustomerStatCard
      icon={<HiOutlineCheckCircle size={20} />}
      label="Active"
      value={stats.active}
      color="#059669"
      bg="#ecfdf5"
      tooltip="Currently operating companies"
    />
    <CustomerStatCard
      icon={<HiOutlineXCircle size={20} />}
      label="Inactive"
      value={stats.inactive}
      color="#64748b"
      bg="#f1f5f9"
      tooltip="Deactivated companies"
      alert={stats.inactive > 0}
    />
    <CustomerStatCard
      icon={<HiOutlineOfficeBuilding size={20} />}
      label="Water Plants"
      value={stats.waterPlants}
      color="#0891b2"
      bg="#ecfeff"
      tooltip="Companies of type Water Plant"
    />
  </div>
);

export default CompanyStats;
