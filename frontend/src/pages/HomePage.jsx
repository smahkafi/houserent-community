function HomePage() {
  return (
    <section className="min-h-[calc(100vh-73px)] bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 px-4 py-10 text-white">
      <div className="mx-auto flex min-h-[75vh] max-w-6xl items-center justify-center">
        <div className="w-full rounded-3xl border border-white/10 bg-white/10 p-8 text-center shadow-2xl backdrop-blur-md md:p-12">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.35em] text-emerald-300">
            HouseRent Community
          </p>
          <h2 className="mx-auto max-w-3xl text-4xl font-bold leading-tight md:text-6xl">
            Frontend Base Layout Ready
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-200 md:text-lg">
            Layout, navigation, route structure, Tailwind and API base are ready for Rental Agreement module.
          </p>
        </div>
      </div>
    </section>
  );
}

export default HomePage;
