import React from 'react';
import { ArrowUpDown, UserCheck } from 'lucide-react';

export default function FilterBar({
  selectedCategory,
  setSelectedCategory,
  maxPrice,
  setMaxPrice,
  driverOnly,
  setDriverOnly,
  sortBy,
  setSortBy,
  resultCount,
  t = {}
}) {
  const categories = [
    { label: t.catAll || 'All Categories', value: 'All' },
    { label: t.catTractor || 'Tractor', value: 'Tractor' },
    { label: t.catHarvester || 'Harvester', value: 'Harvester' },
    { label: t.catPlough || 'Disc Plough', value: 'Plough' },
    { label: t.catSprayer || 'Drone Sprayer', value: 'Sprayer' },
    { label: t.catLand || 'Farmland', value: 'Farmland' }
  ];

  return (
    <div id="listings" className="bg-white/80 backdrop-blur-xl border-b border-slate-200/80 sticky top-20 z-30 shadow-sm py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        
        {/* Top Category Buttons Bar */}
        <div className="flex items-center justify-between gap-4 overflow-x-auto pb-1 no-scrollbar">
          <div className="flex items-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setSelectedCategory(cat.value)}
                className={`px-4 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat.value
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="shrink-0">
            <span className="text-xs font-extrabold text-emerald-800 bg-emerald-50 px-3.5 py-1.5 rounded-full border border-emerald-200">
              {resultCount} {t.itemsAvailable || 'Items Available'}
            </span>
          </div>
        </div>

        {/* Secondary Filters Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 text-xs font-semibold pt-2 border-t border-slate-100">
          
          <div className="flex items-center gap-4 flex-wrap">
            {/* Price Slider */}
            <div className="flex items-center gap-2">
              <span className="text-slate-500 font-extrabold uppercase">{t.maxRate || 'Max Rate:'}</span>
              <input
                type="range"
                min="500"
                max="65000"
                step="500"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="accent-emerald-600 cursor-pointer w-28"
              />
              <span className="font-extrabold text-slate-900 bg-slate-100 px-2 py-1 rounded-lg font-mono border border-slate-200">
                ₹{maxPrice.toLocaleString()}
              </span>
            </div>

            {/* Driver Filter Toggle */}
            <label className="flex items-center gap-1.5 cursor-pointer bg-slate-50 hover:bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200 transition-colors">
              <input
                type="checkbox"
                checked={driverOnly}
                onChange={(e) => setDriverOnly(e.target.checked)}
                className="accent-emerald-600 rounded cursor-pointer"
              />
              <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-slate-700 font-bold">{t.driverIncluded || 'Driver Provided Only'}</span>
            </label>
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-500 font-extrabold uppercase">{t.sortBy || 'Sort By:'}</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 font-bold text-slate-800 outline-none focus:border-emerald-500 cursor-pointer"
            >
              <option value="featured">{t.sortFeatured || 'Featured First'}</option>
              <option value="price-asc">{t.sortLowHigh || 'Price: Low to High'}</option>
              <option value="price-desc">{t.sortHighLow || 'Price: High to Low'}</option>
              <option value="rating">{t.sortRating || 'Top Rated Only'}</option>
            </select>
          </div>

        </div>

      </div>
    </div>
  );
}
