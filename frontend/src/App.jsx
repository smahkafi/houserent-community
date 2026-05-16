import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import MainLayout from "./layouts/MainLayout.jsx";
import HomePage from "./pages/HomePage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RentalAgreementsPage from "./pages/RentalAgreementsPage.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/rental-agreements" element={<RentalAgreementsPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
