import { NextResponse } from "next/server";
import { randomBytes, timingSafeEqual } from "node:crypto";
import { whoopConfigured } from "@/lib/whoop";

export async function POST(request) {
  if (!whoopConfigured() || !process.env.WHOOP_SETUP_KEY) return new Response("Not configured", { status: 503 });
  const form = await request.formData();
  const supplied = String(form.get("setup_key") || "");
  const expected = process.env.WHOOP_SETUP_KEY;
  const a = Buffer.from(supplied), b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return new Response("Unauthorized", { status: 401 });
  const state = randomBytes(6).toString("base64url").slice(0, 8);
  const url = new URL("https://api.prod.whoop.com/oauth/oauth2/auth");
  url.searchParams.set("response_type", "code");
  url.searchParams.set("client_id", process.env.WHOOP_CLIENT_ID);
  url.searchParams.set("redirect_uri", process.env.WHOOP_REDIRECT_URI);
  url.searchParams.set("scope", "read:recovery read:sleep read:cycles offline");
  url.searchParams.set("state", state);
  const response = NextResponse.redirect(url);
  response.cookies.set("whoop_oauth_state", state, {
    httpOnly: true, secure: true, sameSite: "lax", maxAge: 600, path: "/api/whoop/callback",
  });
  return response;
}
