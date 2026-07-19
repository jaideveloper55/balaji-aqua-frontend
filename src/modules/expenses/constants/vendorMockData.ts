export interface Vendor {
  id: string;
  name: string;
  category: string;
  phone: string;
  email?: string;
  gstin?: string;
  totalPaidYTD: number;
  outstanding: number;
  transactions: number;
  lastTransaction: string;
  isActive: boolean;
}

export const MOCK_VENDORS: Vendor[] = [
  {
    id: "1",
    name: "TN Electricity Board",
    category: "Utilities",
    phone: "1912",
    gstin: "33AAACT2727Q1ZW",
    totalPaidYTD: 145000,
    outstanding: 0,
    transactions: 12,
    lastTransaction: "2026-05-04",
    isActive: true,
  },
  {
    id: "2",
    name: "Indian Oil Pump",
    category: "Vehicle & Fuel",
    phone: "9876543220",
    totalPaidYTD: 64500,
    outstanding: 0,
    transactions: 38,
    lastTransaction: "2026-05-04",
    isActive: true,
  },
  {
    id: "3",
    name: "Murugan Salt Suppliers",
    category: "Plant Operations",
    phone: "9876543221",
    gstin: "33ABCDE1234F1Z5",
    totalPaidYTD: 38000,
    outstanding: 4500,
    transactions: 8,
    lastTransaction: "2026-05-03",
    isActive: true,
  },
  {
    id: "4",
    name: "Saravanan Caps & Seals",
    category: "Packaging",
    phone: "9876543222",
    email: "saravanan@capsseals.in",
    gstin: "33XYZAB5678C2D3",
    totalPaidYTD: 28500,
    outstanding: 2800,
    transactions: 6,
    lastTransaction: "2026-05-03",
    isActive: true,
  },
  {
    id: "5",
    name: "Sundaram Property",
    category: "Rent & Lease",
    phone: "9876543223",
    totalPaidYTD: 48000,
    outstanding: 0,
    transactions: 4,
    lastTransaction: "2026-05-01",
    isActive: true,
  },
  {
    id: "6",
    name: "Plant Maintenance — Kumar",
    category: "Repairs",
    phone: "9876543224",
    totalPaidYTD: 18500,
    outstanding: 0,
    transactions: 7,
    lastTransaction: "2026-05-02",
    isActive: true,
  },
  {
    id: "7",
    name: "Local Stationery",
    category: "Office",
    phone: "9876543225",
    totalPaidYTD: 4200,
    outstanding: 0,
    transactions: 9,
    lastTransaction: "2026-04-30",
    isActive: true,
  },
];

export const VENDOR_STATS = {
  totalVendors: 7,
  paidYtd: 346700,
  totalOutstanding: 7300,
  needPayment: 2,
};
