import { ServerConfig, GalleryImage } from './types';

export const serverConfig: ServerConfig = {
  serverName: "CZ/SK Rust Pohoda",
  serverIP: "203.16.163.84:24789",
  connectLink: "steam://connect/203.16.163.84:24789",
  discord: "https://discord.com/invite/4eY75AnPCj",
  wipe: "Monthly – každý prvý štvrtok v mesiaci o 20:00",
  mode: "Vanilla",
  teamLimit: "Quad",
  tagline: "Vanilla • Quad • Monthly wipe • No P2W",
  footerLine: "Vanilla • Quad • No P2W • Fair Play",
  battlemetricsServerId: "",
  battlemetricsLabel: "BattleMetrics",
  defaultLang: "sk",
  donateLabel: "Podpor server",
  donateUrl: "",
  promoEnabled: true,
  promoText_sk: "Najbližší wipe: 1. štvrtok v mesiaci o 20:00 • Vanilla • Quad • No P2W",
  promoText_cz: "Nejbližší wipe: 1. čtvrtek v měsíci ve 20:00 • Vanilla • Quad • No P2W",
  topRules_sk: [
    "Max tím: 4 (Quad)",
    "Max hodiny tímu: 10 000",
    "Verejný Steam profil",
    "Zákaz alt účtov",
    "Zákaz teaming medzi tímami"
  ],
  topRules_cz: [
    "Max tým: 4 (Quad)",
    "Max hodiny týmu: 10 000",
    "Veřejný Steam profil",
    "Zákaz alt účtů",
    "Zákaz teamingu mezi týmy"
  ],
  donateLabel_sk: "Podpora servera",
  donateLabel_cz: "Podpora serveru",
  donateComingSoon: true,
  donateComingSoonText_sk: "Tebex store je momentálne v schvaľovaní. Podpora servera bude dostupná čoskoro.",
  donateComingSoonText_cz: "Tebex store je momentálně ve schvalování. Podpora serveru bude dostupná brzy.",
  donateDiscordCta_sk: "Ak chceš podporiť hneď, ozvi sa nám na Discorde.",
  donateDiscordCta_cz: "Pokud chceš podpořit hned, napiš nám na Discord.",
  donateDiscordText_sk: "Kontakt cez Discord",
  donateDiscordText_cz: "Kontakt přes Discord"
};

export const galleryImages: GalleryImage[] = [
  {
    file: "https://raw.githubusercontent.com/Siberia799/rustpohodaw/main/gallery/326b414d-88c0-446d-a2c1-00f5c7ed947a.jpg",
    title: "Prestrelka na pláži",
    desc: "Tímový útok pri pobreží"
  },
  {
    file: "https://raw.githubusercontent.com/Siberia799/rustpohodaw/main/gallery/896dcb62-7433-429d-8faf-565b79a56178.jpg",
    title: "Raid vo vode",
    desc: "Použitie výbušnín pri raide vodnej základne"
  },
  {
    file: "https://raw.githubusercontent.com/Siberia799/rustpohodaw/main/gallery/336c9c78-1934-4bf2-b4c6-b0ed4e98a2d3.jpg",
    title: "Vežová základňa nad vodou",
    desc: "Základňa na vyvýšenom mieste nad oceánom"
  },
  {
    file: "https://raw.githubusercontent.com/Siberia799/rustpohodaw/main/gallery/257da1df-95dd-4427-a8ce-7491e709f2b1.jpg",
    title: "Raid v interiéri",
    desc: "Blízky boj vo vnútri nepriateľskej základne"
  }
];

