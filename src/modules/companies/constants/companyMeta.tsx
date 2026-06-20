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
    name: "Sribalaji Aqua Water",
    type: "WATER_PLANT",
    email: "sribalajiaqua2026@gmail.com",
    phone: "+91 80159 29891",
    address: "Urappakkam",
    city: "Chennai",
    state: "Tamil Nadu",
    gstNumber: "33XXXXX1234X1ZX",
    isActive: true,
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z",
  },
];
