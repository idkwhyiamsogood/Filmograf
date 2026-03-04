import { AxiosResponse } from "axios";
import { setCookie } from "cookies-next";

export const getToken = (response: AxiosResponse) => {
  if (response.data?.data?.accessToken) {
    setCookie("token", response.data.data.accessToken);
  }
  return response;
};
