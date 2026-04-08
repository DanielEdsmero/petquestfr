import { Heart, Zap } from 'lucide-react';
import { PetState } from '@/lib/types';

interface PetStatusCardProps {
  pet: PetState;
}

export function PetStatusCard({ pet }: PetStatusCardProps) {
  return (
    <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-semibold">{pet.name}</h2>
        <span className="rounded-full bg-brand-100 px-3 py-1 text-xs font-medium text-brand-700">Level {pet.level}</span>
      </div>
      <div className="space-y-3 text-sm text-slate-600">
        <p className="inline-flex items-center gap-2"><Heart size={16} /> Mood: {pet.mood}</p>
        <p className="inline-flex items-center gap-2"><Zap size={16} /> Energy: {pet.energy}%</p>
        <p>XP: {pet.experience}</p>
      </div>
    </section>
  );
}
