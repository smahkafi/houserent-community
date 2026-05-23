import express from "express";
import cors from "cors";
import userRoutes from "./modules/user/user.route.js";
import authRoutes from "./modules/auth/auth.route.js";
import adminRoutes from "./modules/admin/admin.route.js";
import bookingRoutes from "./modules/booking/booking.route.js";
import houseRoutes from "./modules/house/house.route.js";
import rentalUnitRoutes from "./modules/rentalUnit/rentalUnit.route.js";
import rentalApplicationRoutes from "./modules/rentalApplication/rentalApplication.route.js";
import rentalAgreementRoutes from "./modules/rentalAgreement/rentalAgreement.route.js";
import settingsRoutes from "./modules/admin/settings.route.js";

const app = express();

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));

app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/admin", settingsRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/houses", houseRoutes);
app.use("/api/rental-units", rentalUnitRoutes);
app.use("/api/rental-applications", rentalApplicationRoutes);
app.use("/api/rental-agreements", rentalAgreementRoutes);

export default app;