export async function onRequest(context) {
  const { request } = context;

  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders() });
  }
  if (request.method !== "GET") {
    return json({ ok:false, error:"method_not_allowed" }, 405);
  }

  const id = "37458252";
  const url = `https://api.battlemetrics.com/servers/${id}?t=${Date.now()}`;

  // BattleMetrics API je za Cloudflare ochranou; niekedy blokuje "bot" requesty (1106).
  // Preto posielame hlavičky čo najviac podobné reálnemu prehliadaču.
  const headers = {
    "Accept": "application/json, text/plain, */*",
    "Accept-Language": "sk-SK,sk;q=0.9,en-US;q=0.8,en;q=0.7",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
    "Referer": "https://www.battlemetrics.com/",
    "Origin": "https://www.battlemetrics.com"
  };

  try {
    const res = await fetch(url, {
      method: "GET",
      headers,
      redirect: "follow",
      cf: { cacheTtl: 0, cacheEverything: false }
    });

    if (!res.ok) {
      const body = await safeText(res);
      return json({
        ok: false,
        error: "upstream_not_ok",
        upstream_status: res.status,
        upstream_body: (body || "").slice(0, 200)
      }, 502);
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
      updatedAt: a.updatedAt || null
    };

    return json(payload, 200);
  } catch (e) {
    return json({ ok:false, error:"exception", message:String(e) }, 502);
  }
}

function json(obj, status=200){
  return new Response(JSON.stringify(obj), {
    status,
    headers: {
      ...corsHeaders(),
      "content-type":"application/json; charset=utf-8",
      "cache-control":"no-store"
    }
  });
}

function corsHeaders(){
  return {
    "access-control-allow-origin":"*",
    "access-control-allow-methods":"GET,OPTIONS",
    "access-control-allow-headers":"Content-Type",
  };
}

async function safeText(res){
  try { return await res.text(); } catch { return ""; }
}
