import axios from "axios";
import type { AxiosRequestConfig } from "axios";
import type { ApiResponse } from "@/shared/types";
import { REQUEST_INTERCEPTORS } from "./interceptors/request/index";
import { RESPONSE_INTERCEPTORS } from "./interceptors/response/index";
 
export class BaseHttpClient {
  http

  constructor(private config?: AxiosRequestConfig) {
    this.http = axios.create({
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 10000,
      baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5090",
      withCredentials: true,
      ...this.config
    })

    REQUEST_INTERCEPTORS.forEach(
      icr => this.http.interceptors.request.use(icr)
    )

    RESPONSE_INTERCEPTORS.forEach(
        icr => this.http.interceptors.response.use(icr)
    )
  }

  post =
    <T>(path: string, data?: unknown, config?: AxiosRequestConfig): ApiResponse<T> =>
      this.http.post<T>(path, data, config)

  get =
    <T>(path: string, config?: AxiosRequestConfig): ApiResponse<T> =>
      this.http.get<T>(path, config)

  put =
    <T>(path: string, data?: unknown, config?: AxiosRequestConfig): ApiResponse<T> =>
      this.http.put<T>(path, data, config)

  patch =
    <T>(path: string, data?: unknown, config?: AxiosRequestConfig): ApiResponse<T> =>
      this.http.patch<T>(path, data, config)

  delete =
    <T>(path: string, config?: AxiosRequestConfig): ApiResponse<T> =>
      this.http.delete<T>(path, config)

  request =
    <T>(config: AxiosRequestConfig): ApiResponse<T> =>
      this.http.request<T>(config)
}