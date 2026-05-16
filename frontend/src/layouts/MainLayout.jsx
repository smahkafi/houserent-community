import { Link, Outlet } from "react-router-dom";

const navItems = [
  { label: "Home", path: "/" },
  { label: "Agreements", path: "/rental-agreements" },
];

function MainLayout() {
  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <header className="sticky top-0 z-20 border-b border-white/10 bg-slate-950/95 text-white shadow-lg backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <Link to="/" className="group">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-300">
              HouseRent
            </p>
            <h1 className="text-lg font-bold tracking-tight">
              Community Panel
            </h1>
          </Link>

          <nav className="flex items-center gap-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="rounded-full border border-white/10 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-emerald-300/50 hover:bg-emerald-400/10 hover:text-emerald-200"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default MainLayout;
