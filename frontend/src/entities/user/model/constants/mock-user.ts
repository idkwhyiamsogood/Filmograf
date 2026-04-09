import type { IUser, UserLight } from "../types"

export const USER_MOCK_LIGHT: UserLight = {
  id: "user-mock",
  email: "user-mock",
  name: "user-mock",
  avatarUrl: "user-mock",
  isAdmin: false,
  isDeleted: false
}

export const USER_MOCK: IUser = {
  ...USER_MOCK_LIGHT,
  userType: "Member",
  googleId: "user-mock",
  createDate: new Date(),
  updateDate: new Date(),
}