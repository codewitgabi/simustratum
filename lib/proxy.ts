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
 * Reject requests whose Origin header doesn't match the server's own host.
 * Returns a 403 response if the check fails, otherwise null.
 */
export function enforceSameOrigin(request: NextRequest): NextResponse | null {
  const origin = request.headers.get("origin");
  const host = request.headers.get("host");

  if (!origin || !host) {
    return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 });
  }

  try {
    if (new URL(origin).host !== host) {
      return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 });
    }
  } catch {
    return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 });
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
