/**
 * RazorpayDemoCheckout — A pixel-perfect simulation of the Razorpay Standard
 * Checkout UI, for demo/test purposes when real API keys are not configured.
 *
 * Features:
 * - UPI (QR + VPA input), Cards (with live preview), Net Banking, Wallets
 * - OTP verification screen (demo OTP: 123456)
 * - Animated processing with step-by-step status messages
 * - Animated success screen with receipt details
 * - AgriVeer branding + item context in header
 * - Mobile-responsive design
 */
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ─── Razorpay Brand Colors ────────────────────────────────────────────────────
const RZP_BLUE   = '#3b5bdb';
const RZP_DARK   = '#072654';
const RZP_LIGHT  = '#e8effd';

// ─── SVG Assets ───────────────────────────────────────────────────────────────

const RazorpayLogoSVG = () => (
  <svg width="84" height="20" viewBox="0 0 90 22" fill="none">
    <path d="M8.5 0L0 22h5.5L14 0H8.5z" fill="#528FF0"/>
    <path d="M14 0L5.5 22H11L19.5 0H14z" fill="#87B0F8"/>
    <text x="23" y="17" fontFamily="Arial,sans-serif" fontWeight="700" fontSize="14" fill="white" letterSpacing="0.2">razorpay</text>
  </svg>
);

const UPIBadge = () => (
  <svg width="36" height="22" viewBox="0 0 36 22" rx="4">
    <rect width="36" height="22" rx="4" fill="#5f259f"/>
    <text x="5" y="15" fontFamily="Arial" fontWeight="900" fontSize="9" fill="white">UPI</text>
    <circle cx="28" cy="11" r="5" fill="none" stroke="#00BFFF" strokeWidth="1.5"/>
    <path d="M25 11l2 2 4-4" stroke="#00BFFF" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
  </svg>
);

const VisaLogo = () => (
  <svg width="36" height="22" viewBox="0 0 36 22">
    <rect width="36" height="22" rx="3" fill="#1a1f71"/>
    <text x="5" y="15" fontFamily="Arial" fontWeight="900" fontSize="12" fill="white" fontStyle="italic">VISA</text>
  </svg>
);

const MasterLogo = () => (
  <svg width="36" height="22" viewBox="0 0 36 22">
    <rect width="36" height="22" rx="3" fill="#252525"/>
    <circle cx="14" cy="11" r="7" fill="#eb001b"/>
    <circle cx="22" cy="11" r="7" fill="#f79e1b"/>
    <path d="M18 6.5a7 7 0 010 9 7 7 0 010-9z" fill="#ff5f00"/>
  </svg>
);

const RupayLogo = () => (
  <svg width="36" height="22" viewBox="0 0 36 22">
    <rect width="36" height="22" rx="3" fill="#1c6b35"/>
    <text x="3" y="15" fontFamily="Arial" fontWeight="900" fontSize="9" fill="white">RuPay</text>
  </svg>
);

