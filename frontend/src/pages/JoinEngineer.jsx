import { Link } from 'react-router-dom';
import { ArrowRight, Globe, Star, Shield, Zap, CheckCircle } from 'lucide-react';

export default function JoinEngineer() {
  const benefits = [
    'Your GitHub is your resume — no PDF needed',
    'Get a Reality Score™ based on real commit activity',
    'Privacy-first: profile only shown to matched companies',
    'AI-native matching surfaces you to the right hirers',
    'Only vetted companies with verified identities can contact you',
  ];

  const steps = [
    { n: '01', title: 'Create Your Profile', desc: 'Sign up with your email and link your GitHub username. It takes under 2 minutes.' },
    { n: '02', title: 'Get Verified', desc: 'Our AI analyzes your GitHub activity and generates your Reality Score™.' },
    { n: '03', title: 'Get Matched', desc: 'Sit back. Companies using AI search will find you based on real skill signals.' },
    { n: '04', title: 'Accept or Decline', desc: 'You stay in control. Your profile is only revealed to companies you approve.' },
  ];

  return (
    <main>
      {/* Hero */}
      <section style={{ background: 'var(--secondary)', borderBottom: '4px solid #000', padding: '80px 0', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -30, right: '5%', width: 200, height: 200, background: 'var(--accent)', border: '4px solid #000', transform: 'rotate(20deg)', opacity: 0.4 }} />
        <div className="container" style={{ position: 'relative' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'center' }}>
            <div>
              <div className="badge badge-black" style={{ marginBottom: 20, transform: 'rotate(-2deg)', display: 'inline-block' }}>For Engineers</div>
              <h1 style={{ fontSize: 'clamp(40px, 5vw, 72px)', fontWeight: 900, lineHeight: 0.9, marginBottom: 24 }}>
                LET YOUR<br />
                <span style={{ display: 'inline-block', background: '#000', color: '#fff', padding: '0 16px', transform: 'rotate(-1deg)', boxShadow: '6px 6px 0 0 var(--accent)' }}>CODE</span><br />
                DO THE TALKING.
              </h1>
              <p style={{ fontSize: 18, fontWeight: 700, lineHeight: 1.7, marginBottom: 32, maxWidth: 460 }}>
                Stop applying to 100 jobs with keyword-stuffed resumes. Get discovered by companies that actually value what you've built.
              </p>
              <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                <Link to="/signup" className="btn btn-black btn-lg">
                  Join Free <ArrowRight size={18} strokeWidth={3} />
                </Link>
                <Link to="/talent" className="btn btn-outline btn-lg">Browse Talent Pool</Link>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {benefits.map((b, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'flex-start', gap: 14,
                  padding: '16px 20px', border: '4px solid #000', background: '#fff',
                  boxShadow: '5px 5px 0 0 #000',
                  transform: `rotate(${i % 2 === 0 ? -0.5 : 0.5}deg)`,
                }}>
                  <CheckCircle size={20} strokeWidth={3} style={{ color: 'var(--accent)', flexShrink: 0, marginTop: 2 }} />
                  <span style={{ fontWeight: 700, fontSize: 15 }}>{b}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Steps */}
      <section style={{ padding: '80px 0', background: 'var(--bg)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <div className="badge badge-accent" style={{ marginBottom: 14, display: 'inline-block', transform: 'rotate(-1deg)' }}>How It Works</div>
            <h2 style={{ fontSize: 'clamp(32px, 4vw, 56px)', fontWeight: 900, lineHeight: 0.9 }}>
              FROM SIGNUP<br />TO HIRED<br />
              <span style={{ background: 'var(--secondary)', border: '4px solid #000', padding: '0 14px', display: 'inline-block', boxShadow: '4px 4px 0 0 #000' }}>IN 4 STEPS.</span>
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 24 }}>
            {steps.map(({ n, title, desc }) => (
              <div key={n} style={{ border: '4px solid #000', padding: '28px', background: '#fff', boxShadow: '6px 6px 0 0 #000', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: -16, right: -10, fontSize: 90, fontWeight: 900, color: 'rgba(0,0,0,0.04)', lineHeight: 1 }}>{n}</div>
                <div style={{ fontWeight: 900, fontSize: 28, color: 'var(--accent)', marginBottom: 12 }}>{n}</div>
                <h3 style={{ fontSize: 20, fontWeight: 900, marginBottom: 10 }}>{title}</h3>
                <p style={{ fontSize: 14, fontWeight: 400, lineHeight: 1.7, color: 'rgba(0,0,0,0.7)' }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reality Score */}
      <section style={{ background: '#000', padding: '80px 0', borderTop: '4px solid #000' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'center' }}>
            <div>
              <div className="badge badge-secondary" style={{ marginBottom: 16 }}>Reality Score™</div>
              <h2 style={{ fontSize: 'clamp(32px, 4vw, 54px)', fontWeight: 900, color: '#fff', lineHeight: 0.9, marginBottom: 20 }}>
                YOUR CODE,<br />QUANTIFIED.
              </h2>
              <p style={{ fontSize: 16, fontWeight: 400, color: 'rgba(255,255,255,0.7)', lineHeight: 1.8, marginBottom: 28 }}>
                We don't just count GitHub stars. Our AI looks at consistency, complexity, collaboration, and code impact — the four pillars of a real engineer.
              </p>
              <Link to="/signup" className="btn btn-secondary btn-lg">
                Get My Score <Zap size={18} strokeWidth={3} />
              </Link>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              {[
                { label: 'Consistency', emoji: '📅', desc: 'Regular commits over time' },
                { label: 'Complexity', emoji: '🧠', desc: 'Architecture & system design' },
                { label: 'Collaboration', emoji: '🤝', desc: 'PRs, reviews, merges' },
                { label: 'Impact', emoji: '🚀', desc: 'Real-world project contributions' },
              ].map(({ label, emoji, desc }) => (
                <div key={label} style={{ background: 'rgba(255,255,255,0.08)', border: '3px solid rgba(255,255,255,0.2)', padding: '20px' }}>
                  <div style={{ fontSize: 28, marginBottom: 10 }}>{emoji}</div>
                  <div style={{ fontWeight: 900, color: '#fff', marginBottom: 6 }}>{label}</div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.5)', lineHeight: 1.5 }}>{desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: 'var(--accent)', borderTop: '4px solid #000', borderBottom: '4px solid #000', padding: '64px 0' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: 'clamp(36px, 4vw, 60px)', fontWeight: 900, lineHeight: 0.9, marginBottom: 20 }}>
            READY TO<br />GET FOUND?
          </h2>
          <p style={{ fontWeight: 700, fontSize: 18, marginBottom: 32 }}>Join for free. No resume required.</p>
          <Link to="/signup" className="btn btn-black btn-lg">
            Create Free Account <ArrowRight size={18} strokeWidth={3} />
          </Link>
        </div>
      </section>
    </main>
  );
}
