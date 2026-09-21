import type { AxiosResponse } from "axios";
import { setCookie } from "cookies-next";

export const onFulfilled = (response: AxiosResponse) => {
  // Сохраняем токен если он есть
  if (response.data?.data?.accessToken) {
    setCookie("access_token", response.data.data.accessToken);
  }
  return response;
};
