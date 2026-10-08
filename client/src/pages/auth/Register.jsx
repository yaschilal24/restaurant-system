import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { validateRegister } from '../../utils/validators';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const err = validateRegister(form);
    if (err) { setError(err); return; }
    setLoading(true);
    try {
      await register({ name: form.name, email: form.email, phone: form.phone, password: form.password });
      navigate('/menu');
    } catch (e2) {
      setError(e2.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-primary px-4 py-8">
      <div className="w-full max-w-[420px]">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4 shadow-glow">R</div>
          <h1 className="text-3xl font-bold text-txt-primary">Create your account.</h1>
        </div>
        <div className="card p-6">
          {error && <div className="bg-danger/10 border border-danger/20 text-danger text-sm rounded-xl px-4 py-3 mb-4">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs text-txt-secondary mb-1.5 block font-medium">Full Name</label>
              <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-base" />
            </div>
            <div>
              <label className="text-xs text-txt-secondary mb-1.5 block font-medium">Email</label>
              <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input-base" />
            </div>
            <div>
              <label className="text-xs text-txt-secondary mb-1.5 block font-medium">Phone</label>
              <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="input-base" />
            </div>
            <div>
              <label className="text-xs text-txt-secondary mb-1.5 block font-medium">Password</label>
              <input type="password" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="input-base" />
            </div>
            <div>
              <label className="text-xs text-txt-secondary mb-1.5 block font-medium">Confirm Password</label>
              <input type="password" required value={form.confirm} onChange={(e) => setForm({ ...form, confirm: e.target.value })} className="input-base" />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full py-3">
              {loading ? 'Creating...' : 'Create Account'}
            </button>
          </form>
          <p className="text-sm text-txt-muted text-center mt-5">
            Already have an account? <Link to="/login" className="text-primary hover:opacity-80 font-medium">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}