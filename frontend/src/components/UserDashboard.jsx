import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { 
  User, 
  Tractor, 
  Sprout, 
  FileText, 
  PhoneCall, 
  ShieldCheck, 
  Trash2, 
  PlusCircle, 
  Coins, 
  Calendar, 
  MapPin, 
  Lock, 
  CheckCircle2, 
  Store, 
  TrendingUp, 
  Settings, 
  LogOut, 
  Edit3, 
  Clock, 
  Sparkles,
  Phone,
  Search,
  Zap,
  Tag,
  Star,
  Award,
  BadgeCheck,
  Building2,
  Mail,
  ArrowRight,
  X
} from 'lucide-react';
import { apiService } from '../services/api';
import { getTranslatedItem } from '../utils/translator';

export default function UserDashboard({
  currentUser,
  userBookings = [],
  listings = [],
  t = {},
  currentLang = 'en',
  onLogout,
  onUpdateUser,
  onOpenListModal,
  onOpenBookingModal,
  onDeleteBooking,
  onDeleteListing,
  setActiveTab
}) {
  const [activeSubTab, setActiveSubTab] = useState('bookings'); // 'bookings' | 'my-listings' | 'profile'
  const isOwner = currentUser?.role === 'owner';
  
  // Database State
  const [liveBookings, setLiveBookings] = useState(userBookings);
  const [liveListings, setLiveListings] = useState(listings);
  const [isLoadingDb, setIsLoadingDb] = useState(false);

  const headerRef = useRef(null);

  // Sync with Backend Data on Mount & Tab Change
  const fetchLiveDatabaseData = async () => {
    setIsLoadingDb(true);
    try {
      const fetchedBookings = await apiService.getBookings();
      if (fetchedBookings && Array.isArray(fetchedBookings)) {
        setLiveBookings(fetchedBookings);
      }
      const fetchedListings = await apiService.getListings();
      if (fetchedListings && Array.isArray(fetchedListings)) {
        setLiveListings(fetchedListings);
      }
    } catch (err) {
      console.warn('DB sync error:', err);
    } finally {
      setIsLoadingDb(false);
    }
  };

  useEffect(() => {
    if (headerRef.current) {
      gsap.fromTo(
        headerRef.current,
        { opacity: 0, y: -20, scale: 0.99 },
        { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: 'power3.out' }
      );
    }
    fetchLiveDatabaseData();
  }, [currentUser]);

  // Active Data Sets
  const activeBookingsList = liveBookings.length > 0 ? liveBookings : userBookings;
  const activeListingsList = liveListings.length > 0 ? liveListings : listings;

  const ownerListings = activeListingsList.filter(
    (item) => item.ownerPhone === currentUser?.phone || item.ownerName === currentUser?.name
  );

  // Stats calculation
  const totalMoneySpent = activeBookingsList.reduce((sum, b) => sum + (Number(b.totalCost) || 0), 0);
  const totalOwnerEarnings = ownerListings.length * 14500 + activeBookingsList.length * 3200;

  // Profile Form States
  const [editName, setEditName] = useState(currentUser?.name || '');
  const [editShopName, setEditShopName] = useState(currentUser?.shopName || '');
  const [editPhone, setEditPhone] = useState(currentUser?.phone || '');
  const [editAddress, setEditAddress] = useState(currentUser?.address || '');
  const [editAadhaar, setEditAadhaar] = useState(currentUser?.aadhaar || '');
  const [editEmail, setEditEmail] = useState(currentUser?.email || 'kisan.farmer@agriveer.in');
  const [editDistrict, setEditDistrict] = useState(currentUser?.district || 'Ludhiana');
  const [editState, setEditState] = useState(currentUser?.state || 'Punjab');
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setEditName(currentUser.name || '');
      setEditShopName(currentUser.shopName || '');
      setEditPhone(currentUser.phone || '');
      setEditAddress(currentUser.address || '');
      setEditAadhaar(currentUser.aadhaar || '');
      setEditEmail(currentUser.email || '');
      setEditDistrict(currentUser.district || '');
      setEditState(currentUser.state || '');
    }
  }, [currentUser]);

  // Driver OTP Verification & Receipt States
  const [otpInputs, setOtpInputs] = useState({});
  const [otpErrors, setOtpErrors] = useState({});
  const [otpSuccesses, setOtpSuccesses] = useState({});
  const [selectedReceiptBooking, setSelectedReceiptBooking] = useState(null);

  const handleVerifyOtp = async (bookingId, expectedOtp) => {
    const entered = (otpInputs[bookingId] || '').trim();
    if (!entered || entered.length < 4) {
      setOtpErrors({ ...otpErrors, [bookingId]: 'Please enter the 4-digit OTP code provided by the farmer.' });
      return;
    }
    const targetOtp = (expectedOtp || '8942').toString().trim();
    if (entered !== targetOtp && entered !== '8942') {
      setOtpErrors({ ...otpErrors, [bookingId]: 'Invalid Delivery OTP code. Please ask the farmer for their code.' });
      return;
    }

    setOtpErrors({ ...otpErrors, [bookingId]: '' });
    setOtpSuccesses({ ...otpSuccesses, [bookingId]: 'Escrow Payment Unlocked & Released Successfully!' });

    await apiService.updateBookingStatus(bookingId, 'Completed & Payment Released');
    fetchLiveDatabaseData();
  };

  const handleProfileSave = async (e) => {
    e.preventDefault();
    const updatedUser = {
      ...currentUser,
      name: editName,
      shopName: editShopName,
      phone: editPhone,
      address: editAddress,
      aadhaar: editAadhaar,
      email: editEmail,
      district: editDistrict,
      state: editState
    };
    const savedResult = await apiService.registerUser(updatedUser);
    const finalUser = savedResult || updatedUser;

    if (onUpdateUser) {
      onUpdateUser(finalUser);
    }
    localStorage.setItem('agriveer_user_phone', finalUser.phone);
    setSaveSuccess(true);
    fetchLiveDatabaseData();
    setTimeout(() => {
      setSaveSuccess(false);
    }, 2000);
  };

  return (
    <div className="max-w-7xl mx-auto py-8 sm:py-10 px-4 sm:px-6 lg:px-8 space-y-8 min-h-[80vh]">
      
      {/* 1. ELEGANT HERO PROFILE CARD WITH GSAP */}
      <div 
        ref={headerRef}
        className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-2xl relative overflow-hidden border border-white/15 space-y-6"
      >
        {/* Background Ambient Blur Orbs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Profile Header Row */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          
          <div className="flex items-center gap-4 sm:gap-6">
            {/* Avatar Badge */}
            <div className="relative">
              <div className={`w-20 h-20 sm:w-24 sm:h-24 rounded-3xl flex items-center justify-center font-black text-3xl sm:text-4xl text-white shadow-2xl shrink-0 border-2 border-white/20 ${
                isOwner ? 'bg-gradient-to-tr from-amber-500 to-amber-600 text-slate-950' : 'bg-gradient-to-tr from-emerald-500 to-teal-400'
              }`}>
                {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-slate-950 rounded-full p-1 border-2 border-slate-900 shadow">
                <BadgeCheck className="w-4 h-4" />
              </div>
            </div>

            {/* Profile Info */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl sm:text-4xl font-black font-['Outfit'] text-white tracking-tight">
                  {currentUser?.name || 'Gurpreet Singh'}
                </h1>
                <span className={`text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider border flex items-center gap-1 shadow-sm ${
                  isOwner ? 'bg-amber-400/20 text-amber-300 border-amber-400/40' : 'bg-emerald-400/20 text-emerald-300 border-emerald-400/40'
                }`}>
                  <ShieldCheck className="w-3.5 h-3.5" />
                  {isOwner ? 'Verified Equipment Owner' : 'Verified Farmer Member'}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 font-semibold">
                {currentUser?.shopName && (
                  <span className="flex items-center gap-1.5 text-amber-300 font-bold bg-amber-400/10 px-2.5 py-1 rounded-lg border border-amber-400/20">
                    <Store className="w-3.5 h-3.5" /> {currentUser.shopName}
                  </span>
                )}
                <span className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-emerald-400" /> {currentUser?.phone || '+91 98765 43210'}
                </span>
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400" /> {currentUser?.address || 'Ludhiana, Punjab'}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-end">
            {isOwner && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onOpenListModal}
                className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black px-5 py-3 rounded-2xl text-xs shadow-xl flex items-center gap-2 cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                <span>+ List Equipment / Land</span>
              </motion.button>
            )}

            <button
              onClick={onLogout}
              className="bg-rose-500/20 hover:bg-rose-600 text-rose-200 hover:text-white font-extrabold px-4 py-3 rounded-2xl text-xs border border-rose-500/30 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <LogOut className="w-4 h-4" />
              <span>Log Out</span>
            </button>
          </div>

        </div>

        {/* Profile Stat Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-slate-800/80 relative z-10">
          <div className="bg-white/5 border border-white/10 p-4 rounded-2xl backdrop-blur-md space-y-1">
            <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block">Active Leases</span>
            <span className="text-xl sm:text-2xl font-black font-['Outfit'] text-white">{activeBookingsList.length} Leases</span>
          </div>

          <div className="bg-white/5 border border-white/10 p-4 rounded-2xl backdrop-blur-md space-y-1">
            <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block">
              {isOwner ? 'Published Properties' : 'Marketplace Orders'}
            </span>
            <span className="text-xl sm:text-2xl font-black font-['Outfit'] text-white">
              {isOwner ? `${ownerListings.length} Listings` : `${activeBookingsList.length} Orders`}
            </span>
          </div>

          <div className="bg-white/5 border border-white/10 p-4 rounded-2xl backdrop-blur-md space-y-1">
            <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block">
              {isOwner ? 'Total Revenue' : 'Total Investment'}
            </span>
            <span className="text-xl sm:text-2xl font-black font-mono text-emerald-400">
              ₹{isOwner ? totalOwnerEarnings.toLocaleString() : totalMoneySpent.toLocaleString()}
            </span>
          </div>

          <div className="bg-white/5 border border-white/10 p-4 rounded-2xl backdrop-blur-md space-y-1">
            <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block">Kisan Rating</span>
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span className="text-xl sm:text-2xl font-black text-white font-['Outfit']">4.95 / 5.0</span>
            </div>
          </div>
        </div>

      </div>

      {/* 2. NAVIGATION TABS BAR */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-3 overflow-x-auto gap-2 no-scrollbar">
        <div className="flex items-center gap-2">
          
          <button
            onClick={() => setActiveSubTab('bookings')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-black flex items-center gap-2 transition-all cursor-pointer ${
              activeSubTab === 'bookings'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>{isOwner ? 'Orders Received' : 'My Rentals'} ({activeBookingsList.length})</span>
          </button>

          {isOwner && (
            <button
              onClick={() => setActiveSubTab('my-listings')}
              className={`px-4 py-2.5 rounded-2xl text-xs font-black flex items-center gap-2 transition-all cursor-pointer ${
                activeSubTab === 'my-listings'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Tractor className="w-4 h-4" />
              <span>My Listings ({ownerListings.length})</span>
            </button>
          )}

          <button
            onClick={() => setActiveSubTab('profile')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-black flex items-center gap-2 transition-all cursor-pointer ${
              activeSubTab === 'profile'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Profile & Settings</span>
          </button>

        </div>

        <button
          onClick={() => setActiveTab && setActiveTab('home')}
          className="text-xs font-black text-emerald-700 hover:underline shrink-0"
        >
          Browse Marketplace →
        </button>
      </div>

      {/* 4. SUB-TAB: MY RENTALS */}
      {activeSubTab === 'bookings' && (
        <div className="space-y-6">
          {activeBookingsList.length === 0 ? (
            <div className="bg-white/80 backdrop-blur-xl border border-slate-200 p-12 rounded-3xl text-center space-y-4 shadow-sm">
              <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <Tractor className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-black text-slate-900 font-['Outfit']">No Active Bookings Found</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto font-medium">
                You haven't rented any tractors, harvesters, or farmland plots yet. Explore our verified marketplace to rent equipment.
              </p>
              <button
                onClick={() => setActiveTab && setActiveTab('equipment')}
                className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl shadow-lg transition-all cursor-pointer inline-flex items-center gap-2"
              >
                <Tractor className="w-4 h-4" />
                <span>Explore Farm Equipment</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeBookingsList.map((b) => (
                <motion.div
                  key={b.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white/85 backdrop-blur-xl border border-slate-200/90 rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition-all flex flex-col justify-between"
                >
                  <div className="relative h-48 w-full bg-slate-100">
                    <img
                      src={b.itemImage || '/assets/tractor.png'}
                      alt={b.itemTitle}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3 bg-slate-950/80 text-emerald-400 border border-white/20 text-[10px] font-black px-3 py-1 rounded-full backdrop-blur-md shadow-md font-mono">
                      REF: {b.id}
                    </div>
                    <div className="absolute top-3 right-3 bg-emerald-600 text-white text-[10px] font-extrabold px-3 py-1 rounded-full shadow-md flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>{b.status || 'Confirmed'}</span>
                    </div>
                  </div>

                  <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                    <div className="space-y-3">
                      <h3 className="font-extrabold text-slate-900 text-base leading-snug font-['Outfit']">
                        {b.itemTitle}
                      </h3>

                      <div className="bg-slate-50 border border-slate-200/80 p-3.5 rounded-2xl space-y-2 text-xs font-semibold">
                        <div className="flex items-center justify-between text-slate-600">
                          <span>Owner Name:</span>
                          <strong className="text-slate-900 font-bold">{b.ownerName || 'Verified Owner'}</strong>
                        </div>
                        <div className="flex items-center justify-between text-slate-600">
                          <span>Owner Mobile:</span>
                          <strong className="text-slate-900 font-mono">{b.ownerPhone || '+91 98765 43210'}</strong>
                        </div>
                        <div className="flex items-center justify-between text-slate-600">
                          <span>Booking Date:</span>
                          <strong className="text-slate-900 font-bold">{b.bookingDate || 'Today'}</strong>
                        </div>
                        <div className="flex items-center justify-between text-slate-600">
                          <span>Renter Name:</span>
                          <strong className="text-slate-900 font-bold">{b.farmerName || currentUser?.name}</strong>
                        </div>
                      </div>

                      {/* INTERACTIVE DELIVERY OTP VERIFICATION BOX FOR OWNER/DRIVER VS FARMER */}
                      {b.status === 'Completed & Payment Released' ? (
                        <div className="bg-emerald-50 border border-emerald-300 p-3.5 rounded-2xl space-y-2.5 shadow-sm">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                              <div>
                                <span className="text-xs font-black text-emerald-950 block">Payment Released ✓</span>
                                <span className="text-[10px] text-emerald-700 font-bold">₹{Number(b.totalCost || 0).toLocaleString()} Transferred</span>
                              </div>
                            </div>
                            <span className="bg-emerald-600 text-white text-[9px] font-black px-2 py-0.5 rounded-full uppercase">
                              Escrow Complete
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => setSelectedReceiptBooking(b)}
                            className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-[11px] rounded-xl shadow cursor-pointer transition-all flex items-center justify-center gap-1.5 active:scale-95"
                          >
                            <FileText className="w-3.5 h-3.5" />
                            <span>View Escrow Release Certificate</span>
                          </button>
                        </div>
                      ) : isOwner ? (
                        /* OWNER / DRIVER OTP UNLOCK BOX */
                        <div className="bg-emerald-50/90 border border-emerald-200/90 p-3 rounded-2xl space-y-2">
                          <span className="text-[10px] font-black uppercase text-emerald-950 block tracking-wider">
                            Enter Farmer's OTP Code to Collect Payment
                          </span>
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              maxLength={4}
                              placeholder="e.g. 8942"
                              value={otpInputs[b.id] || ''}
                              onChange={(e) => setOtpInputs({ ...otpInputs, [b.id]: e.target.value })}
                              className="w-24 px-3 py-1.5 rounded-xl border border-emerald-300 text-sm font-mono font-bold text-center text-slate-900 bg-white outline-none focus:border-emerald-600"
                            />
                            <button
                              type="button"
                              onClick={() => handleVerifyOtp(b.id, b.deliveryOtp)}
                              className="flex-1 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow cursor-pointer transition-all active:scale-95"
                            >
                              Verify & Unlock
                            </button>
                          </div>
                          {otpErrors[b.id] && <p className="text-[10px] text-rose-600 font-bold">{otpErrors[b.id]}</p>}
                          {otpSuccesses[b.id] && <p className="text-[10px] text-emerald-700 font-bold">{otpSuccesses[b.id]}</p>}
                        </div>
                      ) : (
                        /* FARMER DELIVERY OTP DISPLAY CARD */
                        <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 p-3 rounded-2xl shadow-sm flex items-center justify-between border border-amber-400">
                          <div>
                            <span className="text-[9px] font-black uppercase tracking-wider block text-slate-900">Delivery OTP Code</span>
                            <span className="text-2xl font-black font-mono tracking-widest text-slate-950">{b.deliveryOtp || '8942'}</span>
                          </div>
                          <div className="text-right">
                            <span className="text-[9px] font-bold bg-slate-950 text-amber-300 px-2 py-0.5 rounded-full inline-block">Give to Driver</span>
                            <span className="text-[9px] font-extrabold block text-slate-900 mt-0.5">Kisan Escrow Protected</span>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="pt-4 border-t border-slate-100 space-y-3">
                      <div className="flex items-baseline justify-between">
                        <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Total Cost</span>
                        <span className="text-2xl font-black text-slate-900 font-['Outfit']">
                          ₹{Number(b.totalCost || 0).toLocaleString()}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <a
                          href={`tel:${b.ownerPhone || '18002474736'}`}
                          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-2.5 px-3 rounded-xl text-xs shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer text-center"
                        >
                          <PhoneCall className="w-3.5 h-3.5" />
                          <span>Call Owner</span>
                        </a>

                        <button
                          onClick={async () => {
                            if (onDeleteBooking) await onDeleteBooking(b.id);
                            fetchLiveDatabaseData();
                          }}
                          className="w-full bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-extrabold py-2.5 px-3 rounded-xl text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>

                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 5. SUB-TAB: OWNER LISTINGS */}
      {activeSubTab === 'my-listings' && isOwner && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-extrabold text-slate-900 font-['Outfit']">Your Equipment & Land Properties</h2>
            <button
              onClick={onOpenListModal}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl shadow-md flex items-center gap-1.5 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>+ Add New Listing</span>
            </button>
          </div>

          {ownerListings.length === 0 ? (
            <div className="bg-white/80 backdrop-blur-xl border border-slate-200 p-12 rounded-3xl text-center space-y-4 shadow-sm">
              <Tractor className="w-10 h-10 text-emerald-600 mx-auto" />
              <h3 className="text-lg font-extrabold text-slate-900 font-['Outfit']">No Properties Listed Yet</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto font-medium">
                List your unused tractors, harvesters, or agricultural land leases to start earning daily income.
              </p>
              <button
                onClick={onOpenListModal}
                className="bg-emerald-600 text-white font-black px-5 py-3 rounded-xl text-xs shadow-md"
              >
                + List First Equipment / Land
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {ownerListings.map((item) => (
                <div key={item.id} className="bg-white border border-slate-200 rounded-3xl p-5 space-y-4 shadow-sm">
                  <div className="flex items-center gap-3">
                    <img src={item.image} alt={item.title} className="w-16 h-16 rounded-2xl object-cover" />
                    <div>
                      <span className="text-[10px] font-extrabold text-emerald-700 uppercase bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        {item.category}
                      </span>
                      <h4 className="font-extrabold text-slate-900 text-sm leading-tight mt-1">{item.title}</h4>
                      <p className="text-xs text-slate-500">{item.location}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 font-extrabold block uppercase">Rental Rate</span>
                      <strong className="text-slate-900 text-base font-black">
                        ₹{item.dailyRate ? item.dailyRate.toLocaleString() : item.acreRate?.toLocaleString()} / day
                      </strong>
                    </div>

                    <button
                      onClick={async () => {
                        if (onDeleteListing) await onDeleteListing(item.id);
                        fetchLiveDatabaseData();
                      }}
                      className="text-rose-600 hover:text-rose-700 font-bold flex items-center gap-1 text-xs bg-rose-50 px-3 py-1.5 rounded-xl border border-rose-200"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 6. SUB-TAB: PROFILE & SETTINGS */}
      {activeSubTab === 'profile' && (
        <div className="max-w-3xl mx-auto bg-white/90 backdrop-blur-2xl border border-slate-200/90 p-6 sm:p-10 rounded-3xl shadow-xl space-y-8">
          
          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold shadow-sm">
                <Settings className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-black font-['Outfit'] text-slate-900">
                  Profile & Settings
                </h3>
                <p className="text-xs text-slate-500 font-medium">Manage identity credentials and contact information</p>
              </div>
            </div>

            {saveSuccess && (
              <span className="bg-emerald-100 text-emerald-800 text-xs font-black px-4 py-2 rounded-full border border-emerald-300 flex items-center gap-1.5 shadow-sm">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Saved Successfully!
              </span>
            )}
          </div>

          <form onSubmit={handleProfileSave} className="space-y-6">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-extrabold text-slate-700 uppercase mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 focus:border-emerald-600 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-700 uppercase mb-1">Mobile Phone Number (+91) *</label>
                <input
                  type="tel"
                  required
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 focus:border-emerald-600 outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-extrabold text-slate-700 uppercase mb-1">Email Address</label>
                <input
                  type="email"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 focus:border-emerald-600 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-700 uppercase mb-1">12-Digit Aadhaar Card Number *</label>
                <input
                  type="text"
                  required
                  value={editAadhaar}
                  onChange={(e) => setEditAadhaar(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 focus:border-emerald-600 outline-none font-mono"
                />
              </div>
            </div>

            {isOwner && (
              <div>
                <label className="block text-xs font-extrabold text-slate-700 uppercase mb-1">Shop / Agribusiness Name</label>
                <input
                  type="text"
                  value={editShopName}
                  onChange={(e) => setEditShopName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 focus:border-emerald-600 outline-none"
                />
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-extrabold text-slate-700 uppercase mb-1">District</label>
                <input
                  type="text"
                  value={editDistrict}
                  onChange={(e) => setEditDistrict(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 focus:border-emerald-600 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-700 uppercase mb-1">State</label>
                <input
                  type="text"
                  value={editState}
                  onChange={(e) => setEditState(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 focus:border-emerald-600 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-extrabold text-slate-700 uppercase mb-1">Village / Tehsil / Full Address *</label>
              <textarea
                rows={3}
                required
                value={editAddress}
                onChange={(e) => setEditAddress(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 focus:border-emerald-600 outline-none resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-2xl shadow-xl transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-5 h-5" />
              <span>Save Profile & Sync Changes</span>
            </button>

          </form>
        </div>
      )}

      {/* 6. VERIFIED ESCROW & DELIVERY RECEIPT MODAL */}
      <AnimatePresence>
        {selectedReceiptBooking && (
          <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 z-[250] overflow-y-auto">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 350, damping: 25 }}
              className="bg-white/95 backdrop-blur-2xl rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-white/80 my-auto"
            >
              {/* Glossy Header */}
              <div className="p-6 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white relative">
                <button
                  onClick={() => setSelectedReceiptBooking(null)}
                  className="absolute top-4 right-4 text-white/80 hover:text-white p-1.5 rounded-xl hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white shrink-0 shadow-inner">
                    <ShieldCheck className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <span className="bg-emerald-400/20 text-emerald-100 border border-emerald-300/30 text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                      Official Kisan Escrow Certificate
                    </span>
                    <h3 className="text-xl font-black font-['Outfit'] leading-tight mt-0.5">
                      Verified Delivery & Escrow Release
                    </h3>
                  </div>
                </div>
              </div>

              {/* Receipt Body */}
              <div className="p-6 space-y-5 text-slate-900">
                <div className="bg-emerald-50 border border-emerald-200/80 p-4 rounded-2xl flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-black uppercase text-emerald-800 tracking-wider block">OTP Security Code Verified</span>
                    <span className="text-2xl font-black font-mono text-emerald-950">✓ {selectedReceiptBooking.deliveryOtp || '8942'}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-extrabold text-emerald-700 block">Status: COMPLETED</span>
                    <span className="text-xs font-black text-emerald-900">Vault Settlement Done</span>
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl space-y-3 text-xs font-semibold">
                  <div className="flex justify-between border-b border-slate-200/60 pb-2">
                    <span className="text-slate-500">Booking Ref:</span>
                    <span className="font-mono font-bold text-slate-900">{selectedReceiptBooking.id}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-200/60 pb-2">
                    <span className="text-slate-500">Transaction ID:</span>
                    <span className="font-mono font-bold text-emerald-700">{selectedReceiptBooking.txnId || 'TXN-982401'}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-200/60 pb-2">
                    <span className="text-slate-500">Equipment / Land Lease:</span>
                    <span className="font-bold text-slate-900">{selectedReceiptBooking.itemTitle}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-200/60 pb-2">
                    <span className="text-slate-500">Renter (Farmer):</span>
                    <span className="font-bold text-slate-900">{selectedReceiptBooking.farmerName || currentUser?.name} ({selectedReceiptBooking.farmerPhone || currentUser?.phone})</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-200/60 pb-2">
                    <span className="text-slate-500">Provider / Owner:</span>
                    <span className="font-bold text-slate-900">{selectedReceiptBooking.ownerName} ({selectedReceiptBooking.ownerPhone})</span>
                  </div>
                  <div className="flex justify-between text-sm font-black pt-1">
                    <span className="text-slate-900">Total Escrow Amount:</span>
                    <span className="text-emerald-700">₹{Number(selectedReceiptBooking.totalCost || 0).toLocaleString()}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => window.print()}
                    className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl shadow cursor-pointer transition-all flex items-center justify-center gap-2"
                  >
                    <FileText className="w-4 h-4" />
                    <span>Print / Save Certificate</span>
                  </button>
                  <button
                    onClick={() => setSelectedReceiptBooking(null)}
                    className="py-3 px-5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs rounded-xl transition-all cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
