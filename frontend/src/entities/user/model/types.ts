import type { BaseModel } from "@/shared/types";

export type UserRole = "Guest" | "Member";

export interface IUser extends BaseModel {
  userType: UserRole;
  email: string;
  googleId: string;
  name: string;
  avatarURL: string;
}

export interface UserLight {
  id: string;
  email: string;
  name: string;
  avatarUrl: string;
  isAdmin: boolean;
  isDeleted: boolean
}