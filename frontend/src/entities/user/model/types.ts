export type UserRole = "Guest" | "Member";

export interface IUser {
  id: number;
  username: string;
  email: string;

  logo: string;
}
