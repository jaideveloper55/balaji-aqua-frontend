export const STOCK_STATUS_OPTIONS = [
  { value: "all", label: "All Status" },
  { value: "in_stock", label: "In Stock" },
  { value: "low", label: "Low Stock" },
  { value: "out", label: "Out of Stock" },
];

export const CATEGORY_OPTIONS = [
  { value: "", label: "All Categories" },
  { value: "water", label: "Water Products" },
  { value: "accessories", label: "Accessories" },
  { value: "spare_parts", label: "Spare Parts" },
  { value: "packaging", label: "Packaging" },
  { value: "consumables", label: "Consumables" },
];

export const UNIT_OPTIONS = [
  { value: "can", label: "Can" },
  { value: "bottle", label: "Bottle" },
  { value: "liter", label: "Liter" },
  { value: "pcs", label: "Pieces" },
  { value: "kg", label: "Kilogram" },
  { value: "pack", label: "Pack" },
  { value: "box", label: "Box" },
];

export const MOVEMENT_TYPE_OPTIONS = [
  { value: "all", label: "All Types" },
  { value: "in", label: "Stock In" },
  { value: "out", label: "Stock Out" },
  { value: "adjust", label: "Adjustment" },
];

export const SOURCE_IN_OPTIONS = [
  { value: "purchase", label: "Purchase" },
  { value: "production", label: "Production" },
  { value: "return", label: "Customer Return" },
];

export const SOURCE_OUT_OPTIONS = [
  { value: "delivery", label: "Delivery" },
  { value: "damage", label: "Damage" },
  { value: "internal_use", label: "Internal Use" },
];

export const ADJUST_REASON_OPTIONS = [
  { value: "audit_correction", label: "Audit Correction" },
  { value: "damage", label: "Damaged Goods" },
  { value: "expired", label: "Expired" },
  { value: "miscounted", label: "Miscount Correction" },
];

export const PRODUCT_OPTIONS = [
  { value: "prod_01", label: "20L Water Can" },
  { value: "prod_02", label: "10L Water Can" },
  { value: "prod_03", label: "1L Packaged Water" },
  { value: "prod_04", label: "500ml Water Bottle" },
  { value: "prod_05", label: "Water Dispenser" },
  { value: "prod_06", label: "Can Cap (Blue)" },
  { value: "prod_07", label: "Can Cap (White)" },
  { value: "prod_08", label: "Delivery Crate" },
  { value: "prod_09", label: "RO Filter Cartridge" },
  { value: "prod_10", label: "Sediment Filter" },
  { value: "prod_11", label: "UV Lamp Replacement" },
  { value: "prod_12", label: "Shrink Wrap Roll" },
];

export const SUPPLIER_OPTIONS = [
  { value: "sup_01", label: "AquaPure Supplies" },
  { value: "sup_02", label: "PackRight Pvt Ltd" },
  { value: "sup_03", label: "In-House Production" },
  { value: "sup_04", label: "FilterTech India" },
  { value: "sup_05", label: "PlastiCo Manufacturers" },
];

export const WAREHOUSE_OPTIONS = [
  { value: "", label: "All Locations" },
  { value: "main_plant", label: "Main Plant" },
  { value: "secondary", label: "Secondary Storage" },
  { value: "vehicle", label: "Vehicle Stock" },
];

export const LOW_STOCK_THRESHOLD_MULTIPLIER = 1.2; // 120% of reorder level
