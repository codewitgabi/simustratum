import { cookies } from "next/headers";
import type { SessionUser } from "./auth";

/** Server-only: reads the cached user info cookie set at login/register time. */
export async function getSessionUser(): Promise<SessionUser | null> {
  const store = await cookies();
  const raw = store.get("ss_user")?.value;
  if (!raw) return null;
  try {
    return JSON.parse(raw) as SessionUser;
  } catch {
    return null;
  }
}
