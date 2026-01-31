export async function onRequest(context) {
  const url = new URL(context.request.url);
  const serverId = url.searchParams.get("server") || "37458252";

  const res = await fetch(`https://api.battlemetrics.com/servers/${encodeURIComponent(serverId)}`, {
    headers: { "Accept": "application/vnd.api+json" }
  });

  if (!res.ok) {
    return new Response(JSON.stringify({ ok:false, status: res.status }), {
      status: 502,
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
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "public, max-age=30"
    }
  });
}
