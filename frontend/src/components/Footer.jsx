import React from 'react';
import { Tractor, PhoneCall, ShieldCheck, Heart } from 'lucide-react';

export default function Footer({ onOpenAuth, t }) {
  return (
    <footer className="relative bg-white/70 backdrop-blur-2xl text-slate-700 pt-10 pb-8 border-t border-white/80 shadow-[0_-10px_30px_rgba(0,0,0,0.02)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Sleek Minimal Top Row */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-slate-200/60">
          
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-600/20">
              <Tractor className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-black text-xl tracking-tight text-slate-900 font-['Outfit'] block">
                AGRIVEER
              </span>
              <span className="text-[11px] font-semibold text-slate-500">
                {t?.marketplacePill || "Peer-to-Peer Agriculture Marketplace"}
              </span>
            </div>
          </div>

          {/* Quick Essential Navigation */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm font-bold text-slate-700">
            <a href="#hero-section" className="hover:text-emerald-600 transition-colors">{t?.navHome || "Home"}</a>
            <a href="#equipment-section" className="hover:text-emerald-600 transition-colors">{t?.navEquipment || "Equipment"}</a>
            <a href="#land-section" className="hover:text-emerald-600 transition-colors">{t?.navLand || "Land"}</a>
            <a href="#about-section" className="hover:text-emerald-600 transition-colors">{t?.navAbout || "About"}</a>
            <a href="#contact-section" className="hover:text-emerald-600 transition-colors">{t?.navContact || "Contact"}</a>
          </div>

          {/* Glossy Helpline Pill */}
          <a 
            href="tel:18002474736" 
            className="group flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500/20 transition-all shadow-sm"
          >
            <div className="w-8 h-8 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
              <PhoneCall className="w-4 h-4" />
            </div>
            <div className="text-left">
              <span className="text-[10px] text-emerald-800 font-extrabold uppercase block tracking-wider">Toll-Free Helpline</span>
              <span className="text-xs font-black text-slate-900 font-mono">1800-AGRI-RENT</span>
            </div>
          </a>

        </div>

        {/* Minimal Bottom Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 font-medium">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>© 2026 Agriveer India. Empowering Farmers.</span>
          </div>
          
          <div className="flex items-center gap-6 font-semibold">
            <button onClick={onOpenAuth} className="hover:text-emerald-700 transition-colors">
              {t?.btnRegister || "Register / Login"}
            </button>
            <span className="text-slate-300">•</span>
            <a href="#contact-section" className="hover:text-slate-800 transition-colors">Kisan Support</a>
          </div>
        </div>

      </div>
    </footer>
  );
}
