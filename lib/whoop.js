import { cache } from "react";

const API = "https://api.prod.whoop.com";
const KEY = "portfolio:whoop:tokens";

export const whoopConfigured = () => Boolean(
  process.env.WHOOP_CLIENT_ID && process.env.WHOOP_CLIENT_SECRET &&
  process.env.WHOOP_REDIRECT_URI && process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN
);

async function redis(command) {
  const response = await fetch(process.env.KV_REST_API_URL, {
    method: "POST",
    headers: { Authorization: `Bearer ${process.env.KV_REST_API_TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify(command),
    cache: "no-store",
  });
  if (!response.ok) throw new Error("Token storage unavailable");
  const data = await response.json();
  if (data.error) throw new Error("Token storage error");
  return data.result;
}

export async function saveTokens(tokens) {
  if (!tokens?.access_token || !tokens?.refresh_token) throw new Error("Incomplete WHOOP tokens");
  await redis(["SET", KEY, JSON.stringify({
    access_token: tokens.access_token,
    refresh_token: tokens.refresh_token,
    expires_at: Date.now() + (tokens.expires_in || 3600) * 1000,
  })]);
}

async function getTokens() {
  const raw = await redis(["GET", KEY]);
  return raw ? (typeof raw === "string" ? JSON.parse(raw) : raw) : null;
}

export async function getAccessToken() {
  const tokens = await getTokens();
  if (!tokens) return null;
  if (tokens.expires_at > Date.now() + 120000) return tokens.access_token;
  // A short-lived distributed lock avoids rotating the same refresh token twice.
  const lock = await redis(["SET", KEY + ":lock", "1", "NX", "EX", "30"]);
  if (lock !== "OK") return null;
  try {
    const latest = await getTokens();
    if (latest?.expires_at > Date.now() + 120000) return latest.access_token;
    const response = await fetch(API + "/oauth/oauth2/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "refresh_token", refresh_token: latest.refresh_token,
        client_id: process.env.WHOOP_CLIENT_ID,
        client_secret: process.env.WHOOP_CLIENT_SECRET,
        scope: "offline",
      }),
      cache: "no-store",
    });
    if (!response.ok) throw new Error("WHOOP token refresh failed");
    const refreshed = await response.json();
    await saveTokens(refreshed);
    return refreshed.access_token;
  } finally {
    await redis(["DEL", KEY + ":lock"]);
  }
}

async function getCollection(path, token) {
  const response = await fetch(API + "/developer/v2/" + path + "?limit=5", {
    headers: { Authorization: `Bearer ${token}` },
    next: { revalidate: 600 },
  });
  if (!response.ok) throw new Error("WHOOP data unavailable");
  const data = await response.json();
  return data.records || [];
}

export const getWhoopSnapshot = cache(async () => {
  if (!whoopConfigured()) return null;
  try {
    const token = await getAccessToken();
    if (!token) return null;
    const [recoveries, sleeps, cycles] = await Promise.all([
      getCollection("recovery", token),
      getCollection("activity/sleep", token),
      getCollection("cycle", token),
    ]);
    const recovery = recoveries.find(r => r.score_state === "SCORED" && r.score?.recovery_score != null);
    const sleep = sleeps.find(s => !s.nap && s.score_state === "SCORED" && s.score?.sleep_performance_percentage != null);
    const cycle = cycles.find(c => c.score_state === "SCORED" && c.score?.strain != null);
    if (!recovery && !sleep && !cycle) return null;
    return {
      recovery: recovery?.score?.recovery_score ?? null,
      sleep: sleep?.score?.sleep_performance_percentage ?? null,
      strain: cycle?.score?.strain ?? null,
      updated: new Date().toISOString(),
    };
  } catch (error) {
    console.error("WHOOP snapshot unavailable:", error.message);
    return null;
  }
});
