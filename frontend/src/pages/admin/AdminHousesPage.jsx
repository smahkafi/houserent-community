import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getToken } from "../../utils/auth";
import axios from "axios";
import { API_BASE_URL } from "../../config/api";

function AdminHousesPage() {
  const navigate = useNavigate();
  const [houses, setHouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState(null);
  const [rejectModal, setRejectModal] = useState(null);
  const [rejectReason, setRejectReason] = useState("");

  useEffect(() => { fetchHouses(); }, []);

  const fetchHouses = async () => {
    try {
      const token = getToken();
      const res = await axios.get(`${API_BASE_URL}/houses/my-houses`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const pending = res.data.data.filter((h) => h.status === "PENDING");
      setHouses(pending);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load houses");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    setActionLoading(id);
    try {
      const token = getToken();
      await axios.patch(
        `${API_BASE_URL}/houses/${id}/approve`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await fetchHouses();
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to approve");
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
        `${API_BASE_URL}/houses/${rejectModal}/reject`,
        { rejectionReason: rejectReason },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setRejectModal(null);
      setRejectReason("");
      await fetchHouses();
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to reject");
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 px-4 py-10 text-white">
      <div className="mx-auto max-w-5xl">

        <div className="mb-8">
          <button onClick={() => navigate("/admin/dashboard")} className="mb-4 text-sm text-slate-400 transition hover:text-emerald-300">
            ← Back to Dashboard
          </button>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-300">Admin Panel</p>
          <h1 className="mt-1 text-3xl font-bold">Manage Houses</h1>
          <p className="mt-1 text-sm text-slate-400">Pending houses waiting for approval.</p>
        </div>

        {loading && <div className="text-center text-slate-400 py-20">Loading...</div>}
        {error && <div className="rounded-2xl border border-red-400/30 bg-red-500/10 p-4 text-sm text-red-100">{error}</div>}

        {!loading && !error && houses.length === 0 && (
          <div className="rounded-3xl border border-white/10 bg-white/5 p-10 text-center backdrop-blur-md">
            <p className="text-2xl">✅</p>
            <p className="mt-3 font-semibold text-slate-200">No pending houses</p>
            <p className="mt-1 text-sm text-slate-400">All houses have been reviewed.</p>
          </div>
        )}

        {!loading && !error && houses.length > 0 && (
          <div className="space-y-4">
            {houses.map((house) => (
              <div key={house.id} className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
                <div className="mb-3">
                  <h2 className="text-lg font-semibold text-white">{house.title}</h2>
                  <p className="text-sm text-slate-400">{house.address}, {house.area}</p>
                  {house.totalFloors && <p className="text-sm text-slate-400">🏢 {house.totalFloors} floors</p>}
                  <p className="mt-2 text-sm text-slate-300">{house.description}</p>
                </div>
                <div className="mb-4 text-sm text-slate-400">
                  <p>👤 Landlord ID: {house.landlordId}</p>
                  <p>📅 {new Date(house.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => handleApprove(house.id)}
                    disabled={actionLoading === house.id}
                    className="flex-1 rounded-2xl bg-emerald-400 px-4 py-2 text-sm font-bold text-slate-950 transition hover:bg-emerald-300 disabled:opacity-60"
                  >
                    {actionLoading === house.id ? "Processing..." : "Approve"}
                  </button>
                  <button
                    onClick={() => { setRejectModal(house.id); setRejectReason(""); }}
                    disabled={actionLoading === house.id}
                    className="flex-1 rounded-2xl border border-red-400/30 bg-red-500/10 px-4 py-2 text-sm font-bold text-red-300 transition hover:bg-red-500/20 disabled:opacity-60"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {rejectModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
            <div className="w-full max-w-md rounded-3xl border border-white/10 bg-slate-900 p-6 text-white">
              <h3 className="mb-4 text-lg font-semibold">Reject House</h3>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Reason for rejection..."
                rows={3}
                className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white outline-none transition placeholder:text-slate-400 focus:border-red-300"
              />
              <div className="mt-4 flex gap-3">
                <button onClick={() => { setRejectModal(null); setRejectReason(""); }} className="flex-1 rounded-2xl border border-white/10 px-4 py-2 text-sm font-medium text-slate-300 transition hover:border-white/30">Cancel</button>
                <button onClick={handleReject} disabled={actionLoading === rejectModal} className="flex-1 rounded-2xl bg-red-500 px-4 py-2 text-sm font-bold text-white transition hover:bg-red-400 disabled:opacity-60">
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

export default AdminHousesPage;