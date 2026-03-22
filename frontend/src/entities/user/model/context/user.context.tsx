"use client";

import {
  createContext,
  useCallback,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import type { IUser } from "../types";
import { userApi } from "../api/user.api";
import { authApi } from "@/shared/lib";

import { useAuth } from "@/shared/hooks";

import { toast } from "sonner";

export interface UserContextType {
  user: IUser | undefined;

  userError: () => void;
  setCurrentUser: () => void;
  logout: () => void;
}

export const UserContext = createContext<UserContextType | undefined>(
  undefined,
);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<IUser | undefined>(undefined);

  const { token } = useAuth();

  const userError = () =>
    toast.error("Произошла непредвиденная ошибка, попробуйте позже");

  const setCurrentUser = useCallback(async () => {
    try {
      if (token) await userApi.getMe().then((res) => setUser(res.data));
      else return;
    } catch (e) {
      console.log(e);
      userError();
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      if (user || authApi.getAccessToken() !== null) {
        authApi.logout();
        setUser(undefined);
      }
    } catch (e) {
      console.log(e);
      userError();
    }
  }, []);

  useEffect(() => {
    setCurrentUser();
  }, [token]);

  return (
    <UserContext.Provider
      value={{
        user,
        userError,
        setCurrentUser,
        logout,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
