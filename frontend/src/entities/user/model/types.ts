import type { BaseModel } from "@/shared/types";

export type UserRole = "Guest" | "Member";

export interface IUser extends BaseModel {
  userType: UserRole;
  email: string;
  googleId: string;
  name: string;
  avatarURL: string;
}