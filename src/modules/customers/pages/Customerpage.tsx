import React, { useCallback, useState } from "react";
import { Button } from "antd";
import {
  HiOutlineUsers,
  HiOutlineUserAdd,
  HiOutlineDownload,
} from "react-icons/hi";
import CustomPageHeader from "../../../components/common/CustomPageHeader";
import CustomerList from "../components/Customerlist";
import CustomerDetail from "../components/Customerdetail";
import CustomerModal from "../components/Customermodal";
import { useCustomer } from "../hooks/useCustomer";

type CustomerView = { page: "list" } | { page: "detail"; customerId: string };

const INITIAL_VIEW: CustomerView = { page: "list" };

const CustomerPage: React.FC = () => {
  const [view, setView] = useState<CustomerView>(INITIAL_VIEW);
  const [editCustomerId, setEditCustomerId] = useState<string | null>(null);
  const [createOpen, setCreateOpen] = useState(false);

  const { data: editCustomer } = useCustomer(editCustomerId ?? "");

  const goToList = useCallback(() => setView({ page: "list" }), []);
  const goToDetail = useCallback(
    (customerId: string) => setView({ page: "detail", customerId }),
    []
  );

  const handleEdit = useCallback((id: string) => {
    setEditCustomerId(id);
  }, []);

  const closeEditModal = useCallback(() => setEditCustomerId(null), []);

  const openCreate = useCallback(() => setCreateOpen(true), []);
  const closeCreate = useCallback(() => setCreateOpen(false), []);
  const handleCreateSuccess = useCallback(
    (id: string) => {
      setCreateOpen(false);
      goToDetail(id);
    },
    [goToDetail]
  );

  return (
    <div className="flex flex-col gap-6">
      <CustomPageHeader
        icon={<HiOutlineUsers className="text-white" size={20} />}
        title="Customer Management"
        subtitle="Manage your customer base and accounts"
        iconBg="bg-blue-500"
        actions={
          view.page === "list" ? (
            <>
              <Button
                icon={<HiOutlineDownload size={15} />}
                className="!rounded-xl !h-9"
              >
                Export
              </Button>

              <Button
                type="primary"
                icon={<HiOutlineUserAdd size={15} />}
                onClick={openCreate}
                className="!bg-blue-600 hover:!bg-blue-700 !rounded-xl !h-9 !font-semibold !shadow-sm !shadow-blue-200"
              >
                Add Customer
              </Button>
            </>
          ) : undefined
        }
      />

      {view.page === "list" && (
        <CustomerList
          onNavigateToDetail={goToDetail}
          onEditCustomer={handleEdit}
        />
      )}

      {view.page === "detail" && (
        <CustomerDetail
          customerId={view.customerId}
          onBack={goToList}
          onEdit={handleEdit}
        />
      )}

      {/* CREATE modal */}
      <CustomerModal
        open={createOpen}
        onClose={closeCreate}
        onSuccess={handleCreateSuccess}
      />

      {/* EDIT modal */}
      <CustomerModal
        open={!!editCustomerId && !!editCustomer}
        onClose={closeEditModal}
        customer={editCustomer ?? undefined}
        onSuccess={closeEditModal}
      />
    </div>
  );
};

export default CustomerPage;
