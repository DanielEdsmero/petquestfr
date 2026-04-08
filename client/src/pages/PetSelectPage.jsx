import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const pets = [
  { emoji: '🐶', name: 'Dog' },
  { emoji: '🐱', name: 'Cat' },
  { emoji: '🦜', name: 'Bird' },
  { emoji: '🐉', name: 'Dragon' }
];

export default function PetSelectPage() {
  const { token, authFetch, refreshUser } = useAuth();
  const [selected, setSelected] = useState(null);
  const [petName, setPetName] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const savePet = async () => {
    if (!token) {
      setError('Please login first.');
      return;
    }
    if (!selected) {
      setError('Choose a pet.');
      return;
    }
    try {
      await authFetch('/auth/pet', {
        method: 'PUT',
        body: JSON.stringify({ pet_type: selected.emoji, pet_name: petName || selected.name })
      });
      await refreshUser();
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-primary p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-semibold mb-6">Choose your companion</h1>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {pets.map((pet) => (
            <button
              key={pet.name}
              onClick={() => setSelected(pet)}
              className={`card p-6 text-center transition-all duration-200 ${
                selected?.name === pet.name ? 'border-accent' : ''
              }`}
            >
              <div className="text-5xl">{pet.emoji}</div>
              <div className="mt-2">{pet.name}</div>
            </button>
          ))}
        </div>
        <div className="card p-4 mt-6 space-y-3">
          <input className="input" placeholder="Custom pet name (optional)" value={petName} onChange={(e) => setPetName(e.target.value)} />
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button className="btn" onClick={savePet}>
            Save and continue
          </button>
        </div>
      </div>
    </div>
  );
}
