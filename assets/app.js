// Rust Pohoda — static site JS (SK/CZ)

const CONNECT_LINK = "steam://run/252490//+connect%20203.16.163.84:24790";

const DEFAULT_CONFIG = {
  serverName: "Rust Pohoda",
  tagline: "SLOVENSKÝ VANILLA SERVER",
  footerLine: "Rust Pohoda • Vanilla • Quad",
  serverIP: "203.16.163.84:24789",
  connectLink: "steam://run/252490//+connect%20203.16.163.84:24790",
  wipe: "Monthly – každý prvý štvrtok v mesiaci o 20:00",
  mode: "Vanilla",
  teamLimit: "Quad (max 4)",
  discord: "https://discord.com/invite/4eY75AnPCj",
  promoEnabled: true,
  promoText_sk: "Najbližší wipe: 05.02.2026 20:00 • Vanilla • Quad • No P2W",
  donateComingSoon: true
};


let APP_CONFIG = null;

const I18N = {
  sk: {
    nav_home: "Domov",
    nav_rules: "Pravidlá",
    nav_vip: "VIP",
    nav_gallery: "Galéria",
    nav_discord: "Discord",
    join: "PRIPOJIŤ SA",
    hero_kicker: "SLOVENSKÝ VANILLA SERVER",
    home_card_title: "Obsah stránky",
    copy_ip: "COPY IP",
    copied: "Skopírované!",
    md_load_fail: "Nepodarilo sa načítať obsah.",
    gallery_empty_home: "Zatiaľ tu nie sú žiadne screenshoty. Pridáme ich čoskoro 🙂",
    bm_fail_line: "Nepodarilo sa načítať status.",
    bm_fail_sub: "Skús neskôr.",
  },
  cz: {
    nav_home: "Domů",
    nav_rules: "Pravidla",
    nav_vip: "VIP",
    nav_gallery: "Galerie",
    nav_discord: "Discord",
    join: "PŘIPOJIT SE",
    hero_kicker: "ČESKOSLOVENSKÝ VANILLA SERVER",
    home_card_title: "Obsah stránky",
    copy_ip: "KOPÍROVAT IP",
    copied: "Zkopírováno!",
    md_load_fail: "Nepodařilo se načíst obsah.",
    gallery_empty_home: "Zatím tu nejsou žádné screenshoty. Brzy je přidáme 🙂",
    bm_fail_line: "Nepodařilo se načíst status.",
    bm_fail_sub: "Zkus později.",
  }
};

function t(key){
  return (I18N[CURRENT_LANG] && I18N[CURRENT_LANG][key]) || I18N.sk[key] || key;
}

function applyI18n(){
  // Nav labels
  const nav = document.getElementById("navMenu");
  if (nav) {
    nav.querySelectorAll("a").forEach(a => {
      const href = a.getAttribute("href") || "";
      if (href === "/") a.textContent = t("nav_home");
      else if (href === "/rules") a.textContent = t("nav_rules");
      else if (href === "/vip") a.textContent = t("nav_vip");
      else if (href === "/gallery") a.textContent = t("nav_gallery");
    });
  }
  const discordNav = document.getElementById("discordNav");
  if (discordNav) discordNav.textContent = t("nav_discord");

  const joinTop = document.getElementById("btnJoinTop");
  if (joinTop) joinTop.textContent = t("join");

  const kicker = document.querySelector(".hero .kicker");
  if (kicker) kicker.textContent = t("hero_kicker");

  const homeCardTitle = document.getElementById("homeCardTitle");
  if (homeCardTitle) homeCardTitle.textContent = t("home_card_title");

  const copyBtn = document.getElementById("btnCopyIP");
  if (copyBtn) {
    // Preserve IP span
    const ipSpan = document.getElementById("ipInline");
    copyBtn.innerHTML = `${t("copy_ip")} ${ipSpan ? ipSpan.outerHTML : ""}`;
  }
}

const $ = (sel, root=document) => root.querySelector(sel);


// === LANGUAGE (SK/CZ) ===
const SUPPORTED_LANGS = ["sk","cz"];

function normalizeLang(raw){
  if(!raw) return null;
  raw = String(raw).toLowerCase();
  if (raw.startsWith("cs") || raw.startsWith("cz")) return "cz";
  if (raw.startsWith("sk")) return "sk";
  if (SUPPORTED_LANGS.includes(raw)) return raw;
  return null;
}

function getUrlLang(){
  try{
    const u = new URL(window.location.href);
    return normalizeLang(u.searchParams.get("lang"));
  }catch(e){ return null; }
}

