import type { RecurringExpense } from "../types/Expenses";

export const MOCK_RECURRING: RecurringExpense[] = [
  {
    id: "1",
    name: "Internet & WiFi",
    vendor: "Airtel Business",
    category: "Utilities",
    frequency: "MONTHLY",
    amount: 1500,
    nextDue: "2026-05-10",
    isPaused: false,
  },
  {
    id: "2",
    name: "Electricity Bill",
    vendor: "TN Electricity Board",
    category: "Utilities",
    frequency: "MONTHLY",
    amount: 18500,
    nextDue: "2026-05-15",
    isPaused: false,
  },
  {
    id: "3",
    name: "Plant Rent",
    vendor: "Sundaram Property",
    category: "Rent & Lease",
    frequency: "MONTHLY",
    amount: 12000,
    nextDue: "2026-06-01",
    isPaused: false,
  },
  {
    id: "4",
    name: "Vehicle Insurance",
    vendor: "ICICI Lombard",
    category: "Vehicle & Fuel",
    frequency: "YEARLY",
    amount: 24000,
    nextDue: "2026-08-15",
    isPaused: false,
  },
  {
    id: "5",
    name: "FSSAI License",
    vendor: "FSSAI",
    category: "Compliance",
    frequency: "YEARLY",
    amount: 7500,
    nextDue: "2026-09-01",
    isPaused: true,
  },
];

export const RECURRING_STATS = {
  activeCount: 5,
  pausedCount: 1,
  monthlyCommitment: 32000,
  dueThisWeek: 1,
  urgent: 0,
};
