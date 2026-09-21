"use client";

import { useEffect, useState } from "react";
import { Capacitor } from "@capacitor/core";
import { GoogleAuth } from "@codetrix-studio/capacitor-google-auth";
import { authApi, IUser } from "@/api/auth.api";

export default function MobileAuthPage() {
  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initAndCheck = async () => {
      try {
        // 1. Инициализация плагина (обязательно для Android/iOS)
        if (Capacitor.isNativePlatform()) {
          GoogleAuth.initialize({
            clientId: '341334726956-oo7rlsn0743ot821mdqoaj5e6uk442vr.apps.googleusercontent.com',
            scopes: ['profile', 'email'],
            grantOfflineAccess: true,
          });
        }

        // 2. Проверка существующей сессии (JWT в localStorage)
        const isAuth = await authApi.isAuthenticated();
        if (isAuth) {
          await loadUser();
        }
      } catch (err) {
        console.error("Initialization error:", err);
      } finally {
        setLoading(false);
      }
    };

    initAndCheck();
  }, []);

  const loadUser = async () => {
    try {
      const response = await authApi.getCurrentUser();
      setUser(response.data);
    } catch (err) {
      authApi.clearToken();
      setUser(null);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      // 3. Вызов нативного окна Google
      const googleUser = await GoogleAuth.signIn();
      const idToken = googleUser.authentication.idToken;

      if (!idToken) {
        throw new Error("No ID Token received from Google");
      }

      // 4. Отправка idToken на ваш бекенд (метод google-native)
      const response = await authApi.verifyNativeGoogleToken(idToken);
      const jwt = response.data.jwt;

      // 5. Сохранение JWT и загрузка данных профиля
      authApi.setAccessToken(jwt);
      await loadUser();
    } catch (err: any) {
      console.error("Login failed:", err);
      setError(err.message || "Authorization failed");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    try {
      // Выходим из Google (чтобы при следующем входе можно было выбрать аккаунт)
      await GoogleAuth.signOut();
      authApi.logout();
      setUser(null);
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={centerStyle}>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      {user ? (
        <div style={{ textAlign: "center" }}>
          <h1>Filmograf Mobile</h1>
          <div style={profileCardStyle}>
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
          </div>
          <button onClick={handleLogout} style={logoutButtonStyle}>
            Logout
          </button>
        </div>
      ) : (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
          <h1>Filmograf</h1>
          <p>Welcome! Please sign in to continue.</p>
          
          {error && <p style={{ color: "red" }}>{error}</p>}

          <button onClick={handleGoogleLogin} style={loginButtonStyle}>
            Sign in with Google
          </button>
        </div>
      )}
    </div>
  );
}

// Стили для теста
const centerStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "100vh",
};

const profileCardStyle: React.CSSProperties = {
  background: "#f4f4f4",
  padding: "20px",
  borderRadius: "8px",
  margin: "20px 0",
};

const loginButtonStyle: React.CSSProperties = {
  padding: "12px 24px",
  background: "#4285f4",
  color: "white",
  border: "none",
  borderRadius: "4px",
  fontSize: "16px",
  cursor: "pointer",
};

const logoutButtonStyle: React.CSSProperties = {
  padding: "10px 20px",
  background: "#dc3545",
  color: "white",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
};