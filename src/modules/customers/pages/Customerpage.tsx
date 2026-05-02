import React, { useCallback, useState } from "react";
import CustomerList from "../components/Customerlist";
import CustomerDetail from "../components/Customerdetail";
import CustomerModal from "../components/Customermodal";
import { useCustomer } from "../hooks/useCustomer";

type CustomerView = { page: "list" } | { page: "detail"; customerId: string };

const INITIAL_VIEW: CustomerView = { page: "list" };

const CustomerPage: React.FC = () => {
  const [view, setView] = useState<CustomerView>(INITIAL_VIEW);
  const [editCustomerId, setEditCustomerId] = useState<string | null>(null);

  // Fetch the customer being edited (only when there's an ID)
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

  return (
    <>
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

      {/* Edit modal — accessible from BOTH list and detail views */}
      <CustomerModal
        open={!!editCustomerId && !!editCustomer}
        onClose={closeEditModal}
        customer={editCustomer ?? undefined}
        onSuccess={closeEditModal}
      />
    </>
  );
};

export default CustomerPage;
