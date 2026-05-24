import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getToken } from "../../utils/auth";
import axios from "axios";
import { API_BASE_URL } from "../../config/api";

function HouseDetailPage() {
  const navigate = useNavigate();
  const { houseId } = useParams();
  const [house, setHouse] = useState(null);
  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = getToken();
        const [housesRes, unitsRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/houses/my-houses`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${API_BASE_URL}/rental-units/house/${houseId}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const found = housesRes.data.data.find(
          (h) => h.id === parseInt(houseId)
        );
        if (!found) throw new Error("House not found");
        setHouse(found);
        setUnits(unitsRes.data.data);
      } catch (err) {
        setError(
          err?.response?.data?.message || err.message || "Failed to load data"
        );
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [houseId]);

  const getStatusStyle = (status) => {
    if (status === "APPROVED") return "text-emerald-300 border-emerald-300/30 bg-emerald-400/10";
    if (status === "REJECTED") return "text-red-300 border-red-300/30 bg-red-400/10";
    return "text-yellow-300 border-yellow-300/30 bg-yellow-400/10";
  };

  const getBathroomText = (unit) => {
    let text = `${unit.bathrooms} bathroom(s)`;
    const parts = [];
    if (unit.attachedBathrooms) parts.push(`${unit.attachedBathrooms} attached`);
    if (unit.commonBathrooms) parts.push(`${unit.commonBathrooms} common`);
    if (parts.length > 0) text += ` (${parts.join(", ")})`;
    return text;
  };

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 flex items-center justify-center text-slate-400">
      Loading...
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 flex items-center justify-center">
      <div className="rounded-2xl border border-red-400/30 bg-red-500/10 p-6 text-red-100">{error}</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 px-4 py-10 text-white">
      <div className="mx-auto max-w-5xl">

        <div className="mb-8">
          <button
            onClick={() => navigate("/landlord/houses")}
            className="mb-4 text-sm text-slate-400 transition hover:text-emerald-300"
          >
            ← Back to My Houses
          </button>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-300">
            Landlord Panel
          </p>
          <h1 className="mt-1 text-3xl font-bold">{house.title}</h1>
        </div>

        <div className="mb-8 rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
          <div className="mb-4 flex items-start justify-between gap-2">
            <h2 className="text-lg font-semibold text-white">House Details</h2>
            <span className={`rounded-full border px-3 py-1 text-xs font-medium ${getStatusStyle(house.status)}`}>
              {house.status}
            </span>
          </div>
          <div className="space-y-2 text-sm text-slate-300">
            <p>📍 {house.address}, {house.area}</p>
            {house.totalFloors && <p>🏢 Total {house.totalFloors} floors</p>}
            <p className="text-slate-400">{house.description}</p>
          </div>
          {house.rejectionReason && (
            <div className="mt-4 rounded-2xl border border-red-400/20 bg-red-500/10 p-3 text-xs text-red-200">
              Rejected: {house.rejectionReason}
            </div>
          )}
          {house.status === "PENDING" && (
            <div className="mt-4 rounded-2xl border border-yellow-400/20 bg-yellow-500/10 p-3 text-xs text-yellow-200">
              ⏳ Waiting for admin approval. You can add rental units after approval.
            </div>
          )}
        </div>

        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-200">
              Rental Units ({units.length})
            </h2>
            {house.status === "APPROVED" && (
              <Link
                to={`/landlord/houses/${houseId}/add-unit`}
                className="rounded-2xl bg-emerald-400 px-5 py-2 text-sm font-bold text-slate-950 transition hover:bg-emerald-300"
              >
                + Add Unit
              </Link>
            )}
          </div>

          {units.length === 0 && (
            <div className="rounded-3xl border border-white/10 bg-white/5 p-10 text-center backdrop-blur-md">
              <p className="text-2xl">🏘</p>
              <p className="mt-3 font-semibold text-slate-200">No rental units yet</p>
              {house.status === "APPROVED" ? (
                <p className="mt-1 text-sm text-slate-400">
                  Add your first rental unit to start receiving bookings.
                </p>
              ) : (
                <p className="mt-1 text-sm text-slate-400">
                  House must be approved before adding rental units.
                </p>
              )}
              {house.status === "APPROVED" && (
                <Link
                  to={`/landlord/houses/${houseId}/add-unit`}
                  className="mt-5 inline-block rounded-2xl bg-emerald-400 px-6 py-2 text-sm font-bold text-slate-950 transition hover:bg-emerald-300"
                >
                  Add Rental Unit
                </Link>
              )}
            </div>
          )}

          {units.length > 0 && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {units.map((unit) => (
                <div
                  key={unit.id}
                  className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-md"
                >
                  <div className="mb-3 flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-white">{unit.title}</h3>
                    <span className={`rounded-full border px-3 py-1 text-xs font-medium ${getStatusStyle(unit.status)}`}>
                      {unit.status}
                    </span>
                  </div>
                  {unit.description && (
                    <p className="mb-3 text-sm text-slate-400 line-clamp-2">{unit.description}</p>
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
                  {unit.rejectionReason && (
                    <div className="mt-4 rounded-2xl border border-red-400/20 bg-red-500/10 p-3 text-xs text-red-200">
                      Rejected: {unit.rejectionReason}
                    </div>
                  )}
                  <div className="mt-4 flex items-center gap-2 text-xs text-slate-400">
                    <span className={`rounded-full px-2 py-1 ${unit.isAvailable ? "bg-emerald-400/10 text-emerald-300" : "bg-red-400/10 text-red-300"}`}>
                      {unit.isAvailable ? "Available" : "Not Available"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default HouseDetailPage;