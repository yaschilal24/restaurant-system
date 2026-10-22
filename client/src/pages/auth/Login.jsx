import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { validateRegister } from '../../utils/validators';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      if (user.role === 'admin') navigate('/admin');
      else if (user.role === 'staff') navigate('/kitchen');
      else navigate('/menu');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const quickLogin = (email) => setForm({ email, password: 'password123' });

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-primary px-4">
      <div className="w-full max-w-[420px]">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4 shadow-glow">R</div>
          <h1 className="text-3xl font-bold text-txt-primary">Welcome back.</h1>
          <p className="text-sm text-txt-muted mt-2">Sign in to your account</p>
        </div>

        <div className="card p-6">
          {error && <div className="bg-danger/10 border border-danger/20 text-danger text-sm rounded-xl px-4 py-3 mb-4">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs text-txt-secondary mb-1.5 block font-medium">Email</label>
              <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" className="input-base" required />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs text-txt-secondary font-medium">Password</label>
                <Link to="/forgot-password" className="text-[11px] text-primary hover:opacity-80">Forgot?</Link>
              </div>
              <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="••••••••" className="input-base" required />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full py-3">
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className="text-sm text-txt-muted text-center mt-5">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary hover:opacity-80 font-medium">Create account</Link>
          </p>
        </div>
      </div>
    </div>
  );
}