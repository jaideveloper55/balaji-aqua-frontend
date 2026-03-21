import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./modules/auth/pages/Login";
import CustomerPage from "./modules/customers/pages/Customerpage";
import AdminLayout from "./components/AdminLayout";

// const isAuthenticated = () => !!localStorage.getItem("token");

function App() {
  // const [orgId, setOrgId] = useState(
  //   () => localStorage.getItem("orgId") || "balaji-aqua"
  // );

  // const handleOrgSwitch = (newOrgId: string) => {
  //   localStorage.setItem("orgId", newOrgId);
  //   setOrgId(newOrgId);
  // };

  return (
    <BrowserRouter>
      <Routes>
        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        <Route path="/login" element={<LoginPage />} />

        <Route
          path="/admin/dashboard"
          element={
            // <ProtectedRoute>
            <AdminLayout>
              <div>Dashboard Page</div>
            </AdminLayout>
            // </ProtectedRoute>
          }
        />
        <Route
          path="/admin/customers"
          element={
            // <ProtectedRoute>
            <AdminLayout>
              <CustomerPage />
            </AdminLayout>

            // </ProtectedRoute>
          }
        />
        <Route
          path="/admin/products"
          element={
            // <ProtectedRoute>
            <AdminLayout>
              <div>Products Page</div>
            </AdminLayout>
            // </ProtectedRoute>
          }
        />
        <Route
          path="/admin/delivery"
          element={
            // <ProtectedRoute>
            <AdminLayout>
              <div>Delivery Page</div>
            </AdminLayout>
            // </ProtectedRoute>
          }
        />
        <Route
          path="/admin/jar-tracking"
          element={
            // <ProtectedRoute>
            <AdminLayout>
              <div>Jar / Can Tracking Page</div>
            </AdminLayout>
            // </ProtectedRoute>
          }
        />
        <Route
          path="/admin/billing-pos"
          element={
            // <ProtectedRoute>
            <AdminLayout>
              <div>Billing & POS Page</div>
            </AdminLayout>
            // </ProtectedRoute>
          }
        />
        <Route
          path="/admin/event-orders"
          element={
            // <ProtectedRoute>
            <AdminLayout>
              <div>Event Orders Page</div>
            </AdminLayout>
            // </ProtectedRoute>
          }
        />
        <Route
          path="/admin/inventory"
          element={
            // <ProtectedRoute>
            <AdminLayout>
              <div>Inventory Page</div>
            </AdminLayout>
            // </ProtectedRoute>
          }
        />
        <Route
          path="/admin/employees"
          element={
            // <ProtectedRoute>
            <AdminLayout>
              <div>Employees Page</div>
            </AdminLayout>
            // </ProtectedRoute>
          }
        />
        <Route
          path="/admin/attendance"
          element={
            // <ProtectedRoute>
            <AdminLayout>
              <div>Attendance Page</div>
            </AdminLayout>
            // </ProtectedRoute>
          }
        />
        <Route
          path="/admin/salary"
          element={
            // <ProtectedRoute>
            <AdminLayout>
              <div>Salary Page</div>
            </AdminLayout>
            // </ProtectedRoute>
          }
        />
        <Route
          path="/admin/expenses"
          element={
            // <ProtectedRoute>
            <AdminLayout>
              <div>Expenses Page</div>
            </AdminLayout>
            // </ProtectedRoute>
          }
        />
        <Route
          path="/admin/production"
          element={
            // <ProtectedRoute>
            <AdminLayout>
              <div>Water Production Page</div>
            </AdminLayout>
            // </ProtectedRoute>
          }
        />
        <Route
          path="/admin/reports"
          element={
            // <ProtectedRoute>
            <AdminLayout>
              <div>Reports & Analytics Page</div>
            </AdminLayout>
            // </ProtectedRoute>
          }
        />

        {/* 404 fallback */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
