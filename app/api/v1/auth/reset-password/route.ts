import { NextRequest, NextResponse } from "next/server";
import { enforceSameOrigin, backendFetch } from "@/lib/proxy";

export async function POST(request: NextRequest) {
  const guard = enforceSameOrigin(request);
  if (guard) return guard;

  const body = await request.json();

  const upstream = await backendFetch("/api/v1/auth/reset-password", {
    method: "POST",
    body: JSON.stringify(body),
  });

  const data = await upstream.json();
  return NextResponse.json(data, { status: upstream.status });
}
