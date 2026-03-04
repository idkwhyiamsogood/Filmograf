import { getToken } from "./getToken"

export const RESPONSE_INTERCEPTORS = [
  getToken
]