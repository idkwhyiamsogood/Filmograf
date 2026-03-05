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

import { toast } from "sonner";

export interface UserContextType {
  user: IUser | undefined;

  userError: () => void;
  setCurrentUser: (token: string | null) => void;
}

export const UserContext = createContext<UserContextType | undefined>(
  undefined,
);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<IUser | undefined>(undefined);

  const userError = () =>
    toast.error("Произошла непредвиденная ошибка, попробуйте позже");

  const setCurrentUser = useCallback(async (token: string | null) => {
    try {
      if (token) await userApi.getMe().then((res) => setUser(res.data));
      
      // что-то потом может добавить ???
      else return;
    } catch (e) {
      console.log(e);
      userError();
    }
  }, []);

  // dev only
  useEffect(() => {
    console.log(user);
  }, [user])

  return (
    <UserContext.Provider
      value={{
        user,
        userError,
        setCurrentUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
