import { NextRequest, NextResponse } from "next/server";
import {
  enforceSameOrigin,
  authedBackendFetch,
  setAuthCookies,
  setUserCookie,
  clearAuthCookies,
} from "@/lib/proxy";

export async function PATCH(request: NextRequest) {
  const guard = enforceSameOrigin(request);
  if (guard) return guard;

  const body = await request.json();

  const result = await authedBackendFetch(request, "/api/v1/auth/me", {
    method: "PATCH",
    body: JSON.stringify(body),
  });

  if (!result.ok) {
    const response = NextResponse.json(
      { success: false, message: "Session expired. Please log in again.", logged_out: true },
      { status: 401 },
    );
    clearAuthCookies(response);
    return response;
  }

  const data = await result.response.json();
  const response = NextResponse.json(data, { status: result.response.status });

  if (result.refreshedTokens) {
    setAuthCookies(response, result.refreshedTokens);
  }
  if (data.success && data.data) {
    setUserCookie(response, data.data);
  }

  return response;
}
