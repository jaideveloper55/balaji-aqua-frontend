import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ProtectedRoute } from "./components/ProtectedRoute";
import LoginPage from "./modules/auth/pages/Login";
import RegisterPage from "./modules/auth/pages/Register";
import ForgotPasswordPage from "./modules/auth/pages/ForgotPassword";
import AdminLayout from "./components/layouts/AdminLayout";
import CustomerPage from "./modules/customers/pages/Customerpage";
import Companies from "./modules/companies/pages/Companies";
import ProductsPage from "./modules/products/pages/ProductsPage";
import Deliverypage from "./modules/delivery/page/Deliverypage";
import JarTrackingPage from "./modules/jar-tracking/pages/JarTrackingPage";
import BillingPage from "./modules/billing/pages/Billingpage";
import InventoryPage from "./modules/inventory/page/Inventorypage";
import ProfilePage from "./modules/profile/pages/ProfilePage";
import EventOrdersPage from "./modules/events/pages/EventsPage";
import EmployeesPage from "./modules/employees/pages/EmployeesPage";
import AttendancePage from "./modules/attendance/pages/Attendancepage";
import SalaryPage from "./modules/salary/pages/Salarypage";
import ExpensesPage from "./modules/expenses/pages/Expensespage";
import ProductionPage from "./modules/production/pages/Productionpage";
import ReportsPage from "./modules/reports/pages/Reportspage";
import Dashboard from "./modules/dashboard/pages/DashboardPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ─── PUBLIC ROUTES ──────────────────────────────────────────── */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

        {/* ─── PROTECTED ADMIN ROUTES ─────────────────────────────────── */}

        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="customers" element={<CustomerPage />} />
          <Route path="company" element={<Companies />} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="delivery" element={<Deliverypage />} />
          <Route path="jar-tracking" element={<JarTrackingPage />} />
          <Route path="billing-pos" element={<BillingPage />} />
          <Route path="inventory" element={<InventoryPage />} />
          <Route path="event-orders" element={<EventOrdersPage />} />
          <Route path="employees" element={<EmployeesPage />} />
          <Route path="attendance" element={<AttendancePage />} />
          <Route path="salary" element={<SalaryPage />} />
          <Route path="expenses" element={<ExpensesPage />} />
          <Route path="production" element={<ProductionPage />} />
          <Route path="reports" element={<ReportsPage />} />
        </Route>

        {/* ─── 404 FALLBACK ───────────────────────────────────────────── */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
