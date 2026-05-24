import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getToken } from "../../utils/auth";
import axios from "axios";
import { API_BASE_URL } from "../../config/api";

function BookingPage() {
  const navigate = useNavigate();
  const { unitId } = useParams();
  const [unit, setUnit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    message: "",
    moveInDate: "",
  });

  useEffect(() => {
    const fetchUnit = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/houses`);
        let found = null;
        for (const house of res.data.data) {
          const u = house.rentalUnits?.find((u) => u.id === parseInt(unitId));
          if (u) {
            found = { ...u, house };
            break;
          }
        }
        if (!found) throw new Error("Rental unit not found");
        setUnit(found);
      } catch (err) {
        setError(err.message || "Failed to load unit");
      } finally {
        setLoading(false);
      }
    };
    fetchUnit();
  }, [unitId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const token = getToken();
      await axios.post(
        `${API_BASE_URL}/bookings`,
        {
          rentalUnitId: parseInt(unitId),
          message: formData.message || undefined,
          moveInDate: formData.moveInDate
            ? new Date(formData.moveInDate).toISOString()
            : undefined,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess(true);
    } catch (err) {
      setError(
        err?.response?.data?.message || "Failed to submit booking request"
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 flex items-center justify-center text-slate-400">
      Loading...
    </div>
  );

  if (success) return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-3xl border border-emerald-300/20 bg-emerald-400/10 p-8 text-center text-white backdrop-blur-md">
        <p className="text-4xl">✅</p>
        <h2 className="mt-4 text-2xl font-bold">Booking Requested!</h2>
        <p className="mt-2 text-sm text-slate-300">
          Your booking request has been sent to the landlord. You will be notified once it is reviewed.
        </p>
        <div className="mt-6 flex gap-3">
          <button
            onClick={() => navigate("/houses")}
            className="flex-1 rounded-2xl border border-white/10 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-emerald-300/50 hover:text-emerald-300"
          >
            Browse More
          </button>
          <button
            onClick={() => navigate("/tenant/bookings")}
            className="flex-1 rounded-2xl bg-emerald-400 px-4 py-2 text-sm font-bold text-slate-950 transition hover:bg-emerald-300"
          >
            My Bookings
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 px-4 py-10 text-white">
      <div className="mx-auto max-w-2xl">

        <div className="mb-8">
          <button
            onClick={() => navigate("/houses")}
            className="mb-4 text-sm text-slate-400 transition hover:text-emerald-300"
          >
            ← Back to Browse
          </button>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-300">
            Tenant Panel
          </p>
          <h1 className="mt-1 text-3xl font-bold">Book This Unit</h1>
        </div>

        {/* Unit Info */}
        {unit && (
          <div className="mb-6 rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
            <h2 className="mb-1 text-lg font-semibold text-white">{unit.title}</h2>
            <p className="mb-3 text-sm text-slate-400">{unit.house.title} — {unit.house.address}, {unit.house.area}</p>
            <div className="grid grid-cols-2 gap-2 text-sm text-slate-300">
              <p>💰 BDT {unit.rentAmount.toLocaleString()} / month</p>
              <p>🛏 {unit.bedrooms} bedroom(s)</p>
              <p>🚿 {unit.bathrooms} bathroom(s)</p>
              {unit.floorNo && <p>🏢 Floor {unit.floorNo}</p>}
              {unit.sizeInSqft && <p>📐 {unit.sizeInSqft} sqft</p>}
              {unit.availableFrom && (
                <p>📅 From {new Date(unit.availableFrom).toLocaleDateString()}</p>
              )}
            </div>
            <div className="mt-3 border-t border-white/10 pt-3 text-sm text-slate-400">
              <p>👤 {unit.house.landlord?.fullName} — 📞 {unit.house.landlord?.phone}</p>
            </div>
          </div>
        )}

        {/* Booking Form */}
        <div className="rounded-3xl border border-white/10 bg-white/5 p-7 backdrop-blur-md">
          {error && (
            <div className="mb-6 rounded-2xl border border-red-400/30 bg-red-500/10 p-4 text-sm text-red-100">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-200">
                Move-in Date
              </label>
              <input
                type="date"
                name="moveInDate"
                value={formData.moveInDate}
                onChange={handleChange}
                className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white outline-none transition focus:border-emerald-300"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-200">
                Message to Landlord
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Introduce yourself or ask any questions..."
                rows={4}
                className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white outline-none transition placeholder:text-slate-400 focus:border-emerald-300"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-2xl bg-emerald-400 px-5 py-3 font-bold text-slate-950 shadow-lg shadow-emerald-950/30 transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? "Submitting..." : "Send Booking Request"}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}

export default BookingPage;