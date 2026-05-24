import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getToken } from "../../utils/auth";
import axios from "axios";
import { API_BASE_URL } from "../../config/api";

const STATUS_STYLE = {
  PENDING: "text-yellow-300 border-yellow-300/30 bg-yellow-400/10",
  IN_PROGRESS: "text-blue-300 border-blue-300/30 bg-blue-400/10",
  RESOLVED: "text-emerald-300 border-emerald-300/30 bg-emerald-400/10",
  REJECTED: "text-red-300 border-red-300/30 bg-red-400/10",
};

const CATEGORY_LABEL = {
  ROAD: "🛣 Road",
  ELECTRICITY: "⚡ Electricity",
  WATER: "💧 Water",
  GAS: "🔥 Gas",
  SECURITY: "🔒 Security",
  SANITATION: "🧹 Sanitation",
  OTHER: "📌 Other",
};

function MyReportsPage() {
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const token = getToken();
        const res = await axios.get(`${API_BASE_URL}/community-reports/my-reports`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setReports(res.data.data);
      } catch (err) {
        setError(err?.response?.data?.message || "Failed to load reports");
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 px-4 py-10 text-white">
      <div className="mx-auto max-w-5xl">

        <div className="mb-8">
          <button onClick={() => navigate("/resident/dashboard")} className="mb-4 text-sm text-slate-400 transition hover:text-emerald-300">
            ← Back to Dashboard
          </button>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-300">Resident Panel</p>
          <h1 className="mt-1 text-3xl font-bold">My Reports</h1>
        </div>

        {loading && <div className="text-center text-slate-400 py-20">Loading...</div>}
        {error && <div className="rounded-2xl border border-red-400/30 bg-red-500/10 p-4 text-sm text-red-100">{error}</div>}

        {!loading && !error && reports.length === 0 && (
          <div className="rounded-3xl border border-white/10 bg-white/5 p-10 text-center backdrop-blur-md">
            <p className="text-2xl">📋</p>
            <p className="mt-3 font-semibold text-slate-200">No reports yet</p>
            <p className="mt-1 text-sm text-slate-400">Submit your first community report.</p>
            <button onClick={() => navigate("/resident/report")} className="mt-5 inline-block rounded-2xl bg-emerald-400 px-6 py-2 text-sm font-bold text-slate-950 transition hover:bg-emerald-300">
              Report a Problem
            </button>
          </div>
        )}

        {!loading && !error && reports.length > 0 && (
          <div className="space-y-4">
            {reports.map((report) => (
              <div key={report.id} className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
                <div className="mb-3 flex items-start justify-between gap-2">
                  <div>
                    <h2 className="font-semibold text-white">{report.title}</h2>
                    <p className="text-sm text-slate-400">{CATEGORY_LABEL[report.category]} — 📍 {report.location}</p>
                  </div>
                  <span className={`rounded-full border px-3 py-1 text-xs font-medium ${STATUS_STYLE[report.status]}`}>
                    {report.status.replace("_", " ")}
                  </span>
                </div>
                <p className="mb-3 text-sm text-slate-300">{report.description}</p>

                {/* Images */}
                {report.imageUrls && report.imageUrls.length > 0 && (
                  <div className="mb-3 grid grid-cols-3 gap-2">
                    {report.imageUrls.map((url, index) => (
                      <a key={index} href={url} target="_blank" rel="noreferrer">
                        <img
                          src={url}
                          alt={`report-${index}`}
                          className="h-24 w-full rounded-2xl object-cover transition hover:opacity-80"
                        />
                      </a>
                    ))}
                  </div>
                )}

                {report.adminNote && (
                  <div className="rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-3 text-sm text-emerald-200">
                    📝 Admin note: {report.adminNote}
                  </div>
                )}
                <p className="mt-3 text-xs text-slate-500">
                  Submitted on {new Date(report.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}

export default MyReportsPage;