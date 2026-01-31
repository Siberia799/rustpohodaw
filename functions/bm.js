export async function onRequest(context) {
  const url = new URL(context.request.url);
  const serverId = url.searchParams.get("server") || "37458252";

  // Set this in Cloudflare Pages -> Settings -> Environment variables
  // Name: BM_TOKEN   Value: <your BattleMetrics API token>
  const token = (context.env && context.env.BM_TOKEN) ? String(context.env.BM_TOKEN).trim() : "";

  const headers = { "Accept": "application/vnd.api+json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const apiUrl = `https://api.battlemetrics.com/servers/${encodeURIComponent(serverId)}`;

  let res;
  try {
    res = await fetch(apiUrl, { headers });
  } catch (e) {
    return new Response(JSON.stringify({ ok:false, error:"fetch_failed" }), {
      status: 502,
      headers: { "Content-Type":"application/json; charset=utf-8", "Cache-Control":"no-store" }
    });
  }

  if (!res.ok) {
    // BattleMetrics returns 403 when token missing/invalid or rate-limited
    return new Response(JSON.stringify({
      ok:false,
      status: res.status,
      hint: (res.status === 403)
        ? "BattleMetrics API vracia 403. Nastav BM_TOKEN v Cloudflare Pages (Environment variables)."
        : "BattleMetrics API error."
    }), {
      status: 200,
      headers: { "Content-Type":"application/json; charset=utf-8", "Cache-Control":"no-store" }
    });
  }

  const json = await res.json();
  const a = json?.data?.attributes || {};

  return new Response(JSON.stringify({
    ok: true,
    status: a.status || "unknown",
    players: a.players ?? null,
    maxPlayers: a.maxPlayers ?? null
  }), {
    status: 200,
    headers: { "Content-Type":"application/json; charset=utf-8", "Cache-Control":"public, max-age=30" }
  });
}