export const rulesContent = {
  sk: {
    title: "Pravidlá servera",
    subtitle: "Dodržuj fair play a rešpektuj ostatných hráčov.",
    list: [
      { id: 1, title: "Maximálny počet hráčov v tíme – 4 (Quad)", text: "Jeden tím môže mať maximálne 4 aktívnych členov." },
      { id: 2, title: "Maximálne 10 000 hodín (tím)", text: "Súčet herných hodín všetkých členov tímu nesmie presiahnuť 10 000 hodín." },
      { id: 3, title: "Verejný Steam profil", text: "Každý hráč musí mať verejný Steam profil kvôli overeniu hodín a fair play." },
      { id: 4, title: "Zákaz alt účtov", text: "Používanie viacerých Steam účtov (altov) za účelom obchádzania pravidiel je zakázané." },
      { id: 5, title: "Zákaz urážok a toxického správania", text: "Urážky, nadávky, vyhrážanie, rasizmus, diskriminácia, provokovanie a toxické správanie sú zakázané." },
      { id: 6, title: "Fair play", text: "Zákaz cheatov, skriptov, makier, exploitov, bug abuse a externých programov dávajúcich výhodu." },
      { id: 7, title: "Zákaz teamingu", text: "Spolupráca medzi tímami pri raidoch, PvP, obrane alebo loote je zakázané." },
      { id: 8, title: "Spam a reklama", text: "Spam, flood, reklama a propagácia iných serverov sú zakázané." },
      { id: 9, title: "Nahlasovanie bugov", text: "Nájdené bugy je nutné nahlásiť administrácii, ich zneužívanie je trestané." },
      { id: 10, title: "Zákaz griefingu mimo mechaniky hry", text: "Úmyselné ničenie základní alebo blokovanie progresu mimo bežných herných mechaník je zakázané." },
      { id: 11, title: "Zákaz zneužívania herných mechaník", text: "Obchádzanie obmedzení serveru (napr. limit tímu, hodín a pod.) je zakázané." },
      { id: 12, title: "Zákaz blokovania monumentov", text: "Úmyselné blokovanie vstupov, loot roomov a spawnov je zakázané." },
      { id: 13, title: "Zákaz zneužívania voice chatu", text: "Prehrávanie zvukov, hudby, screamov alebo obťažovanie cez voice chat je zakázané." },
      { id: 14, title: "Rešpekt k nováčikom", text: "Úmyselný spawn-kill alebo dlhodobé šikanovanie nových hráčov nie je tolerované." },
      { id: 15, title: "Zákaz obchádzania trestov", text: "Pokusy o obídenie banu, kicku alebo trestu vedú k prísnejším postihom." },
      { id: 16, title: "Identita hráča", text: "Vydávanie sa za admina alebo člena administrácie je zakázané." },
      { id: 17, title: "Pokyny administrácie", text: "Rozhodnutia administrátorov sú konečné a záväzné." },
      { id: 18, title: "Dôkazy a riešenie sporov", text: "Sťažnosti riešte slušne cez Discord, ideálne s dôkazmi (video, screenshot)." },
      { id: 19, title: "Tresty za porušenie pravidiel", text: "Porušenie pravidiel môže viesť k varovaniu, wipe trestu, kicku, dočasnému alebo permanentnému banu." }
    ]
  },
  cz: {
    title: "Pravidla serveru",
    subtitle: "Dodržuj fair play a respektuj ostatní hráče.",
    list: [
      { id: 1, title: "Maximální počet hráčů v týmu – 4 (Quad)", text: "Jeden tým může mít maximálně 4 aktivní členy." },
      { id: 2, title: "Maximálně 10 000 hodin (tým)", text: "Součet herních hodin všech členů týmu nesmí přesáhnout 10 000 hodin." },
      { id: 3, title: "Veřejný Steam profil", text: "Každý hráč musí mít veřejný Steam profil kvůli ověření hodin a fair play." },
      { id: 4, title: "Zákaz alt účtů", text: "Používání více Steam účtů (altů) za účelem obcházení pravidel je zakázané." },
      { id: 5, title: "Zákaz urážek a toxického chování", text: "Urážky, nadávky, vyhrožování, rasismus, diskriminace, provokování a toxické chování je zakázané." },
      { id: 6, title: "Zákaz cheatu a zneužívání bugů", text: "Jakýkoli cheat, skript, makro, exploit nebo zneužívání chyb hry je zakázané." },
      { id: 7, title: "Zákaz stream-snipu", text: "Záměrné vyhledávání/obtěžování hráčů podle streamu je zakázané." },
      { id: 8, title: "Zákaz spolupráce mezi týmy", text: "Aliance, „teaming“, společné raidy a jakákoli dlouhodobá spolupráce mezi týmy je zakázaná (pokud admin neoznámí event výjimku)." },
      { id: 9, title: "Zákaz zneužívání report systému", text: "Falešné nahlášení nebo spam reportů je zakázaný." },
      { id: 10, title: "Respektuj výkon serveru", text: "Záměrné lagování, DoS pokusy, masové entity apod. jsou zakázané." },
      { id: 11, title: "Stavby a úkryty", text: "„Griefing“ (záměrné znehodnocení basy bez herního důvodu) může být postihované." },
      { id: 12, title: "Obchod a scamy", text: "Podvody mimo pravidla hry (např. mimo-herní „deal“ a okradení) řeš přes Discord – bez důkazů se to nedá řešit." },
      { id: 13, title: "Nahlášení hráče", text: "Podezření na cheaty/bugy hlas přes Discord, ideálně s důkazem (video/screenshot, Steam ID)." },
      { id: 14, title: "Spawn-kill a šikana", text: "Úmyslný spawn-kill nebo dlouhodobé šikanování nových hráčů není tolerované." },
      { id: 15, title: "Zákaz obcházení trestů", text: "Pokusy o obcházení banu, kicku nebo trestu vedou k přísnějším postihům." },
      { id: 16, title: "Identita hráče", text: "Vydávání se za admina nebo člena administrace je zakázané." },
      { id: 17, title: "Pokyny administrace", text: "Rozhodnutí administrátorů jsou konečná a závazná." },
      { id: 18, title: "Důkazy a řešení sporů", text: "Stížnosti řeš slušně přes Discord, ideálně s důkazy (video, screenshot)." },
      { id: 19, title: "Tresty za porušení pravidel", text: "Porušení pravidel může vést k varování, wipe trestu, kicku, dočasnému nebo permanentnímu banu." }
    ]
  }
};

