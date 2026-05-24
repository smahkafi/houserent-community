import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getUser, clearAuth } from "../../utils/auth";

function ResidentDashboardPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = getUser();
    if (!userData) { navigate("/login", { replace: true }); return; }
    setUser(userData);
  }, []);

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
              Resident Panel
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

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Link
            to="/resident/report"
            className="flex items-center gap-4 rounded-3xl border border-white/10 bg-white/5 p-6 transition hover:border-emerald-300/30 hover:bg-emerald-400/5 backdrop-blur-md"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-400/10 text-2xl text-emerald-300">📢</div>
            <div>
              <p className="font-semibold text-white">Report a Problem</p>
              <p className="text-sm text-slate-400">Submit a community issue</p>
            </div>
          </Link>
          <Link
            to="/resident/my-reports"
            className="flex items-center gap-4 rounded-3xl border border-white/10 bg-white/5 p-6 transition hover:border-emerald-300/30 hover:bg-emerald-400/5 backdrop-blur-md"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-400/10 text-2xl text-emerald-300">📋</div>
            <div>
              <p className="font-semibold text-white">My Reports</p>
              <p className="text-sm text-slate-400">Track your submitted reports</p>
            </div>
          </Link>
        </div>

      </div>
    </div>
  );
}

export default ResidentDashboardPage;