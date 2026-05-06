import { Globe, Share2, X as XIcon, AtSign, MessageCircle, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer>
      {/* Marquee band */}
      <div className="marquee-track">
        {'HIRE REAL BUILDERS ★ CODE DOESN\'T LIE ★ GITHUB IS YOUR CV ★ VERIFY BEFORE YOU HIRE ★ AI-NATIVE HIRING ★ '.repeat(6).split('').join('').split('★').join(' ★ ').split('  ').join(' ').repeat(2).split('').slice(0, 300).join('').split('').join('')}
        {[...Array(2)].map((_, i) => (
          <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 0 }}>
            {['HIRE REAL BUILDERS', 'CODE DOESN\'T LIE', 'GITHUB IS YOUR CV', 'VERIFY BEFORE YOU HIRE', 'AI-NATIVE HIRING', 'REALITY SCORE™', 'PROOF OF WORK'].map((txt) => (
              <span key={txt} style={{
                padding: '14px 32px',
                fontSize: 13,
                fontWeight: 900,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                borderRight: '4px solid #000',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 12,
              }}>
                ★ {txt}
              </span>
            ))}
          </span>
        ))}
      </div>

      {/* Main footer */}
      <div style={{ background: '#000', color: '#fff', borderTop: '4px solid #000' }}>
        <div className="container" style={{ padding: '64px 24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 48 }}>
            {/* Brand */}
            <div style={{ gridColumn: 'span 1' }}>
              <div className="logo-box" style={{ borderColor: '#fff', marginBottom: 20, width: 'fit-content' }}>
                <div className="logo-icon" style={{ borderColor: '#fff' }}>
                  <Zap size={16} strokeWidth={3} />
                </div>
                <div className="logo-text" style={{ background: '#000', color: '#fff' }}>HireAHuman</div>
              </div>
              <p style={{ fontSize: 14, fontWeight: 400, color: 'rgba(255,255,255,0.7)', lineHeight: 1.7, marginBottom: 20 }}>
                The platform that makes GitHub your new CV. Verified engineers, real builders.
              </p>
              {/* Social */}
              <div style={{ display: 'flex', gap: 10 }}>
                {[
                  { Icon: XIcon, href: 'https://twitter.com/hireahuman', label: 'X / Twitter' },
                  { Icon: MessageCircle, href: 'https://linkedin.com/company/hireahuman', label: 'LinkedIn' },
                  { Icon: Share2, href: 'https://youtube.com/@hireahuman', label: 'YouTube' },
                  { Icon: AtSign, href: 'https://instagram.com/hireahuman', label: 'Instagram' },
                ].map(({ Icon, href, label }) => (
                  <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                    aria-label={label}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      width: 40, height: 40,
                      border: '3px solid rgba(255,255,255,0.3)',
                      color: '#fff',
                      transition: 'all 0.15s',
                    }}
                    onMouseOver={e => { e.currentTarget.style.borderColor = '#FFD93D'; e.currentTarget.style.background = '#FFD93D'; e.currentTarget.style.color = '#000'; }}
                    onMouseOut={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)'; e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#fff'; }}
                  >
                    <Icon size={16} strokeWidth={2.5} />
                  </a>
                ))}
              </div>
            </div>

            {/* Links */}
            <div>
              <div style={{ fontWeight: 900, fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#FF6B6B', marginBottom: 20, borderBottom: '2px solid rgba(255,255,255,0.1)', paddingBottom: 10 }}>Platform</div>
              {[
                { label: 'For Engineers', to: '/join' },
                { label: 'For Companies', to: '/companies' },
                { label: 'AI Talent Match', to: '/chat' },
                { label: 'Browse Talent', to: '/talent' },
              ].map((l) => (
                <Link key={l.label} to={l.to} style={{ display: 'block', marginBottom: 12, fontSize: 14, fontWeight: 700, color: 'rgba(255,255,255,0.7)', transition: 'color 0.1s' }}
                  onMouseOver={e => e.currentTarget.style.color = '#FFD93D'}
                  onMouseOut={e => e.currentTarget.style.color = 'rgba(255,255,255,0.7)'}
                >
                  → {l.label}
                </Link>
              ))}
            </div>

            <div>
              <div style={{ fontWeight: 900, fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#C4B5FD', marginBottom: 20, borderBottom: '2px solid rgba(255,255,255,0.1)', paddingBottom: 10 }}>Company</div>
              {[
                { label: 'About', to: '/' },
                { label: 'Blog / Insights', to: '/blog' },
                { label: 'Docs', to: '/docs' },
                { label: 'Privacy Policy', to: '/' },
              ].map((l) => (
                <Link key={l.label} to={l.to} style={{ display: 'block', marginBottom: 12, fontSize: 14, fontWeight: 700, color: 'rgba(255,255,255,0.7)', transition: 'color 0.1s' }}
                  onMouseOver={e => e.currentTarget.style.color = '#C4B5FD'}
                  onMouseOut={e => e.currentTarget.style.color = 'rgba(255,255,255,0.7)'}
                >
                  → {l.label}
                </Link>
              ))}
            </div>

            {/* Contact */}
            <div>
              <div style={{ fontWeight: 900, fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#FFD93D', marginBottom: 20, borderBottom: '2px solid rgba(255,255,255,0.1)', paddingBottom: 10 }}>Contact</div>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', lineHeight: 1.7 }}>
                36 Tilak Path, Gulab Bhawan<br />Flat No. 104, Indore MP
              </p>
              <a href="mailto:sanskar21072005@gmail.com" style={{ display: 'block', marginTop: 12, fontSize: 13, color: '#FF6B6B', fontWeight: 700 }}>
                sanskar21072005@gmail.com
              </a>
              <a href="tel:+919406820661" style={{ display: 'block', marginTop: 6, fontSize: 13, color: '#FFD93D', fontWeight: 700 }}>
                +91 9406820661
              </a>
            </div>
          </div>

          {/* Bottom bar */}
          <div style={{ marginTop: 48, paddingTop: 24, borderTop: '2px solid rgba(255,255,255,0.1)', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', fontWeight: 700 }}>
              © 2026 HireAHuman Inc. · Built by Sanskar Agrawal
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Powered by</span>
              <span style={{ padding: '3px 10px', border: '2px solid rgba(255,255,255,0.3)', fontSize: 11, fontWeight: 900, color: '#C4B5FD', textTransform: 'uppercase', letterSpacing: '0.1em' }}>FastAPI + AI</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
