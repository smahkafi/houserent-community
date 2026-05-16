import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import MainLayout from "./layouts/MainLayout.jsx";
import HomePage from "./pages/HomePage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RentalAgreementsPage from "./pages/RentalAgreementsPage.jsx";
import { getToken, getUser } from "./utils/auth";

function ProtectedRoute({ children, allowedRoles }) {
  const token = getToken();
  const user = getUser();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && (!user || !allowedRoles.includes(user.role))) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/rental-agreements" element={<RentalAgreementsPage />} />

          {/* Tenant */}
          <Route
            path="/tenant/dashboard"
            element={
              <ProtectedRoute allowedRoles={["TENANT"]}>
                <div className="p-10 text-white">Tenant Dashboard</div>
              </ProtectedRoute>
            }
          />

          {/* Landlord */}
          <Route
            path="/landlord/dashboard"
            element={
              <ProtectedRoute allowedRoles={["LANDLORD"]}>
                <div className="p-10 text-white">Landlord Dashboard</div>
              </ProtectedRoute>
            }
          />

          {/* Resident */}
          <Route
            path="/resident/dashboard"
            element={
              <ProtectedRoute allowedRoles={["RESIDENT"]}>
                <div className="p-10 text-white">Resident Dashboard</div>
              </ProtectedRoute>
            }
          />

          {/* Admin */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={["ADMIN", "SUPER_ADMIN"]}>
                <div className="p-10 text-white">Admin Dashboard</div>
              </ProtectedRoute>
            }
          />

          {/* Super Admin */}
          <Route
            path="/super-admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={["SUPER_ADMIN"]}>
                <div className="p-10 text-white">Super Admin Dashboard</div>
              </ProtectedRoute>
            }
          />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;