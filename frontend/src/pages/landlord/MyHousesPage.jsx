import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getToken } from "../../utils/auth";
import axios from "axios";
import { API_BASE_URL } from "../../config/api";

function MyHousesPage() {
  const navigate = useNavigate();
  const [houses, setHouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchHouses = async () => {
      try {
        const token = getToken();
        const res = await axios.get(`${API_BASE_URL}/houses/my-houses`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setHouses(res.data.data);
      } catch (err) {
        setError(
          err?.response?.data?.error ||
            err?.response?.data?.message ||
            "Failed to load houses"
        );
      } finally {
        setLoading(false);
      }
    };
    fetchHouses();
  }, []);

  const getStatusStyle = (status) => {
    if (status === "APPROVED") return "text-emerald-300 border-emerald-300/30 bg-emerald-400/10";
    if (status === "REJECTED") return "text-red-300 border-red-300/30 bg-red-400/10";
    return "text-yellow-300 border-yellow-300/30 bg-yellow-400/10";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 px-4 py-10 text-white">
      <div className="mx-auto max-w-5xl">

        <div className="mb-8 flex items-center justify-between">
          <div>
            <button
              onClick={() => navigate("/landlord/dashboard")}
              className="mb-4 text-sm text-slate-400 transition hover:text-emerald-300"
            >
              ← Back to Dashboard
            </button>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-300">
              Landlord Panel
            </p>
            <h1 className="mt-1 text-3xl font-bold">My Houses</h1>
          </div>
          <Link
            to="/landlord/houses/add"
            className="rounded-2xl bg-emerald-400 px-5 py-2 text-sm font-bold text-slate-950 transition hover:bg-emerald-300"
          >
            + Add New House
          </Link>
        </div>

        {loading && (
          <div className="text-center text-slate-400 py-20">Loading...</div>
        )}

        {error && (
          <div className="rounded-2xl border border-red-400/30 bg-red-500/10 p-4 text-sm text-red-100">
            {error}
          </div>
        )}

        {!loading && !error && houses.length === 0 && (
          <div className="rounded-3xl border border-white/10 bg-white/5 p-10 text-center backdrop-blur-md">
            <p className="text-2xl">🏠</p>
            <p className="mt-3 font-semibold text-slate-200">No houses yet</p>
            <p className="mt-1 text-sm text-slate-400">
              Add your first property to get started.
            </p>
            <Link
              to="/landlord/houses/add"
              className="mt-5 inline-block rounded-2xl bg-emerald-400 px-6 py-2 text-sm font-bold text-slate-950 transition hover:bg-emerald-300"
            >
              Add House
            </Link>
          </div>
        )}

        {!loading && !error && houses.length > 0 && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {houses.map((house) => (
              <div
                key={house.id}
                className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-md"
              >
                <div className="mb-3 flex items-start justify-between gap-2">
                  <h2 className="text-lg font-semibold text-white">
                    {house.title}
                  </h2>
                  <span
                    className={`rounded-full border px-3 py-1 text-xs font-medium ${getStatusStyle(house.status)}`}
                  >
                    {house.status}
                  </span>
                </div>
                <p className="mb-4 text-sm text-slate-400 line-clamp-2">
                  {house.description}
                </p>
                <div className="space-y-1 text-sm text-slate-300">
                  <p>📍 {house.address}, {house.area}</p>
                  {house.totalFloors && (
                    <p>🏢 Total {house.totalFloors} floors</p>
                  )}
                  <p>🏘 {house.rentalUnits?.length || 0} rental unit(s)</p>
                </div>
                {house.rejectionReason && (
                  <div className="mt-4 rounded-2xl border border-red-400/20 bg-red-500/10 p-3 text-xs text-red-200">
                    Rejected: {house.rejectionReason}
                  </div>
                )}
                <div className="mt-4 flex gap-2">
                  <Link
                    to={`/landlord/houses/${house.id}`}
                    className="flex-1 rounded-2xl border border-white/10 px-4 py-2 text-center text-sm font-medium text-slate-200 transition hover:border-emerald-300/50 hover:text-emerald-300"
                  >
                    View Details
                  </Link>
                  {house.status === "APPROVED" && (
                    <Link
                      to={`/landlord/houses/${house.id}/add-unit`}
                      className="flex-1 rounded-2xl bg-emerald-400/10 border border-emerald-300/20 px-4 py-2 text-center text-sm font-medium text-emerald-300 transition hover:bg-emerald-400/20"
                    >
                      + Add Unit
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}

export default MyHousesPage;