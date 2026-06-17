import { NextRequest, NextResponse } from "next/server";
import { enforceSameOrigin, backendFetch, setAuthCookies, setUserCookie } from "@/lib/proxy";

export async function POST(request: NextRequest) {
  const guard = enforceSameOrigin(request);
  if (guard) return guard;

  const body = await request.json();

  const upstream = await backendFetch("/api/v1/auth/login", {
    method: "POST",
    body: JSON.stringify(body),
  });

  const data = await upstream.json();

  if (data.success && data.data?.tokens) {
    const { tokens, ...rest } = data.data;
    const response = NextResponse.json(
      { ...data, data: rest },
      { status: upstream.status },
    );
    setAuthCookies(response, tokens);
    setUserCookie(response, rest.user);
    return response;
  }

  return NextResponse.json(data, { status: upstream.status });
}
