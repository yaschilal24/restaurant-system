import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-primary px-4">
      <div className="w-full max-w-[420px]">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4 shadow-glow">R</div>
          <h1 className="text-3xl font-bold text-txt-primary">Reset password.</h1>
          <p className="text-sm text-txt-muted mt-2">We'll send you a reset link</p>
        </div>
        <div className="card p-6">
          {sent ? (
            <div className="bg-success/10 border border-success/20 text-success text-sm rounded-xl px-4 py-3 text-center">
              ✓ If an account exists for {email}, a reset link has been sent.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs text-txt-secondary mb-1.5 block font-medium">Email</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input-base" required />
              </div>
              <button type="submit" className="btn-primary w-full py-3">Send Reset Link</button>
            </form>
          )}
          <p className="text-sm text-txt-muted text-center mt-5">
            <Link to="/login" className="text-primary hover:opacity-80 font-medium">← Back to login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}