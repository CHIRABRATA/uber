const stats = [
  { label: 'Routes wired', value: '2 auth areas' },
  { label: 'Stack', value: 'React + Vite' },
  { label: 'Backend ready', value: 'MongoDB + Express' }
];

function App() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(245,158,11,0.18),transparent_32%),radial-gradient(circle_at_top_right,rgba(59,130,246,0.16),transparent_28%),linear-gradient(135deg,#0b1020_0%,#111827_55%,#0f172a_100%)] px-5 py-8 text-slate-100 sm:px-8 lg:px-10">
      <section className="mx-auto grid min-h-[calc(100vh-4rem)] w-full max-w-6xl items-center gap-8 lg:grid-cols-2">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-amber-400">
            Uber Clone Frontend
          </p>
          <h1 className="mt-3 max-w-[10ch] text-5xl font-semibold leading-[0.95] tracking-[-0.05em] sm:text-6xl lg:text-7xl">
            Fast React UI for riders and captains.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-slate-100/75 sm:text-lg">
            This Vite app is ready to connect to your backend auth routes, profiles,
            and ride flows.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-5 py-3 font-semibold text-slate-950 shadow-[0_14px_30px_rgba(249,115,22,0.25)] transition hover:-translate-y-0.5"
              href="http://localhost:3000/api/users/profile"
            >
              Test user profile
            </a>
            <a
              className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/8 px-5 py-3 font-semibold text-slate-100 transition hover:-translate-y-0.5 hover:bg-white/12"
              href="http://localhost:3000/api/captains/login"
            >
              Captain login route
            </a>
          </div>
        </div>

        <div className="rounded-[28px] border border-white/10 bg-slate-900/70 p-6 shadow-glow backdrop-blur-xl">
          <div className="mb-5 flex items-center justify-between gap-3">
            <span className="inline-flex items-center rounded-full bg-emerald-500/15 px-3 py-2 text-sm font-medium text-emerald-300">
              Frontend scaffolded
            </span>
            <span className="inline-flex items-center rounded-full bg-white/8 px-3 py-2 text-sm font-medium text-slate-200">
              JS
            </span>
          </div>

          <div className="rounded-3xl border border-white/10 bg-gradient-to-b from-white/10 to-white/5 p-5">
            <div className="mb-3 h-3 w-2/5 rounded-full bg-white/15" />
            <div className="mb-3 h-3 w-full rounded-full bg-white/15" />
            <div className="mb-3 h-3 w-3/4 rounded-full bg-white/15" />

            <div className="mt-5 flex flex-wrap gap-2">
              <span className="rounded-full bg-amber-500/15 px-3 py-2 text-sm font-medium text-amber-200">
                Users
              </span>
              <span className="rounded-full bg-white/8 px-3 py-2 text-sm font-medium text-slate-100/90">
                Captains
              </span>
              <span className="rounded-full bg-white/8 px-3 py-2 text-sm font-medium text-slate-100/90">
                Trips
              </span>
            </div>
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {stats.map((item) => (
              <div
                key={item.label}
                className="rounded-2xl border border-white/10 bg-white/5 p-4"
              >
                <span className="mb-1 block text-sm text-slate-100/70">{item.label}</span>
                <strong className="text-sm font-semibold text-slate-50">{item.value}</strong>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

export default App;