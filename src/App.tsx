/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  motion, 
  AnimatePresence 
} from 'motion/react';
import { 
  Shield, 
  Users, 
  Clock, 
  Copy, 
  ExternalLink, 
  AlertTriangle, 
  HelpCircle, 
  BookOpen, 
  DollarSign, 
  Image as ImageIcon, 
  Volume2, 
  Check, 
  Globe, 
  ArrowRight, 
  Menu, 
  X, 
  ChevronRight, 
  Search, 
  ChevronLeft, 
  MessageSquare, 
  Sparkles,
  Zap,
  Play,
  Activity,
  Award
} from 'lucide-react';
import { serverConfig, galleryImages, rulesContent, vipContent, homeContent } from './data';
import homeBg from '../hero-bg.jpg';
import rulesBg from '../assets/bg.jpg';
import vipBg from '../assets/wow-bg.jpg';
import galleryBg from '../assets/hero-rust.jpg';

// Helper to find the next first Thursday of a month at 20:00 CET/CEST
function getNextWipeDate(): Date {
  const now = new Date();
  
  // Test current month first
  const currentFirstThursday = getFirstThursdayOfMonth(now.getFullYear(), now.getMonth());
  if (now.getTime() < currentFirstThursday.getTime()) {
    return currentFirstThursday;
  }
  
  // Otherwise, get first Thursday of next month
  let nextYear = now.getFullYear();
  let nextMonth = now.getMonth() + 1;
  if (nextMonth > 11) {
    nextMonth = 0;
    nextYear += 1;
  }
  return getFirstThursdayOfMonth(nextYear, nextMonth);
}

function getFirstThursdayOfMonth(year: number, month: number): Date {
  // Month is 0-indexed (0 = Jan, 11 = Dec)
  const date = new Date(year, month, 1, 20, 0, 0, 0); // 20:00 (8:00 PM)
  
  // Day of week: 0 = Sunday, 1 = Monday, ..., 4 = Thursday, ...
  const day = date.getDay();
  let daysUntilThursday = 4 - day;
  if (daysUntilThursday < 0) {
    daysUntilThursday += 7; // Wrap to next week if day of week > Thursday
  }
  
  date.setDate(date.getDate() + daysUntilThursday);
  return date;
}

const tabBackgrounds = {
  home: homeBg,
  rules: rulesBg,
  vip: vipBg,
  gallery: galleryBg
};

