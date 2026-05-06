import { useState, useEffect } from 'react';
import { getEngineers, searchEngineers } from '../api';
import { useAuth } from '../context/AuthContext';
import { Search, Filter, Globe, MapPin, Briefcase, Star, X } from 'lucide-react';
import { Link } from 'react-router-dom';

function EngineerCard({ eng }) {
  return (
    <div className="card" style={{ padding: '28px', position: 'relative', overflow: 'hidden' }}>
      {/* Status badge */}
      {eng.is_open_to_hire && (
        <div className="badge badge-accent" style={{ position: 'absolute', top: 16, right: 16, transform: 'rotate(3deg)', fontSize: 10 }}>
          Open to Hire ✓
        </div>
      )}

      {/* Avatar placeholder */}
      <div style={{
        width: 56, height: 56, border: '4px solid #000',
        background: `hsl(${eng.full_name.charCodeAt(0) * 7 % 360}, 70%, 65%)`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontWeight: 900, fontSize: 22, marginBottom: 14, boxShadow: '3px 3px 0 0 #000',
        flexShrink: 0,
      }}>
        {eng.full_name.charAt(0).toUpperCase()}
      </div>

      <h3 style={{ fontSize: 18, fontWeight: 900, marginBottom: 8 }}>{eng.full_name}</h3>

      {/* Meta */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 16 }}>
        {eng.github_username && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 700 }}>
            <Globe size={14} strokeWidth={2.5} />
            <a href={`https://github.com/${eng.github_username}`} target="_blank" rel="noopener noreferrer"
              style={{ color: 'var(--accent)', textDecoration: 'underline' }}>
              {eng.github_username}
            </a>
          </div>
        )}
        {(eng.curr_location || eng.preferred_location) && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 700, color: 'rgba(0,0,0,0.6)' }}>
            <MapPin size={14} strokeWidth={2.5} />
            {eng.curr_location || eng.preferred_location}
          </div>
        )}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 700, color: 'rgba(0,0,0,0.6)' }}>
          <Briefcase size={14} strokeWidth={2.5} />
          {eng.experience_years}yr exp — {eng.job_type?.replace('_', ' ') || 'any role'}
        </div>
      </div>

      {/* Skills */}
      {eng.skills.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 14 }}>
          {eng.skills.slice(0, 5).map(s => (
            <span key={s} className="skill-tag" style={{ fontSize: 11 }}>{s}</span>
          ))}
          {eng.skills.length > 5 && (
            <span style={{ fontSize: 11, fontWeight: 700, padding: '4px 10px', border: '2px dashed #000', color: 'rgba(0,0,0,0.5)' }}>
              +{eng.skills.length - 5}
            </span>
          )}
        </div>
      )}

      {/* Bio */}
      {eng.bio && (
        <p style={{ fontSize: 13, fontWeight: 400, color: 'rgba(0,0,0,0.65)', lineHeight: 1.6, borderTop: '2px solid rgba(0,0,0,0.1)', paddingTop: 12 }}>
          {eng.bio.slice(0, 120)}{eng.bio.length > 120 ? '...' : ''}
        </p>
      )}
    </div>
  );
}

