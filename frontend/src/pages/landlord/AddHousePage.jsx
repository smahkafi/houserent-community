import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getToken } from "../../utils/auth";
import axios from "axios";
import { API_BASE_URL } from "../../config/api";

function AddHousePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    houseNo: "",
    plotNo: "",
    roadNo: "",
    address: "",
    area: "",
    mapLocation: "",
    unionName: "",
    totalFloors: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const token = getToken();
      const form = new FormData();
      Object.keys(formData).forEach((key) => {
        if (formData[key]) form.append(key, formData[key]);
      });
      if (formData.totalFloors) form.set("totalFloors", parseInt(formData.totalFloors));
      if (image) form.append("image", image);

      await axios.post(`${API_BASE_URL}/houses`, form, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      navigate("/landlord/houses");
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to add house");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 px-4 py-10 text-white">
      <div className="mx-auto max-w-2xl">

        <div className="mb-8">
          <button onClick={() => navigate("/landlord/houses")} className="mb-4 text-sm text-slate-400 transition hover:text-emerald-300">
            ← Back to My Houses
          </button>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-300">Landlord Panel</p>
          <h1 className="mt-1 text-3xl font-bold">Add New House</h1>
          <p className="mt-1 text-sm text-slate-400">Add your property details. You can add rental units after the house is approved.</p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-7 backdrop-blur-md">
          {error && <div className="mb-6 rounded-2xl border border-red-400/30 bg-red-500/10 p-4 text-sm text-red-100">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* House Image */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-200">
                House Image <span className="text-red-400">*</span>
              </label>
              <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-white/20 bg-white/5 px-4 py-6 transition hover:border-emerald-300/50 hover:bg-emerald-400/5">
                {preview ? (
                  <img src={preview} alt="preview" className="h-40 w-full rounded-2xl object-cover" />
                ) : (
                  <>
                    <p className="text-2xl">🏠</p>
                    <p className="mt-2 text-sm text-slate-300">Click to upload house image</p>
                    <p className="text-xs text-slate-500">JPG, PNG, WEBP — max 5MB</p>
                  </>
                )}
                <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" required />
              </label>
            </div>

            {/* Title */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-200">
                House Title <span className="text-red-400">*</span>
              </label>
              <input type="text" name="title" value={formData.title} onChange={handleChange}
                placeholder="e.g. Kafi Villa"
                className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white outline-none transition placeholder:text-slate-400 focus:border-emerald-300" required />
            </div>

            {/* Description */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-200">
                Description <span className="text-red-400">*</span>
              </label>
              <textarea name="description" value={formData.description} onChange={handleChange}
                placeholder="Describe your property..." rows={3}
                className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white outline-none transition placeholder:text-slate-400 focus:border-emerald-300" required />
            </div>

            {/* House No & Plot No */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-200">
                  House No <span className="text-red-400">*</span>
                </label>
                <input type="text" name="houseNo" value={formData.houseNo} onChange={handleChange}
                  placeholder="e.g. H-103"
                  className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white outline-none transition placeholder:text-slate-400 focus:border-emerald-300" required />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-200">Plot No</label>
                <input type="text" name="plotNo" value={formData.plotNo} onChange={handleChange}
                  placeholder="e.g. P-45"
                  className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white outline-none transition placeholder:text-slate-400 focus:border-emerald-300" />
              </div>
            </div>

            {/* Road No & Union Name */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-200">Road No</label>
                <input type="text" name="roadNo" value={formData.roadNo} onChange={handleChange}
                  placeholder="e.g. Road-5"
                  className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white outline-none transition placeholder:text-slate-400 focus:border-emerald-300" />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-200">Union Name</label>
                <input type="text" name="unionName" value={formData.unionName} onChange={handleChange}
                  placeholder="e.g. Ward 10"
                  className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white outline-none transition placeholder:text-slate-400 focus:border-emerald-300" />
              </div>
            </div>

            {/* Area & Total Floors */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-200">
                  Area <span className="text-red-400">*</span>
                </label>
                <input type="text" name="area" value={formData.area} onChange={handleChange}
                  placeholder="e.g. Mirpur, Dhaka"
                  className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white outline-none transition placeholder:text-slate-400 focus:border-emerald-300" required />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-200">Total Floors</label>
                <input type="number" name="totalFloors" value={formData.totalFloors} onChange={handleChange}
                  placeholder="e.g. 6"
                  className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white outline-none transition placeholder:text-slate-400 focus:border-emerald-300" />
              </div>
            </div>

            {/* Full Address */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-200">Full Address</label>
              <input type="text" name="address" value={formData.address} onChange={handleChange}
                placeholder="e.g. H-103, Road-5, Block-B, Mirpur-10, Dhaka"
                className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white outline-none transition placeholder:text-slate-400 focus:border-emerald-300" />
            </div>

            {/* Google Map Location */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-200">
                Google Map Link <span className="text-red-400">*</span>
              </label>
              <input type="text" name="mapLocation" value={formData.mapLocation} onChange={handleChange}
                placeholder="e.g. https://maps.google.com/?q=..."
                className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white outline-none transition placeholder:text-slate-400 focus:border-emerald-300" required />
            </div>

            <button type="submit" disabled={loading}
              className="w-full rounded-2xl bg-emerald-400 px-5 py-3 font-bold text-slate-950 shadow-lg shadow-emerald-950/30 transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-60">
              {loading ? "Submitting..." : "Add House"}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}

export default AddHousePage;