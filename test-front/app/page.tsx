// app/page.tsx
'use client'

import { authApi, IUser } from "@/api/auth.api";
import { useEffect, useState } from "react";

export default function Home() {
  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Проверяем callback параметры при загрузке
    const tokens = authApi.handleCallback();
    
    // Если получили токены из callback, пробуем загрузить пользователя
    if (tokens) {
      loadUser();
    } else {
      // Проверяем, может пользователь уже авторизован
      checkAuthStatus();
    }
  }, []);

  const checkAuthStatus = async () => {
    try {
      const isAuth = await authApi.isAuthenticated();
      if (isAuth) {
        await loadUser();
      } else {
        setLoading(false);
      }
    } catch (err) {
      console.error("Auth check failed:", err);
      setLoading(false);
    }
  };

  const loadUser = async () => {
    try {
      setError(null);
      const response = await authApi.getCurrentUser();
      setUser(response.data);
    } catch (error: any) {
      console.error("Failed to load user", error);
      if (error.response?.status === 401) {
        // Неавторизован - просто сбрасываем состояние
        setUser(null);
      } else {
        setError("Failed to load user data. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = () => {
    authApi.googleLogin();
  };

  const handleLogout = async () => {
    try {
      setError(null);
      await authApi.logout();
      setUser(null);
    } catch (error) {
      console.error("Logout failed", error);
      setError("Logout failed. Please try again.");
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        Loading...
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      {error && (
        <div style={{ color: 'red', marginBottom: '20px', padding: '10px', background: '#ffeeee', borderRadius: '4px' }}>
          {error}
        </div>
      )}
      
      {user ? (
        <div style={{ textAlign: 'center' }}>
          <h1>Welcome, {user.name}!</h1>
          {user.picture && (
            <img 
              src={user.picture} 
              alt="Profile" 
              width={100} 
              height={100} 
              style={{ borderRadius: '50%', margin: '20px 0' }}
            />
          )}
          <p>Email: {user.email}</p>
          <button 
            onClick={handleLogout}
            style={{
              padding: '10px 20px',
              background: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Logout
          </button>
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <h1>Welcome to Filmograf</h1>
          <p>Please sign in to continue</p>
          <button 
            onClick={handleLogin}
            style={{
              padding: '12px 24px',
              background: '#4285f4',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '16px',
              cursor: 'pointer',
              marginTop: '20px'
            }}
          >
            Sign in with Google
          </button>
        </div>
      )}
    </div>
  );
}