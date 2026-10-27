import React, { useState, useEffect } from 'react';
import { 
  X, 
  Clock, 
  Phone, 
  UserCheck, 
  ShieldCheck, 
  CheckCircle2, 
  Lock, 
  CreditCard, 
  QrCode, 
  Building2, 
  Smartphone, 
  Download, 
  RefreshCw, 
  BadgeCheck, 
  Wallet, 
  ArrowRight, 
  ArrowLeft,
  Sparkles,
  Check,
  AlertTriangle,
  KeyRound,
  Shield,
  Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRazorpay } from '../hooks/useRazorpay';
import RazorpayDemoCheckout from './RazorpayDemoCheckout';

// Detect if real Razorpay keys are configured
const HAS_REAL_RZP_KEY = (() => {
  const key = (import.meta.env.VITE_RAZORPAY_KEY_ID || '').trim();
  return key && key !== '' && key !== 'rzp_test_YourTestKeyIdHere';
})();

export default function BookingModal({ item, isOpen, onClose, currentUser, onBookingConfirmed }) {
  // ── ALL HOOKS MUST BE CALLED UNCONDITIONALLY (React Rules of Hooks) ──
  // The early return guard is BELOW all hook declarations.

  // STEP STATE: 'details' | 'payment' | 'processing' | 'confirmed'
  const [step, setStep] = useState('details');

  // Razorpay hook — must be unconditional
  const { openCheckout, isLoading: isRazorpayLoading } = useRazorpay();
  const [razorpayError, setRazorpayError] = useState('');

  const [duration, setDuration] = useState(1);
  // Lazy initializers — safe even when item is null on first render
  const [unitType, setUnitType] = useState(() =>
    item?.hourlyRate ? 'hours' : item?.type === 'land' ? 'acres' : 'days'
  );
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);

  // Add-on states
  const [includeDriver, setIncludeDriver] = useState(() => item?.specs?.driverProvided || false);
  const [includeFuel, setIncludeFuel] = useState(false);
  const [includeTransport, setIncludeTransport] = useState(true);

  // Mandatory Renter Details
  const [farmerName, setFarmerName] = useState(currentUser?.name || '');
  const [farmerPhone, setFarmerPhone] = useState(currentUser?.phone || '');
  const [farmerAadhaar, setFarmerAadhaar] = useState(currentUser?.aadhaar || '');
  const [farmAddress, setFarmAddress] = useState(
    currentUser?.address ||
    (currentUser?.district ? `${currentUser.district}, ${currentUser.state}` : '')
  );

  // PAYMENT PROTECTION MODEL: 'escrow' | 'token' | 'cod'
  const [paymentModel, setPaymentModel] = useState('escrow');

  // PAYMENT GATEWAY METHOD: 'upi' | 'card' | 'netbanking' | 'kcc'
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [upiId, setUpiId] = useState(
    currentUser?.phone ? `${currentUser.phone}@upi` : '9876543210@paytm'
  );

  // Card states
  const [cardNumber, setCardNumber] = useState('4532 8912 0041 9823');
  const [cardExpiry, setCardExpiry] = useState('08/29');
  const [cardCvv, setCardCvv] = useState('892');
  const [cardName, setCardName] = useState(currentUser?.name || 'Gurpreet Singh');

  // Net banking state
  const [selectedBank, setSelectedBank] = useState('SBI');

  // KCC State
  const [kccNumber, setKccNumber] = useState('KCC-9823-4019-12');

  const [refId, setRefId] = useState('');
  const [txnId, setTxnId] = useState('');
  const [deliveryOtp, setDeliveryOtp] = useState('');
  const [processingStatus, setProcessingStatus] = useState('Connecting to Payment Gateway...');

  // Demo checkout modal state
  const [isDemoCheckoutOpen, setIsDemoCheckoutOpen] = useState(false);

  // ── EARLY RETURN GUARD (after all hooks) ──
  if (!isOpen || !item) return null;

  const isLand = item.type === 'land';

  // Cost calculation logic
  let baseRate = item.dailyRate || item.acreRate || 1000;
  if (unitType === 'hours' && item.hourlyRate) {
    baseRate = item.hourlyRate;
  } else if (unitType === 'acres' && item.acreRate) {
    baseRate = item.acreRate;
  }

  const baseTotal = baseRate * duration;
  const driverCost = includeDriver ? (unitType === 'hours' ? 100 * duration : 400 * duration) : 0;
  const fuelCost = includeFuel ? 600 * duration : 0;
  const transportCost = includeTransport ? 500 : 0;
  
  const grandTotal = baseTotal + driverCost + fuelCost + transportCost;

  // Escrow & Token Calculation
  const tokenPayable = Math.round(grandTotal * 0.15); // 15% token advance
  const remainingOnDelivery = grandTotal - tokenPayable;

  const actualOnlinePayable = paymentModel === 'escrow' ? grandTotal : paymentModel === 'token' ? tokenPayable : 0;

  // Step 1 -> Step 2 validation
  const handleProceedToPayment = (e) => {
    e.preventDefault();
    if (!farmerName || !farmerPhone || !farmerAadhaar || !farmAddress) {
      alert('Please fill in all mandatory fields: Full Name, Mobile Phone, 12-Digit Aadhaar Card Number, and Full Address.');
      return;
    }
    if (farmerAadhaar.replace(/\s/g, '').length < 12) {
      alert('Please enter a valid 12-digit Aadhaar Card Number.');
      return;
    }
    setStep('payment');
  };

  // Step 2 -> Step 3 (Payment Execution / Order Confirmation)
  const handleExecutePayment = () => {
    setStep('processing');
    setProcessingStatus('Verifying Kisan Protection Escrow & Order Security...');

    setTimeout(() => {
      setProcessingStatus('Securing Funds in Agriveer Kisan Escrow Vault...');
    }, 900);

    setTimeout(() => {
      const generatedRef = 'AGR-' + Math.floor(100000 + Math.random() * 900000);
      const generatedTxn = 'TXN-' + Math.floor(1000000000 + Math.random() * 9000000000);
      const generatedOtp = Math.floor(1000 + Math.random() * 9000).toString();
      setRefId(generatedRef);
      setTxnId(generatedTxn);
      setDeliveryOtp(generatedOtp);
      setStep('confirmed');

      if (onBookingConfirmed) {
        onBookingConfirmed({
          id: generatedRef,
          txnId: generatedTxn,
          deliveryOtp: generatedOtp,
          paymentModel: paymentModel,
          paymentMethod: paymentModel === 'cod' ? 'CASH_ON_DELIVERY' : paymentMethod.toUpperCase(),
          itemTitle: item.title,
          itemImage: item.image,
          ownerName: item.ownerName,
          ownerPhone: item.ownerPhone,
          totalCost: grandTotal,
          onlinePaid: actualOnlinePayable,
          balanceDueOnDelivery: paymentModel === 'token' ? remainingOnDelivery : paymentModel === 'cod' ? grandTotal : 0,
          farmerName: farmerName,
          farmerPhone: farmerPhone,
          farmerAadhaar: farmerAadhaar,
          farmerAddress: farmAddress,
          bookingDate: new Date().toLocaleDateString()
        });
      }
    }, 2200);
  };

  const handleResetModal = () => {
    setStep('details');
    setDuration(1);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 z-[200] overflow-y-auto">
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 350, damping: 25 }}
          className="bg-white/95 backdrop-blur-2xl rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden relative shadow-2xl border border-white/80 my-auto"
        >
          
          {/* Header */}
          <div className="shrink-0 p-4 sm:p-5 bg-gradient-to-r from-emerald-500/10 via-teal-500/5 to-emerald-500/10 border-b border-slate-200/80 relative backdrop-blur-md">
            <button
              onClick={handleResetModal}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1.5 rounded-xl hover:bg-slate-200/60 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <img
                src={item.image}
                alt={item.title}
                className="w-12 h-12 rounded-xl object-cover border border-slate-200 shadow-sm shrink-0"
              />
              <div>
                <div className="flex items-center gap-2">
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase border border-emerald-200">
                    {item.category}
                  </span>
                  <span className="bg-amber-100 text-amber-900 text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase flex items-center gap-1 border border-amber-300">
                    <Shield className="w-3 h-3 text-amber-600" /> Escrow Protected
                  </span>
                </div>
                <h3 className="text-lg font-extrabold font-['Outfit'] text-slate-900 leading-tight mt-0.5">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-500 font-medium">{item.location} (Owner: {item.ownerName})</p>
              </div>
            </div>
          </div>

          {/* Modal Content Body */}
          <div className="overflow-y-auto p-5 sm:p-6 space-y-4">

            {/* 1. STEP 1: RENTER DETAILS & RENTAL DURATION */}
            {step === 'details' && (
              <form onSubmit={handleProceedToPayment} className="space-y-4">
                
                {/* Mandatory Registration Details Box */}
                <div className="bg-emerald-50/80 border border-emerald-200/90 p-4 rounded-2xl space-y-3">
                  <h4 className="text-xs font-extrabold text-emerald-950 uppercase tracking-wider flex items-center gap-1.5 font-['Outfit']">
                    <UserCheck className="w-4 h-4 text-emerald-600" />
                    1. Renter Booking Details (Name, Phone, Aadhaar, Address)
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-extrabold text-slate-700 mb-1">Full Name *</label>
                      <input
                        type="text"
                        required
                        value={farmerName}
                        onChange={(e) => setFarmerName(e.target.value)}
                        placeholder="e.g. Gurpreet Singh"
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold outline-none focus:border-emerald-600 bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-extrabold text-slate-700 mb-1">Mobile Phone Number (+91) *</label>
                      <input
                        type="tel"
                        required
                        value={farmerPhone}
                        onChange={(e) => setFarmerPhone(e.target.value)}
                        placeholder="+91 98765 43210"
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold outline-none focus:border-emerald-600 bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-extrabold text-slate-700 mb-1">12-Digit Aadhaar Card Number *</label>
                      <input
                        type="text"
                        required
                        maxLength={14}
                        value={farmerAadhaar}
                        onChange={(e) => setFarmerAadhaar(e.target.value)}
                        placeholder="1234 5678 9012"
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-mono font-bold tracking-wider outline-none focus:border-emerald-600 bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-extrabold text-slate-700 mb-1">Full Address (Village / Tehsil) *</label>
                      <input
                        type="text"
                        required
                        value={farmAddress}
                        onChange={(e) => setFarmAddress(e.target.value)}
                        placeholder="e.g. Village Gill, Tehsil Ludhiana, Punjab"
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold outline-none focus:border-emerald-600 bg-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Duration & Rates Selector */}
                <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl space-y-3">
                  <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-1.5 font-['Outfit']">
                    <Clock className="w-4 h-4 text-emerald-700" />
                    2. Select Rental Duration & Rates
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1">Rent Duration</label>
                      <div className="flex items-center">
                        <button
                          type="button"
                          onClick={() => setDuration(Math.max(1, duration - 1))}
                          className="w-10 h-10 bg-white border border-slate-300 rounded-l-xl font-bold text-slate-700 hover:bg-slate-100 cursor-pointer"
                        >
                          -
                        </button>
                        <input
                          type="number"
                          min="1"
                          value={duration}
                          onChange={(e) => setDuration(Math.max(1, parseInt(e.target.value) || 1))}
                          className="w-full h-10 border-y border-slate-300 text-center font-bold text-slate-800 outline-none bg-white"
                        />
                        <button
                          type="button"
                          onClick={() => setDuration(duration + 1)}
                          className="w-10 h-10 bg-white border border-slate-300 rounded-r-xl font-bold text-slate-700 hover:bg-slate-100 cursor-pointer"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1">Rental Unit</label>
                      <select
                        value={unitType}
                        onChange={(e) => setUnitType(e.target.value)}
                        className="w-full h-10 px-3 rounded-xl border border-slate-300 font-bold text-xs text-slate-800 outline-none cursor-pointer bg-white"
                      >
                        {item.hourlyRate && <option value="hours">Hours (₹{item.hourlyRate}/hr)</option>}
                        <option value="days">Days (₹{item.dailyRate || item.acreRate}/day)</option>
                        {isLand && <option value="acres">Years / Acres Lease</option>}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Cost Summary Box */}
                <div className="bg-slate-900 text-white p-4 rounded-2xl space-y-2 shadow-inner">
                  <div className="flex justify-between text-xs text-emerald-300 font-semibold">
                    <span>Base Rent ({duration} {unitType})</span>
                    <span>₹{baseTotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-baseline pt-2 border-t border-slate-800">
                    <span className="text-xs font-extrabold uppercase text-amber-400">Total Rental Fee</span>
                    <span className="text-2xl font-black text-white font-['Outfit']">₹{grandTotal.toLocaleString()}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                >
                  <span>Select Payment & Escrow Protection (₹{grandTotal.toLocaleString()})</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

              </form>
            )}

            {/* 2. STEP 2: KISAN ESCROW & PAYMENT GATEWAY */}
            {step === 'payment' && (
              <div className="space-y-4">
                
                {/* Back Button & Escrow Banner */}
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => setStep('details')}
                    className="flex items-center gap-1.5 text-xs font-extrabold text-slate-600 hover:text-slate-900 bg-slate-100 px-3 py-1.5 rounded-xl cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" /> Back to Details
                  </button>

                  <div className="flex items-center gap-1.5 text-xs font-extrabold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-xl border border-emerald-300">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Agriveer Kisan Escrow Protected</span>
                  </div>
                </div>

                {/* ESCROW PROTECTION HIGHLIGHT BOX */}
                <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-950 text-white p-4 rounded-2xl border border-emerald-500/30 shadow-lg space-y-2">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold shrink-0 mt-0.5">
                      <Shield className="w-5 h-5" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-sm font-black text-amber-300 font-['Outfit']">How Agriveer Protects Your Money</h4>
                      <p className="text-[11px] text-slate-300 leading-relaxed font-medium">
                        Payment is <span className="font-bold text-white underline">NOT released to the owner immediately</span>. Funds are safely held in Agriveer Escrow until the tractor/machinery is delivered to your field & verified by your 4-digit OTP.
                      </p>
                    </div>
                  </div>
                </div>

                {/* CHOOSE PAYMENT PROTECTION MODEL */}
                <div>
                  <label className="block text-xs font-extrabold text-slate-800 uppercase mb-2">
                    How Would You Like to Pay? *
                  </label>

                  <div className="space-y-2.5">
                    
                    {/* Model 1: Safe Escrow Hold (100% Escrow Protection) */}
                    <div 
                      onClick={() => setPaymentModel('escrow')}
                      className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all ${
                        paymentModel === 'escrow' 
                          ? 'bg-emerald-50/90 border-emerald-600 shadow-md' 
                          : 'bg-white border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            paymentModel === 'escrow' ? 'border-emerald-600 bg-emerald-600' : 'border-slate-400'
                          }`}>
                            {paymentModel === 'escrow' && <Check className="w-3 h-3 text-white stroke-[3]" />}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-black text-xs text-slate-900">100% Escrow Vault Hold (Recommended)</span>
                              <span className="bg-emerald-600 text-white text-[9px] font-extrabold px-2 py-0.5 rounded-full">Safest</span>
                            </div>
                            <p className="text-[11px] text-slate-600 font-medium">
                              Pay ₹{grandTotal.toLocaleString()} now into Escrow. Released to owner ONLY after machinery arrives & passes inspection. 100% instant refund if cancelled.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Model 2: Token Advance (Pay 15% Now, Pay Rest on Field Delivery) */}
                    <div 
                      onClick={() => setPaymentModel('token')}
                      className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all ${
                        paymentModel === 'token' 
                          ? 'bg-emerald-50/90 border-emerald-600 shadow-md' 
                          : 'bg-white border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            paymentModel === 'token' ? 'border-emerald-600 bg-emerald-600' : 'border-slate-400'
                          }`}>
                            {paymentModel === 'token' && <Check className="w-3 h-3 text-white stroke-[3]" />}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-black text-xs text-slate-900">Pay 15% Token Advance (₹{tokenPayable.toLocaleString()})</span>
                              <span className="bg-amber-500 text-slate-950 text-[9px] font-extrabold px-2 py-0.5 rounded-full">Low Advance</span>
                            </div>
                            <p className="text-[11px] text-slate-600 font-medium">
                              Pay ₹{tokenPayable.toLocaleString()} token now to lock booking dates. Pay remaining <span className="font-extrabold text-slate-900">₹{remainingOnDelivery.toLocaleString()}</span> in Cash/UPI after machine reaches your field.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Model 3: Pay 100% Cash/UPI After Delivery */}
                    <div 
                      onClick={() => setPaymentModel('cod')}
                      className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all ${
                        paymentModel === 'cod' 
                          ? 'bg-emerald-50/90 border-emerald-600 shadow-md' 
                          : 'bg-white border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            paymentModel === 'cod' ? 'border-emerald-600 bg-emerald-600' : 'border-slate-400'
                          }`}>
                            {paymentModel === 'cod' && <Check className="w-3 h-3 text-white stroke-[3]" />}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-black text-xs text-slate-900">Pay 100% Upon Machinery Delivery (COD)</span>
                              <span className="bg-slate-800 text-white text-[9px] font-extrabold px-2 py-0.5 rounded-full">₹0 Advance</span>
                            </div>
                            <p className="text-[11px] text-slate-600 font-medium">
                              No advance payment required! Pay full ₹{grandTotal.toLocaleString()} directly to driver after inspecting the machine on your farm.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>

                {/* ONLINE PAYMENT GATEWAY (SHOWN FOR ESCROW & TOKEN ADVANCE) */}
                {paymentModel !== 'cod' && (
                  <div className="space-y-3 pt-2">
                    <label className="block text-xs font-extrabold text-slate-800 uppercase">
                      Select Gateway Method (Payable Now: ₹{actualOnlinePayable.toLocaleString()}) *
                    </label>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('upi')}
                        className={`p-3 rounded-2xl border flex flex-col items-center gap-1.5 font-extrabold text-xs transition-all cursor-pointer ${
                          paymentMethod === 'upi'
                            ? 'bg-emerald-600 text-white border-emerald-600 shadow-md scale-[1.02]'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <QrCode className="w-5 h-5" />
                        <span>BHIM UPI / QR</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPaymentMethod('card')}
                        className={`p-3 rounded-2xl border flex flex-col items-center gap-1.5 font-extrabold text-xs transition-all cursor-pointer ${
                          paymentMethod === 'card'
                            ? 'bg-emerald-600 text-white border-emerald-600 shadow-md scale-[1.02]'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <CreditCard className="w-5 h-5" />
                        <span>Debit / Credit Card</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPaymentMethod('netbanking')}
                        className={`p-3 rounded-2xl border flex flex-col items-center gap-1.5 font-extrabold text-xs transition-all cursor-pointer ${
                          paymentMethod === 'netbanking'
                            ? 'bg-emerald-600 text-white border-emerald-600 shadow-md scale-[1.02]'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <Building2 className="w-5 h-5" />
                        <span>Net Banking</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPaymentMethod('kcc')}
                        className={`p-3 rounded-2xl border flex flex-col items-center gap-1.5 font-extrabold text-xs transition-all cursor-pointer ${
                          paymentMethod === 'kcc'
                            ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-md scale-[1.02]'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <BadgeCheck className="w-5 h-5" />
                        <span>Kisan Card (KCC)</span>
                      </button>
                    </div>

                    {/* PAYMENT METHOD DETAILS INPUTS */}
                    <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl space-y-4">
                      {paymentMethod === 'upi' && (
                        <div className="space-y-3">
                          <div className="flex flex-col sm:flex-row items-center gap-4 bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                            <div className="w-28 h-28 bg-slate-900 text-white p-2 rounded-2xl flex flex-col items-center justify-center text-center shrink-0 border-2 border-emerald-500/50 shadow">
                              <QrCode className="w-16 h-16 text-emerald-400" />
                              <span className="text-[8px] font-black uppercase text-amber-300">Scan to Pay</span>
                            </div>

                            <div className="space-y-1 text-center sm:text-left">
                              <span className="text-xs font-black text-slate-900 block">Instant Scan via UPI</span>
                              <p className="text-[11px] text-slate-500 font-medium">
                                Pay ₹{actualOnlinePayable.toLocaleString()} safely into Escrow with Google Pay, PhonePe, or Paytm.
                              </p>
                            </div>
                          </div>

                          <input
                            type="text"
                            value={upiId}
                            onChange={(e) => setUpiId(e.target.value)}
                            placeholder="e.g. 9876543210@upi"
                            className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-mono font-bold text-slate-900 bg-white"
                          />
                        </div>
                      )}

                      {paymentMethod === 'card' && (
                        <div className="grid grid-cols-2 gap-3">
                          <div className="col-span-2">
                            <label className="block text-[11px] font-bold text-slate-700 mb-1">Card Number *</label>
                            <input
                              type="text"
                              value={cardNumber}
                              onChange={(e) => setCardNumber(e.target.value)}
                              placeholder="4532 8912 0041 9823"
                              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-mono font-bold text-slate-900 bg-white"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-bold text-slate-700 mb-1">Expiry (MM/YY) *</label>
                            <input
                              type="text"
                              value={cardExpiry}
                              onChange={(e) => setCardExpiry(e.target.value)}
                              placeholder="08/29"
                              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-mono font-bold text-slate-900 bg-white"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-bold text-slate-700 mb-1">CVV *</label>
                            <input
                              type="password"
                              maxLength={3}
                              value={cardCvv}
                              onChange={(e) => setCardCvv(e.target.value)}
                              placeholder="892"
                              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-mono font-bold text-slate-900 bg-white"
                            />
                          </div>
                        </div>
                      )}

                      {paymentMethod === 'netbanking' && (
                        <div className="grid grid-cols-3 gap-2">
                          {['SBI', 'HDFC', 'ICICI', 'PNB', 'AXIS', 'BOB'].map((bank) => (
                            <button
                              key={bank}
                              type="button"
                              onClick={() => setSelectedBank(bank)}
                              className={`p-2.5 rounded-xl border font-black text-xs transition-all cursor-pointer ${
                                selectedBank === bank
                                  ? 'bg-slate-900 text-amber-400 border-slate-900 shadow-md'
                                  : 'bg-white text-slate-700 border-slate-200'
                              }`}
                            >
                              {bank}
                            </button>
                          ))}
                        </div>
                      )}

                      {paymentMethod === 'kcc' && (
                        <div>
                          <label className="block text-[11px] font-bold text-amber-900 mb-1">KCC Account / Card Number *</label>
                          <input
                            type="text"
                            value={kccNumber}
                            onChange={(e) => setKccNumber(e.target.value)}
                            placeholder="KCC-9823-4019-12"
                            className="w-full px-3 py-2 rounded-xl border border-amber-300 text-xs font-mono font-bold text-slate-900 bg-white"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Razorpay Error Message */}
                {razorpayError && paymentModel !== 'cod' && (
                  <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-800 text-xs font-semibold px-4 py-3 rounded-xl">
                    <AlertTriangle className="w-4 h-4 shrink-0 text-red-500" />
                    <span>{razorpayError}</span>
                  </div>
                )}

                {/* ── PAY VIA RAZORPAY (Real Payment or Demo Modal) — Only for Escrow & Token ── */}
                {paymentModel !== 'cod' && (
                  <>
                    <button
                      type="button"
                      disabled={isRazorpayLoading}
                      onClick={() => {
                        setRazorpayError('');
                        const payable = paymentModel === 'token' ? tokenPayable : grandTotal;

                        // If real Razorpay keys are configured, use real SDK
                        if (HAS_REAL_RZP_KEY) {
                          openCheckout({
                            amount: payable,
                            receipt: 'agr-' + Date.now(),
                            name: 'Agriveer',
                            description: `Rental: ${item.title}`,
                            prefill: {
                              name: farmerName,
                              contact: farmerPhone.replace(/\D/g, '').slice(-10)
                            },
                            notes: {
                              item: item.title,
                              owner: item.ownerName,
                              renter: farmerName
                            },
                            onSuccess: (rzpData) => {
                              const generatedRef = 'AGR-' + Math.floor(100000 + Math.random() * 900000);
                              const generatedOtp = Math.floor(1000 + Math.random() * 9000).toString();
                              setRefId(generatedRef);
                              setTxnId(rzpData.razorpay_payment_id);
                              setDeliveryOtp(generatedOtp);
                              setStep('confirmed');
                              if (onBookingConfirmed) {
                                onBookingConfirmed({
                                  id: generatedRef,
                                  txnId: rzpData.razorpay_payment_id,
                                  deliveryOtp: generatedOtp,
                                  paymentModel,
                                  paymentMethod: 'RAZORPAY',
                                  itemTitle: item.title,
                                  itemImage: item.image,
                                  ownerName: item.ownerName,
                                  ownerPhone: item.ownerPhone,
                                  totalCost: grandTotal,
                                  onlinePaid: payable,
                                  balanceDueOnDelivery: paymentModel === 'token' ? remainingOnDelivery : 0,
                                  farmerName,
                                  farmerPhone,
                                  farmerAadhaar,
                                  farmerAddress: farmAddress,
                                  bookingDate: new Date().toLocaleDateString()
                                });
                              }
                            },
                            onFailure: (msg) => {
                              setRazorpayError(msg);
                            }
                          });
                        } else {
                          // Open the beautiful demo Razorpay checkout
                          setIsDemoCheckoutOpen(true);
                        }
                      }}
                      className="w-full py-4 bg-[#0d2e87] hover:bg-[#0a2270] disabled:opacity-60 text-white font-black rounded-2xl text-sm shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                    >
                      {isRazorpayLoading ? (
                        <><RefreshCw className="w-4 h-4 animate-spin" /><span>Opening Razorpay...</span></>
                      ) : (
                        <>
                          <Zap className="w-4 h-4 text-blue-200" />
                          <span>
                            Pay ₹{(paymentModel === 'token' ? tokenPayable : grandTotal).toLocaleString()} via Razorpay
                          </span>
                          <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-bold">
                            {HAS_REAL_RZP_KEY ? 'UPI · Card · NB' : 'Demo Checkout'}
                          </span>
                        </>
                      )}
                    </button>

                    {/* Divider */}
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-px bg-slate-200" />
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">or simulate payment</span>
                      <div className="flex-1 h-px bg-slate-200" />
                    </div>
                  </>
                )}

                {/* Final Pay / Confirm Action CTA (Simulated / COD) */}
                <button
                  type="button"
                  onClick={handleExecutePayment}
                  className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-2xl text-sm shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                >
                  <Lock className="w-4 h-4 text-emerald-200" />
                  <span>
                    {paymentModel === 'escrow' ? `Simulate ₹${grandTotal.toLocaleString()} Escrow` :
                     paymentModel === 'token' ? `Simulate ₹${tokenPayable.toLocaleString()} Token` :
                     `Confirm ₹0 Advance Delivery Booking`}
                  </span>
                </button>

              </div>
            )}

            {/* 3. STEP 3: PROCESSING ANIMATION */}
            {step === 'processing' && (
              <div className="py-12 text-center space-y-4">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                  <RefreshCw className="w-8 h-8 text-emerald-600 animate-spin" />
                </div>
                <h3 className="text-xl font-black text-slate-900 font-['Outfit']">Securing Rental Booking...</h3>
                <p className="text-xs font-bold text-emerald-700 bg-emerald-50 max-w-sm mx-auto p-2.5 rounded-xl border border-emerald-200">
                  {processingStatus}
                </p>
                <p className="text-[10px] text-slate-400 font-medium">Please do not close or refresh this page.</p>
              </div>
            )}

            {/* 4. STEP 4: CONFIRMATION & ESCROW DELIVERY OTP RECEIPT */}
            {step === 'confirmed' && (
              <div className="text-center space-y-4 py-3">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                  <CheckCircle2 className="w-10 h-10 text-emerald-600" />
                </div>

                <div>
                  <h3 className="text-2xl font-black text-slate-900 font-['Outfit']">Rental Agreement Confirmed!</h3>
                  <p className="text-xs text-slate-600 font-medium mt-1">
                    Your booking request has been saved in <span className="font-bold text-emerald-700">"My Rentals"</span> with Kisan Escrow Protection.
                  </p>
                </div>

                {/* ESCROW DELIVERY OTP CARD */}
                <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 p-4 rounded-2xl shadow-lg border border-amber-400 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-950">Delivery Verification OTP</span>
                    <span className="bg-slate-950 text-white text-[9px] font-bold px-2 py-0.5 rounded-full">Give to Driver Only After Arrival</span>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <KeyRound className="w-6 h-6 text-slate-950" />
                    <span className="text-3xl font-black font-mono tracking-widest text-slate-950">{deliveryOtp}</span>
                  </div>
                  <p className="text-[10px] font-bold text-slate-900">
                    Provide this 4-digit OTP code to the machinery operator ONLY AFTER inspect testing the tractor/equipment on your farm!
                  </p>
                </div>

                {/* Reference Ticket Box */}
                <div className="bg-slate-900 text-white p-5 rounded-2xl border border-slate-800 text-left space-y-3 shadow-lg">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold">Booking Reference ID</span>
                      <p className="text-lg font-black text-amber-400 tracking-wider font-mono">{refId}</p>
                    </div>
                    <span className="bg-emerald-500/20 text-emerald-400 text-xs px-3 py-1 rounded-full border border-emerald-500/40 font-bold flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" /> Escrow Protected
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-slate-400 block font-bold">Payment Model</span>
                      <span className="font-bold text-white uppercase">
                        {paymentModel === 'escrow' ? 'Safe Escrow Vault Hold' : paymentModel === 'token' ? '15% Token Advance' : '100% COD on Delivery'}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-bold">Paid Online Now</span>
                      <span className="font-extrabold text-emerald-400">₹{actualOnlinePayable.toLocaleString()}</span>
                    </div>
                    {paymentModel !== 'escrow' && (
                      <div>
                        <span className="text-slate-400 block font-bold">Due to Driver/Owner on Arrival</span>
                        <span className="font-extrabold text-amber-400">₹{(grandTotal - actualOnlinePayable).toLocaleString()}</span>
                      </div>
                    )}
                    <div>
                      <span className="text-slate-400 block font-bold">Renter Name</span>
                      <span className="font-bold text-white">{farmerName}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-bold">Mobile Phone</span>
                      <span className="font-bold text-white">{farmerPhone}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-bold">Owner Contact</span>
                      <span className="font-bold text-amber-400">{item.ownerName} ({item.ownerPhone})</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <a
                    href={`tel:${item.ownerPhone}`}
                    className="flex-1 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-md cursor-pointer"
                  >
                    <Phone className="w-4 h-4" /> Call Owner ({item.ownerPhone})
                  </a>
                  <button
                    onClick={handleResetModal}
                    className="py-3.5 px-6 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs cursor-pointer"
                  >
                    Done & Close
                  </button>
                </div>
              </div>
            )}

          </div>
        </motion.div>
      </div>

      {/* ── RAZORPAY DEMO CHECKOUT MODAL ── */}
      {isDemoCheckoutOpen && (
        <RazorpayDemoCheckout
          isOpen={isDemoCheckoutOpen}
          onClose={() => setIsDemoCheckoutOpen(false)}
          amount={paymentModel === 'token' ? tokenPayable : grandTotal}
          currency="INR"
          businessName="Agriveer"
          description={`Rental: ${item?.title || 'Agricultural Equipment'}`}
          itemImage={item?.image}
          itemTitle={item?.title}
          prefill={{
            name: farmerName,
            contact: farmerPhone.replace(/\D/g, '').slice(-10)
          }}
          onSuccess={(rzpData) => {
            setIsDemoCheckoutOpen(false);
            const generatedRef = 'AGR-' + Math.floor(100000 + Math.random() * 900000);
            const generatedOtp = Math.floor(1000 + Math.random() * 9000).toString();
            setRefId(generatedRef);
            setTxnId(rzpData.razorpay_payment_id);
            setDeliveryOtp(generatedOtp);
            setStep('confirmed');
            if (onBookingConfirmed) {
              const payable = paymentModel === 'token' ? tokenPayable : grandTotal;
              onBookingConfirmed({
                id: generatedRef,
                txnId: rzpData.razorpay_payment_id,
                deliveryOtp: generatedOtp,
                paymentModel,
                paymentMethod: 'RAZORPAY_DEMO',
                itemTitle: item.title,
                itemImage: item.image,
                ownerName: item.ownerName,
                ownerPhone: item.ownerPhone,
                totalCost: grandTotal,
                onlinePaid: payable,
                balanceDueOnDelivery: paymentModel === 'token' ? remainingOnDelivery : 0,
                farmerName,
                farmerPhone,
                farmerAadhaar,
                farmerAddress: farmAddress,
                bookingDate: new Date().toLocaleDateString()
              });
            }
          }}
          onFailure={(msg) => {
            setIsDemoCheckoutOpen(false);
            if (msg && msg !== 'Payment cancelled.') {
              setRazorpayError(msg);
            }
          }}
        />
      )}
    </AnimatePresence>
  );
}
