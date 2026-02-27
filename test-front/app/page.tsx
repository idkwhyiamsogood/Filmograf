'use client'

import { authApi, IUser } from "@/api/auth.api";
import { useEffect, useState } from "react";

export default function Home() {
  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = authApi.handleCallback();

    if (token) {
      loadUser();
    } else {
      checkAuth();
    }
  }, []);

  const checkAuth = async () => {
    try {
      const isAuth = await authApi.isAuthenticated();
      if (isAuth) {
        await loadUser();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadUser = async () => {
    try {
      setError(null);
      const response = await authApi.getCurrentUser();
      setUser(response.data);
    } catch (error: any) {
      if (error.response?.status === 401) {
        authApi.clearToken();
        setUser(null);
      } else {
        setError("Failed to load user.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = () => {
    authApi.googleLogin();
  };

  const handleLogout = async () => {
    authApi.logout();
    setUser(null);
  };

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        Loading...
      </div>
    );
  }

  return (
    <div style={{ padding: 20 }}>
      {error && (
        <div style={{ color: "red", marginBottom: 20 }}>
          {error}
        </div>
      )}

      {user ? (
        <div style={{ textAlign: "center" }}>
          <h1>Welcome, {user.name}</h1>
          <p>Email: {user.email}</p>

          <button
            onClick={handleLogout}
            style={{
              padding: "10px 20px",
              background: "#dc3545",
              color: "white",
              border: "none",
              borderRadius: 4,
              cursor: "pointer",
              marginTop: 20
            }}
          >
            Logout
          </button>
        </div>
      ) : (
        <div style={{ textAlign: "center", padding: 50 }}>
          <h1>Welcome to Filmograf</h1>
          <p>Please sign in</p>

          <button
            onClick={handleLogin}
            style={{
              padding: "12px 24px",
              background: "#4285f4",
              color: "white",
              border: "none",
              borderRadius: 4,
              fontSize: 16,
              cursor: "pointer",
              marginTop: 20
            }}
          >
            Sign in with Google
          </button>
        </div>
      )}
    </div>
  );
}