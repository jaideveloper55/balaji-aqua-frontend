export const EXPENSE_CATEGORIES = [
  {
    value: "utilities",
    label: "Utilities",
    icon: "⚡",
    color: "amber",
    description: "Electricity, water bill, internet",
  },
  {
    value: "plant_ops",
    label: "Plant Operations",
    icon: "🏭",
    color: "cyan",
    description: "RO membrane, filters, salt, chemicals",
  },
  {
    value: "packaging",
    label: "Packaging",
    icon: "📦",
    color: "purple",
    description: "Caps, seals, labels, shrink wrap",
  },
  {
    value: "vehicle",
    label: "Vehicle & Fuel",
    icon: "🚚",
    color: "blue",
    description: "Diesel, vehicle service, FASTag",
  },
  {
    value: "rent",
    label: "Rent & Lease",
    icon: "🏢",
    color: "indigo",
    description: "Plant rent, godown, vehicle lease",
  },
  {
    value: "compliance",
    label: "Government & Compliance",
    icon: "📋",
    color: "rose",
    description: "GST, BIS, FSSAI, pollution board",
  },
  {
    value: "marketing",
    label: "Marketing",
    icon: "📢",
    color: "pink",
    description: "Pamphlets, hoardings, ads",
  },
  {
    value: "office",
    label: "Office & Admin",
    icon: "🗂️",
    color: "slate",
    description: "Stationery, tea, miscellaneous",
  },
  {
    value: "repairs",
    label: "Repairs & Maintenance",
    icon: "🔧",
    color: "orange",
    description: "Equipment repair, vehicle maintenance",
  },
  {
    value: "loan",
    label: "Loan & Interest",
    icon: "💳",
    color: "red",
    description: "EMI payments, interest charges",
  },
] as const;

export const CATEGORY_META: Record<
  string,
  { label: string; icon: string; bg: string; color: string; iconBg: string }
> = {
  utilities: {
    label: "Utilities",
    icon: "⚡",
    bg: "bg-amber-50 border-amber-200",
    color: "text-amber-700",
    iconBg: "bg-amber-100",
  },
  plant_ops: {
    label: "Plant Operations",
    icon: "🏭",
    bg: "bg-cyan-50 border-cyan-200",
    color: "text-cyan-700",
    iconBg: "bg-cyan-100",
  },
  packaging: {
    label: "Packaging",
    icon: "📦",
    bg: "bg-purple-50 border-purple-200",
    color: "text-purple-700",
    iconBg: "bg-purple-100",
  },
  vehicle: {
    label: "Vehicle & Fuel",
    icon: "🚚",
    bg: "bg-blue-50 border-blue-200",
    color: "text-blue-700",
    iconBg: "bg-blue-100",
  },
  rent: {
    label: "Rent & Lease",
    icon: "🏢",
    bg: "bg-indigo-50 border-indigo-200",
    color: "text-indigo-700",
    iconBg: "bg-indigo-100",
  },
  compliance: {
    label: "Compliance",
    icon: "📋",
    bg: "bg-rose-50 border-rose-200",
    color: "text-rose-700",
    iconBg: "bg-rose-100",
  },
  marketing: {
    label: "Marketing",
    icon: "📢",
    bg: "bg-pink-50 border-pink-200",
    color: "text-pink-700",
    iconBg: "bg-pink-100",
  },
  office: {
    label: "Office",
    icon: "🗂️",
    bg: "bg-slate-50 border-slate-200",
    color: "text-slate-700",
    iconBg: "bg-slate-100",
  },
  repairs: {
    label: "Repairs",
    icon: "🔧",
    bg: "bg-orange-50 border-orange-200",
    color: "text-orange-700",
    iconBg: "bg-orange-100",
  },
  loan: {
    label: "Loan",
    icon: "💳",
    bg: "bg-red-50 border-red-200",
    color: "text-red-700",
    iconBg: "bg-red-100",
  },
};

export const PAYMENT_MODES = [
  { value: "cash", label: "Cash", icon: "💵" },
  { value: "upi", label: "UPI", icon: "📱" },
  { value: "bank", label: "Bank Transfer", icon: "🏦" },
  { value: "cheque", label: "Cheque", icon: "📝" },
  { value: "card", label: "Card", icon: "💳" },
] as const;

export const PAYMENT_MODE_META: Record<
  string,
  { label: string; icon: string; bg: string; color: string }
> = {
  cash: {
    label: "Cash",
    icon: "💵",
    bg: "bg-emerald-50 border-emerald-200",
    color: "text-emerald-700",
  },
  upi: {
    label: "UPI",
    icon: "📱",
    bg: "bg-purple-50 border-purple-200",
    color: "text-purple-700",
  },
  bank: {
    label: "Bank",
    icon: "🏦",
    bg: "bg-blue-50 border-blue-200",
    color: "text-blue-700",
  },
  cheque: {
    label: "Cheque",
    icon: "📝",
    bg: "bg-amber-50 border-amber-200",
    color: "text-amber-700",
  },
  card: {
    label: "Card",
    icon: "💳",
    bg: "bg-indigo-50 border-indigo-200",
    color: "text-indigo-700",
  },
};

export const EXPENSE_STATUS = [
  { value: "draft", label: "Draft" },
  { value: "pending", label: "Pending Approval" },
  { value: "approved", label: "Approved" },
  { value: "paid", label: "Paid" },
  { value: "rejected", label: "Rejected" },
] as const;

export const STATUS_META: Record<
  string,
  { label: string; bg: string; color: string; dot: string }
> = {
  draft: {
    label: "Draft",
    bg: "bg-slate-50 border-slate-200",
    color: "text-slate-600",
    dot: "bg-slate-400",
  },
  pending: {
    label: "Pending",
    bg: "bg-amber-50 border-amber-200",
    color: "text-amber-700",
    dot: "bg-amber-500",
  },
  approved: {
    label: "Approved",
    bg: "bg-blue-50 border-blue-200",
    color: "text-blue-700",
    dot: "bg-blue-500",
  },
  paid: {
    label: "Paid",
    bg: "bg-emerald-50 border-emerald-200",
    color: "text-emerald-700",
    dot: "bg-emerald-500",
  },
  rejected: {
    label: "Rejected",
    bg: "bg-red-50 border-red-200",
    color: "text-red-700",
    dot: "bg-red-500",
  },
};
