import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import MainLayout from "./layouts/MainLayout.jsx";
import HomePage from "./pages/HomePage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RentalAgreementsPage from "./pages/RentalAgreementsPage.jsx";
import TenantDashboardPage from "./pages/tenant/TenantDashboardPage.jsx";
import BrowseHousesPage from "./pages/tenant/BrowseHousesPage.jsx";
import BookingPage from "./pages/tenant/BookingPage.jsx";
import MyBookingsPage from "./pages/tenant/MyBookingsPage.jsx";
import LandlordDashboardPage from "./pages/landlord/LandlordDashboardPage.jsx";
import AddHousePage from "./pages/landlord/AddHousePage.jsx";
import MyHousesPage from "./pages/landlord/MyHousesPage.jsx";
import HouseDetailPage from "./pages/landlord/HouseDetailPage.jsx";
import AddRentalUnitPage from "./pages/landlord/AddRentalUnitPage.jsx";
import BookingRequestsPage from "./pages/landlord/BookingRequestsPage.jsx";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage.jsx";
import AdminHousesPage from "./pages/admin/AdminHousesPage.jsx";
import AdminRentalUnitsPage from "./pages/admin/AdminRentalUnitsPage.jsx";
import ResidentDashboardPage from "./pages/resident/ResidentDashboardPage.jsx";
import ReportProblemPage from "./pages/resident/ReportProblemPage.jsx";
import MyReportsPage from "./pages/resident/MyReportsPage.jsx";
import { getToken, getUser } from "./utils/auth";

function ProtectedRoute({ children, allowedRoles }) {
  const token = getToken();
  const user = getUser();
  if (!token) return <Navigate to="/login" replace />;
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
          <Route path="/tenant/dashboard" element={<ProtectedRoute allowedRoles={["TENANT"]}><TenantDashboardPage /></ProtectedRoute>} />
          <Route path="/houses" element={<ProtectedRoute allowedRoles={["TENANT"]}><BrowseHousesPage /></ProtectedRoute>} />
          <Route path="/tenant/booking/:unitId" element={<ProtectedRoute allowedRoles={["TENANT"]}><BookingPage /></ProtectedRoute>} />
          <Route path="/tenant/bookings" element={<ProtectedRoute allowedRoles={["TENANT"]}><MyBookingsPage /></ProtectedRoute>} />

          {/* Landlord */}
          <Route path="/landlord/dashboard" element={<ProtectedRoute allowedRoles={["LANDLORD"]}><LandlordDashboardPage /></ProtectedRoute>} />
          <Route path="/landlord/houses" element={<ProtectedRoute allowedRoles={["LANDLORD"]}><MyHousesPage /></ProtectedRoute>} />
          <Route path="/landlord/houses/add" element={<ProtectedRoute allowedRoles={["LANDLORD"]}><AddHousePage /></ProtectedRoute>} />
          <Route path="/landlord/houses/:houseId" element={<ProtectedRoute allowedRoles={["LANDLORD"]}><HouseDetailPage /></ProtectedRoute>} />
          <Route path="/landlord/houses/:houseId/add-unit" element={<ProtectedRoute allowedRoles={["LANDLORD"]}><AddRentalUnitPage /></ProtectedRoute>} />
          <Route path="/landlord/bookings" element={<ProtectedRoute allowedRoles={["LANDLORD"]}><BookingRequestsPage /></ProtectedRoute>} />

          {/* Resident */}
          <Route path="/resident/dashboard" element={<ProtectedRoute allowedRoles={["RESIDENT"]}><ResidentDashboardPage /></ProtectedRoute>} />
          <Route path="/resident/report" element={<ProtectedRoute allowedRoles={["RESIDENT"]}><ReportProblemPage /></ProtectedRoute>} />
          <Route path="/resident/my-reports" element={<ProtectedRoute allowedRoles={["RESIDENT"]}><MyReportsPage /></ProtectedRoute>} />

          {/* Admin */}
          <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={["ADMIN", "SUPER_ADMIN"]}><AdminDashboardPage /></ProtectedRoute>} />
          <Route path="/admin/houses" element={<ProtectedRoute allowedRoles={["ADMIN", "SUPER_ADMIN"]}><AdminHousesPage /></ProtectedRoute>} />
          <Route path="/admin/rental-units" element={<ProtectedRoute allowedRoles={["ADMIN", "SUPER_ADMIN"]}><AdminRentalUnitsPage /></ProtectedRoute>} />

          {/* Super Admin */}
          <Route path="/super-admin/dashboard" element={<ProtectedRoute allowedRoles={["SUPER_ADMIN"]}><div className="p-10 text-white">Super Admin Dashboard — Coming Soon</div></ProtectedRoute>} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;