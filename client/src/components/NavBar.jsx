import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function NavBar() {
  const { user, logout } = useAuth();

  return (
    <nav className="card px-5 py-4 flex items-center justify-between mb-6">
      <div className="font-semibold text-lg">Pet Quest</div>
      <div className="flex items-center gap-4 text-sm">
        <span className="text-muted">{user?.username}</span>
        {user?.role === 'admin' && (
          <Link className="text-accent hover:opacity-90 transition-all duration-200" to="/admin">
            Admin
          </Link>
        )}
        <button className="btn" onClick={logout}>
          Logout
        </button>
      </div>
    </nav>
  );
}
