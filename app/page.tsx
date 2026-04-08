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
          <Link href="/login" className="btn btn-primary">
            Open PetQuest Dashboard
          </Link>
          <Link href="/summary" className="btn btn-secondary">
            Explore Features
          </Link>
        </div>
      </section>

      <section className="summary-grid">
        {[
          {
            title: 'Login + Pet Onboarding',
            text: 'Sign in with username/password, then choose Dog, Cat, Bird, or Dragon.',
          },
          {
            title: 'Task Creator',
            text: 'Create custom tasks with title, description, due date, and priority.',
          },
          {
            title: 'Pet Mood + Admin Insights',
            text: 'Your pet mood updates as you complete tasks. Admin panel shows analytics.',
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
