import {
  HiOutlineLightningBolt,
  HiOutlineTruck,
  HiOutlineArchive,
  HiOutlineOfficeBuilding,
  HiOutlineFolder,
  HiOutlineClipboardCheck,
  HiOutlineCash,
  HiOutlineDeviceMobile,
  HiOutlineLibrary,
  HiOutlineCreditCard,
  HiOutlineDocumentText,
  HiOutlineSpeakerphone,
} from "react-icons/hi";
import { HiOutlineWrench, HiOutlineCube } from "react-icons/hi2";
import type { ReactNode } from "react";

export const CATEGORY_META: Record<
  string,
  { label: string; icon: ReactNode; bg: string; color: string; iconBg: string }
> = {
  utilities: {
    label: "Utilities",
    icon: <HiOutlineLightningBolt size={18} />,
    bg: "bg-amber-50 border-amber-200",
    color: "text-amber-700",
    iconBg: "bg-amber-100",
  },
  plant_ops: {
    label: "Plant Operations",
    icon: <HiOutlineCube size={18} />,
    bg: "bg-cyan-50 border-cyan-200",
    color: "text-cyan-700",
    iconBg: "bg-cyan-100",
  },
  packaging: {
    label: "Packaging",
    icon: <HiOutlineArchive size={18} />,
    bg: "bg-purple-50 border-purple-200",
    color: "text-purple-700",
    iconBg: "bg-purple-100",
  },
  vehicle: {
    label: "Vehicle & Fuel",
    icon: <HiOutlineTruck size={18} />,
    bg: "bg-blue-50 border-blue-200",
    color: "text-blue-700",
    iconBg: "bg-blue-100",
  },
  rent: {
    label: "Rent & Lease",
    icon: <HiOutlineOfficeBuilding size={18} />,
    bg: "bg-indigo-50 border-indigo-200",
    color: "text-indigo-700",
    iconBg: "bg-indigo-100",
  },
  compliance: {
    label: "Compliance",
    icon: <HiOutlineClipboardCheck size={18} />,
    bg: "bg-rose-50 border-rose-200",
    color: "text-rose-700",
    iconBg: "bg-rose-100",
  },
  marketing: {
    label: "Marketing",
    icon: <HiOutlineSpeakerphone size={18} />,
    bg: "bg-pink-50 border-pink-200",
    color: "text-pink-700",
    iconBg: "bg-pink-100",
  },
  office: {
    label: "Office",
    icon: <HiOutlineFolder size={18} />,
    bg: "bg-slate-50 border-slate-200",
    color: "text-slate-700",
    iconBg: "bg-slate-100",
  },
  repairs: {
    label: "Repairs",
    icon: <HiOutlineWrench size={18} />,
    bg: "bg-orange-50 border-orange-200",
    color: "text-orange-700",
    iconBg: "bg-orange-100",
  },
  loan: {
    label: "Loan",
    icon: <HiOutlineCreditCard size={18} />,
    bg: "bg-red-50 border-red-200",
    color: "text-red-700",
    iconBg: "bg-red-100",
  },
};

export const EXPENSE_CATEGORIES = [
  {
    value: "utilities",
    label: "Utilities",
    description: "Electricity, water bill, internet",
  },
  {
    value: "plant_ops",
    label: "Plant Operations",
    description: "RO membrane, filters, salt, chemicals",
  },
  {
    value: "packaging",
    label: "Packaging",
    description: "Caps, seals, labels, shrink wrap",
  },
  {
    value: "vehicle",
    label: "Vehicle & Fuel",
    description: "Diesel, vehicle service, FASTag",
  },
  {
    value: "rent",
    label: "Rent & Lease",
    description: "Plant rent, godown, vehicle lease",
  },
  {
    value: "compliance",
    label: "Government & Compliance",
    description: "GST, BIS, FSSAI, pollution board",
  },
  {
    value: "marketing",
    label: "Marketing",
    description: "Pamphlets, hoardings, ads",
  },
  {
    value: "office",
    label: "Office & Admin",
    description: "Stationery, tea, miscellaneous",
  },
  {
    value: "repairs",
    label: "Repairs & Maintenance",
    description: "Equipment repair, vehicle maintenance",
  },
  {
    value: "loan",
    label: "Loan & Interest",
    description: "EMI payments, interest charges",
  },
] as const;

export const PAYMENT_MODE_META: Record<
  string,
  { label: string; icon: ReactNode; bg: string; color: string }
> = {
  CASH: {
    label: "Cash",
    icon: <HiOutlineCash size={14} />,
    bg: "bg-emerald-50 border-emerald-200",
    color: "text-emerald-700",
  },
  UPI: {
    label: "UPI",
    icon: <HiOutlineDeviceMobile size={14} />,
    bg: "bg-purple-50 border-purple-200",
    color: "text-purple-700",
  },
  BANK_TRANSFER: {
    label: "Bank",
    icon: <HiOutlineLibrary size={14} />,
    bg: "bg-blue-50 border-blue-200",
    color: "text-blue-700",
  },
  CHEQUE: {
    label: "Cheque",
    icon: <HiOutlineDocumentText size={14} />,
    bg: "bg-amber-50 border-amber-200",
    color: "text-amber-700",
  },
  CARD: {
    label: "Card",
    icon: <HiOutlineCreditCard size={14} />,
    bg: "bg-indigo-50 border-indigo-200",
    color: "text-indigo-700",
  },
};

export const PAYMENT_MODES = [
  { value: "CASH", label: "Cash", icon: <HiOutlineCash size={14} /> },
  { value: "UPI", label: "UPI", icon: <HiOutlineDeviceMobile size={14} /> },
  {
    value: "BANK_TRANSFER",
    label: "Bank Transfer",
    icon: <HiOutlineLibrary size={14} />,
  },
  {
    value: "CHEQUE",
    label: "Cheque",
    icon: <HiOutlineDocumentText size={14} />,
  },
  { value: "CARD", label: "Card", icon: <HiOutlineCreditCard size={14} /> },
] as const;

export const STATUS_META: Record<
  string,
  { label: string; bg: string; color: string; dot: string }
> = {
  PENDING: {
    label: "Pending",
    bg: "bg-amber-50 border-amber-200",
    color: "text-amber-700",
    dot: "bg-amber-500",
  },
  APPROVED: {
    label: "Approved",
    bg: "bg-blue-50 border-blue-200",
    color: "text-blue-700",
    dot: "bg-blue-500",
  },
  PAID: {
    label: "Paid",
    bg: "bg-emerald-50 border-emerald-200",
    color: "text-emerald-700",
    dot: "bg-emerald-500",
  },
  REJECTED: {
    label: "Rejected",
    bg: "bg-red-50 border-red-200",
    color: "text-red-700",
    dot: "bg-red-500",
  },
};

export const EXPENSE_STATUS = [
  { value: "PENDING", label: "Pending Approval" },
  { value: "APPROVED", label: "Approved" },
  { value: "PAID", label: "Paid" },
  { value: "REJECTED", label: "Rejected" },
] as const;
