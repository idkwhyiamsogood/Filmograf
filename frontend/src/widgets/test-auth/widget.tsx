"use client";

import React, { useEffect, useState } from "react";

import { authApi } from "entities/user/model/auth.api";
import type { IUser } from "entities/user";

interface Props {
  className?: string;
}

export const Widget: React.FC<Props> = ({ className }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
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
      const response = await authApi.getUser();
      setUser(response.data);
    } catch (error: any) {
      if (error.response?.status === 401) {
        authApi.clearAccessToken();
        setUser(null);
      }
    }
  };

  const handleLogin = () => {
    authApi.googleLogin();
  };

  const handleLogout = () => {
    authApi.logout();
    setUser(null);
  };

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        Loading...
      </div>
    );
  }

  return (
    <div style={{ padding: 20 }}>
      {user ? (
        <div style={{ textAlign: "center" }}>
          <h1>Welcome, {user.email}</h1>
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
              marginTop: 20,
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
              marginTop: 20,
            }}
          >
            Sign in with Google
          </button>
        </div>
      )}
    </div>
  );
};
