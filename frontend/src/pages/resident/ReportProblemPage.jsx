import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getToken } from "../../utils/auth";
import axios from "axios";
import { API_BASE_URL } from "../../config/api";

const CATEGORIES = [
  { value: "ROAD", label: "🛣 Road & Infrastructure" },
  { value: "ELECTRICITY", label: "⚡ Electricity" },
  { value: "WATER", label: "💧 Water Supply" },
  { value: "GAS", label: "🔥 Gas" },
  { value: "SECURITY", label: "🔒 Security" },
  { value: "SANITATION", label: "🧹 Sanitation & Waste" },
  { value: "OTHER", label: "📌 Other" },
];

function ReportProblemPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    location: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const token = getToken();
      await axios.post(`${API_BASE_URL}/community-reports`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess(true);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to submit report");
    } finally {
      setLoading(false);
    }
  };

  if (success) return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-3xl border border-emerald-300/20 bg-emerald-400/10 p-8 text-center text-white backdrop-blur-md">
        <p className="text-4xl">✅</p>
        <h2 className="mt-4 text-2xl font-bold">Report Submitted!</h2>
        <p className="mt-2 text-sm text-slate-300">Your report has been submitted. Admin will review it shortly.</p>
        <div className="mt-6 flex gap-3">
          <button onClick={() => navigate("/resident/my-reports")} className="flex-1 rounded-2xl bg-emerald-400 px-4 py-2 text-sm font-bold text-slate-950 transition hover:bg-emerald-300">My Reports</button>
          <button onClick={() => { setSuccess(false); setFormData({ title: "", description: "", category: "", location: "" }); }} className="flex-1 rounded-2xl border border-white/10 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-emerald-300/50">New Report</button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 px-4 py-10 text-white">
      <div className="mx-auto max-w-2xl">

        <div className="mb-8">
          <button onClick={() => navigate("/resident/dashboard")} className="mb-4 text-sm text-slate-400 transition hover:text-emerald-300">
            ← Back to Dashboard
          </button>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-300">Resident Panel</p>
          <h1 className="mt-1 text-3xl font-bold">Report a Problem</h1>
          <p className="mt-1 text-sm text-slate-400">Submit a community issue for admin review.</p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-7 backdrop-blur-md">
          {error && (
            <div className="mb-6 rounded-2xl border border-red-400/30 bg-red-500/10 p-4 text-sm text-red-100">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-200">
                Title <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Broken road near mosque"
                className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white outline-none transition placeholder:text-slate-400 focus:border-emerald-300"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-200">
                Category <span className="text-red-400">*</span>
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full rounded-2xl border border-white/10 bg-slate-800 px-4 py-3 text-white outline-none transition focus:border-emerald-300"
                required
              >
                <option value="">Select a category</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-200">
                Location <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g. Road 5, Block B, Mirpur"
                className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white outline-none transition placeholder:text-slate-400 focus:border-emerald-300"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-200">
                Description <span className="text-red-400">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe the problem in detail..."
                rows={4}
                className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white outline-none transition placeholder:text-slate-400 focus:border-emerald-300"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl bg-emerald-400 px-5 py-3 font-bold text-slate-950 shadow-lg shadow-emerald-950/30 transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Submitting..." : "Submit Report"}
            </button>

          </form>
        </div>

      </div>
    </div>
  );
}

export default ReportProblemPage;