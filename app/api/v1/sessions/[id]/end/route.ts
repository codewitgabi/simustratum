import { NextRequest, NextResponse } from "next/server";
import { enforceSameOrigin, authedBackendFetch, setAuthCookies, clearAuthCookies } from "@/lib/proxy";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const guard = enforceSameOrigin(request);
  if (guard) return guard;

  const { id } = await params;

  let body: unknown = {};
  try {
    body = await request.json();
  } catch {
    /* body is optional */
  }

  const result = await authedBackendFetch(request, `/api/v1/sessions/${id}/end`, {
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
