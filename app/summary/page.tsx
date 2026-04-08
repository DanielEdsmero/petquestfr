import Link from 'next/link';

export default function SummaryPage() {
  return (
    <main className="page-shell">
      <section className="glass-card hero">
        <p className="badge">Explore Features</p>
        <h1>Everything you asked for is now in one flow.</h1>
        <p className="subtitle">
          Login, choose a pet, manage personalized tasks, track pet mood, and review admin analytics.
        </p>
        <div className="cta-row">
          <Link href="/login" className="btn btn-primary">Go to Login</Link>
          <Link href="/" className="btn btn-secondary">Back Home</Link>
        </div>
      </section>
    </main>
  );
}
