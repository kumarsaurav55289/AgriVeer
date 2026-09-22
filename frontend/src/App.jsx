import React, { useState, useEffect, useMemo } from 'react';
import Navbar from './components/Navbar';
import LanguageBar from './components/LanguageBar';
import Hero from './components/Hero';
import FilterBar from './components/FilterBar';
import ListingGrid from './components/ListingGrid';
import EquipmentGuide from './components/EquipmentGuide';
import BookingModal from './components/BookingModal';
import ListPropertyModal from './components/ListPropertyModal';
import AuthModal from './components/AuthModal';
import AboutPage from './components/AboutPage';
import UserDashboard from './components/UserDashboard';
import AiAssistant from './components/AiAssistant';
import Footer from './components/Footer';

import { MOCK_LISTINGS, TRANSLATIONS } from './data/mockData';
import { apiService } from './services/api';
import { PhoneCall, ShieldCheck, Sprout, Tractor, Calendar, CheckCircle2, FileText, UserCheck, Tag, Trash2, PlusCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function App() {
  // 1. LIVE SUPABASE DATABASE LISTINGS STATE
  const [listings, setListings] = useState([]);
  const [isLoadingListings, setIsLoadingListings] = useState(true);

  // 2. LIVE USER STATE (STORED IN SUPABASE DB)
  const [currentUser, setCurrentUser] = useState(null);

  // 3. LIVE BOOKINGS STATE (STORED IN SUPABASE DB)
  const [userBookings, setUserBookings] = useState([]);

  // INITIALIZE ALL BACKEND DATA LIVE FROM SUPABASE POSTGRESQL DB
  useEffect(() => {
    async function syncBackend() {
      setIsLoadingListings(true);

      // 1. Fetch live listings from Supabase
      const remoteListings = await apiService.getListings();
      if (remoteListings && Array.isArray(remoteListings)) {
        setListings(remoteListings);
      }

      // 2. Fetch live bookings from Supabase
      const remoteBookings = await apiService.getBookings();
      if (remoteBookings && Array.isArray(remoteBookings)) {
        setUserBookings(remoteBookings);
      }

      // 3. Fetch active logged-in user profile directly from Supabase DB
      const sessionPhone = localStorage.getItem('agriveer_user_phone');
      if (sessionPhone) {
        const liveUser = await apiService.loginUser(sessionPhone, '', '');
        if (liveUser) {
          setCurrentUser(liveUser);
        }
      }

      setIsLoadingListings(false);
    }
    syncBackend();
  }, []);

  const [currentLang, setCurrentLang] = useState(() => {
    return localStorage.getItem('agriveer_lang') || 'en';
  });
  
  // Navigation Page State
  const [activeTab, setActiveTab] = useState('home');

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [locationQuery, setLocationQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [maxPrice, setMaxPrice] = useState(65000);
  const [driverOnly, setDriverOnly] = useState(false);
  const [sortBy, setSortBy] = useState('featured');

  // Registration & Booking Modals
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authRoleTarget, setAuthRoleTarget] = useState('farmer');
  const [pendingBookingItem, setPendingBookingItem] = useState(null);
  const [isListModalOpen, setIsListModalOpen] = useState(false);
  const [selectedBookingItem, setSelectedBookingItem] = useState(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  const handleOpenFarmerAuth = () => {
    setAuthRoleTarget('farmer');
    setIsAuthModalOpen(true);
  };

  const handleOpenShopkeeperAuth = () => {
    setAuthRoleTarget('owner');
    setIsAuthModalOpen(true);
  };

  // Contact Form State
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactMsg, setContactMsg] = useState('');
  const [contactSubmitted, setContactSubmitted] = useState(false);

  // Active translation dictionary
  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.en;

  const [pendingListingAction, setPendingListingAction] = useState(false);

  const handleAddListing = async (newListing) => {
    const updated = [newListing, ...listings];
    setListings(updated);
    await apiService.createListing(newListing);
  };

  // STRICT GATED RENTAL FLOW: REQUIRES FARMER REGISTRATION/LOGIN FIRST
  const handleBookNow = (item) => {
    if (!currentUser) {
      setPendingBookingItem(item);
      setAuthRoleTarget('farmer');
      setIsAuthModalOpen(true);
      return;
    }
    setSelectedBookingItem(item);
    setIsBookingModalOpen(true);
  };

  // STRICT GATED LISTING FLOW: REQUIRES SHOPKEEPER/OWNER REGISTRATION/LOGIN FIRST
  const handleOpenListModal = () => {
    if (!currentUser || currentUser.role !== 'owner') {
      setPendingListingAction(true);
      setAuthRoleTarget('owner');
      setIsAuthModalOpen(true);
      return;
    }
    setIsListModalOpen(true);
  };

  const handleRegisterSuccess = (userData) => {
    setCurrentUser(userData);
    setIsAuthModalOpen(false);
    
    // Auto-resume pending booking flow after farmer registration
    if (userData && pendingBookingItem) {
      setSelectedBookingItem(pendingBookingItem);
      setIsBookingModalOpen(true);
      setPendingBookingItem(null);
    }

    // Auto-resume pending listing flow after shopkeeper registration
    if (userData && userData.role === 'owner' && pendingListingAction) {
      setIsListModalOpen(true);
      setPendingListingAction(false);
    }
  };

  const handleBookingConfirmed = async (bookingData) => {
    const updated = [bookingData, ...userBookings];
    setUserBookings(updated);
    await apiService.createBooking(bookingData);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('agriveer_user_phone');
    setActiveTab('home');
  };

  const handleUpdateUser = async (updatedUserData) => {
    const oldPhone = currentUser?.phone;
    const oldName = currentUser?.name;
    setCurrentUser(updatedUserData);
    localStorage.setItem('agriveer_user_phone', updatedUserData.phone);

    // 1. Cascade profile changes to owner's published listings
    if (updatedUserData.role === 'owner') {
      const updatedListings = listings.map(item => {
        if (item.ownerPhone === oldPhone || item.ownerName === oldName) {
          return {
            ...item,
            ownerName: updatedUserData.name,
            ownerPhone: updatedUserData.phone
          };
        }
        return item;
      });
      setListings(updatedListings);
    }

    // 2. Cascade profile changes to user's bookings
    const updatedBookings = userBookings.map(b => {
      if (b.farmerPhone === oldPhone || b.farmerName === oldName) {
        return {
          ...b,
          farmerName: updatedUserData.name,
          farmerPhone: updatedUserData.phone,
          farmerAddress: updatedUserData.address
        };
      }
      if (b.ownerPhone === oldPhone || b.ownerName === oldName) {
        return {
          ...b,
          ownerName: updatedUserData.name,
          ownerPhone: updatedUserData.phone
        };
      }
      return b;
    });
    setUserBookings(updatedBookings);

    // 3. Persist live update to Supabase
    await apiService.registerUser(updatedUserData);
  };

  const handleDeleteBooking = async (bookingId) => {
    if (window.confirm('Are you sure you want to delete this rental agreement?')) {
      const updated = userBookings.filter((b) => b.id !== bookingId);
      setUserBookings(updated);
      await apiService.deleteBooking(bookingId);
    }
  };

  const handleDeleteListing = async (listingId) => {
    if (window.confirm('Are you sure you want to remove this property listing?')) {
      const updated = listings.filter((l) => l.id !== listingId);
      setListings(updated);
      await apiService.deleteListing(listingId);
    }
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    setContactSubmitted(true);
    setTimeout(() => {
      setContactSubmitted(false);
      setContactName('');
      setContactPhone('');
      setContactMsg('');
    }, 3000);
  };

  // Strict Filter & Sort Logic for Land vs Equipment
  const filteredListings = useMemo(() => {
    return listings
      .filter((item) => {
        if (activeTab === 'land' && item.type !== 'land') return false;
        if (activeTab === 'equipment' && item.type !== 'machinery') return false;
        if (selectedCategory !== 'All' && item.category !== selectedCategory) return false;

        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchesTitle = item.title.toLowerCase().includes(q);
          const matchesDesc = item.description.toLowerCase().includes(q);
          const matchesCat = item.category.toLowerCase().includes(q);
          if (!matchesTitle && !matchesDesc && !matchesCat) return false;
        }

        if (locationQuery.trim()) {
          const loc = locationQuery.toLowerCase();
          if (!item.location.toLowerCase().includes(loc)) return false;
        }

        const effectivePrice = item.dailyRate || item.acreRate || 0;
        if (effectivePrice > maxPrice) return false;
        if (driverOnly && !item.specs.driverProvided) return false;

        return true;
      })
      .sort((a, b) => {
        const priceA = a.dailyRate || a.acreRate || 0;
        const priceB = b.dailyRate || b.acreRate || 0;

        if (sortBy === 'price-asc') return priceA - priceB;
        if (sortBy === 'price-desc') return priceB - priceA;
        if (sortBy === 'rating') return b.rating - a.rating;
        return 0;
      });
  }, [listings, activeTab, selectedCategory, searchQuery, locationQuery, maxPrice, driverOnly, sortBy]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setLocationQuery('');
    setSelectedCategory('All');
    setMaxPrice(65000);
    setDriverOnly(false);
    setSortBy('featured');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAF6] text-slate-900 font-sans">
      
      {/* 1. TOP NAVBAR */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentLang={currentLang}
        setCurrentLang={setCurrentLang}
        t={t}
        onOpenAuth={handleOpenFarmerAuth}
        onOpenListModal={handleOpenListModal}
        currentUser={currentUser}
        bookingCount={userBookings.length}
      />

      {/* PAGE ROUTER CONTENT */}

      {/* USER DASHBOARD PAGE (RENTER & OWNER PANELS) */}
      {activeTab === 'my-rentals' && (
        <main className="flex-1">
          <UserDashboard
            currentUser={currentUser}
            userBookings={userBookings}
            listings={listings}
            t={t}
            currentLang={currentLang}
            onLogout={handleLogout}
            onUpdateUser={handleUpdateUser}
            onOpenListModal={handleOpenListModal}
            onOpenBookingModal={(item) => handleBookNow(item)}
            onDeleteBooking={handleDeleteBooking}
            onDeleteListing={handleDeleteListing}
            setActiveTab={setActiveTab}
          />
        </main>
      )}

      {/* DETAILED ABOUT PAGE VIEW WITH GSAP & FRAMER MOTION */}
      {activeTab === 'about' && (
        <main className="flex-1">
          <AboutPage t={t} onOpenAuth={handleOpenFarmerAuth} />
        </main>
      )}

      {/* CONTACT US PAGE VIEW */}
      {activeTab === 'contact' && (
        <main className="max-w-5xl mx-auto py-12 px-4 sm:px-6 space-y-10 flex-1">
          <div className="text-center space-y-3">
            <span className="bg-amber-100 text-amber-900 font-extrabold text-xs px-3.5 py-1.5 rounded-full border border-amber-200 uppercase tracking-wider">
              24/7 Kisan Assistance
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 font-['Outfit']">
              {t.contactHeading || 'Contact Us & Farmer Support'}
            </h1>
            <p className="text-slate-600 text-sm font-medium">{t.contactSub || 'Have questions or need help booking a machine or land lease? Get in touch with our team.'}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            <div className="md:col-span-7 bg-white border border-slate-200 p-6 sm:p-8 rounded-3xl space-y-6 shadow-sm">
              <h3 className="text-xl font-extrabold text-slate-900 font-['Outfit'] border-b border-slate-100 pb-3">
                Send Us a Message
              </h3>

              {contactSubmitted ? (
                <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-2xl text-center space-y-2">
                  <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                  <h4 className="font-extrabold text-emerald-900 text-lg">Message Sent Successfully!</h4>
                  <p className="text-xs text-emerald-700">Our Kisan support team will call you back within 30 minutes.</p>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-extrabold text-slate-700 uppercase mb-1.5">
                      {t.formFullName || 'Full Name *'}
                    </label>
                    <input
                      type="text"
                      required
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      placeholder="e.g. Gurpreet Singh"
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-emerald-600 outline-none text-sm font-medium text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold text-slate-700 uppercase mb-1.5">
                      {t.formMobilePhone || 'Mobile Phone Number (+91) *'}
                    </label>
                    <input
                      type="tel"
                      required
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-emerald-600 outline-none text-sm font-medium text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold text-slate-700 uppercase mb-1.5">
                      {t.formMessage || 'How Can We Help You? *'}
                    </label>
                    <textarea
                      rows={4}
                      required
                      value={contactMsg}
                      onChange={(e) => setContactMsg(e.target.value)}
                      placeholder="Tell us what tractor, harvester, or land lease requirement you have..."
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-emerald-600 outline-none text-sm font-medium text-slate-900 resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm rounded-xl shadow-md transition-all"
                  >
                    {t.formSubmit || 'Submit Message & Request Call →'}
                  </button>
                </form>
              )}
            </div>

            <div className="md:col-span-5 space-y-6">
              <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-3xl space-y-4 shadow-xl">
                <div className="w-12 h-12 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold">
                  <PhoneCall className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-extrabold font-['Outfit'] text-white">{t.helplineTitle || 'Toll-Free Kisan Hotline'}</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {t.helplineText || 'Call our agricultural team 24/7 for instant assistance with machinery rentals and land leasing agreements.'}
                </p>
                <div className="pt-2 border-t border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Helpline Number</span>
                  <a href="tel:18002474736" className="text-xl font-black text-amber-400 font-mono">
                    1800-AGRI-RENT (1800-247-4736)
                  </a>
                </div>
              </div>
            </div>
          </div>
        </main>
      )}

      {/* HOME / EQUIPMENT / LAND MARKETPLACE VIEWS */}
      {(activeTab === 'home' || activeTab === 'equipment' || activeTab === 'land') && (
        <main className="flex-1">
          <Hero
            t={t}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            locationQuery={locationQuery}
            setLocationQuery={setLocationQuery}
            activeType={activeTab === 'equipment' ? 'machinery' : activeTab === 'land' ? 'land' : 'all'}
            setActiveType={(type) => {
              if (type === 'machinery') setActiveTab('equipment');
              else if (type === 'land') setActiveTab('land');
              else setActiveTab('home');
            }}
          />

          <FilterBar
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            maxPrice={maxPrice}
            setMaxPrice={setMaxPrice}
            driverOnly={driverOnly}
            setDriverOnly={setDriverOnly}
            sortBy={sortBy}
            setSortBy={setSortBy}
            resultCount={filteredListings.length}
            t={t}
          />

          <ListingGrid
            listings={filteredListings}
            t={t}
            currentLang={currentLang}
            onBookNow={handleBookNow}
            onResetFilters={handleResetFilters}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            userBookings={userBookings}
          />

          <EquipmentGuide
            t={t}
            onApplyFilter={(cat) => {
              setSelectedCategory(cat);
              const el = document.getElementById('listings');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
          />
        </main>
      )}

      {/* Footer */}
      <Footer t={t} onOpenAuth={() => { setPendingBookingItem(null); setIsAuthModalOpen(true); }} />

      {/* User Registration & Login Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => { setIsAuthModalOpen(false); setPendingBookingItem(null); }}
        currentUser={currentUser}
        pendingItem={pendingBookingItem}
        targetRole={authRoleTarget}
        onRegisterSuccess={handleRegisterSuccess}
      />

      {/* List Property / Equipment Modal */}
      <ListPropertyModal
        isOpen={isListModalOpen}
        onClose={() => setIsListModalOpen(false)}
        onAddListing={handleAddListing}
        currentUser={currentUser}
      />

      {/* Rental Checkout Modal */}
      <BookingModal
        item={selectedBookingItem}
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        currentUser={currentUser}
        onBookingConfirmed={handleBookingConfirmed}
      />

      {/* FLOATING KISAN AI ASSISTANT WIDGET (BOTTOM RIGHT) */}
      <AiAssistant />

    </div>
  );
}
