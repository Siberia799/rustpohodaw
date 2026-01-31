export async function onRequest() {
  const res = await fetch("https://api.battlemetrics.com/servers/37458252", {
    headers: { "Accept": "application/vnd.api+json" }
  });
  if (!res.ok) return new Response(JSON.stringify({ ok:false }), { status:500 });
  const j = await res.json();
  const a = j.data.attributes;
  return new Response(JSON.stringify({
    ok:true,
    status:a.status,
    players:a.players,
    maxPlayers:a.maxPlayers
  }), { headers:{ "Content-Type":"application/json","Cache-Control":"max-age=30" }});
}