import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL ?? "";

export type SessionUser = {
  id: string;
  full_name: string;
  email: string;
  is_verified: boolean;
  auth_provider: string;
};

/**
 * Reject requests whose Origin (or, for GET/HEAD, Referer) header doesn't
 * match the server's own host. Browsers omit Origin on plain same-origin
 * GET/HEAD fetches, so those fall back to Referer instead of being rejected
 * outright. Returns a 403 response if the check fails, otherwise null.
 */
export function enforceSameOrigin(request: NextRequest): NextResponse | null {
  const host = request.headers.get("host");
  const origin = request.headers.get("origin");
  const forbidden = NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 });

  if (!host) return forbidden;

  const isSafeMethod = request.method === "GET" || request.method === "HEAD";
  const sourceUrl = origin ?? (isSafeMethod ? request.headers.get("referer") : null);

  if (!sourceUrl) return forbidden;

  try {
    if (new URL(sourceUrl).host !== host) return forbidden;
  } catch {
    return forbidden;
  }

  return null;
}

/** Write access and refresh tokens into httpOnly session cookies. */
export function setAuthCookies(
  response: NextResponse,
  tokens: { access_token: string; refresh_token: string },
): void {
  const isProd = process.env.NODE_ENV === "production";
  const base = { httpOnly: true, secure: isProd, sameSite: "lax" as const, path: "/" };

  const accessMaxAge = process.env.ACCESS_TOKEN_MAX_AGE
    ? Number(process.env.ACCESS_TOKEN_MAX_AGE)
    : undefined;
  const refreshMaxAge = process.env.REFRESH_TOKEN_MAX_AGE
    ? Number(process.env.REFRESH_TOKEN_MAX_AGE)
    : undefined;

  response.cookies.set("ss_access", tokens.access_token, {
    ...base,
    ...(accessMaxAge != null ? { maxAge: accessMaxAge * 60 } : {}),
  });
  response.cookies.set("ss_refresh", tokens.refresh_token, {
    ...base,
    ...(refreshMaxAge != null ? { maxAge: refreshMaxAge * 60 * 60 * 24 } : {}),
  });
}

/** Store basic user info in an httpOnly cookie so the server can read it without a backend call. */
export function setUserCookie(response: NextResponse, user: SessionUser): void {
  response.cookies.set("ss_user", JSON.stringify(user), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });
}

/** Expire all auth and user cookies immediately. */
export function clearAuthCookies(response: NextResponse): void {
  const base = { path: "/", httpOnly: true, secure: process.env.NODE_ENV === "production" };
  response.cookies.set("ss_access", "", { ...base, maxAge: 0 });
  response.cookies.set("ss_refresh", "", { ...base, maxAge: 0 });
  response.cookies.set("ss_user", "", { ...base, maxAge: 0 });
}

/** Forward a JSON request to the backend. */
export async function backendFetch(path: string, init?: RequestInit): Promise<Response> {
  return fetch(`${BACKEND_URL}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...init?.headers },
  });
}

export type AuthedFetchResult =
  | { ok: true; response: Response; refreshedTokens?: { access_token: string; refresh_token: string } }
  | { ok: false; reason: "no_refresh_token" | "refresh_failed" };

/**
 * Forward a JSON request to the backend with the access token attached.
 * On a 401, transparently refreshes using the refresh token cookie and
 * retries once. Callers should set the returned `refreshedTokens` on the
 * response cookies, or clear auth cookies entirely when `ok` is false.
 */
export async function authedBackendFetch(
  request: NextRequest,
  path: string,
  init?: RequestInit,
): Promise<AuthedFetchResult> {
  const attempt = (token: string) =>
    backendFetch(path, {
      ...init,
      headers: { ...init?.headers, Authorization: `Bearer ${token}` },
    });

  const accessToken = request.cookies.get("ss_access")?.value;
  if (accessToken) {
    const response = await attempt(accessToken);
    if (response.status !== 401) {
      return { ok: true, response };
    }
  }

  const refreshToken = request.cookies.get("ss_refresh")?.value;
  if (!refreshToken) {
    return { ok: false, reason: "no_refresh_token" };
  }

  const refreshUpstream = await backendFetch("/api/v1/auth/refresh", {
    method: "POST",
    body: JSON.stringify({ refresh_token: refreshToken }),
  });
  const refreshData = await refreshUpstream.json();

  if (!refreshData.success || !refreshData.data?.access_token) {
    return { ok: false, reason: "refresh_failed" };
  }

  const refreshedTokens = refreshData.data as {
    access_token: string;
    refresh_token: string;
  };
  const response = await attempt(refreshedTokens.access_token);

  return { ok: true, response, refreshedTokens };
}
