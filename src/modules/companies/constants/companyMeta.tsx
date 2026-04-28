import { Company, CompanyType } from "../types/company";

export const TYPE_META: Record<CompanyType, { color: string; label: string }> =
  {
    WATER_PLANT: { color: "blue", label: "Water Plant" },
    DISTRIBUTOR: { color: "purple", label: "Distributor" },
    RETAILER: { color: "cyan", label: "Retailer" },
    SERVICE_CENTER: { color: "geekblue", label: "Service Center" },
  };

export const getInitials = (name: string) =>
  name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

export const SEED_COMPANIES: Company[] = [
  {
    id: "1",
    name: "Krishna Water Plant",
    type: "WATER_PLANT",
    email: "info@krishnawater.com",
    phone: "+91 98765 43210",
    address: "12 Gandhi Street, RS Puram",
    city: "Coimbatore",
    state: "Tamil Nadu",
    gstNumber: "33AABCU9603R1ZX",
    isActive: true,
    createdAt: "2024-03-15T00:00:00.000Z",
    updatedAt: "2024-03-15T00:00:00.000Z",
  },
  {
    id: "2",
    name: "Sri Aqua Distributors",
    type: "DISTRIBUTOR",
    email: "contact@sriaqua.com",
    phone: "+91 99887 76655",
    address: "45 Anna Salai",
    city: "Chennai",
    state: "Tamil Nadu",
    gstNumber: "33BBCDE1234F1Z2",
    isActive: true,
    createdAt: "2024-06-22T00:00:00.000Z",
    updatedAt: "2024-06-22T00:00:00.000Z",
  },
  {
    id: "3",
    name: "Bangalore Pure Water Retail",
    type: "RETAILER",
    email: "hello@bpurewater.com",
    phone: "+91 98123 45678",
    address: "MG Road",
    city: "Bangalore",
    state: "Karnataka",
    gstNumber: "29CCDEF5678G1Z9",
    isActive: false,
    createdAt: "2023-11-01T00:00:00.000Z",
    updatedAt: "2024-01-10T00:00:00.000Z",
  },
];
