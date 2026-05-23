import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/authService";
import { setToken, setUser, getRoleDashboard } from "../utils/auth";

function LoginPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    phone: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const result = await loginUser(formData);
      setToken(result.token);
      setUser(result.data);
      navigate(getRoleDashboard(result.data.role), { replace: true });
    } catch (err) {
      setError(
        err?.response?.data?.error ||
          err?.response?.data?.message ||
          "Login failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="flex min-h-[calc(100vh-73px)] items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 px-4 py-10">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/10 p-7 text-white shadow-2xl backdrop-blur-md">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-300">
          Login
        </p>
        <h2 className="mt-3 text-3xl font-bold">Access your panel</h2>
        <p className="mt-2 text-sm leading-6 text-slate-300">
          Use your phone number and password to continue.
        </p>
        {error && (
          <div className="mt-5 rounded-2xl border border-red-400/30 bg-red-500/10 p-4 text-sm text-red-100">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-200">
              Phone Number
            </label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="01700000003"
              className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white outline-none transition placeholder:text-slate-400 focus:border-emerald-300"
              required
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-200">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter password"
              className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white outline-none transition placeholder:text-slate-400 focus:border-emerald-300"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-emerald-400 px-5 py-3 font-bold text-slate-950 shadow-lg shadow-emerald-950/30 transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </section>
  );
}

export default LoginPage;