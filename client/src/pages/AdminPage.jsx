import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import StatCard from '../components/StatCard';
import { useAuth } from '../context/AuthContext';

export default function AdminPage() {
  const { authFetch } = useAuth();
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const [statsData, usersData] = await Promise.all([authFetch('/admin/stats'), authFetch('/admin/users')]);
        setStats(statsData);
        setUsers(usersData.users);
      } catch (err) {
        setError(err.message);
      }
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (error) return <div className="p-6 text-red-400">{error}</div>;
  if (!stats) return <div className="p-6 text-muted">Loading...</div>;

  return (
    <div className="min-h-screen bg-primary p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="grid md:grid-cols-4 gap-4">
          <StatCard label="Total Users" value={stats.totalUsers} />
          <StatCard label="Total Tasks" value={stats.totalTasks} />
          <StatCard label="Completion Rate" value={`${stats.completionRate}%`} />
          <StatCard label="Most Active User" value={stats.mostActiveUser || '-'} />
        </div>
        <div className="card p-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-muted border-b border-white/10">
              <tr>
                <th className="py-2">Username</th>
                <th>Pet</th>
                <th>Level</th>
                <th>XP</th>
                <th>Streak</th>
                <th>Tasks Completed</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b border-white/5">
                  <td className="py-2">{u.username}</td>
                  <td>{u.pet_type || '-'}</td>
                  <td>{u.level}</td>
                  <td>{u.xp}</td>
                  <td>{u.streak}</td>
                  <td>{u.completed_tasks}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Link to="/dashboard" className="btn inline-block">
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
