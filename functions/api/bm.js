export async function onRequestGet() {
  const id = "37458252";
  const url = `https://api.battlemetrics.com/servers/${id}`;

  const res = await fetch(url, {
    headers: { "Accept": "application/json" }
  });

  if (!res.ok) {
    return new Response(JSON.stringify({ ok: false }), {
      status: 502,
      headers: { "content-type": "application/json; charset=utf-8", "access-control-allow-origin": "*" }
    });
  }

  const data = await res.json();
  const a = data?.data?.attributes || {};

  const payload = {
    ok: true,
    name: a.name || "",
    status: a.status || "unknown",
    players: a.players ?? null,
    maxPlayers: a.maxPlayers ?? null,
    queue: a.queue ?? null,
    map: a.details?.map || null,
    rust: a.details?.rust_type || null,
    country: a.country || null,
    updatedAt: a.updatedAt || null
  };

  return new Response(JSON.stringify(payload), {
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
      "access-control-allow-origin": "*"
    }
  });
}
