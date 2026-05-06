import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import JoinEngineer from './pages/JoinEngineer';
import Companies from './pages/Companies';
import Talent from './pages/Talent';
import Chat from './pages/Chat';
import Admin from './pages/Admin';

// Protected route wrapper
function RequireAuth({ children, role }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) return <Navigate to="/" replace />;
  return children;
}

// Layout wrapper (Navbar + Footer on most pages)
function Layout({ children, fullHeight = false }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <div style={{ flex: 1 }}>{children}</div>
      {!fullHeight && <Footer />}
    </div>
  );
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Layout><Home /></Layout>} />
      <Route path="/join" element={<Layout><JoinEngineer /></Layout>} />
      <Route path="/companies" element={<Layout><Companies /></Layout>} />
      <Route path="/talent" element={<Layout><Talent /></Layout>} />
      <Route path="/login" element={<Layout><Login /></Layout>} />
      <Route path="/signup" element={<Layout><Signup /></Layout>} />
      <Route path="/chat" element={
        <RequireAuth role="recruiter">
          <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
            <Navbar />
            <div style={{ flex: 1, overflow: 'hidden' }}><Chat /></div>
          </div>
        </RequireAuth>
      } />
      <Route path="/admin" element={
        <RequireAuth role="admin">
          <Layout><Admin /></Layout>
        </RequireAuth>
      } />
      <Route path="*" element={
        <Layout>
          <div style={{ textAlign: 'center', padding: '120px 24px' }}>
            <h1 style={{ fontSize: 120, fontWeight: 900, lineHeight: 1 }}>404</h1>
            <p style={{ fontWeight: 700, fontSize: 24, marginTop: 16 }}>Page not found</p>
            <a href="/" className="btn btn-primary btn-lg" style={{ display: 'inline-flex', marginTop: 32 }}>← Go Home</a>
          </div>
        </Layout>
      } />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
