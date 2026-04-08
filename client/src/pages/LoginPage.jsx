import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const { login, register } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const user = isRegister ? await register(username, password) : await login(username, password);
      if (!user.pet_type) navigate('/select-pet');
      else navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-primary">
      <form onSubmit={submit} className="card p-6 w-full max-w-md space-y-4">
        <h1 className="text-2xl font-semibold">{isRegister ? 'Create account' : 'Welcome back'}</h1>
        <input className="input" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
        <input
          className="input"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <p className="text-red-400 text-sm">{error}</p>}
        <button className="btn w-full" type="submit">
          {isRegister ? 'Register' : 'Login'}
        </button>
        <p className="text-sm text-muted text-center">
          {isRegister ? 'Already have an account?' : 'Need an account?'}{' '}
          <button type="button" className="text-accent" onClick={() => setIsRegister((v) => !v)}>
            {isRegister ? 'Login' : 'Register'}
          </button>
        </p>
        <Link className="text-xs text-muted block text-center" to="/select-pet">
          Continue to pet select (public)
        </Link>
      </form>
    </div>
  );
}
