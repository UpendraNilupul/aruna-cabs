import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await login(email, password);
      navigate('/'); // Redirect to Home on success
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    }
  };

  return (
    <div style={S.page}>
      <div style={S.container}>
        <div style={S.card}>
          <div style={S.logoCircle}>
            <span>ARUNA<br />CABS</span>
          </div>
          <h2 style={S.title}>Welcome Back</h2>
          <p style={S.subtitle}>Log in to access your VIP account.</p>

          {error && <div style={S.errorBox}>{error}</div>}

          <form onSubmit={handleSubmit}>
            <div style={S.inputGroup}>
              <label style={S.label}>Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={S.input}
                placeholder="john@example.com"
              />
            </div>

            <div style={S.inputGroup}>
              <label style={S.label}>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={S.input}
                placeholder="••••••••"
              />
            </div>

            <button type="submit" style={S.button}>
              Log In
            </button>
          </form>

          <p style={S.footerText}>
            Don't have an account? <Link to="/register" style={S.link}>Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── PREMIUM DARK MODE STYLES ────────────────────────────────────────────────
const S = {
  page: { minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#020617', fontFamily: "'Inter', 'Segoe UI', sans-serif" },
  container: { flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' },
  card: { width: '100%', maxWidth: '400px', background: 'rgba(255, 255, 255, 0.02)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255, 255, 255, 0.05)', borderRadius: '16px', padding: '40px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' },
  logoCircle: { width: 56, height: 56, margin: '0 auto 24px', borderRadius: 14, background: 'linear-gradient(135deg, #10B981, #059669)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#020617', fontWeight: 900, fontSize: 12, textAlign: 'center', lineHeight: 1.1, letterSpacing: 1 },
  title: { textAlign: 'center', margin: '0 0 8px', color: '#F8FAFC', fontSize: '24px', fontWeight: 700 },
  subtitle: { textAlign: 'center', margin: '0 0 32px', color: '#94A3B8', fontSize: '14px' },
  errorBox: { backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#F87171', padding: '12px', borderRadius: '8px', marginBottom: '24px', textAlign: 'center', fontSize: '14px' },
  inputGroup: { marginBottom: '20px' },
  label: { display: 'block', marginBottom: '8px', color: '#94A3B8', fontSize: '13px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' },
  input: { width: '100%', padding: '14px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.1)', backgroundColor: 'rgba(0, 0, 0, 0.2)', color: '#F8FAFC', fontSize: '15px', boxSizing: 'border-box', outline: 'none', transition: 'border 0.3s' },
  button: { width: '100%', padding: '14px', background: 'linear-gradient(135deg, #10B981, #059669)', color: '#020617', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '15px', fontWeight: 700, marginTop: '10px', boxShadow: '0 4px 15px rgba(16, 185, 129, 0.2)' },
  footerText: { textAlign: 'center', marginTop: '24px', color: '#64748B', fontSize: '14px' },
  link: { color: '#10B981', textDecoration: 'none', fontWeight: 600 }
};