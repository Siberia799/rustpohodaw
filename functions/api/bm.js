export async function onRequest(context) {
  const { request } = context;

  // CORS + preflight
  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: corsHeaders()
    });
  }
  if (request.method !== "GET") {
    return new Response(JSON.stringify({ ok:false, error:"method_not_allowed" }), {
      status: 405,
      headers: { ...corsHeaders(), "content-type":"application/json; charset=utf-8", "cache-control":"no-store" }
    });
  }

  const id = "37458252";
  const url = `https://api.battlemetrics.com/servers/${id}`;

  try {
    const res = await fetch(url, {
      method: "GET",
      redirect: "follow",
      headers: {
        "Accept": "application/json",
        "User-Agent": "rustpohoda.pages (server widget)",
      },
      cf: {
        cacheTtl: 0,
        cacheEverything: false
      }
    });

    if (!res.ok) {
      const body = await safeText(res);
      return new Response(JSON.stringify({
        ok: false,
        error: "upstream_not_ok",
        upstream_status: res.status,
        upstream_body: body?.slice(0, 200) || ""
      }), {
        status: 502,
        headers: { ...corsHeaders(), "content-type":"application/json; charset=utf-8", "cache-control":"no-store" }
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
      updatedAt: a.updatedAt || null
    };

    return new Response(JSON.stringify(payload), {
      headers: { ...corsHeaders(), "content-type":"application/json; charset=utf-8", "cache-control":"no-store" }
    });
  } catch (e) {
    return new Response(JSON.stringify({
      ok: false,
      error: "exception",
      message: String(e)
    }), {
      status: 502,
      headers: { ...corsHeaders(), "content-type":"application/json; charset=utf-8", "cache-control":"no-store" }
    });
  }
}

function corsHeaders(){
  return {
    "access-control-allow-origin": "*",
    "access-control-allow-methods": "GET,OPTIONS",
    "access-control-allow-headers": "Content-Type",
  };
}

async function safeText(res){
  try { return await res.text(); } catch { return ""; }
}
