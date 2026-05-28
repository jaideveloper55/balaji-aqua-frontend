export type ProductionShift = "morning" | "evening" | "night";
export type ProductionStatus = "completed" | "in_progress" | "halted";
export type QualityResult = "pass" | "fail" | "pending";

export interface ProductionBatch {
  id: string;
  batchNo: string;
  date: string; // YYYY-MM-DD
  shift: ProductionShift;
  product: string; // e.g. "20L Jar", "1L Bottle"
  productCategory: "jar" | "bottle" | "can";
  targetUnits: number;
  producedUnits: number;
  wastageUnits: number;
  inputLitres: number;
  outputLitres: number;
  totalCost: number;
  costPerUnit: number;
  status: ProductionStatus;
  quality: QualityResult;
  operator: string;
  startTime: string;
  endTime?: string;
  remarks?: string;
}

export interface CostBreakdown {
  rawWater: number;
  electricity: number;
  labor: number;
  packaging: number;
  chemicals: number;
  maintenance: number;
  others: number;
}

export interface ProductionStats {
  totalProductionToday: number; // litres
  totalUnitsToday: number;
  avgCostPerLitre: number;
  efficiencyPct: number;
  wastagePct: number;
  pendingQualityChecks: number;
  activeBatches: number;
  monthlyProduction: number;
}

export interface QualityCheck {
  id: string;
  batchNo: string;
  date: string;
  tds: number; // ppm
  ph: number;
  temperature: number;
  hardness: number;
  chlorine: number;
  result: QualityResult;
  inspector: string;
  remarks?: string;
}

export interface ProductionTrendPoint {
  date: string;
  production: number; // litres
  cost: number; // rupees
  efficiency: number; // percentage
}