export const vipContent = {
  sk: {
    title: "VIP & Podpora",
    subtitle: "Kúpa VIP balíčka",
    ctaLabel: "🛒 KÚPIŤ VIP & SPONZOR",
    ctaUrl: "https://czsk-rust-pohoda.tebex.io",
    howTitle: "Ako to kúpiť",
    steps: [
      "Prihlás sa cez Steam na https://czsk-rust-pohoda.tebex.io",
      "Vyber si balíček",
      "Dokonči Checkout a zaplať",
      "Po zaplatení bude v priebehu niekoľkých hodín priradená rola k prihlásenému Steam účtu, na ktorý bol balíček zakúpený (podľa Steam ID)"
    ]
  },
  cz: {
    title: "VIP & Sponzor",
    subtitle: "Nákup VIP balíčku",
    ctaLabel: "🛒 KOUPIT VIP & SPONZOR",
    ctaUrl: "https://czsk-rust-pohoda.tebex.io",
    howTitle: "Jak to koupit",
    steps: [
      "Přihlas se přes Steam na https://czsk-rust-pohoda.tebex.io",
      "Vyber si balíček",
      "Dokonči checkout a zaplať",
      "Po zaplacení bude během několika hodin přiřazena role k přihlášenému Steam účtu, na který byl balíček zakoupen (podle Steam ID)"
    ]
  }
};

export const homeContent = {
  sk: {
    title: "Vanilla Rust server",
    subtitle: "Pre hráčov, ktorí chcú pohodu, férový gameplay a žiadne P2W.",
    tagline: "Zamerané na SK komunitu, stabilný chod a čistý vanilla zážitok.",
    connectionTitle: "Pripojenie",
    connectionIP: "IP: 203.16.163.84:24789",
    connectionType: "Typ: Vanilla",
    connectionTeam: "Max tím: Quad (max 4)",
    wipeTitle: "Wipe",
    wipeText: "Monthly wipe – každý prvý štvrtok v mesiaci o 20:00.",
    communityTitle: "Komunita",
    communityText: "Pridaj sa na Discord",
    philosophyTitle: "Naša filozofia",
    philosophyList: [
      "žiadne pay-to-win",
      "aktívna, ale férová administrácia",
      "minimum zásahov do gameplaya",
      "príjemná atmosféra bez toxického správania"
    ],
    faqTitle: "FAQ",
    faqs: [
      { q: "Kedy je wipe?", a: "Monthly – každý prvý štvrtok v mesiaci o 20:00." },
      { q: "Aký je limit tímu?", a: "Max. 4 hráči (Quad)." },
      { q: "Prečo musím mať verejný Steam profil?", a: "Kvôli overeniu hodín a fair play." },
      { q: "Ako nahlásim cheatera / bug?", a: "Najlepšie cez Discord, ideálne s videom alebo screenshotom." }
    ],
    tipTitle: "Tip",
    tipText: "Ak máš problém alebo report, píš cez Discord – ideálne s videom alebo screenshotom.",
    features: [
      { title: "Férový vanilla zážitok", text: "Bez pay-to-win výhod. Hrá rozhodovanie, skill a taktika." },
      { title: "Aktívna administrácia", text: "Rýchle riešenie reportov, bugov a porušení pravidiel." },
      { title: "Silná CZ/SK komunita", text: "Discord, oznámenia, eventy a čistá komunikácia." }
    ]
  },
  cz: {
    title: "Vanilla Rust server",
    subtitle: "Pro hráče, kteří chtějí pohodu, férový gameplay a žádné P2W.",
    tagline: "Zaměřeno na CZ/SK komunitu, stabilní chod a čistý vanilla zážitek.",
    connectionTitle: "Připojení",
    connectionIP: "IP: 203.16.163.84:24789",
    connectionType: "Typ: Vanilla",
    connectionTeam: "Max tým: Quad (max 4)",
    wipeTitle: "Wipe",
    wipeText: "Monthly wipe – každý první čtvrtek v měsíci ve 20:00.",
    communityTitle: "Komunita",
    communityText: "Přidej se na Discord",
    philosophyTitle: "Naše filozofie",
    philosophyList: [
      "žádné pay-to-win",
      "aktivní, ale férová administrace",
      "minimum zásahů do gameplaye",
      "příjemná atmosféra bez toxického chování"
    ],
    faqTitle: "FAQ",
    faqs: [
      { q: "Kdy je wipe?", a: "Monthly – každý první čtvrtek v měsíci ve 20:00." },
      { q: "Jaký je limit týmu?", a: "Max. 4 hráči (Quad)." },
      { q: "Proč musím mít veřejný Steam profil?", a: "Kvůli ověření hodin a fair play." },
      { q: "Jak nahlásím cheatera / bug?", a: "Nejlépe přes Discord, ideálně s videem nebo screenshotem." }
    ],
    tipTitle: "Tip",
    tipText: "Nejlépe přes Discord, ideálně s videem nebo screenshotem.",
    features: [
      { title: "Férový vanilla zážitek", text: "Bez pay-to-win výhod. Rozhoduje herní myšlení, skill a taktika." },
      { title: "Aktivní administrace", text: "Rychlé řešení reportů, chyb a porušení pravidel." },
      { title: "Silná CZ/SK komunita", text: "Discord, oznámení, eventy a přímá komunikace." }
    ]
  }
};
