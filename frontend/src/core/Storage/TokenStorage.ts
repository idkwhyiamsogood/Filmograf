"use client";

import { Preferences } from "@capacitor/preferences";
import { Capacitor } from "@capacitor/core";

export class TokenStorage {
  private tokenKey: string; 

  constructor(tokenKey: string) { 
    this.tokenKey = tokenKey;
  }

  async setToken(token: string): Promise<void> {
    if (typeof window === "undefined") {
      return;
    }

    try {
      if (Capacitor.isNativePlatform()) {
        await Preferences.set({ key: this.tokenKey, value: token });
      } else {
        localStorage.setItem(this.tokenKey, token);
      }
    } catch (error) {
      throw error;
    }
  }

  async getToken(): Promise<string | null> {
    if (typeof window === "undefined") {
      return null;
    }

    try {
      if (Capacitor.isNativePlatform()) {
        const { value } = await Preferences.get({ key: this.tokenKey });
        return value;
      } else {
        return localStorage.getItem(this.tokenKey);
      }
    } catch (error) {
      return null;
    }
  }

  async removeToken(): Promise<void> {
    if (typeof window === "undefined") {
      console.warn("TokenStorage: window is not available (server side)");
      return;
    }

    try {
      if (Capacitor.isNativePlatform()) {
        await Preferences.remove({ key: this.tokenKey });
        console.log("Token removed from Capacitor Preferences");
      } else {
        localStorage.removeItem(this.tokenKey);
        console.log("Token removed from localStorage");
      }
    } catch (error) {
      console.error("TokenStorage: Failed to remove token", error);
      throw error;
    }
  }
}