const LockSVG = ({ size = 10 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <rect x="5" y="11" width="14" height="10" rx="2"/>
    <path d="M8 11V7a4 4 0 018 0v4" stroke="currentColor" strokeWidth="2" fill="none"/>
  </svg>
);

const SuccessCheckSVG = () => (
  <svg width="56" height="56" viewBox="0 0 56 56">
    <circle cx="28" cy="28" r="28" fill="#16a34a" opacity="0.12"/>
    <circle cx="28" cy="28" r="22" fill="#16a34a"/>
    <path d="M18 28l6 6 14-14" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
  </svg>
);

// ─── Decorative QR Code ────────────────────────────────────────────────────────
const QRCodeSVG = ({ upiVpa = 'agriveer@razorpay' }) => (
  <svg width="140" height="140" viewBox="0 0 140 140">
    <rect width="140" height="140" fill="white"/>
    {/* Border */}
    <rect x="5" y="5" width="130" height="130" rx="6" stroke="#1e293b" strokeWidth="3.5" fill="none"/>
    {/* Top-left finder */}
    <rect x="16" y="16" width="32" height="32" rx="3" fill="#1e293b"/>
    <rect x="22" y="22" width="20" height="20" rx="2" fill="white"/>
    <rect x="27" y="27" width="10" height="10" rx="1" fill="#1e293b"/>
    {/* Top-right finder */}
    <rect x="92" y="16" width="32" height="32" rx="3" fill="#1e293b"/>
    <rect x="98" y="22" width="20" height="20" rx="2" fill="white"/>
    <rect x="103" y="27" width="10" height="10" rx="1" fill="#1e293b"/>
    {/* Bottom-left finder */}
    <rect x="16" y="92" width="32" height="32" rx="3" fill="#1e293b"/>
    <rect x="22" y="98" width="20" height="20" rx="2" fill="white"/>
    <rect x="27" y="103" width="10" height="10" rx="1" fill="#1e293b"/>
    {/* Data modules — decorative */}
    {[60,66,72,78,84,60,68,76,84,62,70,78,60,64,72,80].map((x, i) => (
      <rect key={i} x={x} y={16 + (i % 8) * 9} width="5" height="5" fill="#1e293b" opacity={0.65 + (i % 4) * 0.07}/>
    ))}
    {[16,22,28,34,40,46,52,58,64,70,76,82,88].map((y, i) => (
      <rect key={`v${i}`} x={60 + (i % 4) * 9} y={y} width="5" height="5" fill="#1e293b" opacity={0.7}/>
    ))}
    {/* UPI center badge */}
    <rect x="46" y="56" width="48" height="28" rx="5" fill="#5f259f"/>
    <text x="70" y="74" textAnchor="middle" fontFamily="Arial" fontWeight="900" fontSize="13" fill="white">UPI</text>
    {/* Bottom data row */}
    {[16,24,32,40,48,56,64,72,80,88,96,104,112,120].map((x, i) => (
      <rect key={`b${i}`} x={x} y={i % 2 === 0 ? 118 : 122} width={i % 3 === 0 ? 6 : 4} height={i % 2 === 0 ? 10 : 7} fill="#1e293b" opacity={0.55}/>
    ))}
  </svg>
);

// ─── Bank list ─────────────────────────────────────────────────────────────────
const BANKS = [
  { id: 'sbi',    name: 'State Bank of India',    short: 'SBI',  color: '#1a3c8f' },
  { id: 'hdfc',   name: 'HDFC Bank',              short: 'HDFC', color: '#004c8f' },
  { id: 'icici',  name: 'ICICI Bank',             short: 'ICICI',color: '#b5131c' },
  { id: 'axis',   name: 'Axis Bank',              short: 'AXIS', color: '#97144d' },
  { id: 'pnb',    name: 'Punjab National Bank',   short: 'PNB',  color: '#1a5c2a' },
  { id: 'kotak',  name: 'Kotak Mahindra Bank',    short: 'KMB',  color: '#ee3124' },
  { id: 'bob',    name: 'Bank of Baroda',         short: 'BOB',  color: '#f07d00' },
  { id: 'canara', name: 'Canara Bank',            short: 'CB',   color: '#1a3c8f' },
];

const WALLETS = [
  { id: 'paytm',   name: 'Paytm',     color: '#00BAF2', textColor: '#fff', logo: '₱' },
  { id: 'phonepe', name: 'PhonePe',   color: '#5f259f', textColor: '#fff', logo: 'Ṗ' },
  { id: 'gpay',    name: 'Google Pay',color: '#4285F4', textColor: '#fff', logo: 'G' },
  { id: 'amazon',  name: 'Amazon Pay',color: '#FF9900', textColor: '#111', logo: 'A' },
];

const UPI_APPS = [
  { name: 'GPay',    color: '#4285F4' },
  { name: 'PhonePe', color: '#5f259f' },
  { name: 'Paytm',   color: '#00BAF2' },
  { name: 'BHIM',    color: '#00538B' },
];

// ─── Main Component ────────────────────────────────────────────────────────────
export default function RazorpayDemoCheckout({
  isOpen,
  onClose,
  amount = 1800,
  currency = 'INR',
  businessName = 'Agriveer',
  description = 'Agricultural Equipment Rental',
  itemImage,
  itemTitle,
  prefill = {},
  onSuccess,
  onFailure,
}) {
  const [tab, setTab]                     = useState('upi');
  const [phase, setPhase]                 = useState('input');
  const [upiMode, setUpiMode]             = useState('id');
  const [upiId, setUpiId]                 = useState(prefill.contact ? `${prefill.contact}@paytm` : '9876543210@paytm');
  const [selectedBank, setSelectedBank]   = useState('sbi');
  const [selectedWallet, setSelectedWallet] = useState('paytm');

  // Card state
  const [cardNum, setCardNum]   = useState('4111 1111 1111 1111');
  const [cardExp, setCardExp]   = useState('12/26');
  const [cardCvv, setCardCvv]   = useState('');
  const [cardName, setCardName] = useState(prefill.name || 'Gurpreet Singh');
  const [cardFlipped, setCardFlipped] = useState(false);

  // OTP state
  const [otp, setOtp]           = useState(['', '', '', '', '', '']);
  const [otpError, setOtpError] = useState('');
  const otpRefs = useRef([]);

  // Processing state
  const [processingMsg, setProcessingMsg] = useState('');
  const [progress, setProgress]           = useState(0);
  const [paymentId, setPaymentId]         = useState('');
  const [orderId, setOrderId]             = useState('');

  // Reset when opened
  useEffect(() => {
    if (isOpen) {
      setPhase('input');
      setTab('upi');
      setUpiMode('id');
      setProgress(0);
      setOtp(['', '', '', '', '', '']);
      setOtpError('');
      setCardCvv('');
      setCardFlipped(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const formattedAmount = new Intl.NumberFormat('en-IN', {
    style: 'currency', currency, minimumFractionDigits: 0
  }).format(amount);

  // ── OTP handling ──────────────────────────────────────────────────────────
  const handleOtpChange = (i, val) => {
    if (!/^\d*$/.test(val)) return;
    const next = [...otp];
    next[i] = val.slice(-1);
    setOtp(next);
    if (val && i < 5) otpRefs.current[i + 1]?.focus();
    if (next.every(d => d !== '') && next.join('') === '123456') {
      handleOtpSubmit(next.join(''));
    }
  };

  const handleOtpKeyDown = (i, e) => {
    if (e.key === 'Backspace' && !otp[i] && i > 0) {
      otpRefs.current[i - 1]?.focus();
    }
  };

  // ── Pay action ─────────────────────────────────────────────────────────────
  const handlePay = () => {
    if (tab === 'upi' && upiMode === 'id' && !upiId.includes('@')) {
      alert('Please enter a valid UPI ID (e.g. 9876543210@paytm)');
      return;
    }
    if (tab === 'card') {
      if (cardNum.replace(/\s/g, '').length < 16) { alert('Enter a valid 16-digit card number.'); return; }
      if (!cardExp.includes('/')) { alert('Enter a valid expiry (MM/YY).'); return; }
      if (cardCvv.length < 3) { alert('Enter a valid 3-digit CVV.'); return; }
      setPhase('otp');
      setTimeout(() => otpRefs.current[0]?.focus(), 100);
      return;
    }
    simulateProcessing();
  };

  const handleOtpSubmit = (code = otp.join('')) => {
    if (code !== '123456') {
      setOtpError('Incorrect OTP. Please try again. (Hint: 123456)');
      setOtp(['', '', '', '', '', '']);
      setTimeout(() => otpRefs.current[0]?.focus(), 50);
      return;
    }
    setOtpError('');
    simulateProcessing();
  };

  const simulateProcessing = () => {
    setPhase('processing');
    setProgress(0);
    const pid = 'pay_Demo' + Math.random().toString(36).slice(2, 12).toUpperCase();
    const oid = 'order_Demo' + Math.random().toString(36).slice(2, 12).toUpperCase();
    setPaymentId(pid);
    setOrderId(oid);

    const messages = [
      'Authenticating with bank...',
      'Verifying payment details...',
      'Processing transaction...',
      'Securing payment channel...',
      'Confirming with Agriveer...',
    ];
    let step = 0;
    setProcessingMsg(messages[0]);

    const interval = setInterval(() => {
      step++;
      setProgress(Math.min(step * 20, 96));
      if (step < messages.length) setProcessingMsg(messages[step]);
    }, 500);

    setTimeout(() => {
      clearInterval(interval);
      setProgress(100);
      setProcessingMsg('Payment Successful!');
      setTimeout(() => {
        setPhase('success');
        setTimeout(() => {
          onSuccess && onSuccess({
            razorpay_payment_id: pid,
            razorpay_order_id: oid,
            razorpay_signature: 'demo_sig_' + Date.now()
          });
        }, 2000);
      }, 400);
    }, 3000);
  };

  const TABS = [
    { id: 'upi',        label: 'UPI',         icon: '⚡' },
    { id: 'card',       label: 'Cards',       icon: '💳' },
    { id: 'netbanking', label: 'Net Banking',  icon: '🏦' },
    { id: 'wallet',     label: 'Wallets',      icon: '👝' },
  ];

  // ─── Card number → brand detection ────────────────────────────────────────
  const getCardBrand = (num) => {
    const n = num.replace(/\s/g, '');
    if (n.startsWith('4')) return 'visa';
    if (n.startsWith('5') || n.startsWith('2')) return 'master';
    if (n.startsWith('6')) return 'rupay';
    return null;
  };
  const cardBrand = getCardBrand(cardNum);

  return (
    <AnimatePresence>
      {/* Backdrop */}
      <motion.div
        key="rzp-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{
          position: 'fixed', inset: 0, zIndex: 99999,
          background: 'rgba(2,6,23,0.78)',
          backdropFilter: 'blur(6px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '16px'
        }}
        onClick={e => {
          if (e.target === e.currentTarget && phase !== 'processing') {
            onClose();
            onFailure && onFailure('Payment cancelled.');
          }
        }}
      >
        {/* Modal */}
        <motion.div
          key="rzp-modal"
          initial={{ scale: 0.88, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.88, opacity: 0, y: 30 }}
          transition={{ type: 'spring', stiffness: 380, damping: 28 }}
          style={{
            width: '100%', maxWidth: 560,
            maxHeight: '94vh',
            borderRadius: 10,
            overflow: 'hidden',
            boxShadow: '0 32px 100px rgba(0,0,0,0.65), 0 0 0 1px rgba(255,255,255,0.06)',
            display: 'flex', flexDirection: 'column',
          }}
        >

          {/* ── Header ─────────────────────────────────────────────────────── */}
          <div style={{
            background: `linear-gradient(145deg, ${RZP_DARK} 0%, #0a3070 100%)`,
            padding: '14px 18px 12px',
            flexShrink: 0,
          }}>
            {/* Top row: business info + amount */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                {/* Business logo */}
                <div style={{
                  width: 42, height: 42, borderRadius: 8,
                  background: 'linear-gradient(135deg,#059669,#10b981)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'white', fontWeight: 900, fontSize: 18,
                  boxShadow: '0 4px 12px rgba(5,150,105,0.4)',
                  overflow: 'hidden', flexShrink: 0,
                }}>
                  {itemImage
                    ? <img src={itemImage} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>
                    : 'A'
                  }
                </div>
                <div>
                  <div style={{ color: 'white', fontWeight: 800, fontSize: 14, fontFamily: 'Arial', lineHeight: 1.2 }}>
                    {businessName}
                  </div>
                  <div style={{ color: '#94a3b8', fontSize: 11, fontFamily: 'Arial', maxWidth: 220, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {itemTitle || description}
                  </div>
                </div>
              </div>

              {/* Amount */}
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{ color: '#64748b', fontSize: 9, fontFamily: 'Arial', textTransform: 'uppercase', letterSpacing: 1 }}>
                  Amount
                </div>
                <div style={{ color: 'white', fontWeight: 900, fontSize: 22, fontFamily: 'Arial', lineHeight: 1.1 }}>
                  {formattedAmount}
                </div>
              </div>
            </div>

            {/* Razorpay secure bar */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              gap: 5, marginTop: 10, paddingTop: 8,
              borderTop: '1px solid rgba(255,255,255,0.07)'
            }}>
              <LockSVG size={9}/>
              <span style={{ color: '#475569', fontSize: 9.5, fontFamily: 'Arial' }}>Secured by</span>
              <RazorpayLogoSVG/>
              <span style={{
                marginLeft: 6, background: 'rgba(255,255,255,0.07)', borderRadius: 3,
                padding: '2px 7px', fontSize: 9, color: '#64748b', fontFamily: 'Arial', fontWeight: 700
              }}>
                🧪 Demo Mode
              </span>
            </div>
          </div>

          {/* ── Body ───────────────────────────────────────────────────────── */}
          <div style={{ display: 'flex', flex: 1, background: '#f1f5f9', overflow: 'hidden', minHeight: 0 }}>

            {/* Left Sidebar — tabs */}
            {phase === 'input' && (
              <div style={{
                width: 148, background: 'white',
                borderRight: '1px solid #e2e8f0',
                flexShrink: 0,
                overflowY: 'auto',
              }}>
                {TABS.map(({ id, label, icon }) => (
                  <button
                    key={id}
                    onClick={() => setTab(id)}
                    style={{
                      width: '100%', padding: '13px 14px',
                      display: 'flex', alignItems: 'center', gap: 9,
                      background: tab === id ? '#eef2ff' : 'transparent',
                      borderLeft: tab === id ? `3px solid ${RZP_BLUE}` : '3px solid transparent',
                      borderTop: 'none', borderRight: 'none',
                      borderBottom: '1px solid #f1f5f9',
                      cursor: 'pointer',
                      color: tab === id ? RZP_BLUE : '#475569',
                      fontWeight: tab === id ? 800 : 500,
                      fontSize: 12.5, fontFamily: 'Arial',
                      textAlign: 'left', transition: 'all 0.15s',
                    }}
                  >
                    <span style={{ fontSize: 15 }}>{icon}</span>
                    {label}
                  </button>
                ))}

                {/* Saved instruments hint */}
                <div style={{ padding: '12px 14px', marginTop: 4 }}>
                  <div style={{ fontSize: 9, color: '#94a3b8', fontFamily: 'Arial', fontWeight: 600, textTransform: 'uppercase', marginBottom: 6, letterSpacing: 0.5 }}>
                    Saved
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 8px', background: '#f8fafc', borderRadius: 5, border: '1px solid #e2e8f0' }}>
                    <span style={{ fontSize: 13 }}>💳</span>
                    <div>
                      <div style={{ fontSize: 10, fontWeight: 700, color: '#1e293b', fontFamily: 'Arial' }}>HDFC ••4823</div>
                      <div style={{ fontSize: 9, color: '#94a3b8', fontFamily: 'Arial' }}>Debit Card</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Right Content Area */}
            <div style={{ flex: 1, overflowY: 'auto', padding: 20 }}>

              {/* ── INPUT PHASE ──────────────────────────────────────────── */}
              {phase === 'input' && (
                <AnimatePresence mode="wait">
                  <motion.div
                    key={tab}
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -12 }}
                    transition={{ duration: 0.13 }}
                  >

                    {/* UPI Tab */}
                    {tab === 'upi' && (
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 800, color: '#1e293b', fontFamily: 'Arial', marginBottom: 12 }}>
                          Pay via UPI
                        </div>

                        {/* UPI mode toggle */}
                        <div style={{ display: 'flex', gap: 6, marginBottom: 14 }}>
                          {['id', 'qr'].map(m => (
                            <button key={m} onClick={() => setUpiMode(m)} style={{
                              padding: '6px 16px', borderRadius: 4, fontSize: 12,
                              fontFamily: 'Arial', fontWeight: 700, cursor: 'pointer',
                              border: `1.5px solid ${upiMode === m ? RZP_BLUE : '#cbd5e1'}`,
                              background: upiMode === m ? '#eef2ff' : 'white',
                              color: upiMode === m ? RZP_BLUE : '#64748b',
                              transition: 'all 0.15s'
                            }}>
                              {m === 'id' ? '📲 UPI ID' : '🔲 QR Code'}
                            </button>
                          ))}
                        </div>

                        {upiMode === 'id' ? (
                          <div>
                            <div style={{ fontSize: 11, color: '#64748b', fontFamily: 'Arial', marginBottom: 5 }}>Enter UPI ID</div>
                            <input
                              value={upiId}
                              onChange={e => setUpiId(e.target.value)}
                              placeholder="yourname@upi"
                              style={{
                                width: '100%', padding: '10px 12px', borderRadius: 5,
                                border: `1.5px solid #cbd5e1`, fontSize: 13, fontFamily: 'monospace',
                                outline: 'none', boxSizing: 'border-box', color: '#1e293b', background: 'white',
                              }}
                              onFocus={e => e.target.style.borderColor = RZP_BLUE}
                              onBlur={e => e.target.style.borderColor = '#cbd5e1'}
                            />
                            <div style={{ fontSize: 10, color: '#94a3b8', fontFamily: 'Arial', marginTop: 5 }}>
                              e.g. 9876543210@paytm · name@oksbi · yourname@upi
                            </div>

                            {/* UPI app chips */}
                            <div style={{ marginTop: 14, display: 'flex', gap: 7, flexWrap: 'wrap' }}>
                              {UPI_APPS.map(app => (
                                <button
                                  key={app.name}
                                  onClick={() => setUpiId(upiId.split('@')[0] + '@' + app.name.toLowerCase())}
                                  style={{
                                    padding: '5px 11px', borderRadius: 4, background: 'white',
                                    border: '1.5px solid #e2e8f0', fontSize: 11, fontFamily: 'Arial',
                                    color: '#475569', fontWeight: 700, cursor: 'pointer',
                                    display: 'flex', alignItems: 'center', gap: 5,
                                    transition: 'border-color 0.15s',
                                  }}
                                  onMouseEnter={e => e.currentTarget.style.borderColor = app.color}
                                  onMouseLeave={e => e.currentTarget.style.borderColor = '#e2e8f0'}
                                >
                                  <span style={{
                                    width: 14, height: 14, borderRadius: 3, background: app.color,
                                    display: 'inline-block'
                                  }}/>
                                  {app.name}
                                </button>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
                            <div style={{
                              background: 'white', padding: 14, borderRadius: 10,
                              border: '1px solid #e2e8f0',
                              boxShadow: '0 4px 16px rgba(0,0,0,0.06)'
                            }}>
                              <QRCodeSVG/>
                            </div>
                            <div style={{ fontSize: 11, color: '#475569', fontFamily: 'Arial', textAlign: 'center' }}>
                              Scan with any UPI app<br/>
                              <strong style={{ color: '#1e293b' }}>Google Pay · PhonePe · Paytm · BHIM</strong>
                            </div>
                            <div style={{
                              background: '#eef2ff', border: `1.5px solid #c7d2fe`,
                              borderRadius: 6, padding: '5px 14px',
                              fontSize: 11, color: RZP_BLUE, fontFamily: 'monospace', fontWeight: 800
                            }}>
                              agriveer@razorpay
                            </div>
                            <div style={{ fontSize: 10, color: '#94a3b8', fontFamily: 'Arial', marginTop: -4 }}>
                              UPI VPA for {businessName}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Card Tab */}
                    {tab === 'card' && (
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 800, color: '#1e293b', fontFamily: 'Arial', marginBottom: 12 }}>
                          Debit / Credit Card
                        </div>

                        {/* Card preview */}
                        <div style={{ perspective: 600, marginBottom: 14, height: 104 }}>
                          <div style={{
                            position: 'relative', width: '100%', height: 104,
                            transformStyle: 'preserve-3d',
                            transform: cardFlipped ? 'rotateY(180deg)' : 'rotateY(0)',
                            transition: 'transform 0.5s ease',
                          }}>
                            {/* Front */}
                            <div style={{
                              position: 'absolute', inset: 0, backfaceVisibility: 'hidden',
                              background: `linear-gradient(135deg, #0f172a 0%, ${RZP_BLUE} 100%)`,
                              borderRadius: 10, padding: '14px 18px', color: 'white',
                              boxShadow: '0 8px 24px rgba(59,91,219,0.3)',
                            }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                                <div style={{ fontSize: 9, opacity: 0.5, fontFamily: 'Arial', letterSpacing: 1, textTransform: 'uppercase' }}>
                                  Card Number
                                </div>
                                <div style={{ display: 'flex', gap: 5 }}>
                                  {cardBrand === 'visa'   && <VisaLogo/>}
                                  {cardBrand === 'master' && <MasterLogo/>}
                                  {cardBrand === 'rupay'  && <RupayLogo/>}
                                  {!cardBrand            && <div style={{ width: 36, height: 22, borderRadius: 3, background: 'rgba(255,255,255,0.15)' }}/>}
                                </div>
                              </div>
                              <div style={{ fontSize: 17, fontWeight: 700, letterSpacing: 4, fontFamily: 'monospace', marginBottom: 12 }}>
                                {cardNum || '•••• •••• •••• ••••'}
                              </div>
                              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10 }}>
                                <div>
                                  <div style={{ opacity: 0.5, fontFamily: 'Arial', fontSize: 8, letterSpacing: 1 }}>CARDHOLDER</div>
                                  <div style={{ fontWeight: 700, textTransform: 'uppercase' }}>{cardName || 'YOUR NAME'}</div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                  <div style={{ opacity: 0.5, fontFamily: 'Arial', fontSize: 8, letterSpacing: 1 }}>EXPIRES</div>
                                  <div style={{ fontWeight: 700 }}>{cardExp || 'MM/YY'}</div>
                                </div>
                              </div>
                            </div>
                            {/* Back */}
                            <div style={{
                              position: 'absolute', inset: 0, backfaceVisibility: 'hidden',
                              transform: 'rotateY(180deg)',
                              background: `linear-gradient(135deg, #1e293b 0%, #334155 100%)`,
                              borderRadius: 10, boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
                              overflow: 'hidden',
                            }}>
                              <div style={{ height: 32, background: '#0f172a', marginTop: 16 }}/>
                              <div style={{ padding: '10px 18px', display: 'flex', alignItems: 'center', gap: 8 }}>
                                <div style={{ flex: 1, height: 28, background: '#f8fafc', borderRadius: 3, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: 10 }}>
                                  <span style={{ fontFamily: 'monospace', fontWeight: 700, color: '#1e293b', fontSize: 14 }}>
                                    {cardCvv || '•••'}
                                  </span>
                                </div>
                                <div style={{ fontSize: 9, color: '#94a3b8', fontFamily: 'Arial', width: 50 }}>CVV</div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Card form */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                          <div>
                            <div style={{ fontSize: 10.5, color: '#64748b', fontFamily: 'Arial', marginBottom: 4 }}>Card Number *</div>
                            <input
                              value={cardNum}
                              onChange={e => {
                                let v = e.target.value.replace(/\D/g,'').slice(0,16);
                                v = v.replace(/(.{4})/g,'$1 ').trim();
                                setCardNum(v);
                              }}
                              placeholder="4111 1111 1111 1111"
                              style={{ width:'100%', padding:'9px 12px', borderRadius:5, border:'1.5px solid #cbd5e1', fontSize:13, fontFamily:'monospace', outline:'none', boxSizing:'border-box', color:'#1e293b', background:'white' }}
                              onFocus={e => e.target.style.borderColor=RZP_BLUE}
                              onBlur={e => e.target.style.borderColor='#cbd5e1'}
                            />
                          </div>
                          <div>
                            <div style={{ fontSize: 10.5, color: '#64748b', fontFamily: 'Arial', marginBottom: 4 }}>Name on Card *</div>
                            <input
                              value={cardName}
                              onChange={e => setCardName(e.target.value)}
                              placeholder="Full Name"
                              style={{ width:'100%', padding:'9px 12px', borderRadius:5, border:'1.5px solid #cbd5e1', fontSize:13, fontFamily:'Arial', outline:'none', boxSizing:'border-box', color:'#1e293b', background:'white' }}
                              onFocus={e => e.target.style.borderColor=RZP_BLUE}
                              onBlur={e => e.target.style.borderColor='#cbd5e1'}
                            />
                          </div>
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                            <div>
                              <div style={{ fontSize: 10.5, color: '#64748b', fontFamily: 'Arial', marginBottom: 4 }}>Expiry (MM/YY) *</div>
                              <input
                                value={cardExp}
                                onChange={e => {
                                  let v = e.target.value.replace(/\D/g,'').slice(0,4);
                                  if (v.length >= 2) v = v.slice(0,2) + '/' + v.slice(2);
                                  setCardExp(v);
                                }}
                                placeholder="12/26"
                                style={{ width:'100%', padding:'9px 12px', borderRadius:5, border:'1.5px solid #cbd5e1', fontSize:13, fontFamily:'monospace', outline:'none', boxSizing:'border-box', color:'#1e293b', background:'white' }}
                                onFocus={e => e.target.style.borderColor=RZP_BLUE}
                                onBlur={e => e.target.style.borderColor='#cbd5e1'}
                              />
                            </div>
                            <div>
                              <div style={{ fontSize: 10.5, color: '#64748b', fontFamily: 'Arial', marginBottom: 4 }}>CVV *</div>
                              <input
                                value={cardCvv}
                                onChange={e => setCardCvv(e.target.value.replace(/\D/g,'').slice(0,3))}
                                onFocus={() => setCardFlipped(true)}
                                onBlur={() => setCardFlipped(false)}
                                type="password"
                                placeholder="•••"
                                maxLength={3}
                                style={{ width:'100%', padding:'9px 12px', borderRadius:5, border:'1.5px solid #cbd5e1', fontSize:13, fontFamily:'monospace', outline:'none', boxSizing:'border-box', color:'#1e293b', background:'white' }}
                              />
                            </div>
                          </div>
                        </div>

                        <div style={{ fontSize: 10, color: '#94a3b8', fontFamily: 'Arial', marginTop: 10 }}>
                          🧪 <strong>Demo:</strong> Any card details work. OTP: <strong style={{ color: RZP_BLUE }}>123456</strong>
                        </div>
                      </div>
                    )}

                    {/* Net Banking Tab */}
                    {tab === 'netbanking' && (
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 800, color: '#1e293b', fontFamily: 'Arial', marginBottom: 12 }}>
                          Select Your Bank
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                          {BANKS.map(bank => (
                            <button
                              key={bank.id}
                              onClick={() => setSelectedBank(bank.id)}
                              style={{
                                padding: '10px 13px', borderRadius: 7,
                                border: `1.5px solid ${selectedBank === bank.id ? RZP_BLUE : '#e2e8f0'}`,
                                background: selectedBank === bank.id ? '#eef2ff' : 'white',
                                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10,
                                transition: 'all 0.15s',
                              }}
                            >
                              <div style={{
                                width: 30, height: 30, borderRadius: 5,
                                background: bank.color, color: 'white',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: 8, fontWeight: 900, fontFamily: 'Arial', flexShrink: 0
                              }}>
                                {bank.short}
                              </div>
                              <span style={{ fontSize: 11.5, fontFamily: 'Arial', fontWeight: 600, color: '#1e293b', textAlign: 'left', lineHeight: 1.3 }}>
                                {bank.name}
                              </span>
                              {selectedBank === bank.id && (
                                <div style={{
                                  marginLeft: 'auto', width: 17, height: 17, borderRadius: '50%',
                                  background: RZP_BLUE, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                                }}>
                                  <span style={{ color: 'white', fontSize: 10 }}>✓</span>
                                </div>
                              )}
                            </button>
                          ))}
                        </div>
                        <div style={{ fontSize: 10, color: '#94a3b8', fontFamily: 'Arial', marginTop: 12 }}>
                          🧪 Demo mode — select any bank and click Pay to simulate the transaction.
                        </div>
                      </div>
                    )}

                    {/* Wallets Tab */}
                    {tab === 'wallet' && (
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 800, color: '#1e293b', fontFamily: 'Arial', marginBottom: 12 }}>
                          Select Wallet
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                          {WALLETS.map(w => (
                            <button
                              key={w.id}
                              onClick={() => setSelectedWallet(w.id)}
                              style={{
                                padding: '12px 15px', borderRadius: 8,
                                border: `1.5px solid ${selectedWallet === w.id ? RZP_BLUE : '#e2e8f0'}`,
                                background: selectedWallet === w.id ? '#eef2ff' : 'white',
                                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 14,
                                transition: 'all 0.15s',
                              }}
                            >
                              <div style={{
                                width: 40, height: 40, borderRadius: 10,
                                background: w.color, color: w.textColor,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: 18, fontWeight: 900, fontFamily: 'Arial', flexShrink: 0,
                                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                              }}>
                                {w.logo}
                              </div>
                              <div style={{ textAlign: 'left' }}>
                                <div style={{ fontSize: 13, fontFamily: 'Arial', fontWeight: 700, color: '#1e293b' }}>
                                  {w.name}
                                </div>
                                <div style={{ fontSize: 10, color: '#94a3b8', fontFamily: 'Arial' }}>
                                  Pay using {w.name} balance
                                </div>
                              </div>
                              {selectedWallet === w.id && (
                                <div style={{
                                  marginLeft: 'auto', width: 18, height: 18, borderRadius: '50%',
                                  background: RZP_BLUE, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                                }}>
                                  <span style={{ color: 'white', fontSize: 11 }}>✓</span>
                                </div>
                              )}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Pay Button — shown for all tabs except QR */}
                    {!(tab === 'upi' && upiMode === 'qr') && (
                      <button
                        onClick={handlePay}
                        style={{
                          width: '100%', marginTop: 18, padding: '13px 0',
                          borderRadius: 6, border: 'none',
                          background: `linear-gradient(135deg, ${RZP_BLUE} 0%, #1d4ed8 100%)`,
                          color: 'white', fontWeight: 800, fontSize: 14, fontFamily: 'Arial',
                          cursor: 'pointer', boxShadow: `0 6px 20px rgba(59,91,219,0.4)`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                          transition: 'opacity 0.15s, transform 0.1s',
                        }}
                        onMouseEnter={e => e.currentTarget.style.opacity = '0.92'}
                        onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                        onMouseDown={e => e.currentTarget.style.transform = 'scale(0.98)'}
                        onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
                      >
                        <LockSVG size={12}/>
                        Pay {formattedAmount}
                      </button>
                    )}

                    {/* QR "I've paid" button */}
                    {tab === 'upi' && upiMode === 'qr' && (
                      <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                        <div style={{ fontSize: 11, color: '#94a3b8', fontFamily: 'Arial' }}>
                          After scanning and paying in your UPI app, click below:
                        </div>
                        <button
                          onClick={simulateProcessing}
                          style={{
                            padding: '10px 28px', borderRadius: 6, cursor: 'pointer',
                            border: `1.5px solid ${RZP_BLUE}`,
                            background: '#eef2ff', color: RZP_BLUE,
                            fontWeight: 700, fontSize: 13, fontFamily: 'Arial',
                          }}
                        >
                          ✓ I have completed the payment
                        </button>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              )}

              {/* ── OTP PHASE ────────────────────────────────────────────── */}
              {phase === 'otp' && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: 'center', padding: '8px 0' }}>
                  <div style={{
                    width: 60, height: 60, borderRadius: '50%',
                    background: '#eef2ff', border: `2px solid #c7d2fe`,
                    margin: '0 auto 14px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 26
                  }}>
                    🔐
                  </div>
                  <div style={{ fontSize: 15, fontWeight: 800, color: '#1e293b', fontFamily: 'Arial', marginBottom: 4 }}>
                    Enter OTP
                  </div>
                  <div style={{ fontSize: 11, color: '#64748b', fontFamily: 'Arial', marginBottom: 18 }}>
                    A 6-digit OTP was sent to your registered mobile number ending in <strong>••••43</strong>
                  </div>

                  {/* OTP boxes */}
                  <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 14 }}>
                    {otp.map((digit, i) => (
                      <input
                        key={i}
                        ref={el => otpRefs.current[i] = el}
                        value={digit}
                        onChange={e => handleOtpChange(i, e.target.value)}
                        onKeyDown={e => handleOtpKeyDown(i, e)}
                        maxLength={1}
                        style={{
                          width: 44, height: 52, textAlign: 'center', fontSize: 20,
                          fontWeight: 700, fontFamily: 'monospace',
                          border: `1.5px solid ${digit ? RZP_BLUE : '#cbd5e1'}`,
                          borderRadius: 7, outline: 'none', color: '#1e293b',
                          background: digit ? '#eef2ff' : 'white',
                          transition: 'border-color 0.15s, background 0.15s',
                        }}
                      />
                    ))}
                  </div>

                  {otpError && (
                    <div style={{ color: '#ef4444', fontSize: 11, fontFamily: 'Arial', marginBottom: 10 }}>
                      {otpError}
                    </div>
                  )}

                  <div style={{ fontSize: 10, color: '#94a3b8', fontFamily: 'Arial', marginBottom: 16 }}>
                    🧪 Demo OTP: <strong style={{ color: RZP_BLUE, letterSpacing: 3 }}>1 2 3 4 5 6</strong>
                  </div>

                  <button
                    onClick={() => handleOtpSubmit()}
                    style={{
                      width: '100%', padding: '12px', borderRadius: 6, border: 'none',
                      background: otp.every(d => d) ? `linear-gradient(135deg, ${RZP_BLUE}, #1d4ed8)` : '#e2e8f0',
                      color: otp.every(d => d) ? 'white' : '#94a3b8',
                      fontWeight: 800, fontSize: 13, fontFamily: 'Arial',
                      cursor: otp.every(d => d) ? 'pointer' : 'not-allowed',
                      transition: 'all 0.2s',
                    }}
                  >
                    Verify & Pay {formattedAmount}
                  </button>

                  <button
                    onClick={() => setPhase('input')}
                    style={{
                      width: '100%', marginTop: 8, padding: '9px', borderRadius: 6,
                      border: '1px solid #e2e8f0', background: 'white',
                      color: '#64748b', fontSize: 12, fontFamily: 'Arial', cursor: 'pointer',
                    }}
                  >
                    ← Back
                  </button>

                  <div style={{ fontSize: 10, color: '#94a3b8', fontFamily: 'Arial', marginTop: 12 }}>
                    Didn't receive OTP? <span style={{ color: RZP_BLUE, fontWeight: 700, cursor: 'pointer' }}>Resend OTP</span>
                  </div>
                </motion.div>
              )}

              {/* ── PROCESSING PHASE ─────────────────────────────────────── */}
              {phase === 'processing' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: 'center', padding: '24px 10px' }}>
                  {/* Circular progress */}
                  <div style={{ width: 72, height: 72, margin: '0 auto 18px', position: 'relative' }}>
                    <svg width="72" height="72" viewBox="0 0 72 72">
                      <circle cx="36" cy="36" r="30" stroke="#e2e8f0" strokeWidth="5" fill="none"/>
                      <circle
                        cx="36" cy="36" r="30" stroke={RZP_BLUE} strokeWidth="5" fill="none"
                        strokeDasharray={`${progress * 1.884} 188.4`}
                        strokeLinecap="round"
                        transform="rotate(-90 36 36)"
                        style={{ transition: 'stroke-dasharray 0.45s ease' }}
                      />
                    </svg>
                    <div style={{
                      position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 13, fontWeight: 800, color: RZP_BLUE, fontFamily: 'Arial'
                    }}>
                      {progress}%
                    </div>
                  </div>

                  <div style={{ fontSize: 15, fontWeight: 800, color: '#1e293b', fontFamily: 'Arial', marginBottom: 8 }}>
                    Processing Payment
                  </div>
                  <div style={{ fontSize: 12, color: '#64748b', fontFamily: 'Arial', minHeight: 20 }}>
                    {processingMsg}
                  </div>

                  {/* Progress bar */}
                  <div style={{ height: 4, background: '#e2e8f0', borderRadius: 2, marginTop: 20, overflow: 'hidden' }}>
                    <div style={{
                      height: '100%', width: `${progress}%`,
                      background: `linear-gradient(90deg, ${RZP_BLUE}, #60a5fa)`,
                      borderRadius: 2, transition: 'width 0.45s ease'
                    }}/>
                  </div>

                  {/* Step indicators */}
                  <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginTop: 20 }}>
                    {[20, 40, 60, 80, 100].map((step, i) => (
                      <div key={i} style={{
                        width: 8, height: 8, borderRadius: '50%',
                        background: progress >= step ? RZP_BLUE : '#e2e8f0',
                        transition: 'background 0.3s',
                      }}/>
                    ))}
                  </div>

                  <div style={{ fontSize: 10, color: '#94a3b8', fontFamily: 'Arial', marginTop: 16 }}>
                    Do not press back or refresh this page
                  </div>
                </motion.div>
              )}

              {/* ── SUCCESS PHASE ────────────────────────────────────────── */}
              {phase === 'success' && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  style={{ textAlign: 'center', padding: '16px 10px' }}
                >
                  <motion.div
                    initial={{ scale: 0, rotate: -20 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 15, delay: 0.1 }}
                    style={{ marginBottom: 14 }}
                  >
                    <SuccessCheckSVG/>
                  </motion.div>

                  <div style={{ fontSize: 18, fontWeight: 900, color: '#1e293b', fontFamily: 'Arial', marginBottom: 6 }}>
                    Payment Successful! 🎉
                  </div>
                  <div style={{ fontSize: 26, fontWeight: 900, color: '#16a34a', fontFamily: 'Arial', marginBottom: 4 }}>
                    {formattedAmount}
                  </div>
                  <div style={{ fontSize: 11, color: '#64748b', fontFamily: 'Arial', marginBottom: 18 }}>
                    Your rental payment has been processed securely.
                  </div>

                  {/* Receipt card */}
                  <div style={{
                    background: '#f0fdf4', border: '1px solid #bbf7d0',
                    borderRadius: 8, padding: '14px 16px', textAlign: 'left', marginBottom: 14
                  }}>
                    <div style={{ fontSize: 10, fontWeight: 800, color: '#16a34a', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10, fontFamily: 'Arial' }}>
                      Payment Receipt
                    </div>
                    {[
                      { label: 'Amount Paid',  value: formattedAmount,        bold: true, green: true },
                      { label: 'Payment ID',   value: paymentId,              mono: true },
                      { label: 'Order ID',     value: orderId,                mono: true },
                      { label: 'Merchant',     value: businessName },
                      { label: 'Description',  value: itemTitle || description },
                    ].map(({ label, value, bold, green, mono }, i) => (
                      <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: i < 4 ? 7 : 0 }}>
                        <span style={{ fontSize: 10.5, color: '#64748b', fontFamily: 'Arial', fontWeight: 600 }}>{label}</span>
                        <span style={{
                          fontSize: 10.5, fontWeight: bold ? 800 : 700,
                          color: green ? '#16a34a' : '#1e293b',
                          fontFamily: mono ? 'monospace' : 'Arial',
                          maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                          textAlign: 'right'
                        }}>
                          {value}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div style={{ fontSize: 10.5, color: '#94a3b8', fontFamily: 'Arial' }}>
                    ↩ Redirecting back to Agriveer...
                  </div>
                </motion.div>
              )}

            </div>
          </div>

          {/* ── Footer ─────────────────────────────────────────────────────── */}
          <div style={{
            background: 'white', borderTop: '1px solid #f1f5f9',
            padding: '8px 18px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            flexShrink: 0,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <LockSVG/>
              <span style={{ fontSize: 9, color: '#94a3b8', fontFamily: 'Arial' }}>256-bit SSL Encrypted · Powered by</span>
              <RazorpayLogoSVG/>
            </div>
            {phase === 'input' && (
              <button
                onClick={() => { onClose(); onFailure && onFailure('Payment cancelled.'); }}
                style={{ fontSize: 10.5, color: '#94a3b8', fontFamily: 'Arial', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
              >
                Cancel
              </button>
            )}
          </div>

        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
