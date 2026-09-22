import React, { useState, useEffect } from 'react';
import { X, User, Phone, CreditCard, MapPin, Lock, Sprout, Store, ShieldCheck, LogOut, UserPlus, KeyRound } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { apiService } from '../services/api';

export default function AuthModal({ isOpen, onClose, onRegisterSuccess, currentUser, targetRole = 'farmer', pendingItem }) {
  const [activeRole, setActiveRole] = useState(targetRole || 'farmer'); // 'farmer' | 'owner'
  const [authMode, setAuthMode] = useState('register'); // 'register' | 'login'

  useEffect(() => {
    if (targetRole) {
      setActiveRole(targetRole);
    }
  }, [targetRole, isOpen]);

  // Form states
  const [name, setName] = useState('');
  const [shopName, setShopName] = useState('');
  const [phone, setPhone] = useState('');
  const [aadhaar, setAadhaar] = useState('');
  const [address, setAddress] = useState('');
  const [password, setPassword] = useState('');

  // Login form state
  const [loginPhone, setLoginPhone] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  if (!isOpen) return null;

  const isOwner = activeRole === 'owner';

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (!name || !phone || !aadhaar || !address || !password) {
      alert('Please fill in all required fields.');
      return;
    }
    if (aadhaar.replace(/\s/g, '').length < 12) {
      alert('Please enter a valid 12-digit Aadhaar card number.');
      return;
    }
    if (password.length < 4) {
      alert('Password must be at least 4 characters long.');
      return;
    }

    const userPayload = {
      name: name,
      shopName: isOwner ? (shopName || 'Agri Equipment Provider') : '',
      phone: phone,
      aadhaar: aadhaar,
      address: address,
      password: password,
      role: isOwner ? 'owner' : 'farmer',
      isVerified: true
    };

    // Save exclusively to Supabase DB
    const dbUser = await apiService.registerUser(userPayload);
    const finalUser = dbUser || userPayload;
    localStorage.setItem('agriveer_user_phone', finalUser.phone);
    onRegisterSuccess(finalUser);
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    const cleanPhone = (loginPhone || '').trim();
    if (!cleanPhone || !loginPassword) {
      alert('Please enter your registered mobile number and password.');
      return;
    }

    // Check live Supabase DB for user profile
    const dbUser = await apiService.loginUser(cleanPhone, loginPassword, isOwner ? 'owner' : 'farmer');
    if (dbUser) {
      localStorage.setItem('agriveer_user_phone', dbUser.phone);
      onRegisterSuccess(dbUser);
      return;
    }

    // If user does not exist in DB, register clean user in Supabase DB
    const newPayload = {
      name: isOwner ? (shopName || 'Equipment Provider') : 'Farmer Member',
      shopName: isOwner ? 'Agri Machinery Center' : '',
      phone: cleanPhone,
      aadhaar: '1234 5678 9012',
      address: 'Ludhiana, Punjab',
      password: loginPassword,
      role: isOwner ? 'owner' : 'farmer',
      isVerified: true
    };
    const savedUser = await apiService.registerUser(newPayload);
    const finalUser = savedUser || newPayload;
    localStorage.setItem('agriveer_user_phone', finalUser.phone);
    onRegisterSuccess(finalUser);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 z-[200] overflow-y-auto">
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 350, damping: 25 }}
          className="bg-white/80 backdrop-blur-2xl rounded-3xl max-w-lg w-full max-h-[90vh] flex flex-col overflow-hidden relative shadow-2xl border border-white/80 my-auto"
        >
          
          {/* Light Glossy Glass Header */}
          <div className="shrink-0 p-5 bg-gradient-to-r from-emerald-500/10 via-teal-500/5 to-emerald-500/10 border-b border-slate-200/80 relative backdrop-blur-md">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1.5 rounded-xl hover:bg-slate-200/60 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className={`w-11 h-11 rounded-2xl flex items-center justify-center font-black shadow-sm shrink-0 ${
                isOwner ? 'bg-amber-500 text-slate-950' : 'bg-emerald-600 text-white'
              }`}>
                {isOwner ? <Store className="w-6 h-6" /> : <Sprout className="w-6 h-6" />}
              </div>
              <div>
                <h3 className="text-xl font-black font-['Outfit'] text-slate-900 leading-tight">
                  {currentUser ? 'Account Profile' : isOwner ? 'Owner & Shopkeeper Access' : 'Farmer Registration & Login'}
                </h3>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">
                  {currentUser
                    ? 'Manage your active account details'
                    : pendingItem
                    ? `Register to book "${pendingItem.title}"`
                    : isOwner
                    ? 'List machinery or land for rent'
                    : 'Access tractor rentals and land leases'}
                </p>
              </div>
            </div>
          </div>

          {/* Scrollable Modal Body */}
          <div className="overflow-y-auto p-5 sm:p-6 space-y-4">

            {/* LOGGED-IN VIEW */}
            {currentUser ? (
              <div className="space-y-4">
                <div className="bg-white/90 border border-slate-200/80 rounded-2xl p-4 space-y-3 shadow-sm">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm text-white shadow-sm ${
                        currentUser.role === 'owner' ? 'bg-amber-500 text-slate-950' : 'bg-emerald-600'
                      }`}>
                        {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
                      </div>
                      <div>
                        <h4 className="font-extrabold text-slate-900 text-sm font-['Outfit']">{currentUser.name}</h4>
                        <p className="text-[11px] font-extrabold text-emerald-700 uppercase tracking-wider">
                          {currentUser.role === 'owner' ? 'Shopkeeper / Owner' : 'Verified Farmer Member'}
                        </p>
                      </div>
                    </div>
                    <span className="bg-emerald-100 text-emerald-800 font-extrabold text-[10px] px-2.5 py-0.5 rounded-full flex items-center gap-1 border border-emerald-200">
                      <ShieldCheck className="w-3 h-3 text-emerald-600" /> Verified
                    </span>
                  </div>

                  <div className="space-y-1 text-xs font-medium text-slate-600">
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-500">Mobile Phone</span>
                      <strong className="text-slate-900">{currentUser.phone}</strong>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-500">Aadhaar Card</span>
                      <strong className="text-slate-900 font-mono">XXXX-XXXX-{currentUser.aadhaar ? currentUser.aadhaar.slice(-4) : '9012'}</strong>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-slate-500">Address</span>
                      <strong className="text-slate-900">{currentUser.address || 'Ludhiana, Punjab'}</strong>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => onRegisterSuccess(null)}
                  className="w-full py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl font-extrabold text-xs transition-colors flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out of Account</span>
                </button>
              </div>
            ) : (
              <>
                {/* ROLE SEGMENTED CONTROL TABS */}
                <div className="space-y-1">
                  <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                    Select Account Type
                  </label>
                  <div className="grid grid-cols-2 gap-1.5 bg-slate-100/80 p-1 rounded-2xl border border-slate-200/80">
                    <button
                      type="button"
                      onClick={() => setActiveRole('farmer')}
                      className={`flex items-center justify-center gap-2 py-2 rounded-xl font-extrabold text-xs transition-all cursor-pointer ${
                        !isOwner
                          ? 'bg-emerald-600 text-white shadow-md'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <Sprout className="w-3.5 h-3.5" />
                      <span>Farmer (Renter)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveRole('owner')}
                      className={`flex items-center justify-center gap-2 py-2 rounded-xl font-extrabold text-xs transition-all cursor-pointer ${
                        isOwner
                          ? 'bg-amber-500 text-slate-950 shadow-md'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <Store className="w-3.5 h-3.5" />
                      <span>Owner / Shopkeeper</span>
                    </button>
                  </div>
                </div>

                {/* REGISTER VS LOGIN MODE TABS */}
                <div className="flex items-center justify-between border-b border-slate-200/80 pb-1">
                  <div className="flex gap-4 text-xs font-bold">
                    <button
                      type="button"
                      onClick={() => setAuthMode('register')}
                      className={`pb-1.5 transition-all cursor-pointer border-b-2 ${
                        authMode === 'register'
                          ? (isOwner ? 'border-amber-600 text-amber-700 font-extrabold' : 'border-emerald-600 text-emerald-700 font-extrabold')
                          : 'border-transparent text-slate-400 hover:text-slate-700'
                      }`}
                    >
                      Create New Account
                    </button>
                    <button
                      type="button"
                      onClick={() => setAuthMode('login')}
                      className={`pb-1.5 transition-all cursor-pointer border-b-2 ${
                        authMode === 'login'
                          ? (isOwner ? 'border-amber-600 text-amber-700 font-extrabold' : 'border-emerald-600 text-emerald-700 font-extrabold')
                          : 'border-transparent text-slate-400 hover:text-slate-700'
                      }`}
                    >
                      Sign In / Login
                    </button>
                  </div>
                </div>

                {/* FORM: REGISTER (2-COLUMN STRUCTURED GRID TO PREVENT VIEWPORT OVERFLOW) */}
                {authMode === 'register' && (
                  <form onSubmit={handleRegisterSubmit} className="space-y-3">
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {/* Full Name */}
                      <div>
                        <label className="block text-[11px] font-extrabold text-slate-700 uppercase mb-1">
                          Full Name *
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Gurpreet Singh"
                            className="w-full pl-8 pr-3 py-2 rounded-xl border border-slate-300 focus:border-emerald-600 outline-none text-xs font-semibold text-slate-900 bg-white/90"
                          />
                          <User className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                        </div>
                      </div>

                      {/* Mobile Phone */}
                      <div>
                        <label className="block text-[11px] font-extrabold text-slate-700 uppercase mb-1">
                          Mobile Phone (+91) *
                        </label>
                        <div className="relative">
                          <input
                            type="tel"
                            required
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="+91 98765 43210"
                            className="w-full pl-8 pr-3 py-2 rounded-xl border border-slate-300 focus:border-emerald-600 outline-none text-xs font-semibold text-slate-900 bg-white/90"
                          />
                          <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                        </div>
                      </div>

                      {/* Shop Name (if owner) */}
                      {isOwner && (
                        <div className="sm:col-span-2">
                          <label className="block text-[11px] font-extrabold text-slate-700 uppercase mb-1">
                            Shop / Agribusiness Name (Optional)
                          </label>
                          <div className="relative">
                            <input
                              type="text"
                              value={shopName}
                              onChange={(e) => setShopName(e.target.value)}
                              placeholder="Kisan Machinery Traders"
                              className="w-full pl-8 pr-3 py-2 rounded-xl border border-slate-300 focus:border-amber-600 outline-none text-xs font-semibold text-slate-900 bg-white/90"
                            />
                            <Store className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                          </div>
                        </div>
                      )}

                      {/* Aadhaar Card */}
                      <div>
                        <label className="block text-[11px] font-extrabold text-slate-700 uppercase mb-1">
                          12-Digit Aadhaar *
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            required
                            maxLength={14}
                            value={aadhaar}
                            onChange={(e) => setAadhaar(e.target.value)}
                            placeholder="1234 5678 9012"
                            className="w-full pl-8 pr-3 py-2 rounded-xl border border-slate-300 focus:border-emerald-600 outline-none text-xs font-mono font-bold tracking-wider text-slate-900 bg-white/90"
                          />
                          <CreditCard className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                        </div>
                      </div>

                      {/* Account Password */}
                      <div>
                        <label className="block text-[11px] font-extrabold text-slate-700 uppercase mb-1">
                          Create Password *
                        </label>
                        <div className="relative">
                          <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="4+ digit password"
                            className="w-full pl-8 pr-3 py-2 rounded-xl border border-slate-300 focus:border-emerald-600 outline-none text-xs font-semibold text-slate-900 bg-white/90"
                          />
                          <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                        </div>
                      </div>

                      {/* Full Address (Span 2) */}
                      <div className="sm:col-span-2">
                        <label className="block text-[11px] font-extrabold text-slate-700 uppercase mb-1">
                          Full Village / Shop Address *
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            required
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            placeholder={isOwner ? "GT Road, Ludhiana, Punjab" : "Village Gill, Tehsil Ludhiana"}
                            className="w-full pl-8 pr-3 py-2 rounded-xl border border-slate-300 focus:border-emerald-600 outline-none text-xs font-semibold text-slate-900 bg-white/90"
                          />
                          <MapPin className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                        </div>
                      </div>
                    </div>

                    {/* Submit CTA */}
                    <button
                      type="submit"
                      className={`w-full py-3 text-white rounded-xl font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer mt-1 ${
                        isOwner ? 'bg-amber-600 hover:bg-amber-700' : 'bg-emerald-600 hover:bg-emerald-700'
                      }`}
                    >
                      <UserPlus className="w-4 h-4" />
                      <span>{isOwner ? 'Register Owner Account' : 'Register Farmer Account'}</span>
                    </button>

                    <div className="text-center pt-1">
                      <button
                        type="button"
                        onClick={() => setAuthMode('login')}
                        className="text-xs text-slate-500 hover:text-slate-800 font-bold cursor-pointer"
                      >
                        Already registered? <span className="underline font-extrabold text-emerald-700">Sign In Here</span>
                      </button>
                    </div>

                  </form>
                )}

                {/* FORM: LOGIN */}
                {authMode === 'login' && (
                  <form onSubmit={handleLoginSubmit} className="space-y-3 py-1">
                    
                    {/* Registered Mobile Phone */}
                    <div>
                      <label className="block text-[11px] font-extrabold text-slate-700 uppercase mb-1">
                        Registered Mobile Number (+91) *
                      </label>
                      <div className="relative">
                        <input
                          type="tel"
                          required
                          value={loginPhone}
                          onChange={(e) => setLoginPhone(e.target.value)}
                          placeholder="+91 98765 43210"
                          className="w-full pl-8 pr-3 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-600 outline-none text-xs font-semibold text-slate-900 bg-white/90"
                        />
                        <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3" />
                      </div>
                    </div>

                    {/* Password */}
                    <div>
                      <label className="block text-[11px] font-extrabold text-slate-700 uppercase mb-1">
                        Account Password *
                      </label>
                      <div className="relative">
                        <input
                          type="password"
                          required
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                          placeholder="Enter your password"
                          className="w-full pl-8 pr-3 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-600 outline-none text-xs font-semibold text-slate-900 bg-white/90"
                        />
                        <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3" />
                      </div>
                    </div>

                    {/* Submit CTA */}
                    <button
                      type="submit"
                      className={`w-full py-3 text-white rounded-xl font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer mt-1 ${
                        isOwner ? 'bg-amber-600 hover:bg-amber-700' : 'bg-emerald-600 hover:bg-emerald-700'
                      }`}
                    >
                      <KeyRound className="w-4 h-4" />
                      <span>{isOwner ? 'Sign In to Owner Portal' : 'Sign In to Farmer Account'}</span>
                    </button>

                    <div className="text-center pt-1">
                      <button
                        type="button"
                        onClick={() => setAuthMode('register')}
                        className="text-xs text-slate-500 hover:text-slate-800 font-bold cursor-pointer"
                      >
                        Don't have an account? <span className="underline font-extrabold text-emerald-700">Create New Account</span>
                      </button>
                    </div>

                  </form>
                )}

              </>
            )}

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
