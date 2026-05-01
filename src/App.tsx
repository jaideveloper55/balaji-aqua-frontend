import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ProtectedRoute } from "./components/ProtectedRoute";

// Auth pages (public)
import LoginPage from "./modules/auth/pages/Login";
import RegisterPage from "./modules/auth/pages/Register";
import ForgotPasswordPage from "./modules/auth/pages/ForgotPassword";

// Admin layout
import AdminLayout from "./components/layouts/AdminLayout";

// Admin pages (protected)
import Dashboard from "./modules/dashboard/Dashboard";
import CustomerPage from "./modules/customers/pages/Customerpage";
import Companies from "./modules/companies/pages/Companies";
import ProductsPage from "./modules/products/pages/ProductsPage";
import Deliverypage from "./modules/delivery/page/Deliverypage";
import JarTrackingPage from "./modules/jar-tracking/pages/JarTrackingPage";
import BillingPage from "./modules/billing/pages/Billingpage";
import InventoryPage from "./modules/inventory/page/Inventorypage";
import ProfilePage from "./modules/profile/pages/ProfilePage";

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
        {/* ProtectedRoute checks auth → AdminLayout wraps with sidebar/header
            → Outlet renders the page below */}
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
          <Route path="event-orders" element={<div>Event Orders Page</div>} />
          <Route path="employees" element={<div>Employees Page</div>} />
          <Route path="attendance" element={<div>Attendance Page</div>} />
          <Route path="salary" element={<div>Salary Page</div>} />
          <Route path="expenses" element={<div>Expenses Page</div>} />
          <Route path="production" element={<div>Water Production Page</div>} />
          <Route path="reports" element={<div>Reports & Analytics Page</div>} />
        </Route>

        {/* ─── 404 FALLBACK ───────────────────────────────────────────── */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
