// Rust Pohoda — static site JS (SK only)

const DEFAULT_CONFIG = {
  serverName: "Rust Pohoda",
  tagline: "SLOVENSKÝ VANILLA SERVER",
  footerLine: "Rust Pohoda • Vanilla • Quad",
  serverIP: "203.16.163.84:24789",
  connectLink: "steam://connect/203.16.163.84:24789",
  wipe: "Monthly – každý prvý štvrtok v mesiaci o 20:00",
  mode: "Vanilla",
  teamLimit: "Quad (max 4)",
  discord: "https://discord.com/invite/4eY75AnPCj",
  promoEnabled: true,
  promoText_sk: "Najbližší wipe: 05.02.2026 20:00 • Vanilla • Quad • No P2W",
  donateComingSoon: true
};

const $ = (sel, root=document) => root.querySelector(sel);

async function loadConfig(){
  try{
    const res = await fetch("/config.json", { cache: "no-store" });
    if (!res.ok) return { ...DEFAULT_CONFIG };
    const cfg = await res.json();
    return { ...DEFAULT_CONFIG, ...cfg };
  }catch(e){
    return { ...DEFAULT_CONFIG };
  }
}

function escapeHtml(str="") {
  return String(str).replace(/[&<>"']/g, s => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[s]));
}

function mdToHtml(md="") {
  md = md.replace(/\r\n/g, "\n");
  const codeSpans = [];
  md = md.replace(/`([^`]+)`/g, (_, code) => {
    const id = codeSpans.push(code) - 1;
    return `@@CODESPAN_${id}@@`;
  });

  md = md.replace(/^>\s?(.*)$/gm, (_, text) => `<blockquote>${inline(text)}</blockquote>`);

  md = md.replace(/(?:^|\n)(- .*(?:\n- .*)+)/g, (m) => {
    const items = m.trim().split("\n").map(l => l.replace(/^- /, "").trim());
    return `\n<ul>${items.map(i=>`<li>${inline(i)}</li>`).join("")}</ul>\n`;
  });

  md = md.replace(/^##\s+(.+)$/gm, (_, t) => `<h2>${inline(t)}</h2>`);
  md = md.replace(/^#\s+(.+)$/gm, (_, t) => `<h1>${inline(t)}</h1>`);

  const parts = md.split(/\n\s*\n/).map(p => p.trim()).filter(Boolean);
  let html = parts.map(p => {
    if (p.startsWith("<h1") || p.startsWith("<h2") || p.startsWith("<ul") || p.startsWith("<blockquote")) return p;
    const lines = p.split("\n").map(l => l.trim()).filter(Boolean);
    return `<p>${lines.map(inline).join("<br/>")}</p>`;
  }).join("\n");

  html = html.replace(/@@CODESPAN_(\d+)@@/g, (_, id) => `<code>${escapeHtml(codeSpans[Number(id)] || "")}</code>`);
  return html;

  function inline(s) {
    const raw = String(s);
    const tokenLinks = [];
    let out = raw.replace(/\*\*([^*]+)\*\*/g, (_, t) => `@@BOLD_${tokenLinks.push(t)-1}@@`);
    out = out.replace(/(https?:\/\/[^\s)]+)/g, (url) => `@@LINK_${tokenLinks.push(url)-1}@@`);
    out = escapeHtml(out);
    out = out.replace(/@@BOLD_(\d+)@@/g, (_, i) => `<strong>${escapeHtml(tokenLinks[Number(i)] || "")}</strong>`);
    out = out.replace(/@@LINK_(\d+)@@/g, (_, i) => {
      const url = tokenLinks[Number(i)] || "";
      return `<a href="${escapeHtml(url)}" target="_blank" rel="noreferrer">${escapeHtml(url)}</a>`;
    });
    return out;
  }
}

function mdPathFor(slug){ return `/content/${slug}.sk.md`; }

async function renderMarkdownInto(targetSel, mdPath) {
  const el = $(targetSel);
  if (!el) return;
  const res = await fetch(mdPath, { cache: "no-store" });
  if (!res.ok) { el.innerHTML = "<p>Nepodarilo sa načítať obsah.</p>"; return; }
  const md = await res.text();
  el.innerHTML = mdToHtml(md);
}

function setActiveNav() {
  const path = location.pathname.replace(/\/+$/, "") || "/";
  document.querySelectorAll(".nav a").forEach(a => {
    const href = a.getAttribute("href").replace(/\/+$/, "") || "/";
    if (href === path) a.classList.add("active");
  });
}

function toast(msg) {
  const t = document.createElement("div");
  t.textContent = msg;
  t.style.position = "fixed";
  t.style.bottom = "18px";
  t.style.left = "50%";
  t.style.transform = "translateX(-50%)";
  t.style.background = "rgba(18,16,14,.92)";
  t.style.border = "1px solid rgba(255,255,255,.12)";
  t.style.padding = "10px 12px";
  t.style.borderRadius = "14px";
  t.style.color = "rgba(255,255,255,.9)";
  t.style.fontWeight = "800";
  t.style.letterSpacing = ".2px";
  t.style.zIndex = "200";
  document.body.appendChild(t);
  setTimeout(()=>t.remove(), 1600);
}

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    toast("Skopírované ✅");
  } catch {
    const ta = document.createElement("textarea");
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    ta.remove();
    toast("Skopírované ✅");
  }
}

// ---- Wipe countdown ----
// 1) Do 05.02.2026 20:00 (Europe/Bratislava) počítaj odpočet na tento termín.
// 2) Po tomto termíne počítaj vždy na najbližší prvý štvrtok v mesiaci o 20:00.
function tzParts(date, timeZone){
  const fmt = new Intl.DateTimeFormat("en-GB", {
    timeZone,
    year:"numeric", month:"2-digit", day:"2-digit",
    hour:"2-digit", minute:"2-digit", second:"2-digit",
    hourCycle:"h23"
  });
  const parts = fmt.formatToParts(date);
  const get = (type) => Number(parts.find(p=>p.type===type)?.value);
  return { year:get("year"), month:get("month"), day:get("day"), hour:get("hour"), minute:get("minute"), second:get("second") };
}
function makeDateInTZ(year, month, day, hour, minute, second, timeZone){
  let utc = new Date(Date.UTC(year, month-1, day, hour, minute, second));
  for(let i=0;i<4;i++){
    const p = tzParts(utc, timeZone);
    const want = Date.UTC(year, month-1, day, hour, minute, second);
    const got  = Date.UTC(p.year, p.month-1, p.day, p.hour, p.minute, p.second);
    const diff = want - got;
    if (Math.abs(diff) < 1000) break;
    utc = new Date(utc.getTime() + diff);
  }
  return utc;
}
function firstThursdayDay(year, month){
  const d = new Date(Date.UTC(year, month-1, 1, 12, 0, 0));
  const weekday = d.getUTCDay(); // 0 Sun .. 4 Thu
  const target = 4;
  const add = (target - weekday + 7) % 7;
  return 1 + add;
}
function nextFirstThursdayWipe(nowUtc, timeZone){
  const nowP = tzParts(nowUtc, timeZone);
  let y = nowP.year, m = nowP.month;
  for(let k=0;k<14;k++){
    const day = firstThursdayDay(y, m);
    const wipeUtc = makeDateInTZ(y, m, day, 20, 0, 0, timeZone);
    if (wipeUtc.getTime() > nowUtc.getTime()) return wipeUtc;
    m += 1; if (m === 13){ m = 1; y += 1; }
  }
  return null;
}
function fmtCountdown(ms){
  const total = Math.max(0, Math.floor(ms/1000));
  const d = Math.floor(total / 86400);
  const h = Math.floor((total % 86400) / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  if (d > 0) return `${d}d ${h}h ${m}m`;
  if (h > 0) return `${h}h ${m}m ${s}s`;
  return `${m}m ${s}s`;
}
function startWipeCountdown(){
  const el = document.getElementById("wipeCountdown");
  const targetEl = document.getElementById("wipeTargetText");
  const tz = "Europe/Bratislava";
  if (!el) return;

  const hardWipeUtc = makeDateInTZ(2026, 2, 5, 20, 0, 0, tz);

  const tick = () => {
    const now = new Date();
    const wipe = (now.getTime() < hardWipeUtc.getTime()) ? hardWipeUtc : nextFirstThursdayWipe(now, tz);
    if (!wipe) return;

    const wp = tzParts(wipe, tz);
    if (targetEl) targetEl.textContent = `Najbližší wipe: ${String(wp.day).padStart(2,'0')}.${String(wp.month).padStart(2,'0')}.${wp.year} 20:00`;

    el.textContent = fmtCountdown(wipe.getTime() - now.getTime());
  };

  tick();
  setInterval(tick, 1000);
}

async function initCommon(config) {
  setActiveNav();

  const brand = $("#brandName"); if (brand) brand.textContent = config.serverName;
  const footerLine = $("#footerLine"); if (footerLine) footerLine.textContent = config.footerLine;
  const footerIP = $("#footerIP"); if (footerIP) footerIP.textContent = config.serverIP;
  const footerWipe = $("#footerWipe"); if (footerWipe) footerWipe.textContent = config.wipe;

  const navDisc = document.getElementById("navDiscord");
  if (navDisc) navDisc.href = config.discord;

  const footerDiscord = $("#footerDiscord");
  if (footerDiscord) footerDiscord.href = config.discord;

  // mobile nav toggle
  const navBtn = document.getElementById("navToggle");
  const navMenu = document.getElementById("navMenu");
  navBtn?.addEventListener("click", ()=> navMenu?.classList.toggle("open"));
}

async function initHome(config) {
  const ip = config.serverIP;
  const copyBtn = $("#btnCopyIP");
  const connectBtn = $("#btnConnect");
  const joinTopBtn = $("#btnJoinTop");
  const discordBtn = $("#discordLink");

  if (copyBtn) copyBtn.addEventListener("click", () => copyText(ip));

  // Make buttons work even without JS (href is set in HTML on home),
  // but we keep click handlers for glow & consistency.
  if (connectBtn) {
    connectBtn.classList.add("btn-glow");
    connectBtn.addEventListener("click", (e) => { e.preventDefault(); location.href = config.connectLink; });
    connectBtn.setAttribute("href", config.connectLink);
  }
  if (joinTopBtn) {
    joinTopBtn.classList.add("btn-glow");
    joinTopBtn.addEventListener("click", (e) => { e.preventDefault(); location.href = config.connectLink; });
    joinTopBtn.setAttribute("href", config.connectLink);
  }
  if (discordBtn) {
    discordBtn.setAttribute("href", config.discord);
    discordBtn.setAttribute("target","_blank");
    discordBtn.setAttribute("rel","noreferrer");
  }

  const set = (id, val) => { const el = $(id); if (el) el.textContent = val; };
  set("#serverName", config.serverName);
  set("#tagline", config.tagline);
  set("#chipWipe", config.wipe);
  set("#chipMode", config.mode);
  set("#chipTeam", config.teamLimit);
  set("#ipInline", ip);
}

async function initGallery() {
  const grid = $("#galleryGrid");
  const box = $("#lightbox");
  if (!grid || !box) return;

  const res = await fetch("/gallery/manifest.json", { cache: "no-store" });
  if (!res.ok) {
    grid.innerHTML = "<p class='small'>Galéria sa nenašla.</p>";
    return;
  }
  const data = await res.json();
  const images = Array.isArray(data.images) ? data.images : [];
  if (!images.length) {
    grid.innerHTML = "<p class='small'>Zatiaľ tu nie sú žiadne obrázky.</p>";
    return;
  }

  images.forEach((img) => {
    const file = img.file;
    const title = img.title || file;
    const desc = img.desc || "";
    const src = "/gallery/" + file;

    const card = document.createElement("div");
    card.className = "thumb";
    card.innerHTML = `
      <img src="${src}" alt="${escapeHtml(title)}" loading="lazy"/>
      <div class="cap">
        <div class="t">${escapeHtml(title)}</div>
        <div class="d">${escapeHtml(desc)}</div>
      </div>
    `;
    card.addEventListener("click", () => openLightbox(src, title, desc));
    grid.appendChild(card);
  });

  const closeBtn = $("#lbClose");
  const imgEl = $("#lbImg");
  const titleEl = $("#lbTitle");
  const descEl = $("#lbDesc");

  function openLightbox(src, title, desc){
    imgEl.src = src;
    titleEl.textContent = title;
    descEl.textContent = desc;
    box.classList.add("open");
  }
  function close(){
    box.classList.remove("open");
    imgEl.src = "";
  }

  closeBtn?.addEventListener("click", close);
  box.addEventListener("click", (e) => { if (e.target === box) close(); });
  document.addEventListener("keydown", (e)=>{ if(e.key==="Escape") close(); });
}




(async function main(){
  document.body.classList.add('wipe-pre');
  const config = await loadConfig();
  await initCommon(config);

  const page = document.body.getAttribute("data-page");
  if (page === "home") {
    await initHome(config);
    await renderMarkdownInto("#mdHome", mdPathFor("home"));
    startWipeCountdown();
    
  }
  if (page === "rules") {
    await renderMarkdownInto("#mdRules", mdPathFor("rules"));
  }
  if (page === "vip") {
    await renderMarkdownInto("#mdVip", mdPathFor("vip"));
  }
  if (page === "gallery") {
    await renderMarkdownInto("#mdGallery", mdPathFor("gallery"));
    await initGallery();
  }
})();
