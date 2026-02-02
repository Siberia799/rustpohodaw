(function () {
  function normalizeLang(raw) {
    if (!raw) return null;
    raw = String(raw).toLowerCase();
    if (raw.startsWith("cs") || raw.startsWith("cz")) return "cz";
    if (raw.startsWith("sk")) return "sk";
    return null;
  }

  function getUrlLang() {
    try {
      const u = new URL(window.location.href);
      return normalizeLang(u.searchParams.get("lang"));
    } catch (e) {
      return null;
    }
  }

  function detectLang() {
    // Priority: URL ?lang=sk|cz -> saved choice -> browser language -> fallback sk
    const urlLang = getUrlLang();
    if (urlLang) return urlLang;

    const saved = normalizeLang(localStorage.getItem("lang"));
    if (saved) return saved;

    const nav = normalizeLang((navigator.languages && navigator.languages[0]) || navigator.language);
    return nav || "sk";
  }

  function applyLang(lang) {
    lang = normalizeLang(lang) || "sk";
    localStorage.setItem("lang", lang);
    document.documentElement.setAttribute("lang", lang);

    document.querySelectorAll("[data-lang]").forEach(function (el) {
      el.style.display = (el.getAttribute("data-lang") === lang) ? "" : "none";
    });

    // Update active state on buttons if present
    document.querySelectorAll("[data-lang-btn]").forEach(function (btn) {
      const btnLang = btn.getAttribute("data-lang-btn");
      btn.style.opacity = (btnLang === lang) ? "1" : "0.65";
      btn.style.transform = (btnLang === lang) ? "scale(1.02)" : "scale(1)";
    });
  }

  function ensureSwitcher() {
    if (document.getElementById("lang-switcher")) return;

    const wrap = document.createElement("div");
    wrap.id = "lang-switcher";
    wrap.style.position = "fixed";
    wrap.style.top = "15px";
    wrap.style.right = "15px";
    wrap.style.zIndex = "9999";
    wrap.style.display = "flex";
    wrap.style.gap = "8px";

    function mkBtn(label, lang) {
      const b = document.createElement("button");
      b.type = "button";
      b.setAttribute("data-lang-btn", lang);
      b.textContent = label;
      // Try to use existing site button styles; fallback to inline styles
      b.className = "btn btn-sm";
      b.style.cursor = "pointer";
      b.style.borderRadius = "10px";
      b.style.padding = "8px 12px";
      b.style.border = "1px solid rgba(255,255,255,0.15)";
      b.style.background = "rgba(0,0,0,0.35)";
      b.style.color = "inherit";
      b.style.backdropFilter = "blur(6px)";

      b.addEventListener("click", function () {
        applyLang(lang);
      });
      return b;
    }

    wrap.appendChild(mkBtn("SK", "sk"));
    wrap.appendChild(mkBtn("CZ", "cz"));

    document.body.appendChild(wrap);
  }

  document.addEventListener("DOMContentLoaded", function () {
    // Only show switcher if there are language blocks on the page
    if (document.querySelector("[data-lang='sk'], [data-lang='cz']")) {
      ensureSwitcher();
      applyLang(detectLang());
    }
  });

  // Expose for manual use if needed
  window.setLang = applyLang;
})();
