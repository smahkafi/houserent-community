import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getToken } from "../../utils/auth";
import axios from "axios";
import { API_BASE_URL } from "../../config/api";

function AddHousePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    address: "",
    area: "",
    rentAmount: "",
    bedrooms: "",
    bathrooms: "",
    balconies: "",
    floorNo: "",
    totalFloors: "",
    sizeInSqft: "",
    availableFrom: "",
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
      await axios.post(
        `${API_BASE_URL}/houses`,
        {
          ...formData,
          rentAmount: parseFloat(formData.rentAmount),
          bedrooms: parseInt(formData.bedrooms),
          bathrooms: parseInt(formData.bathrooms),
          balconies: formData.balconies ? parseInt(formData.balconies) : undefined,
          floorNo: formData.floorNo ? parseInt(formData.floorNo) : undefined,
          totalFloors: formData.totalFloors ? parseInt(formData.totalFloors) : undefined,
          sizeInSqft: formData.sizeInSqft ? parseFloat(formData.sizeInSqft) : undefined,
          availableFrom: formData.availableFrom ? new Date(formData.availableFrom).toISOString() : undefined,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      navigate("/landlord/houses");
    } catch (err) {
      setError(
        err?.response?.data?.error ||
          err?.response?.data?.message ||
          "Failed to add house"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 px-4 py-10 text-white">
      <div className="mx-auto max-w-2xl">

        {/* Header */}
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
          <h1 className="mt-1 text-3xl font-bold">Add New House</h1>
          <p className="mt-1 text-sm text-slate-400">
            Fill in the details to list your property.
          </p>
        </div>

        {/* Form */}
        <div className="rounded-3xl border border-white/10 bg-white/5 p-7 backdrop-blur-md">
          {error && (
            <div className="mb-6 rounded-2xl border border-red-400/30 bg-red-500/10 p-4 text-sm text-red-100">
              {error}
            </div>
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
                placeholder="e.g. 2 Bedroom Flat in Dhanmondi"
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
                placeholder="Describe your property..."
                rows={3}
                className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white outline-none transition placeholder:text-slate-400 focus:border-emerald-300"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-200">
                Address <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Full address"
                className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white outline-none transition placeholder:text-slate-400 focus:border-emerald-300"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-200">
                Area <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                name="area"
                value={formData.area}
                onChange={handleChange}
                placeholder="e.g. Dhanmondi, Dhaka"
                className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white outline-none transition placeholder:text-slate-400 focus:border-emerald-300"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-200">
                Rent Amount (BDT) <span className="text-red-400">*</span>
              </label>
              <input
                type="number"
                name="rentAmount"
                value={formData.rentAmount}
                onChange={handleChange}
                placeholder="e.g. 15000"
                className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white outline-none transition placeholder:text-slate-400 focus:border-emerald-300"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-200">
                  Bedrooms <span className="text-red-400">*</span>
                </label>
                <input
                  type="number"
                  name="bedrooms"
                  value={formData.bedrooms}
                  onChange={handleChange}
                  placeholder="e.g. 2"
                  className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white outline-none transition placeholder:text-slate-400 focus:border-emerald-300"
                  required
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-200">
                  Bathrooms <span className="text-red-400">*</span>
                </label>
                <input
                  type="number"
                  name="bathrooms"
                  value={formData.bathrooms}
                  onChange={handleChange}
                  placeholder="e.g. 2"
                  className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white outline-none transition placeholder:text-slate-400 focus:border-emerald-300"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-200">
                  Balconies
                </label>
                <input
                  type="number"
                  name="balconies"
                  value={formData.balconies}
                  onChange={handleChange}
                  placeholder="e.g. 1"
                  className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white outline-none transition placeholder:text-slate-400 focus:border-emerald-300"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-200">
                  Balconies
                </label>
                <input
                  type="number"
                  name="balconies"
                  value={formData.balconies}
                  onChange={handleChange}
                  placeholder="e.g. 1"
                  className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white outline-none transition placeholder:text-slate-400 focus:border-emerald-300"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-200">
                  Floor No
                </label>
                <input
                  type="number"
                  name="floorNo"
                  value={formData.floorNo}
                  onChange={handleChange}
                  placeholder="e.g. 3"
                  className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white outline-none transition placeholder:text-slate-400 focus:border-emerald-300"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-200">
                  Total Floors
                </label>
                <input
                  type="number"
                  name="totalFloors"
                  value={formData.totalFloors}
                  onChange={handleChange}
                  placeholder="e.g. 6"
                  className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white outline-none transition placeholder:text-slate-400 focus:border-emerald-300"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-200">
                  Size (sqft)
                </label>
                <input
                  type="number"
                  name="sizeInSqft"
                  value={formData.sizeInSqft}
                  onChange={handleChange}
                  placeholder="e.g. 1200"
                  className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white outline-none transition placeholder:text-slate-400 focus:border-emerald-300"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-200">
                Available From
              </label>
              <input
                type="date"
                name="availableFrom"
                value={formData.availableFrom}
                onChange={handleChange}
                className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white outline-none transition focus:border-emerald-300"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl bg-emerald-400 px-5 py-3 font-bold text-slate-950 shadow-lg shadow-emerald-950/30 transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Submitting..." : "Add House"}
            </button>

          </form>
        </div>

      </div>
    </div>
  );
}

export default AddHousePage;