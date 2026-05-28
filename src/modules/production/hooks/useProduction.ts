import { useMemo } from "react";
import {
  ProductionBatch,
  ProductionStats,
  CostBreakdown,
  QualityCheck,
  ProductionTrendPoint,
} from "../types/Production";

// Mock data — replace with API calls
export const useProduction = () => {
  const stats: ProductionStats = useMemo(
    () => ({
      totalProductionToday: 12450,
      totalUnitsToday: 624,
      avgCostPerLitre: 2.18,
      efficiencyPct: 92,
      wastagePct: 3.2,
      pendingQualityChecks: 2,
      activeBatches: 3,
      monthlyProduction: 285600,
    }),
    []
  );

  const costBreakdown: CostBreakdown = useMemo(
    () => ({
      rawWater: 18500,
      electricity: 32400,
      labor: 24000,
      packaging: 19800,
      chemicals: 8200,
      maintenance: 6500,
      others: 3200,
    }),
    []
  );

  const batches: ProductionBatch[] = useMemo(
    () => [
      {
        id: "1",
        batchNo: "BATCH-2026-0142",
        date: "2026-05-10",
        shift: "morning",
        product: "20L Jar",
        productCategory: "jar",
        targetUnits: 500,
        producedUnits: 487,
        wastageUnits: 13,
        inputLitres: 10000,
        outputLitres: 9740,
        totalCost: 21450,
        costPerUnit: 44.05,
        status: "completed",
        quality: "pass",
        operator: "Ramesh Kumar",
        startTime: "06:00",
        endTime: "13:30",
      },
      {
        id: "2",
        batchNo: "BATCH-2026-0141",
        date: "2026-05-10",
        shift: "morning",
        product: "1L Bottle",
        productCategory: "bottle",
        targetUnits: 2000,
        producedUnits: 1850,
        wastageUnits: 50,
        inputLitres: 2000,
        outputLitres: 1900,
        totalCost: 8400,
        costPerUnit: 4.54,
        status: "completed",
        quality: "pending",
        operator: "Sundar Raj",
        startTime: "06:30",
        endTime: "12:00",
      },
      {
        id: "3",
        batchNo: "BATCH-2026-0140",
        date: "2026-05-10",
        shift: "evening",
        product: "20L Jar",
        productCategory: "jar",
        targetUnits: 600,
        producedUnits: 320,
        wastageUnits: 8,
        inputLitres: 12000,
        outputLitres: 6400,
        totalCost: 14200,
        costPerUnit: 44.38,
        status: "in_progress",
        quality: "pending",
        operator: "Priya Devi",
        startTime: "14:00",
      },
      {
        id: "4",
        batchNo: "BATCH-2026-0139",
        date: "2026-05-09",
        shift: "night",
        product: "500ml Bottle",
        productCategory: "bottle",
        targetUnits: 3000,
        producedUnits: 2980,
        wastageUnits: 20,
        inputLitres: 1500,
        outputLitres: 1490,
        totalCost: 9200,
        costPerUnit: 3.09,
        status: "completed",
        quality: "pass",
        operator: "Karthik V",
        startTime: "22:00",
        endTime: "05:30",
      },
      {
        id: "5",
        batchNo: "BATCH-2026-0138",
        date: "2026-05-09",
        shift: "evening",
        product: "20L Jar",
        productCategory: "jar",
        targetUnits: 500,
        producedUnits: 0,
        wastageUnits: 0,
        inputLitres: 0,
        outputLitres: 0,
        totalCost: 0,
        costPerUnit: 0,
        status: "halted",
        quality: "fail",
        operator: "Mohan Das",
        startTime: "14:00",
        endTime: "14:45",
        remarks: "RO membrane failure",
      },
    ],
    []
  );

  const qualityChecks: QualityCheck[] = useMemo(
    () => [
      {
        id: "q1",
        batchNo: "BATCH-2026-0142",
        date: "2026-05-10",
        tds: 85,
        ph: 7.2,
        temperature: 24,
        hardness: 65,
        chlorine: 0.2,
        result: "pass",
        inspector: "Dr. Anand",
      },
      {
        id: "q2",
        batchNo: "BATCH-2026-0139",
        date: "2026-05-09",
        tds: 95,
        ph: 7.4,
        temperature: 25,
        hardness: 72,
        chlorine: 0.3,
        result: "pass",
        inspector: "Dr. Anand",
      },
      {
        id: "q3",
        batchNo: "BATCH-2026-0138",
        date: "2026-05-09",
        tds: 180,
        ph: 6.2,
        temperature: 29,
        hardness: 110,
        chlorine: 0.6,
        result: "fail",
        inspector: "Suresh M",
        remarks: "TDS above acceptable range",
      },
      {
        id: "q4",
        batchNo: "BATCH-2026-0137",
        date: "2026-05-08",
        tds: 78,
        ph: 7.1,
        temperature: 23,
        hardness: 58,
        chlorine: 0.15,
        result: "pass",
        inspector: "Dr. Anand",
      },
    ],
    []
  );

  const trends: ProductionTrendPoint[] = useMemo(
    () => [
      { date: "2026-05-04", production: 11200, cost: 24500, efficiency: 88 },
      { date: "2026-05-05", production: 11800, cost: 25100, efficiency: 90 },
      { date: "2026-05-06", production: 12100, cost: 25800, efficiency: 91 },
      { date: "2026-05-07", production: 11600, cost: 24900, efficiency: 89 },
      { date: "2026-05-08", production: 12300, cost: 26100, efficiency: 92 },
      { date: "2026-05-09", production: 12000, cost: 25600, efficiency: 91 },
      { date: "2026-05-10", production: 12450, cost: 26500, efficiency: 92 },
    ],
    []
  );

  return { stats, costBreakdown, batches, qualityChecks, trends };
};
