export const JAR_STATUS_OPTIONS = [
    { value: "all", label: "All Status" },
    { value: "good", label: "Good" },
    { value: "warning", label: "Warning" },
    { value: "overdue", label: "Overdue" },
  ];
  
  export const ENTRY_TYPE_OPTIONS = [
    { value: "issue", label: "Issue Cans" },
    { value: "return", label: "Return Cans" },
    { value: "damaged", label: "Mark Damaged" },
  ];
  
  export const ROUTE_OPTIONS = [
    { value: "", label: "All Routes" },
    { value: "route_a", label: "Route A - North" },
    { value: "route_b", label: "Route B - South" },
    { value: "route_c", label: "Route C - East" },
    { value: "route_d", label: "Route D - West" },
    { value: "route_e", label: "Route E - Central" },
  ];
  
  export const DRIVER_OPTIONS = [
    { value: "", label: "All Drivers" },
    { value: "drv_01", label: "Ravi Kumar" },
    { value: "drv_02", label: "Suresh M" },
    { value: "drv_03", label: "Karthik R" },
    { value: "drv_04", label: "Manoj P" },
  ];
  
  export const CUSTOMER_OPTIONS = [
    { value: "cust_01", label: "Lakshmi Stores" },
    { value: "cust_02", label: "Anand Enterprises" },
    { value: "cust_03", label: "Sri Krishna Agency" },
    { value: "cust_04", label: "Balaji Traders" },
    { value: "cust_05", label: "Murugan Stores" },
    { value: "cust_06", label: "Kavitha Supermarket" },
    { value: "cust_07", label: "Ganesh Water Supply" },
    { value: "cust_08", label: "Rajan & Sons" },
    { value: "cust_09", label: "Tamil Nadu Traders" },
    { value: "cust_10", label: "Surya Enterprises" },
  ];
  
  export const HOLDING_THRESHOLD = 50;
  export const OVERDUE_DAYS = 14;
  export const WARNING_DAYS = 7;