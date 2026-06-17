import { NextRequest, NextResponse } from "next/server";
import { enforceSameOrigin, clearAuthCookies, backendFetch } from "@/lib/proxy";

export async function POST(request: NextRequest) {
  const guard = enforceSameOrigin(request);
  if (guard) return guard;

  const accessToken = request.cookies.get("ss_access")?.value;

  const upstream = await backendFetch("/api/v1/auth/logout", {
    method: "POST",
    headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
  });

  const data = await upstream.json();

  if (data.success) {
    const response = NextResponse.json({
      success: true,
      message: "Logged out",
    });
    clearAuthCookies(response);
    return response;
  }

  return NextResponse.json(data, { status: upstream.status });
}
