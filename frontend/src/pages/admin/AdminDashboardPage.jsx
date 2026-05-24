import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getUser, clearAuth } from "../../utils/auth";
import { getToken } from "../../utils/auth";
import axios from "axios";
import { API_BASE_URL } from "../../config/api";

function AdminDashboardPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [summary, setSummary] = useState({
    pendingHouses: 0,
    pendingUnits: 0,
  });

  useEffect(() => {
    const userData = getUser();
    if (!userData) { navigate("/login", { replace: true }); return; }
    setUser(userData);
    fetchSummary();
  }, []);

  const fetchSummary = async () => {
    try {
      const token = getToken();
      const [housesRes, unitsRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/houses/admin-summary`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${API_BASE_URL}/rental-units/pending`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);
      setSummary({
        pendingHouses: housesRes.data.data?.pendingHousesCount || 0,
        pendingUnits: unitsRes.data.data?.length || 0,
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    clearAuth();
    navigate("/login", { replace: true });
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 px-4 py-10 text-white">
      <div className="mx-auto max-w-5xl">

        <div className="mb-10 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-300">
              Admin Panel
            </p>
            <h1 className="mt-1 text-3xl font-bold">Welcome, {user.fullName}</h1>
            <p className="mt-1 text-sm text-slate-400">{user.phone} — {user.role}</p>
          </div>
          <button
            onClick={handleLogout}
            className="rounded-2xl border border-white/10 px-5 py-2 text-sm font-medium text-slate-300 transition hover:border-red-400/50 hover:bg-red-500/10 hover:text-red-300"
          >
            Logout
          </button>
        </div>

        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
            <p className="text-sm text-slate-400">Pending Houses</p>
            <p className="mt-2 text-4xl font-bold text-yellow-300">{summary.pendingHouses}</p>
            <p className="mt-1 text-xs text-slate-500">Waiting for approval</p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
            <p className="text-sm text-slate-400">Pending Rental Units</p>
            <p className="mt-2 text-4xl font-bold text-yellow-300">{summary.pendingUnits}</p>
            <p className="mt-1 text-xs text-slate-500">Waiting for approval</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Link
            to="/admin/houses"
            className="flex items-center gap-4 rounded-3xl border border-white/10 bg-white/5 p-6 transition hover:border-emerald-300/30 hover:bg-emerald-400/5 backdrop-blur-md"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-400/10 text-2xl text-emerald-300">🏠</div>
            <div>
              <p className="font-semibold text-white">Manage Houses</p>
              <p className="text-sm text-slate-400">Approve or reject houses</p>
            </div>
          </Link>
          <Link
            to="/admin/rental-units"
            className="flex items-center gap-4 rounded-3xl border border-white/10 bg-white/5 p-6 transition hover:border-emerald-300/30 hover:bg-emerald-400/5 backdrop-blur-md"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-400/10 text-2xl text-emerald-300">🏘</div>
            <div>
              <p className="font-semibold text-white">Manage Rental Units</p>
              <p className="text-sm text-slate-400">Approve or reject rental units</p>
            </div>
          </Link>
        </div>

      </div>
    </div>
  );
}

export default AdminDashboardPage;