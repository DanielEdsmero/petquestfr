'use client';

import { useRouter } from 'next/navigation';
import { usePetQuestStore, type PetType } from '../../hooks/usePetQuestStore';

const PETS: Array<{ type: PetType; emoji: string }> = [
  { type: 'Dog', emoji: '🐶' },
  { type: 'Cat', emoji: '🐱' },
  { type: 'Bird', emoji: '🐦' },
  { type: 'Dragon', emoji: '🐉' },
];

export default function PetSelectPage() {
  const router = useRouter();
  const { choosePet, state, isHydrated } = usePetQuestStore();

  if (!isHydrated) {
    return <main className="page-shell"><section className="glass-card panel"><p>Loading...</p></section></main>;
  }

  if (!state.user) {
    router.push('/login');
    return null;
  }

  return (
    <main className="page-shell">
      <section className="glass-card panel">
        <p className="badge">Step 2</p>
        <h1>Choose your pet</h1>
        <p className="subtitle">Pick one companion: Dog, Cat, Bird, or Dragon.</p>

        <div className="pet-grid">
          {PETS.map((pet) => (
            <button
              key={pet.type}
              type="button"
              className={`pet-choice ${state.selectedPetType === pet.type ? 'active' : ''}`}
              onClick={() => choosePet(pet.type)}
            >
              <span>{pet.emoji}</span>
              <strong>{pet.type}</strong>
            </button>
          ))}
        </div>

        <div className="cta-row">
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => router.push('/dashboard')}
            disabled={!state.selectedPetType}
          >
            Continue to Dashboard
          </button>
        </div>
      </section>
    </main>
  );
}
