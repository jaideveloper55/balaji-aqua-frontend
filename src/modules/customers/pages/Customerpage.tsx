import { useCallback, useState } from "react";
import { Button, Spin } from "antd";
import {
  HiOutlineUsers,
  HiOutlineUserAdd,
  HiOutlineDownload,
} from "react-icons/hi";
import { useQuery } from "@tanstack/react-query";
import CustomPageHeader from "../../../components/common/CustomPageHeader";
import CustomerList from "../components/Customerlist";
import CustomerDetail from "../components/Customerdetail";
import CustomerModal from "../components/Customermodal";
import { getCustomerApi } from "../api/customers.api";
import type { Customer } from "../types/Customer";

type CustomerView = { page: "list" } | { page: "detail"; customerId: string };

const INITIAL_VIEW: CustomerView = { page: "list" };

const CustomerPage = () => {
  const [view, setView] = useState<CustomerView>(INITIAL_VIEW);
  const [createOpen, setCreateOpen] = useState(false);
  const [editCustomerId, setEditCustomerId] = useState<string | null>(null);

  const goToList = useCallback(() => setView({ page: "list" }), []);

  const goToDetail = useCallback(
    (customerId: string) => setView({ page: "detail", customerId }),
    []
  );

  //  Fetch Single Customer
  const { data: editCustomer, isLoading: isEditLoading } = useQuery({
    queryKey: ["getCustomer", { editCustomerId }],
    queryFn: () =>
      getCustomerApi(editCustomerId!).then((res) => res.data as Customer),
    enabled: !!editCustomerId,
    refetchOnWindowFocus: false,
  });

  const handleEdit = useCallback((id: string) => {
    setEditCustomerId(id);
  }, []);

  const closeEditModal = useCallback(() => {
    setEditCustomerId(null);
  }, []);

  const openCreate = useCallback(() => setCreateOpen(true), []);
  const closeCreate = useCallback(() => setCreateOpen(false), []);

  const handleCreateSuccess = useCallback(
    (id: string) => {
      setCreateOpen(false);
      goToDetail(id);
    },
    [goToDetail]
  );

  const handleEditSuccess = useCallback(() => {
    setEditCustomerId(null);
  }, []);

  return (
    <Spin spinning={isEditLoading}>
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
          customer={editCustomer}
          onSuccess={handleEditSuccess}
        />
      </div>
    </Spin>
  );
};

export default CustomerPage;
