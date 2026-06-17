import { NextRequest, NextResponse } from "next/server";
import { enforceSameOrigin, backendFetch, setAuthCookies } from "@/lib/proxy";

export async function POST(request: NextRequest) {
  const guard = enforceSameOrigin(request);
  if (guard) return guard;

  const refreshToken = request.cookies.get("ss_refresh")?.value;

  if (!refreshToken) {
    return NextResponse.json(
      { success: false, message: "No refresh token" },
      { status: 401 },
    );
  }

  const upstream = await backendFetch("/api/v1/auth/refresh", {
    method: "POST",
    body: JSON.stringify({ refresh_token: refreshToken }),
  });

  const data = await upstream.json();

  if (data.success && data.data?.access_token) {
    const response = NextResponse.json(
      { success: true, message: data.message },
      { status: upstream.status },
    );
    setAuthCookies(response, data.data);
    return response;
  }

  return NextResponse.json(data, { status: upstream.status });
}
