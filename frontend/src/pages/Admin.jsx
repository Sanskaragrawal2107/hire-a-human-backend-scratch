import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getEngineers, reviewRecruiter } from '../api';
import api from '../api';
import { CheckCircle, XCircle, Clock, Shield, Users } from 'lucide-react';
import { useToast } from '../components/Toast';

export default function Admin() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { show, ToastComponent } = useToast();
  const [recruiters, setRecruiters] = useState([]);
  const [engineers, setEngineers] = useState([]);
  const [tab, setTab] = useState('recruiters');
  const [loading, setLoading] = useState(true);
  const [reviewing, setReviewing] = useState(null);
  const [rejectionMsg, setRejectionMsg] = useState('');
  const [showRejectForm, setShowRejectForm] = useState(null);

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    if (user.role !== 'admin') { navigate('/'); return; }
    loadData();
  }, [user]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [recRes, engRes] = await Promise.all([
        api.get('/admin/recruiters'),
        getEngineers(),
      ]);
      setRecruiters(Array.isArray(recRes?.data) ? recRes.data : []);
      setEngineers(engRes.data);
    } catch {
      // engineers always loads
      try { const e = await getEngineers(); setEngineers(e.data); } catch {}
    } finally {
      setLoading(false);
    }
  };

  const handleReview = async (recruiterId, status) => {
    setReviewing(recruiterId);
    try {
      await reviewRecruiter(recruiterId, status, status === 'rejected' ? rejectionMsg : undefined);
      show(`Recruiter ${status}!`, status === 'verified' ? 'success' : 'error');
      setShowRejectForm(null);
      setRejectionMsg('');
      loadData();
    } catch (err) {
      show(err?.response?.data?.detail || 'Action failed', 'error');
    } finally {
      setReviewing(null);
    }
  };

  const statusColor = (s) => ({ verified: 'var(--secondary)', pending: 'var(--muted)', rejected: 'var(--accent)' }[s] || '#fff');

  return (
    <main style={{ minHeight: '100vh', background: 'var(--bg)', padding: '40px 0' }}>
      {ToastComponent}
      <div className="container">
        {/* Header */}
        <div style={{ marginBottom: 36 }}>
          <div className="badge badge-black" style={{ marginBottom: 12 }}>🔑 Admin Panel</div>
          <h1 style={{ fontSize: 'clamp(32px, 4vw, 52px)', fontWeight: 900, lineHeight: 0.9 }}>
            HIRE A HUMAN<br />
            <span style={{ background: 'var(--accent)', border: '4px solid #000', padding: '0 14px', display: 'inline-block', boxShadow: '4px 4px 0 0 #000' }}>
              CONTROL PANEL
            </span>
          </h1>
        </div>

        {/* Stats row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16, marginBottom: 36 }}>
          {[
            { label: 'Total Engineers', num: engineers.length, bg: 'var(--secondary)', Icon: Users },
            { label: 'Recruiters', num: recruiters.length, bg: 'var(--muted)', Icon: Shield },
            { label: 'Pending Review', num: recruiters.filter(r => r.verification_status === 'pending').length, bg: 'var(--accent)', Icon: Clock },
            { label: 'Verified', num: recruiters.filter(r => r.verification_status === 'verified').length, bg: '#000', Icon: CheckCircle },
          ].map(({ label, num, bg, Icon }) => (
            <div key={label} style={{ padding: '20px', border: '4px solid #000', background: bg, boxShadow: '5px 5px 0 0 #000', display: 'flex', flexDirection: 'column', gap: 8 }}>
              <Icon size={20} strokeWidth={3} color={bg === '#000' ? '#fff' : '#000'} />
              <div style={{ fontSize: 36, fontWeight: 900, color: bg === '#000' ? '#fff' : '#000' }}>{num}</div>
              <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: bg === '#000' ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)' }}>{label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', border: '4px solid #000', marginBottom: 28, boxShadow: '4px 4px 0 0 #000', width: 'fit-content' }}>
          {[
            { key: 'recruiters', label: '🏢 Recruiters' },
            { key: 'engineers', label: '⚡ Engineers' },
          ].map(({ key, label }) => (
            <button key={key} onClick={() => setTab(key)}
              style={{
                padding: '12px 28px', fontFamily: 'Space Grotesk, sans-serif', fontWeight: 900, fontSize: 13,
                textTransform: 'uppercase', letterSpacing: '0.08em',
                border: 'none', borderRight: key === 'recruiters' ? '4px solid #000' : 'none',
                cursor: 'pointer', background: tab === key ? '#000' : '#fff', color: tab === key ? '#fff' : '#000',
              }}>
              {label}
            </button>
          ))}
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px', fontWeight: 700, fontSize: 18 }}>Loading...</div>
        ) : tab === 'recruiters' ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {recruiters.length === 0 ? (
              <div style={{ padding: '40px', border: '4px dashed rgba(0,0,0,0.2)', textAlign: 'center' }}>
                <p style={{ fontWeight: 700, opacity: 0.5 }}>No recruiters found. The /recruiters/ GET endpoint may not be available.</p>
              </div>
            ) : recruiters.map(r => (
              <div key={r.id} className="card" style={{ padding: '24px', position: 'relative' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
                  <div>
                    <h3 style={{ fontSize: 20, fontWeight: 900, marginBottom: 6 }}>{r.company_name}</h3>
                    <p style={{ fontSize: 13, fontWeight: 700, color: 'rgba(0,0,0,0.6)' }}>ID: {r.id}</p>
                    <p style={{ fontSize: 13, fontWeight: 700, color: 'rgba(0,0,0,0.6)' }}>Tier: {r.subscription_tier}</p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span className="badge" style={{ background: statusColor(r.verification_status), textTransform: 'capitalize' }}>
                      {r.verification_status}
                    </span>
                    {r.verification_status === 'pending' && (
                      <>
                        <button className="btn btn-secondary btn-sm"
                          disabled={reviewing === r.id}
                          onClick={() => handleReview(r.id, 'verified')}>
                          <CheckCircle size={14} strokeWidth={3} /> Approve
                        </button>
                        <button className="btn btn-outline btn-sm"
                          onClick={() => setShowRejectForm(showRejectForm === r.id ? null : r.id)}>
                          <XCircle size={14} strokeWidth={3} /> Reject
                        </button>
                      </>
                    )}
                  </div>
                </div>
                {showRejectForm === r.id && (
                  <div style={{ marginTop: 16, padding: '16px', background: 'var(--accent)', border: '3px solid #000' }}>
                    <input className="input" placeholder="Rejection reason (optional)" value={rejectionMsg}
                      onChange={e => setRejectionMsg(e.target.value)} style={{ marginBottom: 10 }} />
                    <div style={{ display: 'flex', gap: 10 }}>
                      <button className="btn btn-black btn-sm"
                        disabled={reviewing === r.id}
                        onClick={() => handleReview(r.id, 'rejected')}>
                        Confirm Reject
                      </button>
                      <button className="btn btn-outline btn-sm" onClick={() => setShowRejectForm(null)}>Cancel</button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
            {engineers.map(eng => (
              <div key={eng.id} className="card" style={{ padding: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                  <div style={{ width: 44, height: 44, border: '3px solid #000', background: `hsl(${eng.full_name.charCodeAt(0) * 7 % 360}, 70%, 65%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 18 }}>
                    {eng.full_name.charAt(0)}
                  </div>
                  <div>
                    <div style={{ fontWeight: 900 }}>{eng.full_name}</div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: 'rgba(0,0,0,0.5)' }}>{eng.experience_years}yr exp</div>
                  </div>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {eng.skills.slice(0, 4).map(s => <span key={s} className="skill-tag" style={{ fontSize: 10 }}>{s}</span>)}
                </div>
                {eng.github_username && (
                  <div style={{ marginTop: 10, fontSize: 12, fontWeight: 700, color: 'rgba(0,0,0,0.5)' }}>
                    github/{eng.github_username}
                  </div>
                )}
                <div style={{ marginTop: 10 }}>
                  <span className="badge" style={{ background: eng.is_open_to_hire ? 'var(--secondary)' : 'rgba(0,0,0,0.1)', fontSize: 10 }}>
                    {eng.is_open_to_hire ? 'Open to Hire' : 'Not Looking'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
