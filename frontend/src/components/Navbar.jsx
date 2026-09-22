import React, { useState } from 'react';
import { Tractor, User, PlusCircle, FileText, Globe, ChevronDown, Menu, X, Home, Sprout, Info, PhoneCall } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { LANGUAGES } from '../data/mockData';

export default function Navbar({
  activeTab,
  setActiveTab,
  currentLang = 'en',
  setCurrentLang,
  t = {},
  onOpenAuth,
  onOpenListModal,
  currentUser,
  bookingCount = 0
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleNavClick = (tabName) => {
    setActiveTab(tabName);
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLangChange = (e) => {
    const langCode = e.target.value;
    if (setCurrentLang) {
      setCurrentLang(langCode);
      localStorage.setItem('agriveer_lang', langCode);
    }
  };

  const navItems = [
    { key: 'home', label: t.navHome || 'Home', icon: Home },
    { key: 'equipment', label: t.navEquipment || 'Equipment', icon: Tractor },
    { key: 'land', label: t.navLand || 'Land', icon: Sprout },
    { key: 'about', label: t.navAbout || 'About', icon: Info },
    { key: 'contact', label: t.navContact || 'Contact Us', icon: PhoneCall }
  ];

  return (
    <header className="bg-white/95 backdrop-blur-2xl text-slate-900 sticky top-0 z-[100] shadow-md border-b border-slate-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-2 sm:gap-3">
          
          {/* 1. LOGO */}
          <div onClick={() => handleNavClick('home')} className="flex items-center gap-2.5 sm:gap-3 cursor-pointer group">
            <motion.div
              whileHover={{ rotate: 10, scale: 1.05 }}
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-emerald-600 flex items-center justify-center text-white font-black shadow-md shrink-0"
            >
              <Tractor className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
            </motion.div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg sm:text-2xl tracking-tight text-slate-900 font-['Outfit'] group-hover:text-emerald-700 transition-colors">
                  AGRIVEER
                </span>
                <span className="bg-emerald-100 text-emerald-800 border border-emerald-200 text-[9px] sm:text-[10px] font-bold px-1.5 py-0.5 rounded-full uppercase">
                  India
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-slate-500 font-medium hidden sm:block">Smart Land & Machinery Rentals</p>
            </div>
          </div>

          {/* 2. DESKTOP NAVBAR OPTIONS WITH ANIMATED PILL */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-100/80 p-1.5 rounded-2xl border border-slate-200 text-xs sm:text-sm font-bold">
            {navItems.map((item) => {
              const isActive = activeTab === item.key;
              const Icon = item.icon;
              return (
                <button
                  key={item.key}
                  onClick={() => handleNavClick(item.key)}
                  className={`relative px-3.5 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                    isActive ? 'text-white font-extrabold' : item.key === 'my-rentals' ? 'text-emerald-700 hover:text-emerald-800' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activePill"
                      className="absolute inset-0 bg-emerald-600 rounded-xl z-0 shadow-md"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-1.5">
                    {Icon && <Icon className="w-3.5 h-3.5" />}
                    <span>{item.label}</span>
                    {item.badge !== undefined && item.badge > 0 && (
                      <span className="bg-amber-500 text-slate-950 font-black text-[10px] px-1.5 py-0.2 rounded-full shadow">
                        {item.badge}
                      </span>
                    )}
                  </span>
                </button>
              );
            })}
          </nav>

          {/* 3. RIGHT DESKTOP & MOBILE ACTIONS */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            
            {/* COMPACT LANGUAGE SELECTOR */}
            <div className="relative">
              <div className="flex items-center gap-1 bg-slate-100/80 border border-slate-200 rounded-xl px-2 py-1.5 text-xs font-extrabold text-slate-700 shadow-sm cursor-pointer hover:border-emerald-400 transition-colors">
                <Globe className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <select
                  value={currentLang}
                  onChange={handleLangChange}
                  className="bg-transparent text-slate-800 font-extrabold outline-none text-xs cursor-pointer appearance-none pr-3"
                >
                  {LANGUAGES.map((lang) => (
                    <option key={lang.code} value={lang.code} className="bg-white text-slate-900 font-bold">
                      {lang.code === 'en' ? 'EN' : lang.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3 h-3 text-slate-400 pointer-events-none absolute right-1.5" />
              </div>
            </div>

            {/* REGISTER / LOGIN / PROFILE PILL - DESKTOP ONLY */}
            {currentUser ? (
              <div
                onClick={() => handleNavClick('my-rentals')}
                className="hidden sm:flex items-center gap-1.5 bg-slate-100 border border-slate-300 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl text-xs font-bold cursor-pointer hover:border-emerald-500 transition-colors"
                title="Go to User Dashboard & Profile"
              >
                <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-white text-xs ${
                  currentUser.role === 'owner' ? 'bg-amber-600' : 'bg-emerald-600'
                }`}>
                  {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <span className="text-slate-800 font-extrabold">{currentUser.name}</span>
              </div>
            ) : (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onOpenAuth}
                className="hidden sm:flex bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold px-3.5 py-2 rounded-xl text-xs shadow-md transition-all items-center gap-1.5 cursor-pointer"
              >
                <User className="w-4 h-4" />
                <span>{t.btnRegister || 'Register / Login'}</span>
              </motion.button>
            )}

            {/* MOBILE HAMBURGER TOGGLE BUTTON - GUARANTEED ALWAYS VISIBLE ON MOBILE */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="flex md:hidden p-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 transition-all cursor-pointer shadow-md active:scale-95 shrink-0 items-center justify-center"
              aria-label="Toggle Navigation Menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6 text-white font-black" /> : <Menu className="w-6 h-6 text-white font-black" />}
            </button>

          </div>

        </div>
      </div>

      {/* MOBILE EXPANDABLE DRAWER */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white/95 backdrop-blur-2xl border-b border-slate-200 overflow-hidden shadow-2xl"
          >
            <div className="px-4 py-4 space-y-2">
              
              {/* USER ACCOUNT BADGE / REGISTER CTA IN DRAWER */}
              {currentUser ? (
                <button
                  onClick={() => handleNavClick('my-rentals')}
                  className={`w-full flex items-center justify-between p-3.5 rounded-2xl font-black text-sm transition-all ${
                    activeTab === 'my-rentals'
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'bg-emerald-50 text-emerald-900 border border-emerald-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white text-xs ${
                      currentUser.role === 'owner' ? 'bg-amber-600' : 'bg-emerald-600'
                    }`}>
                      {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <div className="text-left">
                      <span className="block text-xs font-black">{currentUser.name}</span>
                      <span className="text-[10px] text-slate-500 font-medium">View Dashboard & Profile</span>
                    </div>
                  </div>
                  {bookingCount > 0 && (
                    <span className="bg-amber-500 text-slate-950 font-black text-xs px-2 py-0.5 rounded-full shadow">
                      {bookingCount}
                    </span>
                  )}
                </button>
              ) : (
                <button
                  onClick={() => { setIsMobileMenuOpen(false); onOpenAuth(); }}
                  className="w-full bg-emerald-600 text-white font-black p-3.5 rounded-2xl text-sm shadow-md flex items-center justify-center gap-2 mb-2"
                >
                  <User className="w-5 h-5" />
                  <span>{t.btnRegister || 'Register / Login'}</span>
                </button>
              )}

              {/* NAV ITEMS LIST */}
              {navItems.map((item) => {
                const isActive = activeTab === item.key;
                const Icon = item.icon;
                return (
                  <button
                    key={item.key}
                    onClick={() => handleNavClick(item.key)}
                    className={`w-full flex items-center justify-between p-3 rounded-2xl font-extrabold text-sm transition-all ${
                      isActive
                        ? 'bg-emerald-600 text-white shadow-md'
                        : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </div>
                  </button>
                );
              })}

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
