import { Link } from 'react-router-dom';
import { ArrowRight, Globe, Star, Shield, Zap, Brain, Lock, Search, ChevronRight } from 'lucide-react';

/* ─── Marquee Band ──────────────────────────────────────────────────────── */
function MarqueeBand() {
  const items = ['HIRE REAL BUILDERS', 'CODE DOESN\'T LIE', 'GITHUB IS YOUR CV', 'VERIFY BEFORE YOU HIRE', 'AI-NATIVE HIRING', 'REALITY SCORE™', 'PROOF OF WORK', 'NO RESUME SPAM'];
  return (
    <div className="marquee-track" style={{ padding: '0' }}>
      <div className="marquee-inner">
        {[...items, ...items].map((item, i) => (
          <span key={i} style={{
            padding: '12px 36px',
            fontSize: 13,
            fontWeight: 900,
            textTransform: 'uppercase',
            letterSpacing: '0.12em',
            borderRight: '4px solid #000',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 14,
            flexShrink: 0,
          }}>
            <Star size={14} strokeWidth={3} fill="#000" /> {item}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ─── Feature Card ──────────────────────────────────────────────────────── */
function FeatureCard({ icon: Icon, title, desc, bg = '#fff', rotate = 0 }) {
  return (
    <div className="card" style={{
      padding: '32px 28px',
      transform: `rotate(${rotate}deg)`,
      background: bg,
    }}>
      <div style={{
        width: 56, height: 56,
        border: '4px solid #000',
        background: 'var(--accent)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: 20,
        boxShadow: '4px 4px 0 0 #000',
      }}>
        <Icon size={26} strokeWidth={3} />
      </div>
      <h3 style={{ fontSize: 20, fontWeight: 900, marginBottom: 12 }}>{title}</h3>
      <p style={{ fontSize: 15, fontWeight: 400, lineHeight: 1.7, color: 'rgba(0,0,0,0.7)' }}>{desc}</p>
    </div>
  );
}

/* ─── Stat ──────────────────────────────────────────────────────────────── */
function Stat({ num, label, bg }) {
  return (
    <div style={{ padding: '32px', border: '4px solid #000', background: bg, boxShadow: '6px 6px 0 0 #000', textAlign: 'center' }}>
      <div style={{ fontSize: 52, fontWeight: 900, lineHeight: 1 }}>{num}</div>
      <div style={{ fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', marginTop: 8 }}>{label}</div>
    </div>
  );
}

export default function Home() {
  return (
    <main>
      {/* ── Hero ────────────────────────────────────────────────────────── */}
      <section style={{ background: 'var(--bg)', position: 'relative', overflow: 'hidden' }} className="pattern-grid">
        {/* Decorative shapes */}
        <div style={{ position: 'absolute', top: 40, right: '5%', width: 180, height: 180, background: 'var(--muted)', border: '4px solid #000', transform: 'rotate(12deg)', zIndex: 0 }} />
        <div style={{ position: 'absolute', bottom: 60, right: '15%', width: 100, height: 100, background: 'var(--secondary)', border: '4px solid #000', transform: 'rotate(-8deg)', zIndex: 0 }} />
        <div style={{ position: 'absolute', top: 120, right: '25%', width: 60, height: 60, background: 'var(--accent)', border: '4px solid #000', transform: 'rotate(45deg)', zIndex: 0 }} />

        <div className="container" style={{ padding: '80px 24px 100px', position: 'relative', zIndex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', alignItems: 'center', gap: 60 }}>
          <div>
            {/* Label */}
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 28 }}>
              <span className="badge badge-accent" style={{ transform: 'rotate(-2deg)' }}>
                <Zap size={11} strokeWidth={3} style={{ marginRight: 5 }} /> New in 2026
              </span>
              <span className="badge badge-secondary">AI-Native Hiring</span>
            </div>

            {/* Headline */}
            <h1 style={{ fontSize: 'clamp(44px, 6vw, 80px)', fontWeight: 900, lineHeight: 0.92, letterSpacing: '-0.03em', marginBottom: 32 }}>
              <span style={{ display: 'block' }}>THE DAY</span>
              <span style={{ display: 'block', color: 'var(--accent)', WebkitTextStroke: '0px', textDecoration: 'none' }}>AI STARTED</span>
              <span style={{ display: 'block' }}>HIRING</span>
              <span style={{
                display: 'inline-block',
                background: 'var(--secondary)',
                border: '4px solid #000',
                padding: '0 16px',
                transform: 'rotate(-1deg)',
                boxShadow: '6px 6px 0 0 #000',
              }}>HUMANS.</span>
            </h1>

            <p style={{ fontSize: 18, fontWeight: 700, lineHeight: 1.7, color: 'rgba(0,0,0,0.7)', marginBottom: 36, maxWidth: 480 }}>
              You used to apply for jobs. Now <strong>jobs find you.</strong> We verify engineers based on real GitHub activity — not keyword-stuffed PDFs.
            </p>

            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              <Link to="/join" className="btn btn-primary btn-lg">
                Join as Engineer <ArrowRight size={18} strokeWidth={3} />
              </Link>
              <Link to="/companies" className="btn btn-outline btn-lg">
                Hire Real Builders
              </Link>
            </div>

            {/* Social proof */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginTop: 36, paddingTop: 28, borderTop: '3px solid #000' }}>
              <div style={{ display: 'flex' }}>
                {['#FF6B6B','#FFD93D','#C4B5FD','#000','#FF6B6B'].map((c, i) => (
                  <div key={i} style={{
                    width: 36, height: 36,
                    borderRadius: '50%',
                    border: '3px solid #000',
                    background: c,
                    marginLeft: i === 0 ? 0 : -10,
                    zIndex: 5 - i,
                    position: 'relative',
                  }} />
                ))}
              </div>
              <div>
                <div style={{ fontWeight: 900, fontSize: 15 }}>500+ Engineers Verified</div>
                <div style={{ fontWeight: 700, fontSize: 12, color: 'rgba(0,0,0,0.6)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>and counting ★★★★★</div>
              </div>
            </div>
          </div>

          {/* Right: Visual block */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, position: 'relative' }}>
            {/* Main card */}
            <div className="card" style={{ padding: 24, transform: 'rotate(1deg)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Globe size={20} strokeWidth={2.5} />
                  <span style={{ fontWeight: 900 }}>github/sanskar_dev</span>
                </div>
                <span className="badge badge-accent">Verified ✓</span>
              </div>
              <div style={{ fontWeight: 900, fontSize: 36, marginBottom: 4, color: 'var(--accent)' }}>94</div>
              <div style={{ fontWeight: 700, fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 16 }}>Reality Score™</div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {['React', 'Python', 'FastAPI', 'PostgreSQL', 'Docker'].map(s => (
                  <span key={s} className="skill-tag">{s}</span>
                ))}
              </div>
              <div style={{ marginTop: 16, height: 8, background: '#000', borderRadius: 0 }}>
                <div style={{ height: '100%', width: '94%', background: 'var(--accent)', transition: 'width 0.3s' }} />
              </div>
            </div>

            {/* Floating badge */}
            <div style={{
              position: 'absolute', top: -20, right: -20,
              background: 'var(--secondary)',
              border: '4px solid #000',
              padding: '12px 18px',
              transform: 'rotate(8deg)',
              boxShadow: '5px 5px 0 0 #000',
              fontWeight: 900,
              fontSize: 12,
              textTransform: 'uppercase',
              zIndex: 10,
            }}>
              🚫 No Resumes
            </div>

            {/* Stats row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div style={{ background: 'var(--muted)', border: '4px solid #000', padding: '16px', boxShadow: '4px 4px 0 0 #000', transform: 'rotate(-1deg)' }}>
                <div style={{ fontWeight: 900, fontSize: 28 }}>400+</div>
                <div style={{ fontWeight: 700, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Apps per job post</div>
              </div>
              <div style={{ background: 'var(--accent)', border: '4px solid #000', padding: '16px', boxShadow: '4px 4px 0 0 #000', transform: 'rotate(1deg)' }}>
                <div style={{ fontWeight: 900, fontSize: 28 }}>85%</div>
                <div style={{ fontWeight: 700, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em' }}>AI spam eliminated</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Marquee ──────────────────────────────────────────────────────── */}
      <MarqueeBand />

      {/* ── Problem Section ──────────────────────────────────────────────── */}
      <section style={{ background: '#000', padding: '80px 0', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.03 }} className="pattern-dots" />
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'center' }}>
            <div>
              <div className="badge badge-accent" style={{ marginBottom: 20 }}>The Problem</div>
              <h2 style={{ fontSize: 'clamp(36px, 4vw, 60px)', fontWeight: 900, color: '#fff', lineHeight: 0.95, marginBottom: 24 }}>
                RESUME SPAM<br />
                <span style={{ color: 'var(--accent)' }}>IS A DDoS</span><br />
                ATTACK.
              </h2>
              <p style={{ fontSize: 16, fontWeight: 400, color: 'rgba(255,255,255,0.75)', lineHeight: 1.8, marginBottom: 24 }}>
                In 2026, a single job posting for a "Junior React Developer" receives over <strong style={{ color: '#fff' }}>400 applications</strong>. 85% of them are unqualified spam generated by AI tools.
              </p>
              <p style={{ fontSize: 16, fontWeight: 400, color: 'rgba(255,255,255,0.75)', lineHeight: 1.8 }}>
                Traditional hiring is broken. Resumes are marketing documents that often exaggerate skills. <strong style={{ color: 'var(--secondary)' }}>GitHub, however, is a ledger of truth. Code doesn't lie.</strong>
              </p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {[
                { num: '400+', label: 'Applications per posting', color: 'var(--accent)' },
                { num: '85%', label: 'AI-generated spam resumes', color: 'var(--secondary)' },
                { num: '0', label: 'Context from a PDF resume', color: 'var(--muted)' },
              ].map(({ num, label, color }) => (
                <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 20, padding: '20px 24px', border: '4px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.05)' }}>
                  <div style={{ fontSize: 42, fontWeight: 900, color, minWidth: 100 }}>{num}</div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: '#fff' }}>{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Solution Section ─────────────────────────────────────────────── */}
      <section style={{ background: 'var(--secondary)', padding: '80px 0', borderTop: '4px solid #000', borderBottom: '4px solid #000' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <div className="badge badge-black" style={{ marginBottom: 16, transform: 'rotate(-1deg)', display: 'inline-block' }}>The Solution</div>
            <h2 style={{ fontSize: 'clamp(36px, 4vw, 64px)', fontWeight: 900, lineHeight: 0.95, marginBottom: 16 }}>
              PROOF OF WORK<br />
              <span style={{ color: 'var(--accent)', display: 'inline-block', transform: 'rotate(-1deg)' }}>VIA GITHUB</span>
            </h2>
            <p style={{ fontSize: 18, fontWeight: 700, maxWidth: 560, margin: '0 auto', lineHeight: 1.7 }}>
              We verify engineers based on their actual GitHub activity — commit logs, pull request history, contribution graphs, and real project complexity.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 24 }}>
            {[
              { step: '01', title: 'Connect GitHub', desc: 'Link your GitHub profile. No resume needed — your code speaks for itself.' },
              { step: '02', title: 'Get Scored', desc: 'Our AI analyzes consistency, complexity, collaboration, and impact to generate your Reality Score™.' },
              { step: '03', title: 'Get Matched', desc: 'AI matches your skills with verified companies using vector-based matching.' },
              { step: '04', title: 'Get Hired', desc: 'Connect with companies that have proven their legitimacy through our verification process.' },
            ].map(({ step, title, desc }) => (
              <div key={step} style={{ background: '#fff', border: '4px solid #000', padding: '28px', boxShadow: '6px 6px 0 0 #000', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: -10, right: -10, fontSize: 80, fontWeight: 900, color: 'rgba(0,0,0,0.05)', lineHeight: 1 }}>{step}</div>
                <div style={{ fontWeight: 900, fontSize: 14, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--accent)', marginBottom: 12 }}>Step {step}</div>
                <h3 style={{ fontSize: 22, fontWeight: 900, marginBottom: 12 }}>{title}</h3>
                <p style={{ fontSize: 14, fontWeight: 400, lineHeight: 1.7, color: 'rgba(0,0,0,0.7)' }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ────────────────────────────────────────────────────── */}
      <section style={{ padding: '80px 0', background: 'var(--bg)' }}>
        <div className="container">
          <div style={{ display: 'grid', alignItems: 'start', gap: 60, gridTemplateColumns: '1fr 2fr' }}>
            <div>
              <div className="badge badge-muted" style={{ marginBottom: 16, transform: 'rotate(1deg)', display: 'inline-block' }}>KEY FEATURES</div>
              <h2 style={{ fontSize: 'clamp(36px, 3.5vw, 56px)', fontWeight: 900, lineHeight: 0.95, marginBottom: 20 }}>
                BUILT FOR<br />REAL<br />BUILDERS.
              </h2>
              <p style={{ fontSize: 16, fontWeight: 400, lineHeight: 1.7, color: 'rgba(0,0,0,0.7)', marginBottom: 28 }}>
                Every feature is designed to eliminate friction and reward engineers who actually write code.
              </p>
              <Link to="/join" className="btn btn-primary">
                Get Verified <ArrowRight size={16} strokeWidth={3} />
              </Link>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
              <FeatureCard
                icon={Globe}
                title="Source Code Verification"
                desc="Deep analysis of GitHub repositories — not just stars and forks, but real commit quality and architecture."
                rotate={-1}
              />
              <FeatureCard
                icon={Shield}
                title="Bluff Detection"
                desc="Identify if code is just a forked repo with no contribution or real engineering work."
                bg="var(--muted)"
                rotate={1}
              />
              <FeatureCard
                icon={Brain}
                title="AI Matching via MCP"
                desc="Recruiters query with natural language: 'Rust experience with recent commits.' Our AI handles the rest."
                bg="var(--secondary)"
                rotate={1}
              />
              <FeatureCard
                icon={Lock}
                title="Privacy First"
                desc="Your profile is locked and only shown to matched employers. You stay in control."
                rotate={-1}
              />
              <FeatureCard
                icon={Search}
                title="Vector Search"
                desc="Beyond simple keyword matching — skill vectors that understand context and relevance."
                bg="var(--accent)"
                rotate={-1}
              />
              <FeatureCard
                icon={Zap}
                title="Verified Companies"
                desc="Employers verify their business and pay a refundable deposit — only legitimate hirers enter."
                rotate={1}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── Reality Score Section ────────────────────────────────────────── */}
      <section style={{ background: 'var(--muted)', borderTop: '4px solid #000', borderBottom: '4px solid #000', padding: '80px 0' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'center' }}>
            {/* Score visual */}
            <div style={{ position: 'relative' }}>
              <div style={{ background: '#fff', border: '4px solid #000', padding: '40px', boxShadow: '10px 10px 0 0 #000', transform: 'rotate(-1deg)' }}>
                <div style={{ fontWeight: 900, fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 24, color: 'rgba(0,0,0,0.5)' }}>Reality Score™ Breakdown</div>
                {[
                  { label: 'Consistency', value: 88, color: 'var(--accent)' },
                  { label: 'Complexity', value: 91, color: 'var(--secondary)' },
                  { label: 'Collaboration', value: 76, color: 'var(--muted)' },
                  { label: 'Impact', value: 94, color: '#000' },
                ].map(({ label, value, color }) => (
                  <div key={label} style={{ marginBottom: 20 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                      <span style={{ fontWeight: 900, fontSize: 14 }}>{label}</span>
                      <span style={{ fontWeight: 900, fontSize: 14, color }}>{value}</span>
                    </div>
                    <div style={{ height: 12, background: 'rgba(0,0,0,0.1)', border: '2px solid #000' }}>
                      <div style={{ height: '100%', width: `${value}%`, background: color, transition: 'width 0.3s' }} />
                    </div>
                  </div>
                ))}
                <div style={{ marginTop: 28, paddingTop: 20, borderTop: '4px solid #000', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 900, fontSize: 18 }}>Overall Reality Score</span>
                  <span style={{ fontWeight: 900, fontSize: 48, color: 'var(--accent)' }}>87</span>
                </div>
              </div>
              {/* Floating badge */}
              <div style={{ position: 'absolute', top: -20, right: -20, background: 'var(--accent)', border: '4px solid #000', padding: '10px 16px', transform: 'rotate(10deg)', boxShadow: '4px 4px 0 0 #000', fontWeight: 900, fontSize: 12 }}>
                AI Powered ⚡
              </div>
            </div>

            <div>
              <div className="badge badge-black" style={{ marginBottom: 16 }}>How It Works</div>
              <h2 style={{ fontSize: 'clamp(32px, 3.5vw, 54px)', fontWeight: 900, lineHeight: 0.95, marginBottom: 24 }}>
                YOUR REALITY<br />
                <span style={{ display: 'inline-block', background: 'var(--accent)', border: '4px solid #000', padding: '0 14px', boxShadow: '4px 4px 0 0 #000' }}>SCORE™</span>
              </h2>
              <p style={{ fontSize: 16, fontWeight: 400, lineHeight: 1.8, color: 'rgba(0,0,0,0.8)', marginBottom: 24 }}>
                Our AI analyzes your public GitHub profile to calculate a "Reality Score". This score evaluates:
              </p>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 32 }}>
                {[
                  ['Consistency', 'Do you code every week?'],
                  ['Complexity', 'Are you architecting systems?'],
                  ['Collaboration', 'Do you merge PRs?'],
                  ['Impact', 'Does your work matter?'],
                ].map(([key, val]) => (
                  <li key={key} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                    <span style={{ width: 24, height: 24, background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}>
                      <ChevronRight size={14} strokeWidth={3} color="#fff" />
                    </span>
                    <div>
                      <strong>{key}</strong> — {val}
                    </div>
                  </li>
                ))}
              </ul>
              <Link to="/join" className="btn btn-black">
                Calculate My Score <ArrowRight size={16} strokeWidth={3} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats ──────────────────────────────────────────────────────── */}
      <section style={{ background: 'var(--bg)', padding: '64px 0', borderBottom: '4px solid #000' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20 }}>
            <Stat num="500+" label="Engineers Verified" bg="var(--accent)" />
            <Stat num="50+" label="Companies Onboarded" bg="var(--secondary)" />
            <Stat num="94%" label="Match Accuracy" bg="var(--muted)" />
            <Stat num="0" label="Resume Required" bg="#000" />
          </div>
        </div>
      </section>

      {/* ── CTA ────────────────────────────────────────────────────────── */}
      <section style={{ background: '#000', padding: '80px 0', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.04 }} className="pattern-dots" />
        <div className="container" style={{ position: 'relative' }}>
          <div style={{ maxWidth: 700, margin: '0 auto', textAlign: 'center' }}>
            <h2 style={{ fontSize: 'clamp(40px, 5vw, 72px)', fontWeight: 900, color: '#fff', lineHeight: 0.9, marginBottom: 28 }}>
              STOP APPLYING.<br />
              <span style={{ color: 'var(--accent)' }}>START</span><br />
              <span style={{
                display: 'inline-block',
                background: 'var(--secondary)',
                border: '4px solid #fff',
                color: '#000',
                padding: '0 20px',
                transform: 'rotate(-1deg)',
                boxShadow: '6px 6px 0 0 rgba(255,255,255,0.3)',
              }}>GETTING FOUND.</span>
            </h2>
            <p style={{ fontSize: 18, fontWeight: 700, color: 'rgba(255,255,255,0.7)', marginBottom: 40, lineHeight: 1.7 }}>
              Join thousands of engineers who let their code do the talking.
            </p>
            <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/join" className="btn btn-primary btn-lg">
                Join as Engineer <ArrowRight size={18} strokeWidth={3} />
              </Link>
              <Link to="/companies" className="btn" style={{ background: 'transparent', border: '4px solid rgba(255,255,255,0.4)', color: '#fff', fontSize: 16, padding: '16px 40px' }}>
                Hire Engineers
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
