import React from 'react';
import ListingCard from './ListingCard';
import { Tractor, Sprout, FilterX, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ListingGrid({ 
  listings, 
  t = {}, 
  currentLang = 'en', 
  onBookNow, 
  onResetFilters, 
  activeTab, 
  setActiveTab, 
  userBookings = [] 
}) {
  const isHome = activeTab === 'home';

  const machineryListings = listings.filter((item) => item.type === 'machinery');
  const landListings = listings.filter((item) => item.type === 'land');

  // On Home Page, limit to top 3 featured items each
  const displayedMachinery = isHome ? machineryListings.slice(0, 3) : machineryListings;
  const displayedLand = isHome ? landListings.slice(0, 3) : landListings;

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 260, damping: 20 } }
  };

  if (listings.length === 0) {
    return (
      <div id="listings" className="max-w-7xl mx-auto py-16 px-4 text-center space-y-4">
        <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto">
          <FilterX className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-slate-800">{t.noListingTitle || 'No Farm Machinery or Land Found'}</h3>
        <p className="text-sm text-slate-500 max-w-md mx-auto">
          {t.noListingSub || "We couldn't find any listings matching your active filters or location query."}
        </p>
        <button
          onClick={onResetFilters}
          className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold text-xs shadow-md transition-all cursor-pointer"
        >
          {t.resetFilters || 'Reset All Filters'}
        </button>
      </div>
    );
  }

  return (
    <section id="listings" className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 space-y-14">
      
      {/* Machinery Section Header */}
      {displayedMachinery.length > 0 && (
        <div id="equipment-section" className="space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                <Tractor className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-extrabold text-slate-900 font-['Outfit']">
                  {isHome ? (t.machineryTitleHome || 'Featured Farm Machinery & Equipment') : (t.machineryTitleAll || 'Agricultural Machinery Rentals')}
                </h2>
                <p className="text-xs text-slate-500 font-medium">
                  {isHome ? (t.machinerySubHome || 'Handpicked top-rated tractors, harvesters & drones ready for rent') : (t.machinerySubAll || 'Verified tractors, harvesters, ploughs, and crop sprayers near you')}
                </p>
              </div>
            </div>

            {isHome ? (
              <button
                onClick={() => { setActiveTab && setActiveTab('equipment'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className="text-xs font-black text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-4 py-2 rounded-xl border border-emerald-200 flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
              >
                <span>{t.viewAllEquipment || 'View All Equipment'} ({machineryListings.length})</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 hidden sm:inline-block">
                {machineryListings.length} Options
              </span>
            )}
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {displayedMachinery.map((item) => {
              const isBooked = userBookings.some(b => b.itemId === item.id || b.itemTitle === item.title);
              return (
                <motion.div key={item.id} variants={itemVariants}>
                  <ListingCard
                    item={item}
                    t={t}
                    currentLang={currentLang}
                    onBookNow={onBookNow}
                    isBooked={isBooked}
                  />
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      )}

      {/* Farmland Section Header */}
      {displayedLand.length > 0 && (
        <div id="land-section" className="space-y-6 pt-6">
          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold">
                <Sprout className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-extrabold text-slate-900 font-['Outfit']">
                  {isHome ? (t.landTitleHome || 'Featured Agricultural Land Leases') : (t.landTitleAll || 'Agricultural Farm Land Leases & Plots')}
                </h2>
                <p className="text-xs text-slate-500 font-medium">
                  {isHome ? (t.landSubHome || 'Prime paddy, wheat & organic orchard plots available for lease') : (t.landSubAll || 'Fertile paddy, wheat, and organic orchard land ready for farming')}
                </p>
              </div>
            </div>

            {isHome ? (
              <button
                onClick={() => { setActiveTab && setActiveTab('land'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className="text-xs font-black text-amber-800 hover:text-amber-900 bg-amber-50 hover:bg-amber-100 px-4 py-2 rounded-xl border border-amber-200 flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
              >
                <span>{t.viewAllLand || 'View All Land'} ({landListings.length})</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <span className="text-xs font-bold text-amber-900 bg-amber-50 px-3 py-1 rounded-full border border-amber-200 hidden sm:inline-block">
                {landListings.length} Land Leases
              </span>
            )}
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {displayedLand.map((item) => {
              const isBooked = userBookings.some(b => b.itemId === item.id || b.itemTitle === item.title);
              return (
                <motion.div key={item.id} variants={itemVariants}>
                  <ListingCard
                    item={item}
                    t={t}
                    currentLang={currentLang}
                    onBookNow={onBookNow}
                    isBooked={isBooked}
                  />
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      )}

    </section>
  );
}
