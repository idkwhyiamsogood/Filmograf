import { BaseHttpClient } from "../http/axios";

export class TokenApi extends BaseHttpClient {
  public getAccessToken = () => {
    return localStorage.getItem("access_token");
  };

  public setAccessToken = (token: string): void => {
    localStorage.setItem("access_token", token);
  };

  public clearAccessToken = (): void => {
    localStorage.removeItem("access_token");
  };
}
