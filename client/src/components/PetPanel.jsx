const moodMap = {
  Happy: '😊',
  Neutral: '😐',
  Sad: '😔'
};

export default function PetPanel({ user }) {
  const pct = Math.min(100, user?.xp || 0);
  return (
    <div className="card p-6 space-y-4">
      <div className="text-7xl">{user?.pet_type || '🐾'}</div>
      <h2 className="text-2xl font-semibold">{user?.pet_name || 'Your Pet'}</h2>
      <p className="text-muted">Level {user?.level || 1}</p>
      <div>
        <div className="flex justify-between text-sm mb-1">
          <span>XP</span>
          <span>{user?.xp || 0}/100</span>
        </div>
        <div className="h-3 rounded-xl bg-secondary border border-white/10 overflow-hidden">
          <div className="h-full bg-accent transition-all duration-200" style={{ width: `${pct}%` }} />
        </div>
      </div>
      <p>
        Mood: <span className="text-accent">{moodMap[user?.mood || 'Sad']} {user?.mood || 'Sad'}</span>
      </p>
      <p>Streak: {user?.streak || 0} day(s)</p>
    </div>
  );
}
