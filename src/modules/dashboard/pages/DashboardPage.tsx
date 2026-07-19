import React, { useState } from "react";

import Greetingheader from "../components/Greetingheader";
import Smartalertstrip from "../components/Smartalertstrip";
import Dashboardkpicards from "../components/Dashboardkpicards";
import Outstandingdonutpanel from "../components/Outstandingdonutpanel";
import Outstandingcustomerspanel from "../components/Outstandingcustomerspanel";
import Stocklevelspanel from "../components/Stocklevelspanel";
import Quickactionsfooter from "../components/Quickactionsfooter";

import {
  MOCK_KPIS,
  MOCK_ALERTS,
  MOCK_OUTSTANDING_BUCKETS,
  MOCK_PAYMENT_MODE,
  MOCK_DUE_CUSTOMERS,
  MOCK_STOCK_ROWS,
} from "../constants/dashboardMockData";
import Paymentmodepanel from "../components/Paymentmodepanel";

const DashboardPage: React.FC = () => {
  const [refreshing, setRefreshing] = useState(false);

  const kpis = MOCK_KPIS;
  const alerts = MOCK_ALERTS;
  const buckets = MOCK_OUTSTANDING_BUCKETS;
  const paymentMode = MOCK_PAYMENT_MODE;
  const dueCustomers = MOCK_DUE_CUSTOMERS;
  const stockRows = MOCK_STOCK_ROWS;

  const handleRefresh = () => {
    setRefreshing(true);
    // Simulate a fetch while on dummy data
    setTimeout(() => setRefreshing(false), 700);
  };

  return (
    <div className="flex flex-col gap-5">
      <Greetingheader
        userName="Devaa"
        attentionCount={alerts.length}
        refreshing={refreshing}
        onRefresh={handleRefresh}
      />

      {alerts.length > 0 && <Smartalertstrip alerts={alerts} />}

      <Dashboardkpicards data={kpis} />

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Outstandingdonutpanel
          buckets={buckets}
          totalOutstanding={kpis.totalOutstanding}
        />
        <Paymentmodepanel data={paymentMode} />
      </div>

      {/* Lists row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Outstandingcustomerspanel
          customers={dueCustomers}
          totalWithDues={kpis.customersWithDues}
        />
        <Stocklevelspanel items={stockRows} />
      </div>

      <Quickactionsfooter />
    </div>
  );
};

export default DashboardPage;
