import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../../config/api";

function BrowseHousesPage() {
  const navigate = useNavigate();
  const [houses, setHouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchHouses = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/houses`);
        setHouses(res.data.data);
      } catch (err) {
        setError(
          err?.response?.data?.message || "Failed to load houses"
        );
      } finally {
        setLoading(false);
      }
    };
    fetchHouses();
  }, []);

  const filtered = houses.filter((house) => {
    const q = search.toLowerCase();
    return (
      house.title.toLowerCase().includes(q) ||
      house.address.toLowerCase().includes(q) ||
      house.area.toLowerCase().includes(q)
    );
  });

  const getBathroomText = (unit) => {
    let text = `${unit.bathrooms} bathroom(s)`;
    const parts = [];
    if (unit.attachedBathrooms) parts.push(`${unit.attachedBathrooms} attached`);
    if (unit.commonBathrooms) parts.push(`${unit.commonBathrooms} common`);
    if (parts.length > 0) text += ` (${parts.join(", ")})`;
    return text;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 px-4 py-10 text-white">
      <div className="mx-auto max-w-5xl">

        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate("/tenant/dashboard")}
            className="mb-4 text-sm text-slate-400 transition hover:text-emerald-300"
          >
            ← Back to Dashboard
          </button>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-300">
            Tenant Panel
          </p>
          <h1 className="mt-1 text-3xl font-bold">Browse Houses</h1>
          <p className="mt-1 text-sm text-slate-400">
            Find your next home from available properties.
          </p>
        </div>

        {/* Search */}
        <div className="mb-6">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title, address or area..."
            className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white outline-none transition placeholder:text-slate-400 focus:border-emerald-300"
          />
        </div>

        {loading && (
          <div className="text-center text-slate-400 py-20">Loading...</div>
        )}

        {error && (
          <div className="rounded-2xl border border-red-400/30 bg-red-500/10 p-4 text-sm text-red-100">
            {error}
          </div>
        )}

        {!loading && !error && filtered.length === 0 && (
          <div className="rounded-3xl border border-white/10 bg-white/5 p-10 text-center backdrop-blur-md">
            <p className="text-2xl">🏠</p>
            <p className="mt-3 font-semibold text-slate-200">No houses found</p>
            <p className="mt-1 text-sm text-slate-400">
              Try a different search or check back later.
            </p>
          </div>
        )}

        {!loading && !error && filtered.length > 0 && (
          <div className="space-y-6">
            {filtered.map((house) => (
              <div
                key={house.id}
                className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-md"
              >
                {/* House Info */}
                <div className="mb-4">
                  <h2 className="text-xl font-bold text-white">{house.title}</h2>
                  <p className="mt-1 text-sm text-slate-400">{house.description}</p>
                  <div className="mt-2 flex flex-wrap gap-3 text-sm text-slate-300">
                    <span>📍 {house.address}, {house.area}</span>
                    {house.totalFloors && <span>🏢 {house.totalFloors} floors</span>}
                  </div>
                  {/* Landlord Info */}
                  <div className="mt-3 flex items-center gap-2 text-sm text-slate-400">
                    <span>👤 {house.landlord?.fullName}</span>
                    <span>•</span>
                    <span>📞 {house.landlord?.phone}</span>
                  </div>
                </div>

                {/* Rental Units */}
                {house.rentalUnits && house.rentalUnits.length > 0 ? (
                  <div>
                    <p className="mb-3 text-sm font-medium text-emerald-300">
                      Available Units ({house.rentalUnits.length})
                    </p>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      {house.rentalUnits.map((unit) => (
                        <div
                          key={unit.id}
                          className="rounded-2xl border border-white/10 bg-white/5 p-4"
                        >
                          <div className="mb-2 flex items-start justify-between gap-2">
                            <h3 className="font-semibold text-white">{unit.title}</h3>
                            <span className="rounded-full bg-emerald-400/10 border border-emerald-300/20 px-2 py-1 text-xs text-emerald-300">
                              Available
                            </span>
                          </div>
                          {unit.description && (
                            <p className="mb-2 text-xs text-slate-400 line-clamp-2">{unit.description}</p>
                          )}
                          <div className="space-y-1 text-sm text-slate-300">
                            <p>💰 BDT {unit.rentAmount.toLocaleString()} / month</p>
                            <p>🛏 {unit.bedrooms} bedroom(s)</p>
                            <p>🚿 {getBathroomText(unit)}</p>
                            {unit.balconies > 0 && <p>🏡 {unit.balconies} balcony(ies)</p>}
                            {unit.floorNo && <p>🏢 Floor {unit.floorNo}</p>}
                            {unit.sizeInSqft && <p>📐 {unit.sizeInSqft} sqft</p>}
                            {unit.availableFrom && (
                              <p>📅 Available from {new Date(unit.availableFrom).toLocaleDateString()}</p>
                            )}
                          </div>
                          <button
                            onClick={() => navigate(`/tenant/booking/${unit.id}`)}
                            className="mt-4 w-full rounded-2xl bg-emerald-400 px-4 py-2 text-sm font-bold text-slate-950 transition hover:bg-emerald-300"
                          >
                            Book This Unit
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-slate-500">No available units at the moment.</p>
                )}
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}

export default BrowseHousesPage;