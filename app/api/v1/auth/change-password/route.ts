import { NextRequest, NextResponse } from "next/server";
import { enforceSameOrigin, authedBackendFetch, setAuthCookies, clearAuthCookies } from "@/lib/proxy";

export async function POST(request: NextRequest) {
  const guard = enforceSameOrigin(request);
  if (guard) return guard;

  const body = await request.json();

  const result = await authedBackendFetch(request, "/api/v1/auth/change-password", {
    method: "POST",
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

  return response;
}
