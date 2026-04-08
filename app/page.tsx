import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-4xl flex-col items-start justify-center gap-6 px-6">
      <span className="rounded-full bg-brand-100 px-3 py-1 text-sm text-brand-700">PetQuest</span>
      <h1 className="text-4xl font-bold text-slate-900">Build habits. Level your pet.</h1>
      <p className="max-w-xl text-slate-600">
        PetQuest is a local-first dashboard where you complete tasks, keep streaks, and evolve your companion.
      </p>
      <Link href="/dashboard" className="rounded-lg bg-brand-500 px-4 py-2 font-medium text-white hover:bg-brand-700">
        Open dashboard
      </Link>
    </main>
  );
}