function detectLang(){
  // Priority: URL ?lang=sk|cz -> saved -> browser -> fallback sk
  const urlLang = getUrlLang();
  if (urlLang) return urlLang;
  const saved = normalizeLang(localStorage.getItem("lang"));
  if (saved) return saved;
  const nav = normalizeLang((navigator.languages && navigator.languages[0]) || navigator.language);
  return nav || "sk";
}

let CURRENT_LANG = detectLang();

function updateLangSwitcherUI(lang){
  document.querySelectorAll("[data-lang-btn]").forEach(btn => {
    const bLang = btn.getAttribute("data-lang-btn");
    btn.style.opacity = (bLang === lang) ? "1" : "0.65";
  });
}

function ensureLangSwitcher(){
  if (document.getElementById("langSwitcher")) return;
  const topbar = document.querySelector(".topbar-inner");
  if (!topbar) return;

  const wrap = document.createElement("div");
  wrap.id = "langSwitcher";
  wrap.style.display = "flex";
  wrap.style.gap = "8px";
  wrap.style.alignItems = "center";
  wrap.style.marginLeft = "10px";

  const mk = (label, lang) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "btn btn-ghost btn-small";
    b.textContent = label;
    b.setAttribute("data-lang-btn", lang);
    b.addEventListener("click", () => setLang(lang));
    return b;
  };

  wrap.appendChild(mk("SK", "sk"));
  wrap.appendChild(mk("CZ", "cz"));

  const cta = document.querySelector(".topbar-inner .cta");
  if (cta) topbar.insertBefore(wrap, cta);
  else topbar.appendChild(wrap);
}

function setLang(lang){
  const next = normalizeLang(lang) || "sk";
  CURRENT_LANG = next;
  localStorage.setItem("lang", next);
  document.documentElement.setAttribute("lang", next);
  ensureLangSwitcher();
  updateLangSwitcherUI(next);
  applyStaticI18n(next);

  const page = document.body.getAttribute("data-page");
  renderPageMarkdown(page).catch(()=>{});
}

function initLang(){
  document.documentElement.setAttribute("lang", CURRENT_LANG);
  ensureLangSwitcher();
  updateLangSwitcherUI(CURRENT_LANG);
  applyStaticI18n(CURRENT_LANG);
}


