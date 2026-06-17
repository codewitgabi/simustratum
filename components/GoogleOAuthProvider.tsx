"use client";

import { GoogleOAuthProvider as Provider } from "@react-oauth/google";

const CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? "";

export default function GoogleOAuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Provider clientId={CLIENT_ID}>{children}</Provider>;
}
