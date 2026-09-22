import React from 'react';
import { Globe, ChevronDown } from 'lucide-react';
import { LANGUAGES } from '../data/mockData';

export default function LanguageBar({ currentLang, setCurrentLang }) {
  const handleSelectChange = (e) => {
    const langCode = e.target.value;
    setCurrentLang(langCode);
    localStorage.setItem('agriveer_lang', langCode);
  };

  return (
    <div className="bg-emerald-50/80 backdrop-blur-md border-b border-slate-200/80 py-2.5 px-4 shadow-inner">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm">
        
        {/* Left Label */}
        <div className="flex items-center gap-2 text-emerald-800 font-extrabold">
          <Globe className="w-4 h-4 text-emerald-600 animate-pulse" />
          <span>Select Website Language / भाषा चुनें:</span>
        </div>

        {/* SINGLE SELECT DROPDOWN FOR ALL 9 INDIAN LANGUAGES */}
        <div className="relative min-w-[220px] sm:min-w-[280px]">
          <select
            value={currentLang}
            onChange={handleSelectChange}
            className="w-full bg-white text-slate-800 font-extrabold px-4 py-2 rounded-xl border border-emerald-300 focus:border-emerald-600 outline-none text-xs sm:text-sm shadow-sm cursor-pointer appearance-none pr-9"
          >
            {LANGUAGES.map((lang) => (
              <option key={lang.code} value={lang.code} className="bg-white text-slate-800 font-bold py-1">
                {lang.code === 'en' ? 'English' : `${lang.native} (${lang.label})`}
              </option>
            ))}
          </select>
          
          {/* Custom Dropdown Arrow */}
          <div className="absolute right-3 top-3 pointer-events-none text-emerald-700">
            <ChevronDown className="w-4 h-4" />
          </div>
        </div>

      </div>
    </div>
  );
}
