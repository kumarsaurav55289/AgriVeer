import React, { useState } from 'react';
import { Sparkles, ArrowRight, Cpu, Tractor, Fuel, Wrench, ShieldCheck } from 'lucide-react';

export default function EquipmentGuide({ onApplyFilter, t = {} }) {
  const [crop, setCrop] = useState('Paddy');
  const [landArea, setLandArea] = useState('5');
  const [season, setSeason] = useState('Kharif');

  // Logic calculation for recommendation
  let recHP = '45 HP to 55 HP (4WD Recommended)';
  let recPlough = '3-Bottom Reversible Disc Plough';
  let recHarvester = 'Combine Harvester with Straw Chopper';
  let estFuel = '4.2 - 5.5 Liters / Hour';

  if (Number(landArea) <= 3) {
    recHP = '35 HP to 45 HP (2WD)';
    recPlough = '2-Bottom Hydraulic Disc Plough';
    recHarvester = 'Mini Harvester or Rotavator Tillage';
    estFuel = '3.0 - 4.0 Liters / Hour';
  } else if (Number(landArea) > 12) {
    recHP = '60 HP+ Heavy Duty 4WD';
    recPlough = '4-Bottom Heavy Reversible Plough';
    recHarvester = 'High-Capacity Tracked Combine Harvester';
    estFuel = '6.5 - 8.0 Liters / Hour';
  }

  return (
    <section id="guide-section" className="bg-gradient-to-br from-emerald-50/60 via-slate-50 to-[#F8FAF6] text-slate-900 py-14 px-4 sm:px-6 lg:px-8 border-t border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-900 text-xs font-extrabold px-3.5 py-1.5 rounded-full border border-emerald-200 shadow-sm">
              <Cpu className="w-3.5 h-3.5 text-emerald-600" />
              <span>{t.guideBadge || 'Smart Kisan Recommendation Tool'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-['Outfit'] text-slate-900">
              {t.guideTitle || 'Not sure which Tractor or Implement you need?'}
            </h2>
            <p className="text-xs text-slate-600 font-medium">
              {t.guideSub || 'Select your crop type and farm acreage to get expert machinery & power recommendations.'}
            </p>
          </div>
        </div>

        {/* Calculator Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          
          {/* Left Input Form */}
          <div className="lg:col-span-5 bg-white/80 border border-slate-200/90 p-6 rounded-3xl space-y-4 backdrop-blur-xl shadow-xl shadow-slate-200/40">
            <div>
              <label className="block text-xs font-extrabold text-slate-700 uppercase mb-1">
                {t.selectCrop || '1. Select Target Crop'}
              </label>
              <select
                value={crop}
                onChange={(e) => setCrop(e.target.value)}
                className="w-full bg-slate-50 text-slate-900 px-3.5 py-3 rounded-xl border border-slate-300 font-bold text-xs outline-none focus:border-emerald-600 focus:bg-white cursor-pointer"
              >
                <option value="Paddy">Paddy / Rice Field Tillage</option>
                <option value="Wheat">Wheat Sowing & Harvesting</option>
                <option value="Sugarcane">Sugarcane Deep Ploughing</option>
                <option value="Cotton">Cotton Bed Preparation</option>
                <option value="Vegetables">Vegetable & Polyhouse Land</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-extrabold text-slate-700 uppercase mb-1">
                {t.landAreaLabel || '2. Total Land Area (Acres):'} <strong className="text-emerald-700">{landArea} Acres</strong>
              </label>
              <input
                type="range"
                min="1"
                max="25"
                value={landArea}
                onChange={(e) => setLandArea(e.target.value)}
                className="w-full accent-emerald-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-extrabold mt-1">
                <span>1 Acre</span>
                <span>10 Acres</span>
                <span>25+ Acres</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-extrabold text-slate-700 uppercase mb-1">
                {t.seasonLabel || '3. Farming Season'}
              </label>
              <select
                value={season}
                onChange={(e) => setSeason(e.target.value)}
                className="w-full bg-slate-50 text-slate-900 px-3.5 py-3 rounded-xl border border-slate-300 font-bold text-xs outline-none focus:border-emerald-600 focus:bg-white cursor-pointer"
              >
                <option value="Kharif">Monsoon / Kharif Season</option>
                <option value="Rabi">Winter / Rabi Harvest</option>
                <option value="Zaid">Summer / Zaid Crops</option>
              </select>
            </div>
          </div>

          {/* Right Recommendation Output Card */}
          <div className="lg:col-span-7 bg-slate-900 text-white p-6 sm:p-8 rounded-3xl space-y-6 shadow-2xl relative overflow-hidden">
            <div className="space-y-1">
              <span className="text-emerald-400 text-xs font-extrabold uppercase tracking-widest block">
                {t.recTitle || 'Optimal Recommendation'}
              </span>
              <h3 className="text-xl sm:text-2xl font-black font-['Outfit']">
                {crop} • {landArea} Acres Field Solution
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-slate-800/90 border border-slate-700 p-4 rounded-2xl space-y-1">
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold">
                  <Tractor className="w-4 h-4" />
                  <span>{t.recHP || 'Recommended Tractor Rating'}</span>
                </div>
                <p className="text-sm font-black text-white">{recHP}</p>
              </div>

              <div className="bg-slate-800/90 border border-slate-700 p-4 rounded-2xl space-y-1">
                <div className="flex items-center gap-2 text-amber-400 text-xs font-bold">
                  <Fuel className="w-4 h-4" />
                  <span>{t.recFuel || 'Estimated Fuel Consumption'}</span>
                </div>
                <p className="text-sm font-black text-white">{estFuel}</p>
              </div>

              <div className="bg-slate-800/90 border border-slate-700 p-4 rounded-2xl space-y-1">
                <div className="flex items-center gap-2 text-teal-400 text-xs font-bold">
                  <Wrench className="w-4 h-4" />
                  <span>{t.recPlough || 'Best Tillage Implement'}</span>
                </div>
                <p className="text-sm font-black text-white">{recPlough}</p>
              </div>

              <div className="bg-slate-800/90 border border-slate-700 p-4 rounded-2xl space-y-1">
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold">
                  <ShieldCheck className="w-4 h-4" />
                  <span>{t.recHarvester || 'Harvesting Solution'}</span>
                </div>
                <p className="text-sm font-black text-white">{recHarvester}</p>
              </div>
            </div>

            <button
              onClick={() => onApplyFilter && onApplyFilter('Tractor')}
              className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{t.viewMatching || 'View Matching Equipment'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>
    </section>
  );
}
