import {
  useState,
  useMemo,
  useCallback,
  forwardRef,
  useImperativeHandle,
} from "react";
import { Table, Tooltip, Popconfirm, Button, Spin } from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  HiOutlinePlus,
  HiOutlineTag,
  HiOutlinePencil,
  HiOutlineTrash,
  HiOutlineSearch,
  HiOutlineColorSwatch,
} from "react-icons/hi";
import CategoryModal, { CategoryFormValues } from "./CategoryModal";

import {
  useCategories,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
} from "../hooks/Usecategories";
import type { Category } from "../types/Product";

export interface CategoryManagerHandle {
  openCreate: () => void;
}

const CategoryManager = forwardRef<CategoryManagerHandle>((_props, ref) => {
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editCategory, setEditCategory] = useState<Category | null>(null);

  const { data: categories = [], isLoading } = useCategories();
  const createMutation = useCreateCategory();
  const updateMutation = useUpdateCategory();
  const deleteMutation = useDeleteCategory();

  const filtered = useMemo(() => {
    if (!search.trim()) return categories;
    const q = search.toLowerCase();
    return categories.filter(
      (c) =>
        c.name.toLowerCase().includes(q) || c.slug.toLowerCase().includes(q)
    );
  }, [categories, search]);

  // ─── Modal open/close ───
  const handleOpenCreate = useCallback(() => {
    setEditCategory(null);
    setModalOpen(true);
  }, []);

  const handleEdit = useCallback((category: Category) => {
    setEditCategory(category);
    setModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setModalOpen(false);
    setEditCategory(null);
  }, []);

  useImperativeHandle(ref, () => ({ openCreate: handleOpenCreate }), [
    handleOpenCreate,
  ]);

  // 🔑 Close the modal AFTER mutation success
  const handleSuccess = useCallback(
    async (data: CategoryFormValues & { color: string; bg: string }) => {
      try {
        if (editCategory) {
          await updateMutation.mutateAsync({
            id: editCategory.id,
            payload: {
              name: data.name,
              color: data.color,
              bg: data.bg,
              description: data.description,
            },
          });
        } else {
          await createMutation.mutateAsync({
            name: data.name,
            color: data.color,
            bg: data.bg,
            description: data.description,
          });
        }
        // ✅ Only reach here if mutation SUCCEEDED — close the modal
        handleCloseModal();
      } catch {
        // ❌ Mutation failed — keep modal open so user can retry
        // toast is already shown by hook's onError
      }
    },
    [editCategory, createMutation, updateMutation, handleCloseModal]
  );

  const handleDelete = useCallback(
    (id: string) => {
      deleteMutation.mutate(id);
    },
    [deleteMutation]
  );

  // ─── Columns ───
  const columns: ColumnsType<Category> = useMemo(
    () => [
      {
        title: "Category",
        key: "name",
        width: 280,
        render: (_, record) => (
          <div className="flex items-center gap-3 group">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ring-1 ring-slate-100 transition-transform duration-200 group-hover:scale-105"
              style={{ background: record.bg, color: record.color }}
            >
              <HiOutlineTag size={16} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[13px] font-semibold text-slate-800 truncate leading-tight">
                {record.name}
              </p>
              <p className="text-[10px] font-mono text-slate-500 bg-slate-50 ring-1 ring-slate-100 px-1.5 py-0.5 rounded w-fit mt-1">
                {record.slug}
              </p>
            </div>
          </div>
        ),
      },
      {
        title: "Color",
        key: "color",
        width: 180,
        align: "center",
        render: (_, record) => (
          <div className="flex items-center justify-center gap-2">
            <div
              className="w-5 h-5 rounded-md ring-1 ring-slate-200 shadow-sm"
              style={{ backgroundColor: record.color }}
            />
            <span className="text-[11px] font-mono text-slate-500 uppercase">
              {record.color}
            </span>
          </div>
        ),
      },
      {
        title: "Products",
        dataIndex: "productCount",
        key: "productCount",
        width: 110,
        align: "center",
        sorter: (a, b) => a.productCount - b.productCount,
        render: (count: number) => (
          <span
            className={`inline-flex items-center justify-center min-w-8 h-7 px-2 rounded-lg text-[12px] font-bold tabular-nums ${
              count === 0
                ? "bg-slate-50 text-slate-400 ring-1 ring-slate-100"
                : "bg-blue-50 text-blue-700 ring-1 ring-blue-100"
            }`}
          >
            {count}
          </span>
        ),
      },
      {
        title: "Status",
        dataIndex: "isActive",
        key: "isActive",
        width: 110,
        align: "center",
        render: (isActive: boolean) => (
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold ${
              isActive
                ? "bg-emerald-50 text-emerald-700"
                : "bg-slate-50 text-slate-500"
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                isActive ? "bg-emerald-500" : "bg-slate-400"
              }`}
            />
            {isActive ? "Active" : "Inactive"}
          </span>
        ),
      },
      {
        title: "Created",
        dataIndex: "createdAt",
        key: "createdAt",
        width: 120,
        align: "center",
        render: (d: string) => (
          <span className="text-[11px] text-slate-500 font-mono tabular-nums">
            {new Date(d).toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </span>
        ),
      },
      {
        title: "",
        key: "actions",
        width: 100,
        align: "center",
        render: (_, record) => (
          <div
            className="flex items-center justify-center gap-1"
            onClick={(e) => e.stopPropagation()}
          >
            <Tooltip title="Edit category">
              <button
                onClick={() => handleEdit(record)}
                className="p-2 rounded-lg hover:bg-blue-50 text-slate-400 hover:text-blue-600 transition-all duration-150 hover:scale-110"
              >
                <HiOutlinePencil size={14} />
              </button>
            </Tooltip>
            <Popconfirm
              title="Delete this category?"
              description={
                record.productCount > 0
                  ? `${record.productCount} products are linked. Reassign first.`
                  : "This action cannot be undone."
              }
              onConfirm={() => handleDelete(record.id)}
              okText="Delete"
              okButtonProps={{
                danger: true,
                loading: deleteMutation.isPending,
              }}
              cancelText="Cancel"
              placement="topRight"
              disabled={record.productCount > 0}
            >
              <button
                disabled={record.productCount > 0}
                className="p-2 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600 transition-all duration-150 hover:scale-110 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:bg-transparent disabled:hover:text-slate-400"
              >
                <HiOutlineTrash size={14} />
              </button>
            </Popconfirm>
          </div>
        ),
      },
    ],
    [handleEdit, handleDelete, deleteMutation.isPending]
  );

  return (
    <>
      <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm shadow-slate-200/40 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100 bg-gradient-to-r from-slate-50/50 to-transparent">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-violet-50 ring-1 ring-violet-100 flex items-center justify-center">
              <HiOutlineColorSwatch size={15} className="text-violet-600" />
            </div>
            <div>
              <h3 className="text-[13px] font-bold text-slate-800 leading-tight">
                Category Management
              </h3>
              <p className="text-[11px] text-slate-500 mt-0.5">
                <span className="font-semibold text-slate-700">
                  {categories.length}
                </span>{" "}
                categories ·{" "}
                <span className="font-semibold text-slate-700">
                  {categories.reduce((s, c) => s + c.productCount, 0)}
                </span>{" "}
                products
              </p>
            </div>
          </div>

          <Button
            type="primary"
            size="small"
            icon={<HiOutlinePlus size={13} />}
            onClick={handleOpenCreate}
            className="!bg-blue-600 hover:!bg-blue-700 !rounded-lg !h-8 !font-semibold !shadow-sm !shadow-blue-500/20 !border-0"
          >
            New Category
          </Button>
        </div>

        {/* Search */}
        <div className="px-5 py-3 border-b border-slate-100">
          <div className="relative max-w-xs">
            <HiOutlineSearch
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search categories..."
              className="w-full h-9 pl-9 pr-3 text-[12px] bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all duration-200 placeholder:text-slate-400"
            />
          </div>
        </div>

        {/* Table */}
        <Spin spinning={isLoading} tip="Loading categories...">
          <Table<Category>
            columns={columns}
            dataSource={filtered}
            rowKey="id"
            size="middle"
            pagination={false}
            onRow={(record) => ({
              onClick: () => handleEdit(record),
              className: "cursor-pointer group",
            })}
            className="category-table"
          />
        </Spin>
      </div>

      {/* Modal */}
      <CategoryModal
        open={modalOpen}
        onClose={handleCloseModal}
        onSuccess={handleSuccess}
        loading={createMutation.isPending || updateMutation.isPending}
        isEdit={!!editCategory}
        defaultValues={
          editCategory
            ? {
                name: editCategory.name,
                color: editCategory.color,
                bg: editCategory.bg,
                description: editCategory.description || "",
              }
            : undefined
        }
      />
    </>
  );
});

CategoryManager.displayName = "CategoryManager";

export default CategoryManager;
