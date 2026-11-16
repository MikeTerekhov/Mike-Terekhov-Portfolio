import { NextResponse } from "next/server";
import { saveTokens, whoopConfigured } from "@/lib/whoop";

export async function GET(request) {
  if (!whoopConfigured()) return new Response("Not configured", { status: 503 });
  const url = new URL(request.url);
  const state = url.searchParams.get("state");
  const cookieState = request.cookies.get("whoop_oauth_state")?.value;
  if (!state || !cookieState || state !== cookieState || !url.searchParams.get("code")) {
    return new Response("WHOOP authorization was not completed or the session expired.", { status: 400 });
  }
  const response = await fetch("https://api.prod.whoop.com/oauth/oauth2/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code: url.searchParams.get("code"),
      client_id: process.env.WHOOP_CLIENT_ID,
      client_secret: process.env.WHOOP_CLIENT_SECRET,
      redirect_uri: process.env.WHOOP_REDIRECT_URI,
    }),
    cache: "no-store",
  });
  if (!response.ok) return new Response("WHOOP token exchange failed.", { status: 502 });
  try { await saveTokens(await response.json()); }
  catch { return new Response("Unable to securely save WHOOP authorization.", { status: 503 }); }
  const redirect = NextResponse.redirect(new URL("/", request.url));
  redirect.cookies.delete("whoop_oauth_state");
  return redirect;
}
