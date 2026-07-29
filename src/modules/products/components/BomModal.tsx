import React, { useState, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button, InputNumber, Spin, Empty, Tooltip } from "antd";
import {
  HiOutlineBeaker,
  HiOutlinePlus,
  HiOutlineTrash,
  HiOutlineExclamationCircle,
} from "react-icons/hi";
import CustomModal from "../../../components/common/CustomModal";
import CustomSelect from "../../../components/common/CustomSelect";
import {
  errorNotification,
  successNotification,
} from "../../../components/common/Notification";
import {
  getProductBomApi,
  setProductBomApi,
  clearProductBomApi,
  getProductsApi,
} from "../api/Products.api";
import type { Product, BomLinePayload } from "../types/Product";

interface BomModalProps {
  open: boolean;
  onClose: () => void;
  product: Product | null;
}

/** Local draft row — componentId can be empty while the user is picking. */
interface DraftLine {
  componentId: string | undefined;
  quantityPerUnit: number;
}

const BomModal: React.FC<BomModalProps> = ({ open, onClose, product }) => {
  const queryClient = useQueryClient();
  const [lines, setLines] = useState<DraftLine[]>([]);

  // CustomSelect needs a react-hook-form control. We use one throwaway form
  // whose fields are named line-0, line-1, … one per row.
  const { control, setValue, formState } = useForm<Record<string, string>>();

  // ─── Load the saved recipe ───
  const { data: bomData, isLoading } = useQuery({
    queryKey: ["getProductBom", product?.id],
    queryFn: () => getProductBomApi(product!.id).then((res) => res.data),
    enabled: open && !!product?.id,
  });

  // ─── Load candidate components ───
  const { data: allProductsData, isLoading: isLoadingProducts } = useQuery({
    queryKey: ["getProducts", { pageSize: 100, forBom: true }],
    queryFn: () => getProductsApi({ pageSize: 100 }).then((res) => res.data),
    enabled: open,
    staleTime: 1000 * 60,
  });

  // Seed the draft + the form fields when server data lands
  useEffect(() => {
    if (!bomData) return;
    const seeded = bomData.lines.map((l) => ({
      componentId: l.componentId,
      quantityPerUnit: l.quantityPerUnit,
    }));
    setLines(seeded);
    seeded.forEach((l, i) => setValue(`line-${i}`, l.componentId ?? ""));
  }, [bomData, setValue]);

  // Reset when the modal closes so the next product starts clean
  useEffect(() => {
    if (!open) setLines([]);
  }, [open]);

  const componentOptions = useMemo(() => {
    const all: Product[] = allProductsData?.data ?? [];
    return all
      .filter((p) => p.id !== product?.id) // can't consume itself
      .map((p) => ({
        value: p.id,
        label: `${p.name} (${p.sku}) — ${p.stock} ${p.unit.toLowerCase()}`,
      }));
  }, [allProductsData, product?.id]);

  // ─── Save ───
  const saveMutation = useMutation({
    mutationFn: (payload: BomLinePayload[]) =>
      setProductBomApi(product!.id, { lines: payload }).then((r) => r.data),
    onSuccess: () => {
      successNotification("Saved", "Bill of materials updated");
      queryClient.invalidateQueries({ queryKey: ["getProductBom"] });
      queryClient.invalidateQueries({ queryKey: ["getProducts"] });
      onClose();
    },
    onError: (err: any) =>
      errorNotification(
        "Save Failed",
        // Backend messages are user-facing: circular recipe, duplicates, etc.
        err?.response?.data?.message ?? "Could not save recipe"
      ),
  });

  // ─── Clear ───
  const clearMutation = useMutation({
    mutationFn: () => clearProductBomApi(product!.id).then((r) => r.data),
    onSuccess: () => {
      successNotification("Cleared", "Recipe removed");
      setLines([]);
      queryClient.invalidateQueries({ queryKey: ["getProductBom"] });
      queryClient.invalidateQueries({ queryKey: ["getProducts"] });
      onClose();
    },
    onError: (err: any) =>
      errorNotification(
        "Failed",
        err?.response?.data?.message ?? "Could not clear recipe"
      ),
  });

  const handleSave = () => {
    // Mirror the backend checks so the user gets instant feedback
    if (lines.some((l) => !l.componentId)) {
      errorNotification("Incomplete", "Select a raw material for every row");
      return;
    }
    const ids = lines.map((l) => l.componentId!);
    if (new Set(ids).size !== ids.length) {
      errorNotification(
        "Duplicate",
        "Same raw material listed twice — combine into one row"
      );
      return;
    }
    if (lines.some((l) => !(l.quantityPerUnit > 0))) {
      errorNotification("Invalid", "Quantity must be greater than 0");
      return;
    }

    saveMutation.mutate(
      lines.map((l) => ({
        componentId: l.componentId!,
        quantityPerUnit: Number(l.quantityPerUnit),
      }))
    );
  };

  const addLine = () =>
    setLines([...lines, { componentId: undefined, quantityPerUnit: 1 }]);

  const removeLine = (index: number) => {
    const next = lines.filter((_, i) => i !== index);
    setLines(next);
    // Re-sync the form fields since indices shift after a removal
    next.forEach((l, i) => setValue(`line-${i}`, l.componentId ?? ""));
  };

  const unitLabel = product?.unit?.toLowerCase() ?? "unit";
  const savedLines = bomData?.lines ?? [];
  const maxBuildable = bomData?.maxBuildable;
  const hasOutOfStockComponent = savedLines.some((l) => l.buildableUnits === 0);

  return (
    <CustomModal
      open={open}
      onClose={onClose}
      title="Bill of Materials"
      subtitle={product ? `${product.name} · ${product.sku}` : ""}
      icon={<HiOutlineBeaker size={20} />}
      iconTone="purple"
      size="2xl"
      footer={
        <div className="flex items-center justify-between">
          <Button
            danger
            type="text"
            disabled={savedLines.length === 0 || clearMutation.isPending}
            loading={clearMutation.isPending}
            onClick={() => clearMutation.mutate()}
            className="!text-[13px]"
          >
            Clear recipe
          </Button>
          <div className="flex gap-2">
            <Button onClick={onClose} className="!rounded-xl !h-9">
              Cancel
            </Button>
            <Button
              type="primary"
              loading={saveMutation.isPending}
              disabled={lines.length === 0}
              onClick={handleSave}
              className="!bg-blue-600 hover:!bg-blue-700 !rounded-xl !h-9 !font-semibold"
            >
              Save Recipe
            </Button>
          </div>
        </div>
      }
    >
      {isLoading ? (
        <div className="py-12 flex justify-center">
          <Spin />
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {/* What this screen does */}
          <p className="text-[13px] text-slate-500 leading-relaxed">
            Raw materials consumed per <strong>1 {unitLabel}</strong> produced.
            These are deducted automatically when you record a Production
            stock-in for this product.
          </p>

          {/* Buildable summary — the number a plant manager cares about */}
          {typeof maxBuildable === "number" && (
            <div className="flex items-center gap-2.5 bg-blue-50 ring-1 ring-blue-100 rounded-xl px-4 py-3">
              <HiOutlineBeaker size={17} className="text-blue-600 shrink-0" />
              <span className="text-[13px] text-blue-900">
                Current raw material stock supports{" "}
                <strong className="font-mono tabular-nums">
                  {maxBuildable.toLocaleString("en-IN")}
                </strong>{" "}
                {unitLabel}
              </span>
            </div>
          )}

          {/* Out-of-stock warning */}
          {hasOutOfStockComponent && (
            <div className="flex items-start gap-2.5 bg-amber-50 ring-1 ring-amber-100 rounded-xl px-4 py-3">
              <HiOutlineExclamationCircle
                size={17}
                className="text-amber-600 shrink-0 mt-0.5"
              />
              <span className="text-[13px] text-amber-900">
                One or more raw materials are out of stock. Production of this
                product will be blocked until they're replenished.
              </span>
            </div>
          )}

          {/* Rows */}
          {lines.length === 0 ? (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={
                <span className="text-[13px] text-slate-400">
                  No recipe set — selling this product won't affect raw
                  materials
                </span>
              }
            />
          ) : (
            <div className="flex flex-col gap-2.5">
              {lines.map((line, i) => (
                <div
                  key={i}
                  className="flex items-end gap-3 ring-1 ring-slate-100 rounded-xl p-3 bg-white"
                >
                  <div className="flex-1 min-w-0">
                    <CustomSelect
                      name={`line-${i}`}
                      control={control}
                      errors={formState.errors}
                      label={i === 0 ? "Raw material" : undefined}
                      placeholder="Select raw material"
                      showSearch
                      isLoading={isLoadingProducts}
                      options={componentOptions}
                      value={line.componentId ?? null}
                      onChange={(val) => {
                        const next = [...lines];
                        next[i] = { ...next[i], componentId: val };
                        setLines(next);
                      }}
                    />
                  </div>

                  <div className="flex flex-col gap-1 shrink-0">
                    {i === 0 && (
                      <label className="py-1 text-sm text-text-primary">
                        Qty per {unitLabel}
                      </label>
                    )}
                    <Tooltip title={`Consumed per 1 ${unitLabel} sold`}>
                      <InputNumber
                        min={0.0001}
                        step={1}
                        value={line.quantityPerUnit}
                        onChange={(val) => {
                          const next = [...lines];
                          next[i] = { ...next[i], quantityPerUnit: val ?? 1 };
                          setLines(next);
                        }}
                        className="!w-28 !rounded-lg"
                      />
                    </Tooltip>
                  </div>

                  <button
                    onClick={() => removeLine(i)}
                    className="p-2 mb-0.5 rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-600 transition-all shrink-0"
                    aria-label="Remove row"
                  >
                    <HiOutlineTrash size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}

          <Button
            icon={<HiOutlinePlus size={15} />}
            onClick={addLine}
            className="!rounded-xl !border-dashed !h-9 w-fit"
          >
            Add raw material
          </Button>
        </div>
      )}
    </CustomModal>
  );
};

export default BomModal;