export default function Talent() {
  const { user } = useAuth();
  const [engineers, setEngineers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    skills: [], preferred_location: '', job_type: '', min_experience: '', is_open_to_hire: true, limit: 20,
  });
  const [skillInput, setSkillInput] = useState('');

  useEffect(() => { fetchEngineers(); }, []);

  const fetchEngineers = async () => {
    setLoading(true);
    try {
      const res = await getEngineers();
      setEngineers(res.data);
    } catch {
      setError('Failed to load talent pool.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (user?.role !== 'recruiter') {
      setError('Only verified recruiters can use advanced search. Log in as a recruiter.');
      return;
    }
    setLoading(true);
    try {
      const payload = {
        ...filters,
        skills: filters.skills.length ? filters.skills : undefined,
        preferred_location: filters.preferred_location || undefined,
        job_type: filters.job_type || undefined,
        min_experience: filters.min_experience !== '' ? Number(filters.min_experience) : undefined,
      };
      const res = await searchEngineers(payload);
      setEngineers(res.data);
      setError('');
    } catch (err) {
      setError(err?.response?.data?.detail || 'Search failed.');
    } finally {
      setLoading(false);
    }
  };

  const addFilterSkill = () => {
    const s = skillInput.trim().toUpperCase();
    if (s && !filters.skills.includes(s)) {
      setFilters(f => ({ ...f, skills: [...f.skills, s] }));
      setSkillInput('');
    }
  };

  return (
    <main style={{ minHeight: '100vh', background: 'var(--bg)', padding: '48px 0' }}>
      <div className="container">
        {/* Header */}
        <div style={{ marginBottom: 40, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div className="badge badge-accent" style={{ marginBottom: 12, transform: 'rotate(-1deg)', display: 'inline-block' }}>Talent Pool</div>
            <h1 style={{ fontSize: 'clamp(36px, 4vw, 56px)', fontWeight: 900, lineHeight: 0.9 }}>
              BROWSE<br />
              <span style={{ background: 'var(--secondary)', border: '4px solid #000', padding: '0 14px', display: 'inline-block', boxShadow: '4px 4px 0 0 #000' }}>
                REAL BUILDERS
              </span>
            </h1>
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            <button className="btn btn-outline" onClick={() => setShowFilters(!showFilters)}>
              <Filter size={16} strokeWidth={3} /> {showFilters ? 'Hide' : 'Filters'}
            </button>
            <button className="btn btn-secondary" onClick={fetchEngineers}>Refresh</button>
          </div>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="card" style={{ padding: '28px', marginBottom: 32, background: 'var(--muted)' }}>
            <form onSubmit={handleSearch}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 16 }}>
                <div className="form-group">
                  <label className="label">Skills (press Enter)</label>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <input className="input" value={skillInput} placeholder="e.g. React"
                      onChange={e => setSkillInput(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addFilterSkill())} />
                    <button type="button" className="btn btn-primary" style={{ flexShrink: 0 }} onClick={addFilterSkill}>+</button>
                  </div>
                  {filters.skills.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
                      {filters.skills.map(s => (
                        <span key={s} className="skill-tag" style={{ cursor: 'pointer' }}
                          onClick={() => setFilters(f => ({ ...f, skills: f.skills.filter(x => x !== s) }))}>
                          {s} <X size={10} strokeWidth={3} />
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="form-group">
                  <label className="label">Location</label>
                  <input className="input" placeholder="e.g. Remote" value={filters.preferred_location}
                    onChange={e => setFilters(f => ({ ...f, preferred_location: e.target.value }))} />
                </div>

                <div className="form-group">
                  <label className="label">Job Type</label>
                  <select className="select" value={filters.job_type}
                    onChange={e => setFilters(f => ({ ...f, job_type: e.target.value }))}>
                    <option value="">Any</option>
                    <option value="full_time">Full Time</option>
                    <option value="internship">Internship</option>
                    <option value="both">Both</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="label">Min Experience (years)</label>
                  <input type="number" className="input" min={0} max={50} placeholder="0"
                    value={filters.min_experience}
                    onChange={e => setFilters(f => ({ ...f, min_experience: e.target.value }))} />
                </div>

                <div className="form-group">
                  <label className="label">Limit (results)</label>
                  <input type="number" className="input" min={1} max={50} value={filters.limit}
                    onChange={e => setFilters(f => ({ ...f, limit: Number(e.target.value) }))} />
                </div>
              </div>

              {user?.role !== 'recruiter' && (
                <div style={{ background: 'var(--secondary)', border: '3px solid #000', padding: '12px 16px', marginBottom: 16 }}>
                  <strong>⚠️ Advanced search requires a verified recruiter account.</strong>
                  <Link to="/login" style={{ marginLeft: 8, textDecoration: 'underline' }}>Log in →</Link>
                </div>
              )}

              <button type="submit" className="btn btn-primary">
                <Search size={16} strokeWidth={3} /> Search Engineers
              </button>
            </form>
          </div>
        )}

        {/* Error */}
        {error && <div className="error-msg" style={{ marginBottom: 24 }}>{error}</div>}

        {/* Results */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <div style={{ fontSize: 48, fontWeight: 900, animation: 'spin-slow 1s linear infinite', display: 'inline-block' }}>★</div>
            <p style={{ fontWeight: 700, marginTop: 12, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Loading talent...</p>
          </div>
        ) : engineers.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px', border: '4px dashed rgba(0,0,0,0.2)' }}>
            <p style={{ fontSize: 24, fontWeight: 900 }}>No engineers found</p>
            <p style={{ color: 'rgba(0,0,0,0.6)', marginTop: 8, fontWeight: 700 }}>Try adjusting your filters</p>
          </div>
        ) : (
          <>
            <div style={{ marginBottom: 20, fontWeight: 700, fontSize: 14, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(0,0,0,0.5)' }}>
              {engineers.length} engineer{engineers.length !== 1 ? 's' : ''} found
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 24 }}>
              {engineers.map(eng => <EngineerCard key={eng.id} eng={eng} />)}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
