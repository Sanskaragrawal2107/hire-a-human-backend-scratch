import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, X, Zap } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [location.pathname]);

  const isActive = (path) => location.pathname === path ? 'nav-link active' : 'nav-link';

  const handleLogout = () => { logout(); navigate('/'); };

  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'For Engineers', path: '/join' },
    { label: 'For Companies', path: '/companies' },
    { label: 'Talent Pool', path: '/talent' },
  ];

  return (
    <>
      <nav className="navbar" style={{ boxShadow: scrolled ? '0 4px 0 0 #000' : undefined }}>
        <div className="navbar-inner">
          {/* Logo */}
          <Link to="/" style={{ textDecoration: 'none' }}>
            <div className="logo-box">
              <div className="logo-icon">
                <Zap size={18} strokeWidth={3} />
              </div>
              <div className="logo-text">HireAHuman</div>
            </div>
          </Link>

          {/* Desktop Nav */}
          <ul className="nav-links">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link to={item.path} className={isActive(item.path)}>{item.label}</Link>
              </li>
            ))}
            {user?.role === 'recruiter' && (
              <li><Link to="/chat" className={isActive('/chat')}>AI Match</Link></li>
            )}
            {user?.role === 'admin' && (
              <li><Link to="/admin" className={isActive('/admin')}>Admin Panel</Link></li>
            )}
          </ul>

          {/* Actions */}
          <div className="nav-actions">
            {!user ? (
              <>
                <Link to="/login" className="btn btn-outline btn-sm">Login</Link>
                <Link to="/signup" className="btn btn-primary btn-sm">Sign Up</Link>
              </>
            ) : (
              <>
                <span style={{ fontSize: 13, fontWeight: 700, textTransform: 'uppercase' }}>
                  {user.role === 'engineer' ? '⚡' : user.role === 'recruiter' ? '🏢' : '🔑'} {user.sub?.split('@')[0]}
                </span>
                <button onClick={handleLogout} className="btn btn-outline btn-sm">Logout</button>
              </>
            )}
          </div>

          {/* Hamburger */}
          <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
            {menuOpen ? <X size={22} strokeWidth={3} /> : <Menu size={22} strokeWidth={3} />}
          </button>
        </div>
      </nav>

      {/* Mobile overlay */}
      {menuOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 150 }} onClick={() => setMenuOpen(false)} />
      )}

      {/* Mobile menu */}
      <div className={`mobile-menu ${menuOpen ? 'open' : ''}`} style={{ width: '280px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <div style={{ fontWeight: 900, fontSize: 18, textTransform: 'uppercase' }}>Menu</div>
          <button onClick={() => setMenuOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
            <X size={24} strokeWidth={3} />
          </button>
        </div>
        <div style={{ height: 4, background: '#000', marginBottom: 16 }} />
        {navItems.map((item) => (
          <Link key={item.path} to={item.path} className="btn btn-outline btn-full" style={{ justifyContent: 'flex-start' }}>
            {item.label}
          </Link>
        ))}
        {user?.role === 'recruiter' && (
          <Link to="/chat" className="btn btn-secondary btn-full" style={{ justifyContent: 'flex-start' }}>AI Match</Link>
        )}
        {user?.role === 'admin' && (
          <Link to="/admin" className="btn btn-black btn-full" style={{ justifyContent: 'flex-start' }}>Admin Panel</Link>
        )}
        <div style={{ marginTop: 'auto' }}>
          {!user ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <Link to="/login" className="btn btn-outline btn-full">Login</Link>
              <Link to="/signup" className="btn btn-primary btn-full">Sign Up Free</Link>
            </div>
          ) : (
            <button onClick={handleLogout} className="btn btn-outline btn-full">Logout</button>
          )}
        </div>
      </div>
    </>
  );
}
