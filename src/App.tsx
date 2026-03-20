import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./modules/auth/pages/Login";
import CustomerPage from "./modules/customers/pages/Customerpage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Auth */}
        <Route path="/login" element={<LoginPage />} />

        {/* Customers */}
        <Route path="/customers" element={<CustomerPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
