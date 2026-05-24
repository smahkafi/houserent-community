import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getToken } from "../../utils/auth";
import axios from "axios";
import { API_BASE_URL } from "../../config/api";

function BookingRequestsPage() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState(null);
  const [rejectModal, setRejectModal] = useState(null);
  const [rejectReason, setRejectReason] = useState("");

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const token = getToken();
      const res = await axios.get(`${API_BASE_URL}/bookings/landlord`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBookings(res.data.data);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (bookingId) => {
    setActionLoading(bookingId);
    try {
      const token = getToken();
      await axios.patch(
        `${API_BASE_URL}/bookings/${bookingId}/review`,
        { status: "APPROVED", landlordNote: "" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await fetchBookings();
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to approve booking");
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) return alert("Rejection reason is required");
    setActionLoading(rejectModal);
    try {
      const token = getToken();
      await axios.patch(
        `${API_BASE_URL}/bookings/${rejectModal}/review`,
        { status: "REJECTED", rejectionReason: rejectReason },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setRejectModal(null);
      setRejectReason("");
      await fetchBookings();
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to reject booking");
    } finally {
      setActionLoading(null);
    }
  };

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
            onClick={() => navigate("/landlord/dashboard")}
            className="mb-4 text-sm text-slate-400 transition hover:text-emerald-300"
          >
            ← Back to Dashboard
          </button>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-300">
            Landlord Panel
          </p>
          <h1 className="mt-1 text-3xl font-bold">Booking Requests</h1>
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
            <p className="mt-3 font-semibold text-slate-200">No booking requests yet</p>
            <p className="mt-1 text-sm text-slate-400">Booking requests will appear here.</p>
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
                      {booking.rentalUnit?.house?.title} — {booking.rentalUnit?.house?.address}
                    </p>
                  </div>
                  <span className={`rounded-full border px-3 py-1 text-xs font-medium ${getStatusStyle(booking.status)}`}>
                    {booking.status}
                  </span>
                </div>

                <div className="mb-4 grid grid-cols-2 gap-3 text-sm text-slate-300">
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Tenant</p>
                    <p>👤 {booking.tenant?.fullName}</p>
                    <p>📞 {booking.tenant?.phone}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Unit Info</p>
                    <p>💰 BDT {booking.rentalUnit?.rentAmount?.toLocaleString()} / month</p>
                    <p>🛏 {booking.rentalUnit?.bedrooms} bed • 🚿 {booking.rentalUnit?.bathrooms} bath</p>
                  </div>
                </div>

                {booking.moveInDate && (
                  <p className="mb-2 text-sm text-slate-300">
                    📅 Move-in: {new Date(booking.moveInDate).toLocaleDateString()}
                  </p>
                )}

                {booking.message && (
                  <div className="mb-4 rounded-2xl border border-white/10 bg-white/5 p-3 text-sm text-slate-300">
                    💬 {booking.message}
                  </div>
                )}

                {booking.rejectionReason && (
                  <div className="mb-4 rounded-2xl border border-red-400/20 bg-red-500/10 p-3 text-xs text-red-200">
                    Rejected: {booking.rejectionReason}
                  </div>
                )}

                {booking.status === "PENDING" && (
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleApprove(booking.id)}
                      disabled={actionLoading === booking.id}
                      className="flex-1 rounded-2xl bg-emerald-400 px-4 py-2 text-sm font-bold text-slate-950 transition hover:bg-emerald-300 disabled:opacity-60"
                    >
                      {actionLoading === booking.id ? "Processing..." : "Approve"}
                    </button>
                    <button
                      onClick={() => { setRejectModal(booking.id); setRejectReason(""); }}
                      disabled={actionLoading === booking.id}
                      className="flex-1 rounded-2xl border border-red-400/30 bg-red-500/10 px-4 py-2 text-sm font-bold text-red-300 transition hover:bg-red-500/20 disabled:opacity-60"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Reject Modal */}
        {rejectModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
            <div className="w-full max-w-md rounded-3xl border border-white/10 bg-slate-900 p-6 text-white">
              <h3 className="mb-4 text-lg font-semibold">Reject Booking</h3>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Reason for rejection..."
                rows={3}
                className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white outline-none transition placeholder:text-slate-400 focus:border-red-300"
              />
              <div className="mt-4 flex gap-3">
                <button
                  onClick={() => { setRejectModal(null); setRejectReason(""); }}
                  className="flex-1 rounded-2xl border border-white/10 px-4 py-2 text-sm font-medium text-slate-300 transition hover:border-white/30"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReject}
                  disabled={actionLoading === rejectModal}
                  className="flex-1 rounded-2xl bg-red-500 px-4 py-2 text-sm font-bold text-white transition hover:bg-red-400 disabled:opacity-60"
                >
                  {actionLoading === rejectModal ? "Rejecting..." : "Confirm Reject"}
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default BookingRequestsPage;