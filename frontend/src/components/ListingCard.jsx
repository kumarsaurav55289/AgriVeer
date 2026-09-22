import React, { useState } from 'react';
import { Star, MapPin, ShieldCheck, UserCheck, Phone, Zap, Eye, Lock, CheckCircle2, Sprout, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getTranslatedItem } from '../utils/translator';

export default function ListingCard({ item, t = {}, currentLang = 'en', onBookNow, isBooked = false }) {
  const [isPhotoOpen, setIsPhotoOpen] = useState(false);
  const displayItem = getTranslatedItem(item, currentLang);
  const isLand = displayItem.type === 'land';

  return (
    <>
      <motion.div
        whileHover={{ y: -6, scale: 1.01 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className={`bg-white/85 backdrop-blur-xl border rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:border-emerald-300/80 transition-all flex flex-col justify-between group relative ${
          isBooked ? 'border-rose-300 bg-rose-50/20' : 'border-slate-200/90'
        }`}
      >
        
        {/* Image Container with Click-to-Zoom Overlay */}
        <div className="relative h-56 w-full overflow-hidden bg-slate-100 cursor-pointer" onClick={() => setIsPhotoOpen(true)}>
          <img
            src={displayItem.image}
            alt={displayItem.title}
            className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ${
              isBooked ? 'brightness-75 grayscale-[30%]' : ''
            }`}
          />

          {/* BOOKED OVERLAY BADGE */}
          {isBooked && (
            <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-[2px] flex items-center justify-center p-4 z-20">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-rose-700 text-white font-extrabold text-xs px-4 py-2 rounded-full shadow-2xl border border-rose-400 flex items-center gap-1.5 uppercase tracking-wider"
              >
                <Lock className="w-4 h-4 text-white" />
                <span>Booked / Unavailable</span>
              </motion.div>
            </div>
          )}

          {/* Zoom Overlay Hint */}
          {!isBooked && (
            <div className="absolute inset-0 bg-slate-950/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white font-extrabold text-xs z-10">
              <div className="bg-slate-900/90 border border-white/30 px-3.5 py-1.5 rounded-full backdrop-blur-md flex items-center gap-1.5 shadow-lg">
                <Eye className="w-4 h-4 text-emerald-400" />
                <span>Click to Expand HD Photo</span>
              </div>
            </div>
          )}

          <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none z-10">
            <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider backdrop-blur-md shadow-sm ${
              isLand ? 'bg-amber-500 text-slate-950' : 'bg-emerald-600 text-white'
            }`}>
              {displayItem.category}
            </span>
            {displayItem.isVerified && !isBooked && (
              <span className="bg-white/90 text-slate-800 text-[10px] font-extrabold px-2.5 py-1 rounded-full border border-slate-200/80 shadow-sm flex items-center gap-1 backdrop-blur-md">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>{t.verifiedOwner || 'Verified Owner'}</span>
              </span>
            )}
          </div>

          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-slate-800 z-10">
            <span className="bg-white/90 px-2.5 py-1 rounded-lg backdrop-blur-md font-semibold text-slate-800 flex items-center gap-1 shadow-sm border border-slate-200/60">
              <MapPin className="w-3.5 h-3.5 text-emerald-600" />
              <span>{displayItem.distance}</span>
            </span>
            <span className="bg-amber-500 text-slate-950 font-black px-2.5 py-1 rounded-lg flex items-center gap-1 shadow-sm">
              <Star className="w-3.5 h-3.5 fill-slate-950" />
              <span>{displayItem.rating || '4.9'}</span>
            </span>
          </div>
        </div>

        {/* Card Content Body */}
        <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
          
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-slate-500">{displayItem.location}</span>
              {isBooked ? (
                <span className="text-rose-700 font-extrabold flex items-center gap-1 bg-rose-100 px-2 py-0.5 rounded-full border border-rose-200 text-[10px]">
                  <Lock className="w-3 h-3" /> Booked
                </span>
              ) : (
                <span className="text-emerald-700 flex items-center gap-1 font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{t.availableToday || 'Available Today'}</span>
                </span>
              )}
            </div>
            <h3 className="font-extrabold text-slate-900 text-lg leading-snug group-hover:text-emerald-700 transition-colors font-['Outfit']">
              {displayItem.title}
            </h3>
            <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed font-medium">
              {displayItem.description}
            </p>
          </div>

          {/* Specs Badges Row */}
          <div className="flex flex-wrap gap-1.5 text-[11px] font-bold">
            {displayItem.specs?.power && (
              <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg border border-slate-200 flex items-center gap-1">
                <Zap className="w-3 h-3 text-emerald-600" />
                <span>{displayItem.specs.power}</span>
              </span>
            )}
            {displayItem.specs?.landSize && (
              <span className="bg-emerald-50 text-emerald-800 px-2.5 py-1 rounded-lg border border-emerald-200 flex items-center gap-1">
                <Sprout className="w-3 h-3 text-emerald-600" />
                <span>{displayItem.specs.landSize}</span>
              </span>
            )}
            {displayItem.specs?.driverProvided && (
              <span className="bg-amber-50 text-amber-900 px-2.5 py-1 rounded-lg border border-amber-200 flex items-center gap-1">
                <UserCheck className="w-3 h-3 text-amber-600" />
                <span>{t.driverIncluded || 'Driver Included'}</span>
              </span>
            )}
          </div>

          {/* Price Display & Booking CTA */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <div>
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
                {t.rateLabel || 'Rental Rate'}
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black text-slate-900 font-['Outfit']">
                  ₹{displayItem.dailyRate ? displayItem.dailyRate.toLocaleString() : displayItem.acreRate.toLocaleString()}
                </span>
                <span className="text-xs font-bold text-slate-500">
                  {isLand ? (t.perAcreYr || '/ acre / yr') : (t.perDay || '/ day')}
                </span>
              </div>
            </div>

            {isBooked ? (
              <button
                disabled
                className="bg-slate-200 border border-slate-300 text-slate-500 font-extrabold px-4 py-2.5 rounded-xl text-xs cursor-not-allowed flex items-center gap-1"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Booked</span>
              </button>
            ) : (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onBookNow(displayItem)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold px-5 py-2.5 rounded-xl text-xs shadow-md shadow-emerald-600/20 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>{t.rentNow || 'Rent Now'}</span>
              </motion.button>
            )}
          </div>

        </div>

      </motion.div>

      {/* EXPANDABLE HD PHOTO MODAL */}
      <AnimatePresence>
        {isPhotoOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsPhotoOpen(false)}
            className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-8"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-4xl w-full bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-white/20"
            >
              <button
                onClick={() => setIsPhotoOpen(false)}
                className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-slate-950/70 text-white flex items-center justify-center hover:bg-rose-600 transition-colors cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>

              <img
                src={displayItem.image}
                alt={displayItem.title}
                className="w-full max-h-[75vh] object-contain bg-slate-950"
              />

              <div className="p-6 bg-slate-900 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-t border-slate-800">
                <div>
                  <span className="text-emerald-400 font-extrabold text-xs uppercase tracking-wider block">
                    {displayItem.category} • {displayItem.location}
                  </span>
                  <h3 className="text-lg font-black font-['Outfit']">{displayItem.title}</h3>
                </div>

                {!isBooked && (
                  <button
                    onClick={() => {
                      setIsPhotoOpen(false);
                      onBookNow(displayItem);
                    }}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold px-6 py-3 rounded-xl text-xs shadow-lg transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <Zap className="w-4 h-4" />
                    <span>{t.rentNow || 'Rent Now'}</span>
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
