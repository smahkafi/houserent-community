import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getToken } from "../../utils/auth";
import axios from "axios";
import { API_BASE_URL } from "../../config/api";

function MyBookingsPage() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = getToken();
        const res = await axios.get(`${API_BASE_URL}/bookings/my-bookings`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBookings(res.data.data);
      } catch (err) {
        setError(err?.response?.data?.message || "Failed to load bookings");
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const getStatusStyle = (status) => {
    if (status === "APPROVED") return "text-emerald-300 border-emerald-300/30 bg-emerald-400/10";
    if (status === "REJECTED") return "text-red-300 border-red-300/30 bg-red-400/10";
    return "text-yellow-300 border-yellow-300/30 bg-yellow-400/10";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 px-4 py-10 text-white">
      <div className="mx-auto max-w-5xl">

        <div className="mb-8">
          <button
            onClick={() => navigate("/tenant/dashboard")}
            className="mb-4 text-sm text-slate-400 transition hover:text-emerald-300"
          >
            ← Back to Dashboard
          </button>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-300">
            Tenant Panel
          </p>
          <h1 className="mt-1 text-3xl font-bold">My Bookings</h1>
        </div>

        {loading && (
          <div className="text-center text-slate-400 py-20">Loading...</div>
        )}

        {error && (
          <div className="rounded-2xl border border-red-400/30 bg-red-500/10 p-4 text-sm text-red-100">
            {error}
          </div>
        )}

        {!loading && !error && bookings.length === 0 && (
          <div className="rounded-3xl border border-white/10 bg-white/5 p-10 text-center backdrop-blur-md">
            <p className="text-2xl">📋</p>
            <p className="mt-3 font-semibold text-slate-200">No bookings yet</p>
            <p className="mt-1 text-sm text-slate-400">Browse houses and book a unit to get started.</p>
            <button
              onClick={() => navigate("/houses")}
              className="mt-5 inline-block rounded-2xl bg-emerald-400 px-6 py-2 text-sm font-bold text-slate-950 transition hover:bg-emerald-300"
            >
              Browse Houses
            </button>
          </div>
        )}

        {!loading && !error && bookings.length > 0 && (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-md"
              >
                <div className="mb-4 flex items-start justify-between gap-2">
                  <div>
                    <h2 className="font-semibold text-white">
                      {booking.rentalUnit?.title}
                    </h2>
                    <p className="text-sm text-slate-400">
                      {booking.rentalUnit?.house?.title} — {booking.rentalUnit?.house?.address}, {booking.rentalUnit?.house?.area}
                    </p>
                  </div>
                  <span className={`rounded-full border px-3 py-1 text-xs font-medium ${getStatusStyle(booking.status)}`}>
                    {booking.status}
                  </span>
                </div>

                <div className="mb-3 grid grid-cols-2 gap-3 text-sm text-slate-300">
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Unit Info</p>
                    <p>💰 BDT {booking.rentalUnit?.rentAmount?.toLocaleString()} / month</p>
                    <p>🛏 {booking.rentalUnit?.bedrooms} bed • 🚿 {booking.rentalUnit?.bathrooms} bath</p>
                    {booking.rentalUnit?.floorNo && <p>🏢 Floor {booking.rentalUnit.floorNo}</p>}
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Landlord</p>
                    <p>👤 {booking.landlord?.fullName}</p>
                    <p>📞 {booking.landlord?.phone}</p>
                  </div>
                </div>

                {booking.moveInDate && (
                  <p className="mb-2 text-sm text-slate-300">
                    📅 Move-in: {new Date(booking.moveInDate).toLocaleDateString()}
                  </p>
                )}

                {booking.message && (
                  <div className="mb-3 rounded-2xl border border-white/10 bg-white/5 p-3 text-sm text-slate-300">
                    💬 {booking.message}
                  </div>
                )}

                {booking.landlordNote && (
                  <div className="mb-3 rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-3 text-sm text-emerald-200">
                    📝 Landlord note: {booking.landlordNote}
                  </div>
                )}

                {booking.rejectionReason && (
                  <div className="rounded-2xl border border-red-400/20 bg-red-500/10 p-3 text-sm text-red-200">
                    ❌ Rejected: {booking.rejectionReason}
                  </div>
                )}

                <p className="mt-3 text-xs text-slate-500">
                  Requested on {new Date(booking.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}

export default MyBookingsPage;