function applyStaticI18n(lang){
  const dict = {
    sk: {
      nav_home: "Domov",
      nav_rules: "Pravidlá",
      nav_vip: "VIP",
      nav_gallery: "Galéria",
      join_top: "PRIPOJIŤ SA",
      promo_rules: "Pravidlá",
      kicker: "SLOVENSKÝ VANILLA SERVER",
      copy_ip: "COPY IP",
      connect: "CONNECT",
      discord: "DISCORD",
      support: "💛 PODPORA",
      chip_wipe: "Wipe:",
      chip_mode: "Mode:",
      chip_team: "Team limit:",
      chip_online: "Online:",
      wipe_countdown_title: "Wipe odpočet",
      wipe_next: "Najbližší wipe:",
      status_title: "Status servera",
      tip_title: "Tip",
      tip_text: "Ak máš problém alebo report, píš cez Discord – ideálne s videom alebo screenshotom.",
      wipe_title: "Wipe",
      wipe_desc: "Monthly – každý prvý štvrtok v mesiaci o 20:00"
    },
    cz: {
      nav_home: "Domů",
      nav_rules: "Pravidla",
      nav_vip: "VIP",
      nav_gallery: "Galerie",
      join_top: "PŘIPOJIT SE",
      promo_rules: "Pravidla",
      kicker: "ČESKÝ VANILLA SERVER",
      copy_ip: "KOPÍROVAT IP",
      connect: "PŘIPOJIT",
      discord: "DISCORD",
      support: "💛 PODPORA",
      chip_wipe: "Wipe:",
      chip_mode: "Režim:",
      chip_team: "Limit týmu:",
      chip_online: "Online:",
      wipe_countdown_title: "Odpočet wipe",
      wipe_next: "Nejbližší wipe:",
      status_title: "Stav serveru",
      tip_title: "Tip",
      tip_text: "Pokud máš problém nebo report, piš přes Discord – ideálně s videem nebo screenshotem.",
      wipe_title: "Wipe",
      wipe_desc: "Monthly – každý první čtvrtek v měsíci ve 20:00"
    }
  };

  const t = dict[lang] || dict.sk;

  // Top nav labels
  const nav = document.getElementById("navMenu");
  if (nav){
    const links = nav.querySelectorAll("a");
    links.forEach(a => {
      const href = a.getAttribute("href") || "";
      if (href === "/") a.textContent = t.nav_home;
      else if (href === "/rules") a.textContent = t.nav_rules;
      else if (href === "/vip") a.textContent = t.nav_vip;
      else if (href === "/gallery") a.textContent = t.nav_gallery;
    });
  }

  // Header join button
  const jt = document.getElementById("btnJoinTop");
  if (jt) jt.textContent = t.join_top;

  // Promo link
  const pl = document.getElementById("promoLink");
  if (pl) pl.textContent = t.promo_rules;

  // Landing hero elements
  const kicker = document.querySelector(".kicker");
  if (kicker) kicker.textContent = t.kicker;

  const btnCopy = document.getElementById("btnCopyIP");
  if (btnCopy){
    const span = btnCopy.querySelector("#ipInline");
    btnCopy.innerHTML = "";
    btnCopy.appendChild(document.createTextNode(t.copy_ip + " "));
    if (span) btnCopy.appendChild(span);
  }

  const btnConn = document.getElementById("btnConnect");
  if (btnConn) btnConn.textContent = t.connect;

  const d = document.getElementById("discordLink");
  if (d) d.textContent = t.discord;

  const sup = document.getElementById("donateLink");
  if (sup) sup.textContent = t.support;

  // Chips labels
  const chipEls = document.querySelectorAll(".chips .chip");
  chipEls.forEach(chip => {
    const labelNode = chip.childNodes[0];
    if (!labelNode || labelNode.nodeType !== 3) return;
    const label = (labelNode.textContent || "").trim();
    if (label.startsWith("Wipe:")) labelNode.textContent = t.chip_wipe + " ";
    else if (label.startsWith("Mode:") || label.startsWith("Režim:")) labelNode.textContent = t.chip_mode + " ";
    else if (label.startsWith("Team limit:") || label.startsWith("Limit týmu:")) labelNode.textContent = t.chip_team + " ";
    else if (label.startsWith("Online:")) labelNode.textContent = t.chip_online + " ";
  });

  // Dynamic cards on landing
  const wipeCardTitle = document.querySelector("#wipeCountdown h3");
  if (wipeCardTitle) wipeCardTitle.textContent = t.wipe_countdown_title;

  const wipeNext = document.getElementById("nextWipeLabel");
  if (wipeNext) wipeNext.textContent = t.wipe_next;

  const statusTitle = document.querySelector("#serverStatus h3");
  if (statusTitle) statusTitle.textContent = t.status_title;

  const tipTitle = document.querySelector("#tipCard h3");
  if (tipTitle) tipTitle.textContent = t.tip_title;

  const tipText = document.querySelector("#tipCard p");
  if (tipText) tipText.textContent = t.tip_text;

  const wipeTitle = document.querySelector("#wipeInfo h3");
  if (wipeTitle) wipeTitle.textContent = t.wipe_title;

  const wipeDesc = document.querySelector("#wipeInfo p");
  if (wipeDesc) wipeDesc.textContent = t.wipe_desc;
}


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
    // Support:
    //  - **bold**
    //  - bare URLs
    //  - markdown links: [text](https://...)
    let out = raw
      .replace(/\*\*([^*]+)\*\*/g, (_, t) => `@@BOLD_${tokenLinks.push({ t, u: null, kind: "bold" })-1}@@`)
      .replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, (_, text, url) => {
        return `@@MLINK_${tokenLinks.push({ t: text, u: url, kind: "mlink" })-1}@@`;
      })
      .replace(/(https?:\/\/[^\s)]+)/g, (url) => `@@LINK_${tokenLinks.push({ t: url, u: url, kind: "url" })-1}@@`);
    out = escapeHtml(out);
    out = out.replace(/@@BOLD_(\d+)@@/g, (_, i) => {
      const tok = tokenLinks[Number(i)];
      const txt = tok && tok.kind === "bold" ? tok.t : "";
      return `<strong>${escapeHtml(txt || "")}</strong>`;
    });
    out = out.replace(/@@MLINK_(\d+)@@/g, (_, i) => {
      const tok = tokenLinks[Number(i)];
      const text = tok?.t || "";
      const url = tok?.u || "";
      const isVipBuy = /k[uú]pi[ťt]\s+vip/i.test(text);
      const cls = isVipBuy ? "btn btn-primary" : "";
      return `<a href="${escapeHtml(url)}" target="_blank" rel="noreferrer"${cls ? ` class=\"${cls}\"` : ""}>${escapeHtml(text)}</a>`;
    });
    out = out.replace(/@@LINK_(\d+)@@/g, (_, i) => {
      const tok = tokenLinks[Number(i)];
      const url = tok?.u || tok?.t || "";
      return `<a href="${escapeHtml(url)}" target="_blank" rel="noreferrer">${escapeHtml(url)}</a>`;
    });
    return out;
  }
}

