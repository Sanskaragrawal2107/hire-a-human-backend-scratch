import { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // { role, id, sub, ... }
  const [token, setToken] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem('hah_token');
    if (stored) {
      try {
        const decoded = jwtDecode(stored);
        setToken(stored);
        setUser(decoded);
      } catch {
        localStorage.removeItem('hah_token');
      }
    }
  }, []);

  const login = (accessToken) => {
    localStorage.setItem('hah_token', accessToken);
    const decoded = jwtDecode(accessToken);
    setToken(accessToken);
    setUser(decoded);
  };

  const logout = () => {
    localStorage.removeItem('hah_token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
