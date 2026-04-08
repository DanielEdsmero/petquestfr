'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { usePetQuestStore } from '../../hooks/usePetQuestStore';

export default function LoginPage() {
  const router = useRouter();
  const { login, state, isHydrated } = usePetQuestStore();
  const [username, setUsername] = useState(state.user?.username ?? '');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError('Username and password are required.');
      return;
    }

    login(username.trim());
    if (state.selectedPetType) {
      router.push('/dashboard');
      return;
    }

    router.push('/pet-select');
  };

  if (!isHydrated) {
    return <main className="page-shell"><section className="glass-card panel"><p>Loading...</p></section></main>;
  }

  return (
    <main className="page-shell auth-shell">
      <form onSubmit={handleSubmit} className="glass-card panel auth-card">
        <p className="badge">Login</p>
        <h1>Sign in to Pet Quest</h1>
        <p className="subtitle">Username + password only (no email required).</p>

        <label className="input-stack">
          Username
          <input value={username} onChange={(event) => setUsername(event.target.value)} placeholder="Enter username" />
        </label>

        <label className="input-stack">
          Password
          <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Enter password" />
        </label>

        {error && <p className="error-text">{error}</p>}

        <div className="cta-row">
          <button className="btn btn-primary" type="submit">Login</button>
          <Link href="/" className="btn btn-secondary">Cancel</Link>
        </div>
      </form>
    </main>
  );
}
