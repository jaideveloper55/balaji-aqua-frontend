import React from "react";
import {
  HiOutlineArrowCircleUp,
  HiOutlineArrowCircleDown,
  HiOutlineExclamationCircle,
} from "react-icons/hi";
import type { TransactionType } from "../types/JarTracking";

export type TransactionTypeConfig = {
  label: string;
  color: string;
  icon: React.ReactNode;
  qtyPrefix: string;
  qtyColor: string;
  qtyBg: string;
};

export const TRANSACTION_TYPE_CONFIG: {
  [K in TransactionType]: TransactionTypeConfig;
} = {
  issued: {
    label: "Issued",
    color: "blue",
    icon: <HiOutlineArrowCircleUp size={13} className="text-blue-500" />,
    qtyPrefix: "+",
    qtyColor: "text-blue-700",
    qtyBg: "bg-blue-50",
  },
  returned: {
    label: "Returned",
    color: "green",
    icon: <HiOutlineArrowCircleDown size={13} className="text-emerald-500" />,
    qtyPrefix: "−",
    qtyColor: "text-emerald-700",
    qtyBg: "bg-emerald-50",
  },
  damaged: {
    label: "Damaged",
    color: "red",
    icon: <HiOutlineExclamationCircle size={13} className="text-red-500" />,
    qtyPrefix: "×",
    qtyColor: "text-red-700",
    qtyBg: "bg-red-50",
  },
};

export const TRANSACTION_TYPE_FILTERS = [
  { text: "Issued", value: "issued" },
  { text: "Returned", value: "returned" },
  { text: "Damaged", value: "damaged" },
];
