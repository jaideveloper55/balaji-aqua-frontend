import React, { useCallback, useState } from "react";
import CustomerList from "../components/Customerlist";
import CustomerDetail from "../components/Customerdetail";

type CustomerView = { page: "list" } | { page: "detail"; customerId: string };

const INITIAL_VIEW: CustomerView = { page: "list" };

const CustomerPage: React.FC = () => {
  const [view, setView] = useState<CustomerView>(INITIAL_VIEW);

  const goToList = useCallback(() => setView({ page: "list" }), []);
  const goToDetail = useCallback(
    (customerId: string) => setView({ page: "detail", customerId }),
    []
  );

  switch (view.page) {
    case "list":
      return <CustomerList onNavigateToDetail={goToDetail} />;

    case "detail":
      return (
        <CustomerDetail
          customerId={view.customerId}
          onBack={goToList}
          onEdit={goToDetail}
        />
      );
  }
};

export default CustomerPage;
