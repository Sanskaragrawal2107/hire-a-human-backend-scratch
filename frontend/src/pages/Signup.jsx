import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { engineerSignup, recruiterSignup } from '../api';
import { ArrowRight, Plus, X } from 'lucide-react';
import { useToast } from '../components/Toast';

export default function Signup() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { show, ToastComponent } = useToast();
  const [role, setRole] = useState('engineer');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Engineer fields
  const [engForm, setEngForm] = useState({
    full_name: '', email: '', password: '', curr_location: '', preferred_location: '',
    github_username: '', leetcode_username: '', experience_years: 0, job_type: '', bio: '', skills: [],
  });
  const [skillInput, setSkillInput] = useState('');

  // Recruiter fields
  const [recForm, setRecForm] = useState({ company_name: '', company_email: '', password: '', company_gstin: '' });

  const addSkill = () => {
    const s = skillInput.trim().toUpperCase();
    if (s && !engForm.skills.includes(s)) {
      setEngForm(f => ({ ...f, skills: [...f.skills, s] }));
      setSkillInput('');
    }
  };
  const removeSkill = (s) => setEngForm(f => ({ ...f, skills: f.skills.filter(x => x !== s) }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (role === 'engineer') {
        const payload = { ...engForm, experience_years: Number(engForm.experience_years) };
        if (!payload.job_type) delete payload.job_type;
        await engineerSignup(payload);
        show('Account created! Please log in.', 'success');
        navigate('/login');
      } else {
        const payload = { ...recForm };
        if (!payload.company_gstin) delete payload.company_gstin;
        await recruiterSignup(payload);
        show('Recruiter account created! Awaiting admin verification.', 'success');
        navigate('/login');
      }
    } catch (err) {
      const detail = err?.response?.data?.detail;
      if (Array.isArray(detail)) setError(detail.map(d => d.msg).join('; '));
      else setError(detail || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ background: 'var(--bg)', minHeight: '100vh', padding: '48px 24px' }} className="pattern-grid">
      {ToastComponent}
      <div style={{ maxWidth: 560, margin: '0 auto' }}>
        <div style={{ marginBottom: 36, textAlign: 'center' }}>
          <div className="badge badge-secondary" style={{ display: 'inline-block', marginBottom: 16, transform: 'rotate(-1deg)' }}>Create Account</div>
          <h1 style={{ fontSize: 52, fontWeight: 900, lineHeight: 0.9 }}>
            SIGN<br /><span style={{ display: 'inline-block', background: 'var(--accent)', border: '4px solid #000', padding: '0 16px', boxShadow: '4px 4px 0 0 #000', transform: 'rotate(1deg)' }}>UP.</span>
          </h1>
          <p style={{ marginTop: 16, fontWeight: 700, color: 'rgba(0,0,0,0.6)' }}>
            Already have an account? <Link to="/login" style={{ color: 'var(--accent)', textDecoration: 'underline' }}>Log in →</Link>
          </p>
        </div>

        {/* Role picker */}
        <div style={{ display: 'flex', marginBottom: 32, border: '4px solid #000', overflow: 'hidden', boxShadow: '6px 6px 0 0 #000' }}>
          {[
            { key: 'engineer', label: '⚡ Engineer', bg: 'var(--secondary)' },
            { key: 'recruiter', label: '🏢 Company', bg: 'var(--muted)' },
          ].map(({ key, label, bg }) => (
            <button key={key} type="button" onClick={() => { setRole(key); setError(''); }}
              style={{
                flex: 1, padding: '14px', fontFamily: 'Space Grotesk, sans-serif', fontWeight: 900, fontSize: 14,
                textTransform: 'uppercase', letterSpacing: '0.08em', border: 'none',
                borderRight: key === 'engineer' ? '4px solid #000' : 'none',
                cursor: 'pointer',
                background: role === key ? bg : '#fff',
                transition: 'background 0.1s',
              }}
            >
              {label}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {role === 'engineer' ? (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div className="form-group">
                  <label className="label">Full Name *</label>
                  <input className="input" required value={engForm.full_name}
                    onChange={e => setEngForm(f => ({ ...f, full_name: e.target.value }))} placeholder="Ada Lovelace" />
                </div>
                <div className="form-group">
                  <label className="label">Email *</label>
                  <input type="email" className="input" required value={engForm.email}
                    onChange={e => setEngForm(f => ({ ...f, email: e.target.value }))} placeholder="ada@code.io" />
                </div>
              </div>

              <div className="form-group">
                <label className="label">Password * (min 8 chars)</label>
                <input type="password" className="input" required minLength={8} value={engForm.password}
                  onChange={e => setEngForm(f => ({ ...f, password: e.target.value }))} placeholder="••••••••" />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div className="form-group">
                  <label className="label">GitHub Username</label>
                  <input className="input" value={engForm.github_username}
                    onChange={e => setEngForm(f => ({ ...f, github_username: e.target.value }))} placeholder="octocat" />
                </div>
                <div className="form-group">
                  <label className="label">LeetCode Username</label>
                  <input className="input" value={engForm.leetcode_username}
                    onChange={e => setEngForm(f => ({ ...f, leetcode_username: e.target.value }))} placeholder="leetcoder" />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div className="form-group">
                  <label className="label">Current Location</label>
                  <input className="input" value={engForm.curr_location}
                    onChange={e => setEngForm(f => ({ ...f, curr_location: e.target.value }))} placeholder="Bangalore, India" />
                </div>
                <div className="form-group">
                  <label className="label">Preferred Location</label>
                  <input className="input" value={engForm.preferred_location}
                    onChange={e => setEngForm(f => ({ ...f, preferred_location: e.target.value }))} placeholder="Remote / Mumbai" />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div className="form-group">
                  <label className="label">Experience (years)</label>
                  <input type="number" className="input" min={0} max={50} value={engForm.experience_years}
                    onChange={e => setEngForm(f => ({ ...f, experience_years: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label className="label">Job Type</label>
                  <select className="select" value={engForm.job_type}
                    onChange={e => setEngForm(f => ({ ...f, job_type: e.target.value }))}>
                    <option value="">Select...</option>
                    <option value="full_time">Full Time</option>
                    <option value="internship">Internship</option>
                    <option value="both">Both</option>
                  </select>
                </div>
              </div>

              {/* Skills */}
              <div className="form-group">
                <label className="label">Skills</label>
                <div style={{ display: 'flex', gap: 8 }}>
                  <input className="input" value={skillInput} onChange={e => setSkillInput(e.target.value)}
                    placeholder="e.g. React" onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addSkill())} />
                  <button type="button" className="btn btn-secondary" onClick={addSkill} style={{ flexShrink: 0 }}>
                    <Plus size={18} strokeWidth={3} />
                  </button>
                </div>
                {engForm.skills.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 10 }}>
                    {engForm.skills.map(s => (
                      <span key={s} className="skill-tag" style={{ cursor: 'pointer' }} onClick={() => removeSkill(s)}>
                        {s} <X size={12} strokeWidth={3} />
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="form-group">
                <label className="label">Bio</label>
                <textarea className="input" rows={3} value={engForm.bio}
                  onChange={e => setEngForm(f => ({ ...f, bio: e.target.value }))}
                  placeholder="I build systems that scale..."
                  style={{ resize: 'vertical', height: 'auto' }} />
              </div>
            </>
          ) : (
            <>
              <div className="form-group">
                <label className="label">Company Name *</label>
                <input className="input" required value={recForm.company_name}
                  onChange={e => setRecForm(f => ({ ...f, company_name: e.target.value }))} placeholder="Acme Corp" />
              </div>
              <div className="form-group">
                <label className="label">Company Email *</label>
                <input type="email" className="input" required value={recForm.company_email}
                  onChange={e => setRecForm(f => ({ ...f, company_email: e.target.value }))} placeholder="hr@acme.com" />
              </div>
              <div className="form-group">
                <label className="label">Password * (min 8 chars)</label>
                <input type="password" className="input" required minLength={8} value={recForm.password}
                  onChange={e => setRecForm(f => ({ ...f, password: e.target.value }))} placeholder="••••••••" />
              </div>
              <div className="form-group">
                <label className="label">GSTIN (optional, 15 chars)</label>
                <input className="input" value={recForm.company_gstin} maxLength={15}
                  onChange={e => setRecForm(f => ({ ...f, company_gstin: e.target.value }))} placeholder="22AAAAA0000A1Z5" />
              </div>
              <div style={{ background: 'var(--muted)', border: '3px solid #000', padding: '16px', marginTop: 4 }}>
                <p style={{ fontSize: 13, fontWeight: 700 }}>
                  🔍 Recruiter accounts require admin verification before you can search engineers. You'll receive confirmation by email.
                </p>
              </div>
            </>
          )}

          {error && <div className="error-msg">{error}</div>}

          <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading}
            style={{ marginTop: 8, opacity: loading ? 0.7 : 1 }}>
            {loading ? 'Creating account...' : <><ArrowRight size={18} strokeWidth={3} /> Create Account</>}
          </button>
        </form>
      </div>
    </main>
  );
}
