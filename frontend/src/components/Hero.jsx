import React, { useEffect, useRef } from 'react';
import { Search, MapPin, Sparkles, Tractor, Sprout, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import gsap from 'gsap';

export default function Hero({
  t = {},
  searchQuery,
  setSearchQuery,
  locationQuery,
  setLocationQuery,
  activeType,
  setActiveType
}) {
  const headlineRef = useRef(null);
  const badgeRef = useRef(null);

  useEffect(() => {
    if (headlineRef.current) {
      gsap.fromTo(
        headlineRef.current,
        { opacity: 0, y: 25 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }
      );
    }
    if (badgeRef.current) {
      gsap.fromTo(
        badgeRef.current,
        { opacity: 0, scale: 0.9 },
        { opacity: 1, scale: 1, duration: 0.5, delay: 0.1, ease: 'back.out(1.5)' }
      );
    }
  }, []);

  return (
    <div className="relative overflow-hidden py-12 px-4 sm:px-6 lg:px-8">
      
      {/* Fluid Floating Ambient Orbs */}
      <motion.div
        animate={{ scale: [1, 1.25, 1], opacity: [0.2, 0.35, 0.2] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -top-24 -left-20 w-96 h-96 bg-emerald-400/25 rounded-full blur-3xl pointer-events-none z-0"
      />
      <motion.div
        animate={{ scale: [1.2, 1, 1.2], opacity: [0.2, 0.35, 0.2] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-1/3 -right-24 w-96 h-96 bg-teal-400/20 rounded-full blur-3xl pointer-events-none z-0"
      />

      <div className="max-w-4xl mx-auto text-center relative z-10 space-y-6">
        
        {/* Minimal Pill */}
        <div ref={badgeRef} className="inline-flex items-center gap-2 bg-white/70 border border-white/80 px-4 py-1.5 rounded-full text-xs font-black text-emerald-800 shadow-sm backdrop-blur-xl">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
          <span>{t.marketplacePill || "Peer-to-Peer Agriculture Marketplace"}</span>
        </div>

        {/* Minimalistic Hero Title */}
        <div ref={headlineRef} className="space-y-2">
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight text-slate-900 font-['Outfit']">
            {t.heroTitle || 'Rent Farm Equipment & Land'}
          </h1>
          <p className="text-sm sm:text-base text-slate-600 font-medium max-w-xl mx-auto">
            {t.heroSub || 'Tractors, harvesters, ploughs, and farmland leases from verified local owners.'}
          </p>
        </div>

        {/* Ultra-Glossy Glass Search Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white/80 border border-white/90 p-3 sm:p-5 rounded-3xl shadow-xl shadow-emerald-950/5 space-y-3 text-left backdrop-blur-2xl"
        >
          
          {/* Fluid Pill Tabs */}
          <div className="flex justify-start gap-2 text-xs font-extrabold">
            <button
              onClick={() => setActiveType('all')}
              className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
                activeType === 'all'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                  : 'bg-slate-100/70 text-slate-700 hover:bg-white'
              }`}
            >
              {t.searchAll || 'Search All'}
            </button>
            <button
              onClick={() => setActiveType('machinery')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl transition-all cursor-pointer ${
                activeType === 'machinery'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                  : 'bg-slate-100/70 text-slate-700 hover:bg-white'
              }`}
            >
              <Tractor className="w-3.5 h-3.5" />
              <span>{t.navEquipment || 'Equipment'}</span>
            </button>
            <button
              onClick={() => setActiveType('land')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl transition-all cursor-pointer ${
                activeType === 'land'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                  : 'bg-slate-100/70 text-slate-700 hover:bg-white'
              }`}
            >
              <Sprout className="w-3.5 h-3.5" />
              <span>{t.navLand || 'Land'}</span>
            </button>
          </div>

          {/* Search Input Bar */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-2">
            
            {/* Search Query */}
            <div className="md:col-span-6 relative flex items-center">
              <Search className="w-4 h-4 text-emerald-600 absolute left-3.5 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.searchPlaceholder || "Search equipment or land..."}
                className="w-full bg-slate-50/80 border border-slate-200/80 pl-10 pr-4 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold outline-none focus:border-emerald-500 focus:bg-white transition-all text-slate-900"
              />
            </div>

            {/* Location Query */}
            <div className="md:col-span-4 relative flex items-center">
              <MapPin className="w-4 h-4 text-emerald-600 absolute left-3.5 pointer-events-none" />
              <input
                type="text"
                value={locationQuery}
                onChange={(e) => setLocationQuery(e.target.value)}
                placeholder={t.searchLocation || "Location..."}
                className="w-full bg-slate-50/80 border border-slate-200/80 pl-10 pr-4 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold outline-none focus:border-emerald-500 focus:bg-white transition-all text-slate-900"
              />
            </div>

            {/* Search CTA */}
            <div className="md:col-span-2">
              <button
                onClick={() => {}}
                className="w-full h-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-2.5 px-4 rounded-2xl text-xs sm:text-sm shadow-lg shadow-emerald-600/25 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Search className="w-4 h-4" />
                <span>{t.searchBtn || 'Search'}</span>
              </button>
            </div>

          </div>

        </motion.div>

        {/* Minimal Stats Row */}
        <div className="flex flex-wrap items-center justify-center gap-6 pt-2 text-xs font-extrabold text-slate-600">
          <div className="flex items-center gap-2">
            <Tractor className="w-4 h-4 text-emerald-600" />
            <span>1,200+ Verified Machinery</span>
          </div>
          <span className="text-slate-300">•</span>
          <div className="flex items-center gap-2">
            <Sprout className="w-4 h-4 text-emerald-600" />
            <span>850+ Land Leases</span>
          </div>
          <span className="text-slate-300">•</span>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Direct Owner Booking</span>
          </div>
        </div>

      </div>
    </div>
  );
}
