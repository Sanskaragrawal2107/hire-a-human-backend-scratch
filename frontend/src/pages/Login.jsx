import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { engineerLogin, recruiterLogin, adminLogin } from '../api';
import { ArrowRight, Eye, EyeOff } from 'lucide-react';
import { useToast } from '../components/Toast';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { show, ToastComponent } = useToast();

  const [role, setRole] = useState('engineer');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      let res;
      if (role === 'engineer') res = await engineerLogin(email, password);
      else if (role === 'recruiter') res = await recruiterLogin(email, password);
      else res = await adminLogin(email, password);

      login(res.data.access_token);
      show('Logged in successfully!', 'success');

      if (role === 'admin') navigate('/admin');
      else if (role === 'recruiter') navigate('/chat');
      else navigate('/');
    } catch (err) {
      const msg = err?.response?.data?.detail || 'Login failed. Check your credentials.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const roles = [
    { key: 'engineer', label: 'Engineer', emoji: '⚡', bg: 'var(--secondary)' },
    { key: 'recruiter', label: 'Recruiter', emoji: '🏢', bg: 'var(--muted)' },
    { key: 'admin', label: 'Admin', emoji: '🔑', bg: 'var(--accent)' },
  ];

  return (
    <main style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 24px' }} className="pattern-grid">
      {ToastComponent}
      <div style={{ width: '100%', maxWidth: 480 }}>
        {/* Header */}
        <div style={{ marginBottom: 40, textAlign: 'center' }}>
          <div className="badge badge-accent" style={{ display: 'inline-block', marginBottom: 16, transform: 'rotate(-2deg)' }}>Welcome Back</div>
          <h1 style={{ fontSize: 48, fontWeight: 900, lineHeight: 0.9, marginBottom: 8 }}>
            LOG<br /><span style={{ display: 'inline-block', background: 'var(--secondary)', border: '4px solid #000', padding: '0 16px', boxShadow: '4px 4px 0 0 #000', transform: 'rotate(-1deg)' }}>IN.</span>
          </h1>
          <p style={{ color: 'rgba(0,0,0,0.6)', fontWeight: 700, marginTop: 16 }}>
            Don't have an account? <Link to="/signup" style={{ color: 'var(--accent)', textDecoration: 'underline' }}>Sign up free →</Link>
          </p>
        </div>

        {/* Role picker */}
        <div style={{ display: 'flex', marginBottom: 28, border: '4px solid #000', overflow: 'hidden', boxShadow: '4px 4px 0 0 #000' }}>
          {roles.map(({ key, label, emoji, bg }) => (
            <button key={key} onClick={() => { setRole(key); setError(''); }}
              style={{
                flex: 1,
                padding: '12px 8px',
                fontFamily: 'Space Grotesk, sans-serif',
                fontWeight: 900,
                fontSize: 13,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                border: 'none',
                borderRight: key !== 'admin' ? '3px solid #000' : 'none',
                cursor: 'pointer',
                background: role === key ? bg : '#fff',
                transition: 'background 0.1s',
              }}
            >
              {emoji} {label}
            </button>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div className="form-group">
            <label className="label">Email Address</label>
            <input type="email" className="input" placeholder="you@company.com" value={email}
              onChange={e => setEmail(e.target.value)} required />
          </div>

          <div className="form-group">
            <label className="label">Password</label>
            <div style={{ position: 'relative' }}>
              <input type={showPass ? 'text' : 'password'} className="input" placeholder="••••••••"
                value={password} onChange={e => setPassword(e.target.value)} required
                style={{ paddingRight: 52 }} />
              <button type="button" onClick={() => setShowPass(!showPass)}
                style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer' }}>
                {showPass ? <EyeOff size={20} strokeWidth={2.5} /> : <Eye size={20} strokeWidth={2.5} />}
              </button>
            </div>
          </div>

          {error && <div className="error-msg">{error}</div>}

          <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading}
            style={{ marginTop: 8, opacity: loading ? 0.7 : 1, cursor: loading ? 'wait' : 'pointer' }}>
            {loading ? 'Signing in...' : <><ArrowRight size={18} strokeWidth={3} /> Sign In</>}
          </button>
        </form>

        <div style={{ marginTop: 24, padding: '16px', border: '3px solid rgba(0,0,0,0.15)', background: 'rgba(0,0,0,0.03)' }}>
          <p style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', opacity: 0.6, textAlign: 'center' }}>
            {role === 'engineer' ? '⚡ Engineers log in to update their profile and track visibility'
              : role === 'recruiter' ? '🏢 Recruiters must be admin-verified before accessing talent search'
              : '🔑 Admin portal — restricted access only'}
          </p>
        </div>
      </div>
    </main>
  );
}
