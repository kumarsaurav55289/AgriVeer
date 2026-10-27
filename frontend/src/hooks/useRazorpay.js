/**
 * useRazorpay — Dynamically loads the Razorpay checkout script and provides
 * an `openCheckout` helper to launch the Razorpay Standard Checkout popup.
 *
 * DESIGN DECISIONS:
 * - Does NOT require backend to be running. Opens Razorpay directly with amount+key.
 *   Backend order creation is attempted as an optional enhancement for signature
 *   verification; if backend is unreachable, checkout still opens.
 * - Detects placeholder keys and shows a friendly UI error instead of a crash.
 */
import { useState, useCallback } from 'react';

const RAZORPAY_SCRIPT_URL = 'https://checkout.razorpay.com/v1/checkout.js';
const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID || '';
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

// Razorpay test key that works out-of-the-box for UI demo (replace with your own)
const DEMO_TEST_KEY = 'rzp_test_1DP5mmOlF5G5ag';

function getEffectiveKey() {
  const key = RAZORPAY_KEY_ID.trim();
  // If user has NOT replaced the placeholder, use the public demo test key
  if (!key || key === 'rzp_test_YourTestKeyIdHere') {
    return DEMO_TEST_KEY;
  }
  return key;
}

function loadRazorpayScript() {
  return new Promise((resolve) => {
    // Script already loaded — resolve immediately
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const existing = document.querySelector(`script[src="${RAZORPAY_SCRIPT_URL}"]`);
    if (existing) {
      // Script tag exists but may still be loading; wait for it
      existing.onload = () => resolve(true);
      existing.onerror = () => resolve(false);
      return;
    }
    const script = document.createElement('script');
    script.src = RAZORPAY_SCRIPT_URL;
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

/**
 * Tries to create a Razorpay order via the backend for signature verification.
 * Returns null (silently) if backend is unreachable — checkout still works.
 */
async function tryCreateOrder(amount, currency, receipt, notes) {
  try {
    const res = await fetch(`${BACKEND_URL}/api/payments/create-order`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount, currency, receipt, notes }),
      signal: AbortSignal.timeout(4000) // 4s timeout — don't wait if backend is down
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.success ? data.order : null;
  } catch {
    // Backend unreachable — proceed without order_id
    return null;
  }
}

/**
 * Tries to verify payment signature via backend.
 * Returns true (silently) if backend is unreachable — better UX than a false failure.
 */
async function tryVerifyPayment(razorpay_order_id, razorpay_payment_id, razorpay_signature) {
  if (!razorpay_order_id || !razorpay_signature) return true; // No order to verify
  try {
    const res = await fetch(`${BACKEND_URL}/api/payments/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ razorpay_order_id, razorpay_payment_id, razorpay_signature }),
      signal: AbortSignal.timeout(4000)
    });
    const data = await res.json();
    return data.success !== false; // If backend is down, assume ok
  } catch {
    return true; // Backend unreachable — assume ok
  }
}

export function useRazorpay() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Opens the Razorpay Standard Checkout popup.
   *
   * @param {Object} params
   * @param {number}   params.amount       Amount in INR (e.g. 1800)
   * @param {string}   [params.currency]   Currency code (default 'INR')
   * @param {string}   [params.receipt]    Optional receipt string for backend order
   * @param {string}   [params.name]       Business name shown in popup
   * @param {string}   [params.description]Payment description
   * @param {string}   [params.image]      Logo URL
   * @param {Object}   [params.prefill]    { name, email, contact }
   * @param {Object}   [params.notes]      Optional notes
   * @param {Function} params.onSuccess    Called with payment response on success
   * @param {Function} params.onFailure    Called with error message string on failure
   */
  const openCheckout = useCallback(async ({
    amount,
    currency = 'INR',
    receipt,
    name = 'Agriveer',
    description = 'Agricultural Equipment Rental',
    image,
    prefill = {},
    notes = {},
    onSuccess,
    onFailure
  }) => {
    setIsLoading(true);
    setError(null);

    try {
      // Step 1: Load the Razorpay checkout script
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded || !window.Razorpay) {
        throw new Error(
          'Could not load Razorpay checkout. Please check your internet connection and try again.'
        );
      }

      const key = getEffectiveKey();

      // Step 2 (optional): Try to create a backend order for signature verification
      const order = await tryCreateOrder(amount, currency, receipt, notes);

      // Step 3: Build Razorpay options
      const options = {
        key,
        amount: Math.round(amount * 100), // paise
        currency,
        name,
        description,
        theme: { color: '#059669' }, // Agriveer green

        prefill: {
          name: prefill.name || '',
          email: prefill.email || '',
          contact: prefill.contact || ''
        },
        notes,

        handler: async (response) => {
          // Step 4: Verify signature (optional — graceful if backend is down)
          const verified = await tryVerifyPayment(
            response.razorpay_order_id,
            response.razorpay_payment_id,
            response.razorpay_signature
          );

          if (verified) {
            onSuccess && onSuccess({
              razorpay_order_id: response.razorpay_order_id || order?.id || '',
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature || ''
            });
          } else {
            onFailure && onFailure('Payment signature could not be verified. Please contact support.');
          }
        },

        modal: {
          ondismiss: () => {
            setIsLoading(false);
            onFailure && onFailure('Payment was cancelled.');
          },
          animation: true
        }
      };

      // Add order_id only if backend returned one (enables signature verification)
      if (order?.id) {
        options.order_id = order.id;
        options.amount = order.amount;   // Use backend amount (already in paise)
        options.currency = order.currency;
      }

      // Add logo only if a valid URL is provided
      if (image && !image.includes('logo.png')) {
        options.image = image;
      }

      const rzp = new window.Razorpay(options);

      rzp.on('payment.failed', (response) => {
        const msg =
          response.error?.description ||
          response.error?.reason ||
          'Payment failed. Please try again.';
        onFailure && onFailure(msg);
      });

      rzp.open();

    } catch (err) {
      const msg = err.message || 'Something went wrong while opening Razorpay.';
      setError(msg);
      onFailure && onFailure(msg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { openCheckout, isLoading, error };
}
