import { useState, useEffect } from "react";
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
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [houses, setHouses] = useState([]);
  const [selectedHouses, setSelectedHouses] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    location: "",
  });

  useEffect(() => {
    const fetchHouses = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/houses`);
        setHouses(res.data.data);
      } catch (err) {
        console.error("Failed to load houses");
      }
    };
    fetchHouses();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 5) {
      setError("Maximum 5 images allowed");
      return;
    }
    setImages(files);
    const urls = files.map((f) => URL.createObjectURL(f));
    setPreviews(urls);
    setError("");
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
    setPreviews(previews.filter((_, i) => i !== index));
  };

  const toggleHouse = (houseId) => {
    setSelectedHouses((prev) =>
      prev.includes(houseId)
        ? prev.filter((id) => id !== houseId)
        : [...prev, houseId]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const token = getToken();
      const form = new FormData();
      form.append("title", formData.title);
      form.append("description", formData.description);
      form.append("category", formData.category);
      form.append("location", formData.location);
      form.append("affectedHouseIds", JSON.stringify(selectedHouses));
      images.forEach((img) => form.append("images", img));

      await axios.post(`${API_BASE_URL}/community-reports`, form, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
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
          <button onClick={() => { setSuccess(false); setFormData({ title: "", description: "", category: "", location: "" }); setImages([]); setPreviews([]); setSelectedHouses([]); }} className="flex-1 rounded-2xl border border-white/10 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-emerald-300/50">New Report</button>
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

            {/* Affected Houses */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-200">
                Affected Houses (optional)
              </label>
              <p className="mb-3 text-xs text-slate-400">Select the houses near this problem area.</p>
              {houses.length === 0 ? (
                <p className="text-sm text-slate-500">No approved houses available.</p>
              ) : (
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {houses.map((house) => (
                    <label
                      key={house.id}
                      className={`flex cursor-pointer items-center gap-3 rounded-2xl border px-4 py-3 transition ${
                        selectedHouses.includes(house.id)
                          ? "border-emerald-300/50 bg-emerald-400/10"
                          : "border-white/10 bg-white/5 hover:border-white/20"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedHouses.includes(house.id)}
                        onChange={() => toggleHouse(house.id)}
                        className="h-4 w-4 accent-emerald-400"
                      />
                      <div>
                        <p className="text-sm font-medium text-white">{house.title}</p>
                        <p className="text-xs text-slate-400">📍 {house.address}, {house.area}</p>
                      </div>
                    </label>
                  ))}
                </div>
              )}
              {selectedHouses.length > 0 && (
                <p className="mt-2 text-xs text-emerald-300">{selectedHouses.length} house(s) selected</p>
              )}
            </div>

            {/* Image Upload */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-200">
                Images (max 5)
              </label>
              <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-white/20 bg-white/5 px-4 py-6 transition hover:border-emerald-300/50 hover:bg-emerald-400/5">
                <p className="text-2xl">📷</p>
                <p className="mt-2 text-sm text-slate-300">Click to upload images</p>
                <p className="text-xs text-slate-500">JPG, PNG, WEBP — max 5MB each</p>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
              {previews.length > 0 && (
                <div className="mt-3 grid grid-cols-3 gap-2">
                  {previews.map((url, index) => (
                    <div key={index} className="relative">
                      <img src={url} alt={`preview-${index}`} className="h-24 w-full rounded-2xl object-cover" />
                      <button type="button" onClick={() => removeImage(index)} className="absolute right-1 top-1 rounded-full bg-red-500 px-2 py-0.5 text-xs text-white">✕</button>
                    </div>
                  ))}
                </div>
              )}
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