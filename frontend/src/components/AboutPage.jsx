import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { 
  Tractor, 
  Sprout, 
  ShieldCheck, 
  Coins, 
  Users, 
  CheckCircle2, 
  PhoneCall, 
  ArrowRight,
  TrendingUp,
  MapPin,
  Clock,
  Sparkles
} from 'lucide-react';

export default function AboutPage({ t = {}, onOpenAuth }) {
  const headerRef = useRef(null);
  const badgeRef = useRef(null);

  useEffect(() => {
    if (headerRef.current) {
      gsap.fromTo(
        headerRef.current,
        { opacity: 0, y: 30, scale: 0.98 },
        { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: 'power3.out' }
      );
    }
    if (badgeRef.current) {
      gsap.fromTo(
        badgeRef.current,
        { opacity: 0, scale: 0.8 },
        { opacity: 1, scale: 1, duration: 0.5, delay: 0.1, ease: 'back.out(1.7)' }
      );
    }
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 25 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 260, damping: 20 } }
  };

  return (
    <div className="relative py-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-16">
      
      {/* Background Animated Fluid Orbs */}
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.35, 0.2] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -top-20 left-1/4 w-96 h-96 bg-emerald-400/20 rounded-full blur-3xl pointer-events-none -z-10"
      />
      <motion.div
        animate={{ scale: [1.2, 1, 1.2], opacity: [0.15, 0.3, 0.15] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-1/2 -right-20 w-96 h-96 bg-teal-400/20 rounded-full blur-3xl pointer-events-none -z-10"
      />

      {/* 1. HERO HEADER WITH GSAP ANIMATIONS */}
      <div className="text-center space-y-4 relative">
        <div ref={badgeRef} className="inline-flex items-center gap-2 bg-emerald-100/90 border border-emerald-300/80 px-4 py-1.5 rounded-full text-xs font-black text-emerald-900 shadow-sm backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
          <span>{t.aboutBadge || "India's Digital Peer-to-Peer Agriculture Marketplace"}</span>
        </div>

        <div ref={headerRef} className="max-w-3xl mx-auto space-y-3">
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight font-['Outfit'] leading-tight">
            {t.aboutHeading || 'Agriveer – Land & Farming Equipment Renting'}
          </h1>
          <p className="text-sm sm:text-base text-slate-600 font-medium leading-relaxed">
            Connecting farmers directly with local machinery owners and farmland lessors to maximize agricultural productivity with zero upfront capital debt.
          </p>
        </div>
      </div>

      {/* 2. CORE MISSION & PROBLEM VISION CARD */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="bg-white/80 backdrop-blur-2xl border border-white/90 p-6 sm:p-10 rounded-3xl shadow-xl shadow-emerald-950/5 space-y-6"
      >
        <div className="flex flex-col md:flex-row items-start gap-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center font-black text-2xl shrink-0 shadow-lg shadow-emerald-600/30">
            <Sprout className="w-7 h-7" />
          </div>
          <div className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-['Outfit']">
              Our Core Mission & Purpose
            </h2>
            <p className="text-slate-700 text-sm sm:text-base leading-relaxed font-medium">
              Agriveer is an agriculture-based digital platform designed to help farmers get easy access to agricultural land and modern farming equipment on rent. The main purpose of Agriveer is to reduce the financial burden on farmers by allowing them to use important agricultural resources without purchasing them.
            </p>
            <p className="text-slate-600 text-sm leading-relaxed">
              Many farmers, especially small and marginal farmers, have limited land and cannot afford expensive machinery such as tractors, harvesters, rotavators, cultivators, seed drills, and crop sprayers. At the same time, many landowners have agricultural land that remains unused, and equipment owners may have machinery that is not being used regularly. Agriveer connects these users through one transparent, digital marketplace.
            </p>
          </div>
        </div>
      </motion.div>

      {/* 3. FOUR CORE PILLARS GRID WITH FRAMER MOTION STAGGER */}
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <span className="text-emerald-700 font-extrabold text-xs uppercase tracking-wider block">Why Agriveer Matters</span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-['Outfit']">Four Pillars of Rural Empowerment</h2>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {/* Pillar 1 */}
          <motion.div variants={itemVariants} className="bg-white/75 backdrop-blur-xl border border-white/80 p-6 rounded-3xl shadow-lg hover:shadow-xl transition-all space-y-3 group">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold shadow-sm group-hover:scale-110 transition-transform">
              <Tractor className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-black text-slate-900 font-['Outfit']">1. On-Demand Machinery Access</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
              Access 50+ HP tractors, combine harvesters, seed drills, and laser levelers on a flexible daily or per-acre rental basis without huge bank loans.
            </p>
          </motion.div>

          {/* Pillar 2 */}
          <motion.div variants={itemVariants} className="bg-white/75 backdrop-blur-xl border border-white/80 p-6 rounded-3xl shadow-lg hover:shadow-xl transition-all space-y-3 group">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold shadow-sm group-hover:scale-110 transition-transform">
              <Sprout className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-black text-slate-900 font-['Outfit']">2. Verified Farmland Leases</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
              Lease fertile paddy, wheat, sugarcane, or organic orchard land directly from verified local landowners with transparent legal lease terms.
            </p>
          </motion.div>

          {/* Pillar 3 */}
          <motion.div variants={itemVariants} className="bg-white/75 backdrop-blur-xl border border-white/80 p-6 rounded-3xl shadow-lg hover:shadow-xl transition-all space-y-3 group">
            <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold shadow-sm group-hover:scale-110 transition-transform">
              <Coins className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-black text-slate-900 font-['Outfit']">3. Zero Middleman Commission</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
              Direct owner-to-renter negotiations ensure fair, transparent pricing without hidden broker fees or exploitative middleman cuts.
            </p>
          </motion.div>

          {/* Pillar 4 */}
          <motion.div variants={itemVariants} className="bg-white/75 backdrop-blur-xl border border-white/80 p-6 rounded-3xl shadow-lg hover:shadow-xl transition-all space-y-3 group">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold shadow-sm group-hover:scale-110 transition-transform">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-black text-slate-900 font-['Outfit']">4. Local Community Trust</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
              Built specifically for Indian farming communities with 9 native regional language options and 24/7 dedicated Kisan helpline support.
            </p>
          </motion.div>
        </motion.div>
      </div>

      {/* 4. HOW IT WORKS (STEP-BY-STEP WORKFLOW) */}
      <div className="bg-gradient-to-b from-emerald-900 to-teal-950 text-white p-8 sm:p-12 rounded-3xl shadow-2xl space-y-8 relative overflow-hidden">
        <div className="text-center space-y-2 relative z-10">
          <span className="text-emerald-400 font-extrabold text-xs uppercase tracking-widest block">Simple Step-by-Step Flow</span>
          <h2 className="text-2xl sm:text-4xl font-black font-['Outfit']">How Agriveer Works for Farmers & Owners</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
          
          <motion.div 
            whileHover={{ y: -5 }}
            className="bg-white/10 backdrop-blur-xl border border-white/15 p-6 rounded-2xl space-y-3"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-500 text-slate-950 font-black flex items-center justify-center text-sm shadow">
              1
            </div>
            <h4 className="text-lg font-black font-['Outfit'] text-white">Search & Filter</h4>
            <p className="text-xs text-slate-300 leading-relaxed font-medium">
              Browse available tractors, combine harvesters, or farmland plots by crop type, location, and daily rate.
            </p>
          </motion.div>

          <motion.div 
            whileHover={{ y: -5 }}
            className="bg-white/10 backdrop-blur-xl border border-white/15 p-6 rounded-2xl space-y-3"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 font-black flex items-center justify-center text-sm shadow">
              2
            </div>
            <h4 className="text-lg font-black font-['Outfit'] text-white">Direct Booking</h4>
            <p className="text-xs text-slate-300 leading-relaxed font-medium">
              Book online instantly or speak directly with the verified local owner with option for experienced drivers.
            </p>
          </motion.div>

          <motion.div 
            whileHover={{ y: -5 }}
            className="bg-white/10 backdrop-blur-xl border border-white/15 p-6 rounded-2xl space-y-3"
          >
            <div className="w-10 h-10 rounded-xl bg-teal-400 text-slate-950 font-black flex items-center justify-center text-sm shadow">
              3
            </div>
            <h4 className="text-lg font-black font-['Outfit'] text-white">Farm & Grow</h4>
            <p className="text-xs text-slate-300 leading-relaxed font-medium">
              Complete your field operations on time during peak harvest season without breaking your budget.
            </p>
          </motion.div>

        </div>

        {/* CTA Banner inside dark card */}
        <div className="pt-6 border-t border-emerald-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-6 h-6 text-emerald-400 shrink-0" />
            <span className="text-xs text-slate-200 font-medium">Are you an owner of a Tractor, Harvester, or Land? Start earning supplementary income.</span>
          </div>
          <button 
            onClick={onOpenAuth}
            className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs px-5 py-3 rounded-xl shadow-lg transition-all shrink-0 flex items-center gap-1.5 cursor-pointer"
          >
            <span>{t.btnRegister || 'Register / Login Now'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 5. IMPACT & TRUST STATS ROW */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
        <div className="bg-white/70 backdrop-blur-xl border border-white/80 p-5 rounded-2xl shadow-sm space-y-1">
          <span className="text-2xl sm:text-3xl font-black text-emerald-700 font-['Outfit'] block">1,200+</span>
          <span className="text-xs text-slate-600 font-extrabold uppercase tracking-wider">Verified Equipment</span>
        </div>

        <div className="bg-white/70 backdrop-blur-xl border border-white/80 p-5 rounded-2xl shadow-sm space-y-1">
          <span className="text-2xl sm:text-3xl font-black text-emerald-700 font-['Outfit'] block">850+</span>
          <span className="text-xs text-slate-600 font-extrabold uppercase tracking-wider">Fertile Land Leases</span>
        </div>

        <div className="bg-white/70 backdrop-blur-xl border border-white/80 p-5 rounded-2xl shadow-sm space-y-1">
          <span className="text-2xl sm:text-3xl font-black text-emerald-700 font-['Outfit'] block">9</span>
          <span className="text-xs text-slate-600 font-extrabold uppercase tracking-wider">Indian Languages</span>
        </div>

        <div className="bg-white/70 backdrop-blur-xl border border-white/80 p-5 rounded-2xl shadow-sm space-y-1">
          <span className="text-2xl sm:text-3xl font-black text-emerald-700 font-['Outfit'] block">24/7</span>
          <span className="text-xs text-slate-600 font-extrabold uppercase tracking-wider">Helpline Support</span>
        </div>
      </div>

    </div>
  );
}