function mdPathFor(slug){ return `/content/${slug}.${CURRENT_LANG}.md`; }

async function renderMarkdownInto(targetSel, mdPath) {
  const el = $(targetSel);
  if (!el) return;
  const res = await fetch(mdPath, { cache: "no-store" });
  if (!res.ok) { el.innerHTML = `<p>${t("md_load_fail")}</p>`; return; }
  const md = await res.text();
  el.innerHTML = mdToHtml(md);
}


async function renderPageMarkdown(page){
  const config = APP_CONFIG || DEFAULT_CONFIG;
  // Re-apply static UI translations first
  applyStaticI18n(CURRENT_LANG);

  if (page === "home") {
    await initHome(config);
    await renderMarkdownInto("#mdHome", mdPathFor("home"));
    const homeGrid = document.getElementById("homeShotsGrid");
    if (homeGrid) {
      await renderGalleryFromManifest(homeGrid, {
        limit: 6,
        emptyMessage: t("gallery_empty_home"),
      });
    }
    startWipeCountdown();
    startBMStatusWidget(37458252).catch(() => {
      const lineEl = document.getElementById("bmStatusLine");
      const subEl  = document.getElementById("bmStatusSub");
      if (lineEl) lineEl.textContent = t("bm_fail_line");
      if (subEl) subEl.textContent = t("bm_fail_sub");
    });
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

// ---- BattleMetrics: simple status widget (HTTP) ----
// Uses the public BattleMetrics API so it works on a static site (no UDP query needed).
async function startBMStatusWidget(serverId){
  const lineEl = document.getElementById("bmStatusLine");
  const subEl  = document.getElementById("bmStatusSub");
  const cardEl = document.getElementById("bmStatusCard");
  if (!lineEl || !subEl || !cardEl) return;

  const cacheKey = `bm_status_${serverId}`;
  try {
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      const { t, data } = JSON.parse(cached);
      if (Date.now() - t < 60_000 && data) {
        render(data);
        // still refresh in background but don't block UI
        refresh(false).catch(() => {});
        return;
      }
    }
  } catch {}

  await refresh(true);

  async function refresh(blocking){
    if (blocking) {
      lineEl.textContent = "Načítavam…";
      subEl.textContent = "";
    }

    const url = `https://api.battlemetrics.com/servers/${encodeURIComponent(String(serverId))}`;
    const res = await fetch(url, { headers: { "Accept": "application/json" } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    const a = json?.data?.attributes;
    if (!a) throw new Error("No attributes");

    const data = {
      name: a.name || "Rust server",
      status: a.status || "unknown",
      players: a.players,
      maxPlayers: a.maxPlayers,
      map: a.details?.map || a.details?.rust?.map || a.details?.mapName || "",
      country: a.country || "",
      ip: a.ip || "",
      port: a.port || "",
      updatedAt: a.updatedAt || ""
    };

    try { localStorage.setItem(cacheKey, JSON.stringify({ t: Date.now(), data })); } catch {}
    render(data);
  }

  function render(d){
    const online = String(d.status).toLowerCase() === "online";
    const dot = online ? "🟢" : "🔴";
    const playersText = (typeof d.players === "number" && typeof d.maxPlayers === "number")
      ? `${d.players}/${d.maxPlayers}`
      : (d.players ?? "?") + "/" + (d.maxPlayers ?? "?");

    lineEl.innerHTML = `${dot} <strong>${escapeHtml(d.name)}</strong><br>Hráči: <strong>${escapeHtml(playersText)}</strong>`;

    const bits = [];
    if (d.map) bits.push(`Mapa: ${d.map}`);
    if (d.ip && d.port) bits.push(`IP: ${d.ip}:${d.port}`);
    subEl.textContent = bits.join(" • ");
  }
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


function showConnectHelp(ipport){
  const msg = `Ak sa Steam link neotvorí, spusti Rust a v konzole (F1) zadaj:\nclient.connect ${ipport}`;
  alert(msg);
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
    connectBtn.addEventListener("click", (e) => { e.preventDefault(); location.href = CONNECT_LINK; setTimeout(()=>showConnectHelp(CONNECT_IPPORT || '203.16.163.84:24789'), 1200); });
    connectBtn.setAttribute("href", CONNECT_LINK);
  }
  if (joinTopBtn) {
    joinTopBtn.classList.add("btn-glow");
    joinTopBtn.addEventListener("click", (e) => { e.preventDefault(); location.href = CONNECT_LINK; setTimeout(()=>showConnectHelp(CONNECT_IPPORT || '203.16.163.84:24789'), 1200); });
    joinTopBtn.setAttribute("href", CONNECT_LINK);
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
  if (!grid) return;
  await renderGalleryFromManifest(grid, { emptyMessage: "Zatiaľ tu nie sú žiadne obrázky." });
}

/**
 * Render gallery thumbs into a given grid from /gallery/manifest.json.
 * Can be reused on Home as a "latest screenshots" preview.
 */
async function renderGalleryFromManifest(gridEl, opts={}){
  const {
    limit = 0,
    emptyMessage = "Zatiaľ tu nie sú žiadne obrázky.",
    notFoundMessage = "Galéria sa nenašla.",
  } = opts;

  const box = $("#lightbox");
  const closeBtn = $("#lbClose");
  const imgEl = $("#lbImg");
  const titleEl = $("#lbTitle");
  const descEl = $("#lbDesc");

  const canLightbox = Boolean(box && closeBtn && imgEl && titleEl && descEl);

  const res = await fetch("/gallery/manifest.json", { cache: "no-store" });
  if (!res.ok) {
    gridEl.innerHTML = `<p class='small'>${escapeHtml(notFoundMessage)}</p>`;
    return;
  }

  const data = await res.json();
  const imagesRaw = Array.isArray(data.images) ? data.images : [];
  const images = (limit > 0) ? imagesRaw.slice(0, limit) : imagesRaw;

  if (!images.length) {
    gridEl.innerHTML = `<p class='small'>${escapeHtml(emptyMessage)}</p>`;
    return;
  }

  // Clear existing
  gridEl.innerHTML = "";

  function openLightbox(src, title, desc){
    if (!canLightbox) return;
    imgEl.src = src;
    titleEl.textContent = title;
    descEl.textContent = desc;
    box.classList.add("open");
  }
  function close(){
    if (!canLightbox) return;
    box.classList.remove("open");
    imgEl.src = "";
  }

  if (canLightbox && !box.dataset.bound){
    closeBtn.addEventListener("click", close);
    box.addEventListener("click", (e) => { if (e.target === box) close(); });
    document.addEventListener("keydown", (e)=>{ if(e.key==="Escape") close(); });
    box.dataset.bound = "1";
  }

  images.forEach((img) => {
    const file = img.file;
    if (!file) return;
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

    if (canLightbox) {
      card.addEventListener("click", () => openLightbox(src, title, desc));
    } else {
      // Fallback: go to gallery
      card.addEventListener("click", () => { location.href = "/gallery"; });
    }

    gridEl.appendChild(card);
  });
}




(async function main(){
  document.body.classList.add('wipe-pre');
  const config = await loadConfig();
  APP_CONFIG = config;
  await initCommon(config);
  initLang();

  const page = document.body.getAttribute("data-page");
  renderPageMarkdown(page).catch(()=>{});
})();


// === BIND_ALL_IDS_FIX ===
// Bind click handlers to ALL matches (guards against duplicate IDs from cached HTML).
document.addEventListener("DOMContentLoaded", () => {
  try {
    const bindAll = (selector, fn) => {
      document.querySelectorAll(selector).forEach(el => el.addEventListener("click", fn));
    };

    bindAll("#btnCopyIP", (e) => {
      e.preventDefault();
      const ipEl = document.getElementById("ipInline");
      const ip = ipEl ? ipEl.textContent.trim() : "";
      if (ip) copyText(ip);
    });

    bindAll("#btnJoinTop", (e) => {
      const href = e.currentTarget.getAttribute("href") || "";
      if (href.trim() === "#" || href.trim() === "") {
        e.preventDefault();
        loadConfig().then(cfg => { if (cfg?.connectLink) location.href = cfg.connectLink; });
      }
      // otherwise let the steam:// link open normally
    });

    bindAll("#btnConnect", (e) => {
      const href = e.currentTarget.getAttribute("href") || "";
      if (href.trim() === "#" || href.trim() === "") {
        e.preventDefault();
        loadConfig().then(cfg => { if (cfg?.connectLink) location.href = cfg.connectLink; });
      }
    });
  } catch {}
});