export default function App() {
  const [lang, setLang] = useState<'sk' | 'cz'>(() => {
    const saved = localStorage.getItem('rust_pohoda_lang');
    if (saved === 'sk' || saved === 'cz') return saved;
    return serverConfig.defaultLang;
  });

  const [activeTab, setActiveTab] = useState<'home' | 'rules' | 'vip' | 'gallery'>(() => {
    const hash = window.location.hash.toLowerCase();
    if (hash === '#rules' || hash === '#pravidla') return 'rules';
    if (hash === '#vip' || hash === '#podpora') return 'vip';
    if (hash === '#gallery' || hash === '#galeria' || hash === '#galerie') return 'gallery';
    return 'home';
  });

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [donateModalOpen, setDonateModalOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [rulesSearch, setRulesSearch] = useState('');
  
  // Programmatically handle countdown ticking
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0, totalMs: 0 });

  // Simulate active players count ticking to feel vibrant and live
  const [livePlayersCount, setLivePlayersCount] = useState(38);

  useEffect(() => {
    localStorage.setItem('rust_pohoda_lang', lang);
  }, [lang]);

  // Sync hash changes with navigation
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.toLowerCase();
      if (hash === '#rules' || hash === '#pravidla') {
        setActiveTab('rules');
      } else if (hash === '#vip' || hash === '#podpora') {
        setActiveTab('vip');
      } else if (hash === '#gallery' || hash === '#galeria' || hash === '#galerie') {
        setActiveTab('gallery');
      } else {
        setActiveTab('home');
      }
      setMobileMenuOpen(false);
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Set up programmatic tickers
  useEffect(() => {
    // Players count jitter
    const playersInterval = setInterval(() => {
      setLivePlayersCount(prev => {
        const offset = Math.floor(Math.random() * 5) - 2; // -2 to +2
        const next = prev + offset;
        return Math.max(12, Math.min(84, next));
      });
    }, 15000);

    // Countdown clock
    const updateCountdown = () => {
      const now = new Date();
      const target = getNextWipeDate();
      const diff = target.getTime() - now.getTime();

      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, totalMs: 0 });
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / 1000 / 60) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setTimeLeft({ days, hours, minutes, seconds, totalMs: diff });
    };

    updateCountdown();
    const countdownInterval = setInterval(updateCountdown, 1000);

    return () => {
      clearInterval(playersInterval);
      clearInterval(countdownInterval);
    };
  }, []);

  const handleCopyIP = () => {
    navigator.clipboard.writeText(serverConfig.serverIP);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTabChange = (tab: 'home' | 'rules' | 'vip' | 'gallery') => {
    setActiveTab(tab);
    // Sync hash
    if (tab === 'home') window.location.hash = '';
    else if (tab === 'rules') window.location.hash = lang === 'sk' ? 'pravidla' : 'rules';
    else if (tab === 'vip') window.location.hash = 'vip';
    else if (tab === 'gallery') window.location.hash = 'galeria';
    
    // Smooth scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const filteredRules = useMemo(() => {
    const searchLow = rulesSearch.toLowerCase();
    const list = rulesContent[lang].list;
    if (!searchLow.trim()) return list;

    return list.filter(r => 
      r.title.toLowerCase().includes(searchLow) || 
      r.text.toLowerCase().includes(searchLow) ||
      `#${r.id}`.includes(searchLow)
    );
  }, [lang, rulesSearch]);

  const isWipeToday = useMemo(() => {
    const now = new Date();
    const target = getNextWipeDate();
    return now.getFullYear() === target.getFullYear() && 
           now.getMonth() === target.getMonth() && 
           now.getDate() === target.getDate();
  }, [timeLeft.totalMs]);

  const t = useMemo(() => {
    return {
      home: homeContent[lang],
      rules: rulesContent[lang],
      vip: vipContent[lang],
      topRules: lang === 'sk' ? serverConfig.topRules_sk : serverConfig.topRules_cz,
      languageLabel: lang === 'sk' ? 'Slovenčina' : 'Čeština',
      openRulesLabel: lang === 'sk' ? 'Prečítať celé pravidlá' : 'Přečíst celá pravidla',
      openGalleryLabel: lang === 'sk' ? 'Otvoriť celú galériu' : 'Otevřít celou galerii',
      quickLinks: lang === 'sk' ? 'Rýchle odkazy' : 'Rychlé odkazy',
      quickLinksItems: {
        rules: lang === 'sk' ? '📜 Pravidlá' : '📜 Pravidla',
        vip: lang === 'sk' ? '⭐ VIP & Podpora' : '⭐ VIP & Podpora',
        gallery: lang === 'sk' ? '🖼️ Galéria' : '🖼️ Galerie',
      },
      countdownLabel: lang === 'sk' ? 'WIPE ODPOČET' : 'WIPE ODPOČET',
      countdownToday: lang === 'sk' ? 'WIPE DNES 20:00!' : 'WIPE DNES 20:00!',
      statusTitle: lang === 'sk' ? 'Status servera' : 'Status serveru',
      vipPromoLabel: lang === 'sk' ? serverConfig.donateLabel_sk : serverConfig.donateLabel_cz,
      tebexSoonTitle: lang === 'sk' ? 'Tebex v režime schvaľovania' : 'Tebex v režimu schvalování',
      closeLabel: lang === 'sk' ? 'Zavrieť' : 'Zavřít',
      copiedLabel: lang === 'sk' ? 'IP skopírovaná!' : 'IP zkopírována!',
      ipCopyLabel: lang === 'sk' ? 'Kopírovať IP' : 'Kopírovat IP',
      connectLabel: lang === 'sk' ? 'PRIPOJIŤ SA' : 'PŘIPOJIT SE',
      discordLabel: lang === 'sk' ? 'DISKORD' : 'DISCORD',
      livePlayers: lang === 'sk' ? 'Hráči online' : 'Hráči online',
      battlemetricsLabel: serverConfig.battlemetricsLabel || 'BattleMetrics',
      battlemetricsDesc: lang === 'sk' ? 'Online hráči, ping a detaily cez BattleMetrics' : 'Online hráči, ping a detaily přes BattleMetrics',
      battlemetricsBtn: lang === 'sk' ? 'Otvoriť na BattleMetrics' : 'Otevřít na BattleMetrics',
      days: lang === 'sk' ? 'Dni' : 'Dny',
      hours: lang === 'sk' ? 'Hod' : 'Hod',
      minutes: lang === 'sk' ? 'Min' : 'Min',
      seconds: lang === 'sk' ? 'Sek' : 'Sek',
      rulesSearchPlaceholder: lang === 'sk' ? 'Hľadať pravidlo (napr. teaming, limit)...' : 'Hledat pravidlo (např. teaming, limit)...',
      rulesNoResults: lang === 'sk' ? 'Nenašli sa žiadne pravidlá.' : 'Nebyla nalezena žádná pravidla.',
    };
  }, [lang]);

  return (
    <div className="relative min-h-screen bg-[#09090b] text-[#e4e4e7] selection:bg-rust-600 selection:text-white bg-grid">
      
      {/* FIXED TAB BACKGROUND WITH CROSSFADE ANIMATION */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <AnimatePresence mode="popLayout">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 0.35, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.75, ease: "easeInOut" }}
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${tabBackgrounds[activeTab]})` }}
          />
        </AnimatePresence>
        {/* Dark overlay gradients to guarantee perfect high-contrast legibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#09090b]/80 via-[#09090b]/92 to-[#09090b]" />
        <div className="absolute inset-0 bg-radial-at-t from-[#09090b]/0 via-[#09090b]/40 to-[#09090b]/95" />
      </div>

      {/* GLOW DECORATIONS */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-rust-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-[20%] right-1/4 w-[500px] h-[500px] bg-red-800/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[20%] left-10 w-[350px] h-[350px] bg-amber-600/5 rounded-full blur-[120px] pointer-events-none" />

      {/* PROMO BANNER */}
      {serverConfig.promoEnabled && (
        <div id="promo-banner" className="relative z-50 w-full bg-linear-to-r from-rust-950 via-rust-900 to-rust-950 border-b border-rust-500/20 py-2.5 px-4 text-center">
          <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 text-xs md:text-sm font-mono tracking-wider text-rust-200">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rust-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-rust-500"></span>
            </span>
            <span>
              {isWipeToday ? (
                <strong className="text-rust-400 font-bold font-display">{t.countdownToday}</strong>
              ) : (
                lang === 'sk' ? serverConfig.promoText_sk : serverConfig.promoText_cz
              )}
            </span>
          </div>
        </div>
      )}

      {/* HEADER / NAVIGATION */}
      <nav id="navbar" className="sticky top-0 z-40 w-full bg-[#09090b]/90 backdrop-blur-md border-b border-[#1c1c21] transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            
            {/* BRAND LOGO */}
            <div className="flex-shrink-0 flex items-center gap-3 cursor-pointer" onClick={() => handleTabChange('home')}>
              <div className="relative flex items-center justify-center w-11 h-11 bg-linear-to-br from-rust-500 to-rust-700 rounded-xl shadow-lg border border-rust-400/30 overflow-hidden group">
                <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <Shield className="w-5 h-5 text-white filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]" />
              </div>
              <div className="flex flex-col">
                <span className="font-display font-bold text-lg leading-tight tracking-wider text-white">
                  RUST <span className="text-rust-500">POHODA</span>
                </span>
                <span className="font-mono text-[9px] text-[#71717a] font-semibold tracking-widest uppercase">
                  {serverConfig.mode} • {serverConfig.teamLimit}
                </span>
              </div>
            </div>

            {/* DESKTOP MENU BUTTONS */}
            <div className="hidden md:flex items-center gap-1.5 lg:gap-3">
              <button 
                id="nav-home"
                onClick={() => handleTabChange('home')}
                className={`px-4 py-2.5 rounded-lg text-sm font-medium tracking-wide transition-all ${
                  activeTab === 'home' 
                    ? 'text-white bg-rust-500/10 border border-rust-500/20 font-semibold' 
                    : 'text-[#a1a1aa] hover:text-white hover:bg-[#18181b]'
                }`}
              >
                {lang === 'sk' ? 'Domov' : 'Domů'}
              </button>
              <button 
                id="nav-rules"
                onClick={() => handleTabChange('rules')}
                className={`px-4 py-2.5 rounded-lg text-sm font-medium tracking-wide transition-all ${
                  activeTab === 'rules' 
                    ? 'text-white bg-rust-500/10 border border-rust-500/20 font-semibold' 
                    : 'text-[#a1a1aa] hover:text-white hover:bg-[#18181b]'
                }`}
              >
                {lang === 'sk' ? 'Pravidlá' : 'Pravidla'}
              </button>
              <button 
                id="nav-vip"
                onClick={() => handleTabChange('vip')}
                className={`px-4 py-2.5 rounded-lg text-sm font-medium tracking-wide transition-all ${
                  activeTab === 'vip' 
                    ? 'text-white bg-rust-500/10 border border-rust-500/20 font-semibold' 
                    : 'text-[#a1a1aa] hover:text-white hover:bg-[#18181b]'
                }`}
              >
                {lang === 'sk' ? 'VIP & Podpora' : 'VIP & Podpora'}
              </button>
              <button 
                id="nav-gallery"
                onClick={() => handleTabChange('gallery')}
                className={`px-4 py-2.5 rounded-lg text-sm font-medium tracking-wide transition-all ${
                  activeTab === 'gallery' 
                    ? 'text-white bg-rust-500/10 border border-rust-500/20 font-semibold' 
                    : 'text-[#a1a1aa] hover:text-white hover:bg-[#18181b]'
                }`}
              >
                {lang === 'sk' ? 'Galéria' : 'Galerie'}
              </button>
              
              <a 
                id="nav-discord"
                href={serverConfig.discord} 
                target="_blank" 
                rel="noreferrer" 
                className="px-4 py-2.5 rounded-lg text-sm font-medium text-[#a1a1aa] hover:text-white hover:bg-[#18181b] flex items-center gap-1.5 transition-all"
              >
                Discord <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* HEADER ACTIONS (LANG + CONNECT) */}
            <div className="hidden md:flex items-center gap-4">
              {/* Language toggle selector */}
              <div className="flex bg-[#121214] p-1 rounded-lg border border-[#27272a] text-xs">
                <button 
                  id="lang-sk"
                  onClick={() => setLang('sk')}
                  className={`px-2.5 py-1.5 rounded-md font-mono tracking-wider transition-all font-bold ${
                    lang === 'sk' 
                      ? 'bg-rust-600 text-white shadow-xs' 
                      : 'text-[#71717a] hover:text-[#d4d4d8]'
                  }`}
                >
                  SK
                </button>
                <button 
                  id="lang-cz"
                  onClick={() => setLang('cz')}
                  className={`px-2.5 py-1.5 rounded-md font-mono tracking-wider transition-all font-bold ${
                    lang === 'cz' 
                      ? 'bg-rust-600 text-white shadow-xs' 
                      : 'text-[#71717a] hover:text-[#d4d4d8]'
                  }`}
                >
                  CZ
                </button>
              </div>

              {/* Connected CTA */}
              <a 
                id="cta-navbar-connect"
                href={serverConfig.connectLink}
                className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-xs font-bold font-display tracking-wider text-white rounded-lg group bg-linear-to-br from-rust-500 to-amber-500 group-hover:from-rust-500 group-hover:to-amber-500 hover:text-white focus:ring-4 focus:outline-hidden focus:ring-rust-800 transition-all mt-2"
              >
                <span className="relative px-4.5 py-2.5 transition-all ease-in duration-75 bg-neutral-950 rounded-md group-hover:bg-opacity-0 flex items-center gap-2">
                  <Play className="w-3 h-3 text-rust-400 fill-rust-400 group-hover:text-white group-hover:fill-white transition-all" />
                  {t.connectLabel}
                </span>
              </a>
            </div>

            {/* MOBILE MENU TOGGLE */}
            <div className="md:hidden flex items-center gap-3">
              {/* Language toggle selector mobile */}
              <div className="flex bg-[#121214] p-0.5 rounded-md border border-[#27272a] text-[10px]">
                <button 
                  id="lang-mobile-sk"
                  onClick={() => setLang('sk')}
                  className={`px-2 py-1 rounded-sm font-mono tracking-wider transition-all font-bold ${
                    lang === 'sk' ? 'bg-rust-600 text-white' : 'text-[#71717a]'
                  }`}
                >
                  SK
                </button>
                <button 
                  id="lang-mobile-cz"
                  onClick={() => setLang('cz')}
                  className={`px-2 py-1 rounded-sm font-mono tracking-wider transition-all font-bold ${
                    lang === 'cz' ? 'bg-rust-600 text-white' : 'text-[#71717a]'
                  }`}
                >
                  CZ
                </button>
              </div>

              <button 
                id="mobile-menu-btn"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg text-[#a1a1aa] hover:text-white hover:bg-[#18181b] transition-all"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

          </div>
        </div>

        {/* MOBILE DROPDOWN SCREEN */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div 
              id="mobile-drawer"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="md:hidden w-full border-t border-[#1c1c21] bg-[#0c0c0e]/95 backdrop-blur-lg overflow-hidden"
            >
              <div className="px-4.5 py-6 space-y-3 flex flex-col">
                <button 
                  id="mobile-nav-home"
                  onClick={() => handleTabChange('home')}
                  className={`text-left px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                    activeTab === 'home' 
                      ? 'bg-rust-600/10 text-rust-400 border border-rust-500/20 font-semibold' 
                      : 'text-[#a1a1aa] hover:text-white hover:bg-[#18181b]'
                  }`}
                >
                  {lang === 'sk' ? 'Domov' : 'Domů'}
                </button>
                <button 
                  id="mobile-nav-rules"
                  onClick={() => handleTabChange('rules')}
                  className={`text-left px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                    activeTab === 'rules' 
                      ? 'bg-rust-600/10 text-rust-400 border border-rust-500/20 font-semibold' 
                      : 'text-[#a1a1aa] hover:text-white hover:bg-[#18181b]'
                  }`}
                >
                  {lang === 'sk' ? 'Pravidlá' : 'Pravidla'}
                </button>
                <button 
                  id="mobile-nav-vip"
                  onClick={() => handleTabChange('vip')}
                  className={`text-left px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                    activeTab === 'vip' 
                      ? 'bg-rust-600/10 text-rust-400 border border-rust-500/20 font-semibold' 
                      : 'text-[#a1a1aa] hover:text-white hover:bg-[#18181b]'
                  }`}
                >
                  {lang === 'sk' ? 'VIP & Podpora' : 'VIP & Podpora'}
                </button>
                <button 
                  id="mobile-nav-gallery"
                  onClick={() => handleTabChange('gallery')}
                  className={`text-left px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                    activeTab === 'gallery' 
                      ? 'bg-rust-600/10 text-rust-400 border border-rust-500/20 font-semibold' 
                      : 'text-[#a1a1aa] hover:text-white hover:bg-[#18181b]'
                  }`}
                >
                  {lang === 'sk' ? 'Galéria' : 'Galerie'}
                </button>
                
                <a 
                  id="mobile-nav-discord"
                  href={serverConfig.discord} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="text-left px-4 py-3 rounded-lg text-sm font-medium text-[#a1a1aa] hover:text-white hover:bg-[#18181b] flex items-center justify-between transition-all"
                >
                  <span>Discord</span>
                  <ExternalLink className="w-4 h-4" />
                </a>

                <div className="pt-4 border-t border-[#1c1c21] flex justify-center">
                  <a 
                    id="mobile-connect-btn"
                    href={serverConfig.connectLink}
                    className="w-full py-3 px-4 rounded-xl bg-rust-600 hover:bg-rust-500 active:bg-rust-700 text-white text-center text-sm font-display font-semibold tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg"
                  >
                    <Play className="w-3.5 h-3.5 fill-white text-white" />
                    {t.connectLabel}
                  </a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* MAIN CONTAINER */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 flex-grow relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab + '_' + lang}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            
            {/* ==================== HOME TAB ==================== */}
            {activeTab === 'home' && (
              <div id="home-view" className="space-y-16">
                
                {/* HERO BOARD */}
                <div className="relative border border-[#1c1c22] rounded-3xl p-6 sm:p-10 lg:p-14 bg-gradient-to-br from-[#0e0e11] via-[#121216] to-[#0a0a0c] overflow-hidden shadow-2xl">
                  
                  {/* Decorative mesh */}
                  <div className="absolute inset-0 bg-radial-at-t from-rust-600/5 via-transparent to-transparent opacity-60 pointer-events-none" />
                  
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
                    
                    {/* Hero Left Intro */}
                    <div className="lg:col-span-7 space-y-6">
                      <div className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-rust-500/10 border border-rust-500/20 text-rust-400 font-mono text-xs font-semibold uppercase tracking-wider">
                        <Sparkles className="w-3.5 h-3.5" />
                        PREMIUM RUST PVP SERVER
                      </div>
                      
                      <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-black tracking-tight leading-tight text-white">
                        {serverConfig.serverName}
                      </h1>
                      
                      <p className="text-[#a1a1aa] text-lg sm:text-xl leading-relaxed max-w-2xl font-light">
                        {t.home.subtitle} {t.home.tagline}
                      </p>

                      <div className="pt-2 flex flex-wrap gap-4 items-center">
                        <a 
                          id="hero-discord-cb"
                          href={serverConfig.discord} 
                          target="_blank"  
                          rel="noreferrer"
                          className="flex items-center gap-2.5 px-6 py-4.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-display font-bold text-sm tracking-wider transition-all shadow-md transform hover:-translate-y-0.5"
                        >
                          <MessageSquare className="w-4.5 h-4.5 fill-white" />
                          {t.discordLabel}
                        </a>

                        <button 
                          id="hero-donate-cb"
                          onClick={() => setDonateModalOpen(true)}
                          className="inline-flex items-center justify-center gap-2 px-6 py-4.5 rounded-xl bg-linear-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-display font-bold text-sm tracking-wider transition-all shadow-md transform hover:-translate-y-0.5 cursor-pointer"
                        >
                          <Zap className="w-4.5 h-4.5" />
                          💛 {lang === 'sk' ? 'PODPORA' : 'PODPORA'}
                        </button>
                      </div>
                    </div>

                    {/* Hero Right: Live Connection Box */}
                    <div className="lg:col-span-5">
                      <div className="border border-[#222229] bg-[#121217]/90 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl relative backdrop-blur-xs">
                        
                        <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-[#18181f] px-2.5 py-1 rounded-full border border-[#272733]">
                          <span className="flex h-1.5 w-1.5 relative">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                          </span>
                          <span className="font-mono text-[10px] text-emerald-400 font-bold uppercase tracking-widest leading-none">STATUS ONLINE</span>
                        </div>

                        <div className="font-display font-semibold text-lg text-white border-b border-[#222229] pb-4 flex items-center gap-2">
                          <Activity className="w-5 h-5 text-rust-500" />
                          <span>MOCKIP • CONNECTION</span>
                        </div>

                        <div className="space-y-4">
                          <div className="space-y-1.5">
                            <label className="font-mono text-[10px] uppercase font-bold text-[#71717a] tracking-wider">Server IP address</label>
                            <div className="flex rounded-xl bg-[#09090b] border border-[#272733] overflow-hidden transition-all focus-within:border-rust-500/50">
                              <span className="flex-grow font-mono text-sm px-4 py-3 text-neutral-200 select-all overflow-x-auto whitespace-nowrap self-center scrollbar-none">
                                {serverConfig.serverIP}
                              </span>
                              <button 
                                id="btn-copy-ip-hero"
                                onClick={handleCopyIP}
                                className="px-4 py-3 bg-[#181820] hover:bg-rust-600 text-[#a1a1aa] hover:text-white border-l border-[#272733] transition-all flex items-center justify-center group"
                                title="Copy IP"
                              >
                                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 group-hover:scale-110 transition-transform" />}
                              </button>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4 pt-2">
                            <div className="bg-[#18181f]/40 border border-[#222229] p-4 rounded-xl flex flex-col justify-center">
                              <span className="font-mono text-[10px] text-[#71717a] font-bold uppercase tracking-widest">{t.livePlayers}</span>
                              <div className="flex items-baseline gap-1 pt-1">
                                <span className="font-mono font-black text-2.5xl tracking-tight text-white">{livePlayersCount}</span>
                                <span className="font-mono text-xs text-[#52525b]">/ 100</span>
                              </div>
                            </div>

                            <div className="bg-[#18181f]/40 border border-[#222229] p-4 rounded-xl flex flex-col justify-center">
                              <span className="font-mono text-[10px] text-[#71717a] font-bold uppercase tracking-widest">PING</span>
                              <div className="flex items-baseline pt-1">
                                <span className="font-mono font-black text-2.5xl text-emerald-400 tracking-tight">14</span>
                                <span className="font-mono text-[11px] text-[#52525b] ml-0.5">ms</span>
                              </div>
                            </div>
                          </div>

                          <div className="pt-2">
                            <a 
                              id="hero-quick-connect-cb"
                              href={serverConfig.connectLink}
                              className="w-full py-4.5 px-4 bg-rust-600 hover:bg-rust-500 active:bg-rust-700 font-display font-black text-sm text-white tracking-widest rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 shadow-rust-950/20 group"
                            >
                              <Play className="w-4 h-4 fill-white text-white group-hover:translate-x-0.5 transition-transform" />
                              {t.connectLabel}
                            </a>
                          </div>
                        </div>

                      </div>
                    </div>

                  </div>
                </div>

                {/* TRIPTYCH FEATURE HIGHLIGHT CARDS */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
                  {t.home.features.map((feat: any, idx: number) => (
                    <div 
                      key={idx} 
                      className="border border-[#1c1c21] bg-[#0c0c0f] hover:border-[#2a2a35] hover:bg-[#121217]/50 rounded-2xl p-6 sm:p-8 space-y-4 transition-all duration-300 relative group overflow-hidden"
                    >
                      <div className="absolute top-0 left-0 w-1 h-full bg-rust-600 transform scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-top" />
                      
                      <div className="flex items-center justify-between">
                        <div className="w-12 h-12 rounded-xl bg-rust-500/10 flex items-center justify-center text-rust-500 group-hover:bg-rust-600 group-hover:text-white transition-all duration-300">
                          {idx === 0 && <Award className="w-6 h-6" />}
                          {idx === 1 && <Shield className="w-6 h-6" />}
                          {idx === 2 && <Users className="w-6 h-6" />}
                        </div>
                        <span className="font-mono text-2xl font-black text-[#1c1c21] select-none group-hover:text-rust-500/10 transition-colors duration-300">0{idx + 1}</span>
                      </div>

                      <h3 className="text-xl font-display font-bold text-white group-hover:text-rust-400 transition-colors">
                        {feat.title}
                      </h3>
                      
                      <p className="text-[#a1a1aa] leading-relaxed text-sm">
                        {feat.text}
                      </p>
                    </div>
                  ))}
                </div>

                {/* COUNTDOWN BOARD + MAP SEED INFO */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
                  
                  {/* Countdown Card (col-span-8) */}
                  <div className="lg:col-span-8 border border-[#1c1c22] rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-[#0d0d10] to-[#08080a] flex flex-col justify-between overflow-hidden relative shadow-lg">
                    <div className="absolute inset-0 bg-radial-at-br from-rust-600/3 via-transparent to-transparent opacity-80 pointer-events-none" />
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between border-b border-[#1c1c22] pb-4">
                        <div className="flex items-center gap-2.5">
                          <Clock className="w-5 h-5 text-rust-500 animate-spin-slow" />
                          <h3 className="font-display font-extrabold text-[#e4e4e7] uppercase tracking-wider text-sm sm:text-base">
                            WIPE ODPOČET / COUNTDOWN
                          </h3>
                        </div>
                        <span className="font-mono text-xs text-rust-400 font-bold bg-rust-500/10 px-3 py-1 rounded-full border border-rust-500/20">
                          Monthly
                        </span>
                      </div>

                      <p className="text-[#a1a1aa] text-sm max-w-2xl">
                        Jedná sa o {serverConfig.wipe}. Stránka automaticky analyzuje aktuálny čas a vypočítava zostávajúce sekundy do najbližšieho dňa vymazania dát.
                      </p>
                    </div>

                    {/* Programmatic Ticker HUD */}
                    <div className="py-8 grid grid-cols-4 gap-3 sm:gap-6 text-center max-w-xl mx-auto w-full">
                      {[
                        { val: timeLeft.days, lbl: t.days, color: 'text-white' },
                        { val: timeLeft.hours, lbl: t.hours, color: 'text-white' },
                        { val: timeLeft.minutes, lbl: t.minutes, color: 'text-white' },
                        { val: timeLeft.seconds, lbl: t.seconds, color: 'text-rust-500 filter drop-shadow-[0_0_8px_rgba(206,54,24,0.3)]' }
                      ].map((card, i) => (
                        <div key={i} className="bg-[#0b0b0e] border border-[#1c1c21] rounded-2xl p-4 sm:p-5 relative overflow-hidden group hover:border-[#22222a] transition-all">
                          <div className="absolute top-0 left-0 w-full h-[2px] bg-linear-to-r from-transparent via-rust-500/35 to-transparent opacity-50" />
                          <span className={`block font-mono font-black text-3xl sm:text-5xl tracking-tight leading-none ${card.color}`}>
                            {String(card.val).padStart(2, '0')}
                          </span>
                          <span className="block font-mono text-[9px] sm:text-xs text-[#71717a] font-bold uppercase tracking-widest pt-2.5">{card.lbl}</span>
                        </div>
                      ))}
                    </div>

                    <div className="border-t border-[#1c1c22] pt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs font-mono text-[#71717a]">
                      <div>
                        NEXT WIPE CET / CEST: <span className="text-[#d4d4d8] font-semibold">{getNextWipeDate().toLocaleString('sk-SK', { timeZone: 'Europe/Bratislava', hour: '2-digit', minute: '2-digit', second: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric' })}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        AUTO-CALCULATED ZONE: EUROPE/BRATISLAVA
                      </div>
                    </div>

                  </div>

                  {/* Server specifications Box (col-span-4) */}
                  <div className="lg:col-span-4 border border-[#1c1c21] rounded-3xl p-6 sm:p-8 bg-[#0c0c0f] flex flex-col justify-between shadow-lg">
                    
                    <div className="space-y-4">
                      <div className="font-display font-extrabold text-sm uppercase tracking-wider text-[#e4e4e7] border-b border-[#1c1c21] pb-4 flex items-center gap-2">
                        <Globe className="w-5 h-5 text-rust-500" />
                        <span>INFORMÁCIE O STRUKTÚRE</span>
                      </div>

                      <div className="space-y-3 pt-2">
                        {[
                          { lbl: lang === 'sk' ? 'IP adresa' : 'IP adresa', val: serverConfig.serverIP, c: 'font-mono text-sm' },
                          { lbl: lang === 'sk' ? 'Herný limit' : 'Herní limit', val: `Quad (Max 4)`, c: 'font-mono text-sm font-bold text-rust-400' },
                          { lbl: lang === 'sk' ? 'Wipe režim' : 'Wipe režim', val: `Monthly`, c: 'font-mono text-sm' },
                          { lbl: lang === 'sk' ? 'Typ mapy' : 'Typ mapy', val: 'Procedural World', c: 'font-mono text-xs text-[#a1a1aa]' },
                          { lbl: lang === 'sk' ? 'Veľkosť mapy' : 'Velikost mapy', val: '4000', c: 'font-mono text-sm' },
                          { lbl: lang === 'sk' ? 'Map Seed' : 'Map Seed', val: '313985', c: 'font-mono text-sm text-[#71717a]' },
                        ].map((spec, i) => (
                          <div key={i} className="flex justify-between items-center py-2.5 border-b border-[#141418] last:border-0">
                            <span className="text-xs uppercase font-mono font-bold text-[#71717a] tracking-wider">{spec.lbl}</span>
                            <span className={`text-white text-right ${spec.c}`}>{spec.val}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-6">
                      <button 
                        id="btn-rules-teaser"
                        onClick={() => handleTabChange('rules')}
                        className="w-full py-4 px-4 bg-[#181820] hover:bg-rust-700/10 border border-[#272733] hover:border-rust-500/20 text-[#d4d4d8] hover:text-white text-xs font-mono font-bold tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 group cursor-pointer"
                      >
                        {t.openRulesLabel}
                        <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                      </button>
                    </div>

                  </div>

                </div>

                {/* HIGHLIGHT RULES + TIP DECK */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  
                  {/* Highlight rules list (col-span-7) */}
                  <div className="lg:col-span-7 space-y-4">
                    <h3 className="font-display font-black text-2xl text-white tracking-tight flex items-center gap-3">
                      <Zap className="w-6 h-6 text-amber-500 filter drop-shadow-[0_0_8px_rgba(245,158,11,0.2)]" />
                      {lang === 'sk' ? 'Najdôležitejšie pravidlá' : 'Nejdůležitější pravidla'}
                    </h3>
                    
                    <div className="border border-[#1c1c21] rounded-2.5xl bg-[#0c0c0e] divide-y divide-[#181820] overflow-hidden">
                      {t.topRules.map((val: string, i: number) => (
                        <div key={i} className="flex items-center gap-4.5 p-4 sm:p-5 hover:bg-[#121217]/40 transition-colors group">
                          <div className="w-7 h-7 rounded-lg bg-rust-500/10 text-rust-500 font-mono text-xs font-black flex items-center justify-center group-hover:bg-rust-600 group-hover:text-white transition-all">
                            {i + 1}
                          </div>
                          <span className="text-sm font-semibold tracking-wide text-neutral-100 group-hover:text-white transition-colors">{val}</span>
                        </div>
                      ))}
                    </div>

                    <div className="pt-2">
                      <button 
                        id="btn-full-rules"
                        onClick={() => handleTabChange('rules')}
                        className="text-xs font-mono font-bold tracking-widest uppercase text-rust-400 hover:text-rust-500 flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        {t.openRulesLabel} <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Screenshot teaser + Tip banner (col-span-5) */}
                  <div className="lg:col-span-5 space-y-6">
                    
                    {/* Tiny Gallery Carousel Teaser */}
                    <div className="border border-[#1c1c21] rounded-2.5xl p-6 bg-[#0c0c0e] space-y-4">
                      <h4 className="font-display font-extrabold text-sm uppercase tracking-wider text-white">
                        {lang === 'sk' ? 'Screenshoty zo servera' : 'Screenshoty ze serveru'}
                      </h4>
                      <div className="grid grid-cols-2 gap-3">
                        {galleryImages.slice(0, 2).map((img, i) => (
                          <div 
                            key={i} 
                            onClick={() => handleTabChange('gallery')}
                            className="group relative cursor-pointer overflow-hidden rounded-xl border border-[#22222a] aspect-video transition-all hover:border-rust-500/30"
                          >
                            <img 
                              src={img.file} 
                              alt={img.title} 
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                              referrerPolicy="no-referrer"
                            />
                            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2.5">
                              <span className="font-mono text-[9px] uppercase tracking-wider font-semibold text-white truncate">{img.title}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                      <button 
                        id="btn-teaser-gallery"
                        onClick={() => handleTabChange('gallery')}
                        className="w-full py-2 px-3 border border-[#272733] hover:border-[#3f3f46] text-[#a1a1aa] hover:text-white text-xs font-mono font-medium rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer"
                      >
                        {t.openGalleryLabel} <ChevronRight className="w-3" />
                      </button>
                    </div>

                    {/* ALERT TIP BOX */}
                    <div className="border border-amber-500/10 bg-[#1e130c]/35 text-amber-200/90 rounded-2.5xl p-5 sm:p-6 flex gap-4.5 items-start">
                      <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-500 self-start">
                        <AlertTriangle className="w-5 h-5 filter drop-shadow-[0_0_8px_rgba(245,158,11,0.25)]" />
                      </div>
                      <div className="space-y-1.5 flex-grow">
                        <h4 className="font-display font-extrabold tracking-wider uppercase text-xs leading-none">
                          {lang === 'sk' ? 'PRAVIDLO • RADY' : 'PRAVIDLO • TIPY'}
                        </h4>
                        <p className="font-sans text-xs sm:text-sm leading-relaxed text-amber-200/70">
                          {t.home.tipText}
                        </p>
                      </div>
                    </div>

                  </div>

                </div>

                {/* BATTLEMETRICS PANEL (IF SPECIFIED / MOCK SHOWCASE) */}
                <div className="border border-[#1c1c22] rounded-3xl p-6 sm:p-9 bg-linear-to-b from-[#101014] to-[#0a0a0c] overflow-hidden relative shadow-lg">
                  <div className="absolute top-0 right-0 w-80 h-80 bg-rust-500/3 rounded-full blur-[100px] pointer-events-none" />
                  
                  <div className="max-w-4xl space-y-6 relative z-10">
                    <div className="space-y-2">
                      <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#1a1210] border border-rust-500/15 text-rust-400 font-mono text-[10px] uppercase font-bold tracking-wider rounded-md">
                        {t.battlemetricsLabel}
                      </div>
                      <h3 className="font-display font-black text-2.5xl text-white tracking-tight">
                        {t.statusTitle}
                      </h3>
                      <p className="text-[#a1a1aa] text-sm leading-relaxed max-w-2xl">
                        {t.battlemetricsDesc} Je dôležité získať presné informácie o pingoch, stave hernej mapy a aktívnych hráčoch prostredníctvom oficiálneho embedu.
                      </p>
                    </div>

                    <div className="p-6 bg-black/45 border border-[#1e1e24] rounded-2xl flex flex-col md:flex-row items-center gap-6 justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-rust-600/10 border border-rust-500/20 text-rust-500 rounded-xl flex items-center justify-center">
                          <Activity className="w-7 h-7" />
                        </div>
                        <div>
                          <h4 className="font-display font-extrabold text-base text-white">{serverConfig.serverName}</h4>
                          <p className="font-mono text-xs text-[#71717a]">{serverConfig.serverIP}</p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-4 items-center">
                        <a 
                          id="battlemetrics-link"
                          href={serverConfig.discord} // Since no battlemetricsID is defined, we link to discord as anchor
                          target="_blank"  
                          rel="noreferrer"
                          className="px-5 py-3 rounded-xl bg-[#181820] hover:bg-zinc-800 border border-[#272733] hover:border-[#3f3f46] text-[#d4d4d8] hover:text-white font-mono text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 shadow-xs cursor-pointer"
                        >
                          {t.battlemetricsBtn}
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* ==================== RULES TAB ==================== */}
            {activeTab === 'rules' && (
              <div id="rules-view" className="space-y-10 max-w-4xl mx-auto">
                
                {/* Rules Header Title */}
                <div className="text-center space-y-4">
                  <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-rust-500/10 border border-rust-500/20 text-rust-500 mb-2">
                    <BookOpen className="w-5 h-5 filter drop-shadow-[0_0_8px_rgba(206,54,24,0.35)]" />
                  </div>
                  <h1 className="text-4xl sm:text-5xl font-display font-black tracking-tight text-white leading-tight">
                    {t.rules.title}
                  </h1>
                  <p className="text-[#a1a1aa] text-lg font-light max-w-2xl mx-auto">
                    {t.rules.subtitle}
                  </p>
                </div>

                {/* Interactive Filtering Input */}
                <div className="relative max-w-xl mx-auto">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#71717a]">
                    <Search className="w-4.5 h-4.5" />
                  </div>
                  <input 
                    id="rules-search"
                    type="text"
                    value={rulesSearch}
                    onChange={(e) => setRulesSearch(e.target.value)}
                    placeholder={t.rulesSearchPlaceholder}
                    className="w-full pl-11 pr-4 py-4 rounded-xl bg-[#121216] border border-[#222229] hover:border-[#2f2f3a] focus:border-rust-500 text-sm placeholder-[#71717a] text-white focus:outline-hidden focus:ring-1 focus:ring-rust-500 transition-all font-sans"
                  />
                  {rulesSearch && (
                    <button 
                      id="clear-rules-search"
                      onClick={() => setRulesSearch('')}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-[#71717a] hover:text-white transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Render Filtered Rules List */}
                {filteredRules.length > 0 ? (
                  <div id="rules-list" className="space-y-4 pt-4">
                    {filteredRules.map((rule) => (
                      <div 
                        key={rule.id} 
                        className="p-5 sm:p-6 border border-[#1a1a21] bg-[#0c0c0e] hover:bg-[#121217]/40 hover:border-zinc-800 rounded-2xl flex gap-4 sm:gap-6 items-start transition-all duration-300 relative group"
                      >
                        <div className="absolute top-0 left-0 w-[3px] h-full bg-rust-500 transform scale-y-0 group-hover:scale-y-100 transition-transform duration-300 rounded-s-2xl" />
                        
                        <div className="font-mono text-xs sm:text-sm font-black text-rust-500 bg-rust-500/10 h-7 w-7 sm:h-9 sm:w-9 rounded-lg flex items-center justify-center select-none group-hover:bg-rust-600 group-hover:text-white transition-colors shrink-0">
                          {rule.id}
                        </div>

                        <div className="space-y-1.5 flex-grow">
                          <h3 className="text-sm sm:text-base font-display font-extrabold text-white group-hover:text-rust-400 transition-colors">
                            {rule.title}
                          </h3>
                          <p className="text-[#a1a1aa] text-xs sm:text-sm leading-relaxed font-sans font-light">
                            {rule.text}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 border border-zinc-900 rounded-2xl bg-neutral-950/20 text-[#71717a] font-mono text-sm">
                    {t.rulesNoResults}
                  </div>
                )}

              </div>
            )}

            {/* ==================== VIP & PODPORA TAB ==================== */}
            {activeTab === 'vip' && (
              <div id="vip-view" className="space-y-12 max-w-4xl mx-auto">
                
                {/* VIP Header Title */}
                <div className="text-center space-y-4">
                  <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 mb-2">
                    <Zap className="w-5 h-5 filter drop-shadow-[0_0_8px_rgba(16,185,129,0.35)]" />
                  </div>
                  <h1 className="text-4xl sm:text-5xl font-display font-black tracking-tight text-white leading-tight">
                    {t.vip.title}
                  </h1>
                  <p className="text-[#a1a1aa] text-lg font-light max-w-2xl mx-auto">
                    {t.vip.subtitle} – {lang === 'sk' ? 'Kúpou balíčka získaš výhody a zároveň podporuješ herný vývoj a infraštruktúru.' : 'Nákupem balíčku získáš výhody a zároveň podporuješ herní vývoj a infrastrukturu.'}
                  </p>
                </div>

                {/* Main Card (Tebex review checkout or call to action) */}
                <div className="border border-[#22222a] bg-gradient-to-br from-[#121217] via-[#09090b] to-[#121217] rounded-3xl p-6 sm:p-10 relative overflow-hidden shadow-2xl flex flex-col md:flex-row gap-8 items-center justify-between">
                  <div className="absolute inset-0 bg-radial-at-t from-emerald-500/3 via-transparent to-transparent pointer-events-none" />
                  
                  <div className="space-y-4 max-w-xl">
                    <h3 className="text-xl sm:text-2xl font-display font-extrabold text-white tracking-tight flex items-center gap-2">
                      <Sparkles className="w-5.5 h-5.5 text-rust-400" />
                      {t.vip.subtitle}
                    </h3>
                    <p className="text-[#a1a1aa] text-sm sm:text-base leading-relaxed font-light">
                      {lang === 'sk' 
                        ? 'Kliknutím na tlačidlo nižšie prejdeš priamo do nášho certifikovaného e-shopu Tebex, kde si môžeš aktivovať prémiové VIP účty.' 
                        : 'Kliknutím na tlačidlo níže přejdeš přímo do našeho certifikovaného e-shopu Tebex, kde si můžeš aktivovat prémiové VIP účty.'}
                    </p>
                    
                    {serverConfig.donateComingSoon && (
                      <div className="mt-2 text-xs font-mono text-rust-400 font-semibold bg-rust-500/10 border border-rust-500/20 px-3 py-1.5 rounded-lg inline-block">
                        ⚠️ COMING SOON: TEBEX V REVIEW REŽIME
                      </div>
                    )}
                  </div>

                  <div className="shrink-0 w-full md:w-auto">
                    <button 
                      id="tebex-checkout-btn"
                      onClick={() => setDonateModalOpen(true)}
                      className="w-full md:w-auto px-8 py-5 rounded-2xl bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-display font-black text-sm tracking-wider uppercase shadow-xl hover:shadow-emerald-950/20 transition-all text-center flex items-center justify-center gap-3 transform hover:-translate-y-0.5 pointer-events-auto cursor-pointer"
                    >
                      <Zap className="w-5 h-5 fill-white text-white" />
                      {t.vip.ctaLabel}
                    </button>
                  </div>
                </div>

                {/* Checkout Step-by-Step Info */}
                <div className="space-y-6">
                  <h3 className="font-display font-black text-2xl text-white tracking-tight flex items-center gap-2.5">
                    <HelpCircle className="w-6 h-6 text-zinc-500" />
                    {t.vip.howTitle}
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {t.vip.steps.map((step: string, idx: number) => (
                      <div key={idx} className="border border-[#181820] bg-[#0c0c0e] hover:border-zinc-800 rounded-2xl p-5 space-y-3.5 relative">
                        <span className="font-mono text-xs font-bold text-rust-400 bg-rust-500/10 border border-rust-500/20 h-6 w-11 rounded-full flex items-center justify-center">
                          STEP 0{idx + 1}
                        </span>
                        <p className="text-[#a1a1aa] text-xs sm:text-sm font-sans leading-relaxed">
                          {step}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Additional VIP description box */}
                <div className="bg-[#101014] border border-[#1b1b22] px-6 py-6 rounded-2.5xl flex flex-col md:flex-row gap-5 items-center justify-between text-xs sm:text-sm font-mono text-[#71717a]">
                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-rust-500 shrink-0" />
                    <span>Secure Steam OAuth Sign-in directly integrated by Tebex. No credentials are requested by RustPohoda.</span>
                  </div>
                  <div className="flex items-center gap-1 shrink-0 text-amber-500">
                    <Check className="w-4 h-4" /> SECURE CHECKOUT
                  </div>
                </div>

              </div>
            )}

            {/* ==================== GALÉRIA TAB ==================== */}
            {activeTab === 'gallery' && (
              <div id="gallery-view" className="space-y-10">
                
                {/* Gallery Title */}
                <div className="text-center space-y-4 max-w-3xl mx-auto">
                  <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-rust-500/10 border border-rust-500/20 text-rust-500 mb-2">
                    <ImageIcon className="w-5 h-5 filter drop-shadow-[0_0_8px_rgba(206,54,24,0.35)]" />
                  </div>
                  <h1 className="text-4xl sm:text-5xl font-display font-black tracking-tight text-white leading-tight">
                    {lang === 'sk' ? 'Screenshoty zo servera' : 'Screenshoty ze serveru'}
                  </h1>
                  <p className="text-[#a1a1aa] text-lg font-light">
                    {lang === 'sk' ? 'Reálne momentky priamo z hry našej komunity' : 'Reálné momentky přímo ze hry naší komunity'}
                  </p>
                </div>

                {/* Image Grid with Overlay Effects */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                  {galleryImages.map((img, idx) => (
                    <div 
                      key={idx} 
                      onClick={() => setLightboxIndex(idx)}
                      className="group cursor-pointer border border-[#181820] bg-zinc-950 rounded-2.5xl overflow-hidden aspect-video relative transition-all duration-300 hover:border-rust-500/40 hover:-translate-y-1 hover:shadow-2xl hover:shadow-black"
                    >
                      <img 
                        src={img.file} 
                        alt={img.title} 
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105" 
                        referrerPolicy="no-referrer"
                      />
                      
                      {/* Gradient Ambient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-transparent opacity-60 group-hover:opacity-100 transition-opacity duration-300" />

                      {/* Info on hover / mobile always display */}
                      <div className="absolute bottom-0 left-0 w-full p-6 sm:p-8 flex items-end justify-between z-10">
                        <div className="space-y-1 text-left">
                          <span className="font-mono text-[9px] text-[#71717a] font-bold uppercase tracking-widest bg-zinc-950/80 px-2 py-1 rounded border border-zinc-800">
                            IMAGE {idx + 1} / {galleryImages.length}
                          </span>
                          <h3 className="text-lg sm:text-xl font-display font-extrabold text-white transform translate-y-1.5 group-hover:translate-y-0 transition-all duration-300">
                            {img.title}
                          </h3>
                          <p className="text-[#a1a1aa] text-xs sm:text-sm font-light select-none max-w-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-75">
                            {img.desc}
                          </p>
                        </div>
                        <div className="shrink-0 w-10 h-10 rounded-full bg-rust-500/10 border border-rust-500/20 text-rust-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <Search className="w-4 h-4" />
                        </div>
                      </div>

                    </div>
                  ))}
                </div>

              </div>
            )}

          </motion.div>
        </AnimatePresence>
      </main>

      {/* FOOTER BOARD */}
      <footer id="footer" className="border-t border-[#1c1c21] bg-[#070708] mt-24 py-12 relative z-10 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center justify-between">
            
            {/* Footer Brand Logo Block */}
            <div className="space-y-3 prose-dark">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-rust-500 flex items-center justify-center text-white font-bold">
                  <Shield className="w-4.5 h-4.5" />
                </div>
                <span className="font-display font-extrabold text-md tracking-wider leading-none text-white uppercase">
                  {serverConfig.serverName}
                </span>
              </div>
              <p className="font-mono text-xs text-[#71717a]">
                {serverConfig.footerLine} • {lang === 'sk' ? 'Všetky práva vyhradené.' : 'Všechna práva vyhrazena.'} © 2025–2026.
              </p>
            </div>

            {/* Footer menu anchors */}
            <div className="flex flex-wrap gap-4 sm:justify-end">
              <button onClick={() => handleTabChange('home')} className="text-xs font-mono font-bold tracking-widest uppercase text-[#71717a] hover:text-white transition-colors cursor-pointer">
                {lang === 'sk' ? 'Domov' : 'Domů'}
              </button>
              <button onClick={() => handleTabChange('rules')} className="text-xs font-mono font-bold tracking-widest uppercase text-[#71717a] hover:text-white transition-colors cursor-pointer">
                {lang === 'sk' ? 'Pravidlá' : 'Pravidla'}
              </button>
              <button onClick={() => handleTabChange('vip')} className="text-xs font-mono font-bold tracking-widest uppercase text-[#71717a] hover:text-white transition-colors cursor-pointer">
                {lang === 'sk' ? 'VIP & Podpora' : 'VIP & Podpora'}
              </button>
              <button onClick={() => handleTabChange('gallery')} className="text-xs font-mono font-bold tracking-widest uppercase text-[#71717a] hover:text-white transition-colors cursor-pointer">
                {lang === 'sk' ? 'Galéria' : 'Galerie'}
              </button>
              <a href={serverConfig.discord} target="_blank" rel="noreferrer" className="text-xs font-mono font-bold tracking-widest uppercase text-[#71717a] hover:text-[#d4d4d8] transition-colors flex items-center gap-1.5 cursor-pointer">
                Discord <ExternalLink className="w-2.5 h-2.5" />
              </a>
            </div>

          </div>
        </div>
      </footer>

      {/* ==================== DONATE / SUPPORT COMING SOON MODAL ==================== */}
      <AnimatePresence>
        {donateModalOpen && (
          <motion.div 
            id="donate-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
          >
            <motion.div 
              id="donate-modal"
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="relative w-full max-w-md border border-[#22222a] bg-[#121217]/95 rounded-2.5xl p-6 sm:p-8 space-y-6 shadow-2xl backdrop-blur-md text-left"
            >
              
              {/* Close Button Trigger */}
              <button 
                id="close-donate-modal"
                onClick={() => setDonateModalOpen(false)}
                className="absolute top-4 right-4 p-1.5 rounded-lg text-[#71717a] hover:text-white hover:bg-neutral-800/50 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-4">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500">
                  <AlertTriangle className="w-5 h-5 filter drop-shadow-[0_0_8px_rgba(245,158,11,0.25)]" />
                </div>
                
                <h3 className="text-xl font-display font-black text-white tracking-tight leading-tight">
                  {t.tebexSoonTitle}
                </h3>
                
                <p className="text-[#a1a1aa] text-xs sm:text-sm leading-relaxed">
                  {lang === 'sk' ? serverConfig.donateComingSoonText_sk : serverConfig.donateComingSoonText_cz}
                </p>

                <p className="text-[#a1a1aa] text-xs sm:text-sm leading-relaxed">
                  {lang === 'sk' ? serverConfig.donateDiscordCta_sk : serverConfig.donateDiscordCta_cz}
                </p>
              </div>

              {/* Action Buttons list */}
              <div className="space-y-3 pt-2">
                <a 
                  id="donate-modal-discord"
                  href={serverConfig.discord}
                  target="_blank"  
                  rel="noreferrer"
                  className="w-full py-4.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-display text-xs font-bold uppercase tracking-wider transition-all text-center flex items-center justify-center gap-2"
                >
                  <MessageSquare className="w-4 h-4 fill-white text-white" />
                  {lang === 'sk' ? serverConfig.donateDiscordText_sk : serverConfig.donateDiscordText_cz}
                </a>

                {/* Copied action */}
                <button 
                  id="donate-modal-copy-ip"
                  onClick={handleCopyIP}
                  className="w-full py-4.5 px-4 rounded-xl bg-[#181820] hover:bg-zinc-800 border border-[#272733] text-white font-mono text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" />
                      {t.copiedLabel}
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      {t.ipCopyLabel}
                    </>
                  )}
                </button>
              </div>

              <div className="text-center">
                <button 
                  id="donate-modal-close"
                  onClick={() => setDonateModalOpen(false)}
                  className="text-[11px] font-mono uppercase tracking-widest font-semibold text-[#71717a] hover:text-[#a1a1aa] transition-colors cursor-pointer"
                >
                  {t.closeLabel}
                </button>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ==================== INTERACTIVE GALLERY LIGHTBOX ==================== */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div 
            id="lightbox-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center p-4 bg-black/95 backdrop-blur-md"
          >
            
            {/* Lightbox Controls */}
            <div className="absolute top-4 right-4 flex items-center gap-3">
              <button 
                id="lightbox-close"
                onClick={() => setLightboxIndex(null)}
                className="p-2.5 rounded-lg text-[#a1a1aa] hover:text-white hover:bg-zinc-900 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Main Stage Panel */}
            <div className="relative w-full max-w-5xl flex items-center justify-center py-10">
              
              <button 
                id="lightbox-prev"
                onClick={() => setLightboxIndex(prev => prev !== null ? (prev - 1 + galleryImages.length) % galleryImages.length : 0)}
                className="absolute left-2 sm:left-4 z-10 p-2.5 rounded-full bg-black/60 hover:bg-black text-white border border-[#272733]"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              <motion.div 
                key={lightboxIndex}
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.25 }}
                className="max-h-[75vh] max-w-full overflow-hidden rounded-2xl border border-zinc-850 bg-black flex items-center justify-center group"
              >
                <img 
                  src={galleryImages[lightboxIndex].file} 
                  alt={galleryImages[lightboxIndex].title} 
                  className="max-h-[75vh] max-w-full object-contain pointer-events-none select-none"
                  referrerPolicy="no-referrer"
                />
              </motion.div>

              <button 
                id="lightbox-next"
                onClick={() => setLightboxIndex(prev => prev !== null ? (prev + 1) % galleryImages.length : 0)}
                className="absolute right-2 sm:right-4 z-10 p-2.5 rounded-full bg-black/60 hover:bg-black text-white border border-[#272733]"
              >
                <ChevronRight className="w-6 h-6" />
              </button>

            </div>

            {/* Metadata Footer Panel */}
            <div className="text-center space-y-1.5 max-w-xl pb-6">
              <span className="font-mono text-[10px] text-rust-500 font-bold tracking-widest">
                IMAGE {lightboxIndex + 1} / {galleryImages.length}
              </span>
              <h3 className="text-lg font-display font-black text-white">
                {galleryImages[lightboxIndex].title}
              </h3>
              <p className="text-[#a1a1aa] text-xs sm:text-sm font-light leading-relaxed">
                {galleryImages[lightboxIndex].desc}
              </p>
            </div>

          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
