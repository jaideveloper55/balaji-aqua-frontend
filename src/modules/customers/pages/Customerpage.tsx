import React, { useState } from "react";
import CustomerList from "../components/Customerlist";
import CustomerDetail from "../components/Customerdetail";

type CustomerView = { page: "list" } | { page: "detail"; customerId: string };

const CustomerPage: React.FC = () => {
  const [view, setView] = useState<CustomerView>({ page: "list" });

  const goToList = () => setView({ page: "list" });
  const goToDetail = (id: string) =>
    setView({ page: "detail", customerId: id });

  switch (view.page) {
    case "list":
      return <CustomerList onNavigateToDetail={goToDetail} />;
    case "detail":
      return (
        <CustomerDetail
          customerId={view.customerId}
          onBack={goToList}
          onEdit={(id) => goToDetail(id)}
        />
      );
    default:
      return null;
  }
};

export default CustomerPage;
