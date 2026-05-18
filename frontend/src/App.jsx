const stats = [
  { label: 'Routes wired', value: '2 auth areas' },
  { label: 'Stack', value: 'React + Vite' },
  { label: 'Backend ready', value: 'MongoDB + Express' }
];

function App() {
  return (
    <main className="shell">
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">Uber Clone Frontend</p>
          <h1>Fast React UI for riders and captains.</h1>
          <p className="lede">
            This Vite app is ready to connect to your backend auth routes, profiles,
            and ride flows.
          </p>

          <div className="actions">
            <a className="primary" href="http://localhost:3000/api/users/profile">
              Test user profile
            </a>
            <a className="secondary" href="http://localhost:3000/api/captains/login">
              Captain login route
            </a>
          </div>
        </div>

        <div className="hero-card">
          <div className="card-top">
            <span className="badge">Frontend scaffolded</span>
            <span className="pill">JS</span>
          </div>

          <div className="mock-panel">
            <div className="mock-line short" />
            <div className="mock-line" />
            <div className="mock-line medium" />
            <div className="mock-chip-row">
              <span className="chip active">Users</span>
              <span className="chip">Captains</span>
              <span className="chip">Trips</span>
            </div>
          </div>

          <div className="stats">
            {stats.map((item) => (
              <div key={item.label} className="stat-card">
                <span>{item.label}</span>
                <strong>{item.value}</strong>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

export default App;