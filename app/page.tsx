import Link from 'next/link';

export default function LandingPage() {
  return (
    <main className="page-shell">
      <section className="hero glass-card">
        <p className="badge">Pet Quest Productivity</p>
        <h1>Build momentum, level up your pet, and finish what matters.</h1>
        <p className="subtitle">
          Pet Quest turns your to-do list into a rewarding daily game. Track progress,
          maintain streaks, and keep your companion thriving as you complete tasks.
        </p>
        <div className="cta-row">
          <Link href="/dashboard" className="btn btn-primary">
            Open PetQuest Dashboard
          </Link>
          <a href="#summary" className="btn btn-secondary">
            Explore Features
          </a>
        </div>
      </section>

      <section id="summary" className="summary-grid">
        {[
          {
            title: 'Gamified Task Flow',
            text: 'Organize tasks with filters, sorting, and smart statuses for better focus.',
          },
          {
            title: 'Pet Wellness Loop',
            text: 'Every completed task feeds XP, mood, and energy to your companion.',
          },
          {
            title: 'Performance Insights',
            text: 'Use weekly trends, streak tracking, and achievements to sustain progress.',
          },
        ].map((item) => (
          <article key={item.title} className="glass-card feature-card">
            <h2>{item.title}</h2>
            <p>{item.text}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
