import { isAxiosError } from "axios";

export const getApiErrorStatus = (error: unknown): number | undefined => {
  if (isAxiosError(error)) {
    return error.response?.status;
  }

  return undefined;
};
