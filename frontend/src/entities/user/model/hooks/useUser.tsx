import { useContext } from "react";
import { type UserContextType, UserContext } from "../context/user.context";

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("Необходимо подключение соответствующего провайдера.");
  }
  return context;
};
