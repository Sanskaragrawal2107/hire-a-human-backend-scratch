import { Link } from 'react-router-dom';
import { ArrowRight, Shield, Brain, Search, Star, CheckCircle } from 'lucide-react';

export default function Companies() {
  return (
    <main>
      {/* Hero */}
      <section style={{ background: 'var(--muted)', borderBottom: '4px solid #000', padding: '80px 0', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -40, left: '5%', width: 220, height: 220, background: 'var(--secondary)', border: '4px solid #000', transform: 'rotate(-15deg)', opacity: 0.5 }} />
        <div style={{ position: 'absolute', bottom: -30, right: '8%', width: 140, height: 140, background: 'var(--accent)', border: '4px solid #000', transform: 'rotate(20deg)', opacity: 0.5 }} />
        <div className="container" style={{ position: 'relative' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'center' }}>
            <div>
              <div className="badge badge-accent" style={{ marginBottom: 20, display: 'inline-block', transform: 'rotate(2deg)' }}>For Companies</div>
              <h1 style={{ fontSize: 'clamp(40px, 5vw, 72px)', fontWeight: 900, lineHeight: 0.9, marginBottom: 24 }}>
                STOP HIRING<br />
                <span style={{ display: 'inline-block', background: 'var(--accent)', border: '4px solid #000', padding: '0 16px', boxShadow: '6px 6px 0 0 #000', transform: 'rotate(-1deg)' }}>PAPER TIGERS.</span><br />
                START HIRING BUILDERS.
              </h1>
              <p style={{ fontSize: 18, fontWeight: 700, lineHeight: 1.7, marginBottom: 32, maxWidth: 480 }}>
                Our platform eliminates resume noise. Every engineer on our platform has been verified through real GitHub activity — not keyword-stuffed PDFs.
              </p>
              <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                <Link to="/signup" className="btn btn-primary btn-lg">
                  Start Hiring <ArrowRight size={18} strokeWidth={3} />
                </Link>
                <Link to="/chat" className="btn btn-outline btn-lg">Try AI Search</Link>
              </div>
            </div>

            {/* Checklist */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0, border: '4px solid #000', boxShadow: '8px 8px 0 0 #000', background: '#fff', transform: 'rotate(1deg)' }}>
              <div style={{ padding: '20px', background: '#000', color: '#fff', fontWeight: 900, fontSize: 15, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                Why HireAHuman?
              </div>
              {[
                'Zero fake resumes in our pool',
                'GitHub-verified skill signals',
                'AI natural language search',
                'Admin-verified company accounts',
                'Refundable deposit for trust',
                'Private, matched connections only',
              ].map((item, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: 14,
                  padding: '18px 20px',
                  borderTop: '2px solid #000',
                  background: i % 2 === 0 ? '#fff' : 'rgba(0,0,0,0.02)',
                }}>
                  <CheckCircle size={18} strokeWidth={3} color="var(--accent)" style={{ flexShrink: 0 }} />
                  <span style={{ fontWeight: 700, fontSize: 15 }}>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section style={{ padding: '80px 0', background: 'var(--bg)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <h2 style={{ fontSize: 'clamp(32px, 4vw, 56px)', fontWeight: 900, lineHeight: 0.9, marginBottom: 12 }}>
              HIRE SMARTER<br />
              <span style={{ background: 'var(--secondary)', border: '4px solid #000', padding: '0 14px', display: 'inline-block', boxShadow: '4px 4px 0 0 #000' }}>IN 3 STEPS.</span>
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
            {[
              { n: '01', Icon: Shield, title: 'Verify Your Company', desc: 'Submit GSTIN and company info. Our admins verify your identity before you access the talent pool.', bg: 'var(--accent)' },
              { n: '02', Icon: Brain, title: 'Use AI Search', desc: 'Query our engineer database in plain English: "Rust experience with recent commits and remote preference."', bg: 'var(--secondary)' },
              { n: '03', Icon: Search, title: 'Match & Connect', desc: 'Get matched with verified engineers who fit your criteria — skills, experience, location, and job type.', bg: 'var(--muted)' },
            ].map(({ n, Icon, title, desc, bg }) => (
              <div key={n} style={{ border: '4px solid #000', padding: '32px', background: '#fff', boxShadow: '6px 6px 0 0 #000', position: 'relative' }}>
                <div style={{ position: 'absolute', top: -16, right: 20, fontWeight: 900, fontSize: 80, color: 'rgba(0,0,0,0.04)', lineHeight: 1 }}>{n}</div>
                <div style={{ width: 52, height: 52, border: '4px solid #000', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20, boxShadow: '3px 3px 0 0 #000' }}>
                  <Icon size={24} strokeWidth={3} />
                </div>
                <div style={{ fontWeight: 900, color: 'rgba(0,0,0,0.4)', fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>Step {n}</div>
                <h3 style={{ fontSize: 22, fontWeight: 900, marginBottom: 12 }}>{title}</h3>
                <p style={{ fontSize: 14, fontWeight: 400, lineHeight: 1.7, color: 'rgba(0,0,0,0.7)' }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MCP section */}
      <section style={{ background: '#000', padding: '80px 0', borderTop: '4px solid #000' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'center' }}>
            <div>
              <div className="badge badge-muted" style={{ marginBottom: 16 }}>AI-Native Hiring</div>
              <h2 style={{ fontSize: 'clamp(32px, 3.5vw, 52px)', fontWeight: 900, color: '#fff', lineHeight: 0.9, marginBottom: 20 }}>
                HIRE WITH<br />
                <span style={{ color: 'var(--accent)' }}>NATURAL</span><br />
                LANGUAGE.
              </h2>
              <p style={{ fontSize: 16, fontWeight: 400, color: 'rgba(255,255,255,0.7)', lineHeight: 1.8, marginBottom: 24 }}>
                We use the <strong style={{ color: '#fff' }}>Model Context Protocol (MCP)</strong> to connect AI agents directly to our database. Recruiters can query in natural language:
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 28 }}>
                {[
                  '"Rust experience with recent commits"',
                  '"React + Node.js, open to full-time, Bangalore"',
                  '"Senior backend engineer, 5+ years, remote only"',
                ].map(q => (
                  <div key={q} style={{ padding: '12px 16px', border: '3px solid rgba(255,255,255,0.2)', fontStyle: 'italic', fontWeight: 700, color: 'var(--secondary)', fontSize: 14 }}>
                    {q}
                  </div>
                ))}
              </div>
              <Link to="/chat" className="btn btn-secondary btn-lg">
                Try AI Search <Brain size={18} strokeWidth={3} />
              </Link>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {[
                { title: 'Vector Similarity', desc: 'Beyond keyword matching — skill vectors that understand semantic context.' },
                { title: 'Bluff Detection', desc: 'We identify if code is forked or genuinely built by the engineer.' },
                { title: 'Consistency Analysis', desc: 'See if the engineer codes daily, weekly, or only when job-hunting.' },
              ].map(({ title, desc }) => (
                <div key={title} style={{ background: 'rgba(255,255,255,0.07)', border: '3px solid rgba(255,255,255,0.15)', padding: '20px 24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                    <Star size={16} strokeWidth={3} fill="var(--secondary)" color="var(--secondary)" />
                    <span style={{ fontWeight: 900, color: '#fff' }}>{title}</span>
                  </div>
                  <p style={{ fontSize: 14, fontWeight: 400, color: 'rgba(255,255,255,0.6)', lineHeight: 1.7 }}>{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: 'var(--secondary)', borderTop: '4px solid #000', padding: '64px 0' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: 'clamp(36px, 4vw, 60px)', fontWeight: 900, lineHeight: 0.9, marginBottom: 20 }}>
            READY TO FIND<br />
            <span style={{ background: 'var(--accent)', border: '4px solid #000', padding: '0 16px', display: 'inline-block', boxShadow: '5px 5px 0 0 #000', transform: 'rotate(-1deg)' }}>REAL TALENT?</span>
          </h2>
          <p style={{ fontWeight: 700, fontSize: 18, marginBottom: 32 }}>Register your company. Get verified. Start hiring builders.</p>
          <Link to="/signup" className="btn btn-black btn-lg">
            Register Company <ArrowRight size={18} strokeWidth={3} />
          </Link>
        </div>
      </section>
    </main>
  );
}
