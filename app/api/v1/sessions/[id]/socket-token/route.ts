import { NextRequest, NextResponse } from "next/server";
import { enforceSameOrigin, ensureAccessToken, backendWsUrl, setAuthCookies, clearAuthCookies } from "@/lib/proxy";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const guard = enforceSameOrigin(request);
  if (guard) return guard;

  const { id } = await params;
  const result = await ensureAccessToken(request);

  if (!result.ok) {
    const response = NextResponse.json(
      { success: false, message: "Session expired. Please log in again.", logged_out: true },
      { status: 401 },
    );
    clearAuthCookies(response);
    return response;
  }

  const response = NextResponse.json({
    success: true,
    data: {
      token: result.accessToken,
      url: backendWsUrl(`/api/v1/sessions/${id}/stream`),
    },
  });

  if (result.refreshedTokens) {
    setAuthCookies(response, result.refreshedTokens);
  }

  return response;
}
