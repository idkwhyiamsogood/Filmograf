import { AxiosError, AxiosHeaders } from "axios";
import type { AxiosAdapter, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { MockHttpError, routes, type MockRequest } from "./handlers";

// Включено по умолчанию; выключается VITE_USE_MOCKS=false в .env.
export const USE_MOCKS = import.meta.env.VITE_USE_MOCKS !== "false";

const MOCK_DELAY_MS = 250;

const normalizePath = (path: string) => path.replace(/^\/+|\/+$/g, "");

const matchRoute = (pattern: string, path: string) => {
  const p = pattern.split("/");
  const s = path.split("/");
  if (p.length !== s.length) return null;

  const params: Record<string, string> = {};
  for (let i = 0; i < p.length; i++) {
    if (p[i].startsWith(":")) params[p[i].slice(1)] = decodeURIComponent(s[i]);
    else if (p[i] !== s[i]) return null;
  }
  return params;
};

const parseBody = (data: unknown) => {
  if (typeof data !== "string") return data;
  try {
    return JSON.parse(data);
  } catch {
    return data;
  }
};

const getToken = (config: InternalAxiosRequestConfig) => {
  const header = AxiosHeaders.from(config.headers).get("Authorization");
  return typeof header === "string" ? header.replace(/^Bearer\s+/i, "") || null : null;
};

/**
 * Axios-адаптер, который вместо сети отвечает из handlers.ts.
 * Интерцепторы (токен, обработка ошибок) продолжают работать как обычно.
 */
export const mockAdapter: AxiosAdapter = async (config) => {
  await new Promise((r) => setTimeout(r, MOCK_DELAY_MS));

  const url = new URL(config.url ?? "", "http://mock.local/");
  const path = normalizePath(url.pathname);
  const method = (config.method ?? "get").toUpperCase();

  const respond = (status: number, data: unknown): AxiosResponse => ({
    data,
    status,
    statusText: String(status),
    headers: {},
    config,
    request: { mock: true, method, path },
  });

  for (const [routeMethod, pattern, handler] of routes) {
    if (routeMethod !== method) continue;
    const params = matchRoute(pattern, path);
    if (!params) continue;

    const req: MockRequest = {
      method,
      params,
      query: url.searchParams,
      body: parseBody(config.data),
      token: getToken(config),
    };

    try {
      const data = handler(req);
      if (import.meta.env.DEV) console.debug(`[mock] ${method} /${path}`, req.body ?? "", "→", data);
      return respond(200, data);
    } catch (e) {
      const status = e instanceof MockHttpError ? e.status : 500;
      const message = e instanceof Error ? e.message : "Mock error";
      const code = e instanceof MockHttpError ? e.code : "MOCK_ERROR";
      console.warn(`[mock] ${method} /${path} → ${status}`, message);
      throw new AxiosError(
        message,
        String(status),
        config,
        null,
        respond(status, { statusCode: status, message, code, data: null }),
      );
    }
  }

  console.warn(`[mock] нет обработчика для ${method} /${path}`);
  throw new AxiosError(
    `No mock for ${method} /${path}`,
    "404",
    config,
    null,
    respond(404, {
      statusCode: 404,
      message: `Мок для ${method} /${path} не реализован`,
      code: "MOCK_NOT_FOUND",
      data: null,
    }),
  );
};

export { resetMockDb } from "./db";
