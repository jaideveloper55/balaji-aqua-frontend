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
import UamPage from "./modules/uam/UamPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ─── PUBLIC ROUTES ──────────────────────────────────────────── */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />

          {/* ── Gated by menuKey: hidden in the sidebar AND blocked by
              direct URL for a role without that toggle enabled. Super
              Admin bypasses this check unconditionally (see
              ProtectedRoute). ── */}
          <Route
            path="dashboard"
            element={
              <ProtectedRoute menuKey="DASHBOARD">
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="customers"
            element={
              <ProtectedRoute menuKey="CUSTOMER_MANAGEMENT">
                <CustomerPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="products"
            element={
              <ProtectedRoute menuKey="PRODUCT_MANAGEMENT">
                <ProductsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="billing-pos"
            element={
              <ProtectedRoute menuKey="BILLING_POS">
                <BillingPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="event-orders"
            element={
              <ProtectedRoute menuKey="EVENT_ORDERS">
                <EventOrdersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="inventory"
            element={
              <ProtectedRoute menuKey="INVENTORY">
                <InventoryPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="expenses"
            element={
              <ProtectedRoute menuKey="EXPENSES">
                <ExpensesPage />
              </ProtectedRoute>
            }
          />

          {/* ── Hard role gate only, no menuKey — matches the sidebar's
              own uam item exactly (never toggleable, always
              Super-Admin-only). ── */}
          <Route
            path="uam"
            element={
              <ProtectedRoute allowedRoles={["SUPER_ADMIN"]}>
                <UamPage />
              </ProtectedRoute>
            }
          />

          {/* ── Not yet wired to a MenuKey — no permission data exists
              for these modules yet, so they stay open to anyone
              authenticated for now rather than guessing a mapping. ── */}
          <Route path="profile" element={<ProfilePage />} />
          <Route path="company" element={<Companies />} />
          <Route path="delivery" element={<Deliverypage />} />
          <Route path="jar-tracking" element={<JarTrackingPage />} />
          <Route path="employees" element={<EmployeesPage />} />
          <Route path="attendance" element={<AttendancePage />} />
          <Route path="salary" element={<SalaryPage />} />
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
