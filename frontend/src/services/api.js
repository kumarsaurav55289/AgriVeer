import { supabase } from './supabaseClient';
import { MOCK_LISTINGS } from '../data/mockData';

export const apiService = {
  // 1. LISTINGS API (SUPABASE SYNC)
  async getListings() {
    try {
      const { data, error } = await supabase
        .from('listings')
        .select('*')
        .order('created_at', { ascending: false });

      if (error || !data) {
        console.warn('Supabase fetch error:', error);
        return [];
      }

      // Map Supabase snake_case columns to camelCase component props
      return data.map(item => ({
        id: item.id,
        title: item.title,
        type: item.type,
        category: item.category,
        image: item.image || '/assets/tractor.png',
        location: item.location || 'Ludhiana, Punjab',
        distance: item.distance || 'Near You',
        dailyRate: item.daily_rate ? Number(item.daily_rate) : undefined,
        hourlyRate: item.hourly_rate ? Number(item.hourly_rate) : undefined,
        acreRate: item.acre_rate ? Number(item.acre_rate) : undefined,
        ownerName: item.owner_name,
        ownerPhone: item.owner_phone,
        rating: item.rating ? Number(item.rating) : 4.9,
        reviewsCount: item.reviews_count || 10,
        isVerified: item.is_verified ?? true,
        availableNow: item.available_now ?? true,
        specs: item.specs || {},
        description: item.description
      }));
    } catch (err) {
      console.warn('Error fetching listings from Supabase:', err);
      return [];
    }
  },

  async createListing(listingData) {
    try {
      const payload = {
        id: listingData.id || 'item-' + Date.now(),
        title: listingData.title,
        type: listingData.type,
        category: listingData.category,
        image: listingData.image,
        location: listingData.location,
        distance: listingData.distance,
        daily_rate: listingData.dailyRate,
        hourly_rate: listingData.hourlyRate,
        acre_rate: listingData.acreRate,
        owner_name: listingData.ownerName,
        owner_phone: listingData.ownerPhone,
        rating: listingData.rating || 5.0,
        reviews_count: listingData.reviewsCount || 1,
        is_verified: listingData.isVerified ?? true,
        available_now: listingData.availableNow ?? true,
        specs: listingData.specs || {},
        description: listingData.description
      };

      const { data, error } = await supabase
        .from('listings')
        .insert([payload])
        .select();

      if (error) {
        console.error('Supabase create listing error:', error);
        return listingData;
      }
      return data ? data[0] : listingData;
    } catch (err) {
      console.error('Failed to create listing on Supabase:', err);
      return listingData;
    }
  },

  async deleteListing(listingId) {
    try {
      const { error } = await supabase
        .from('listings')
        .delete()
        .eq('id', listingId);

      if (error) console.error('Supabase delete listing error:', error);
      return { success: !error };
    } catch (err) {
      console.error('Failed to delete listing on Supabase:', err);
      return { success: false };
    }
  },

  // 2. BOOKINGS API (SUPABASE SYNC)
  async getBookings() {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false });

      if (error || !data) return [];

      return data.map(b => ({
        id: b.id,
        itemId: b.item_id,
        itemTitle: b.item_title,
        itemImage: b.item_image,
        ownerName: b.owner_name,
        ownerPhone: b.owner_phone,
        farmerName: b.farmer_name,
        farmerPhone: b.farmer_phone,
        farmerAadhaar: b.farmer_aadhaar,
        farmerAddress: b.farmer_address,
        totalCost: Number(b.total_cost),
        bookingDate: b.booking_date,
        status: b.status || 'Confirmed',
        deliveryOtp: b.delivery_otp || '8942',
        txnId: b.txn_id || 'TXN-982401',
        paymentModel: b.payment_model || 'escrow',
        paymentMethod: b.payment_method || 'BHIM UPI'
      }));
    } catch (err) {
      console.warn('Error fetching bookings from Supabase:', err);
      return [];
    }
  },

  async createBooking(bookingData) {
    try {
      const payload = {
        id: bookingData.id || 'AGR-' + Math.floor(100000 + Math.random() * 900000),
        item_id: bookingData.itemId,
        item_title: bookingData.itemTitle,
        item_image: bookingData.itemImage,
        owner_name: bookingData.ownerName,
        owner_phone: bookingData.ownerPhone,
        farmer_name: bookingData.farmerName,
        farmer_phone: bookingData.farmerPhone,
        farmer_aadhaar: bookingData.farmerAadhaar,
        farmer_address: bookingData.farmerAddress,
        total_cost: bookingData.totalCost,
        booking_date: bookingData.bookingDate || new Date().toLocaleDateString(),
        status: 'Confirmed',
        delivery_otp: bookingData.deliveryOtp || '8942',
        txn_id: bookingData.txnId || 'TXN-' + Math.floor(1000000000 + Math.random() * 9000000000),
        payment_model: bookingData.paymentModel || 'escrow',
        payment_method: bookingData.paymentMethod || 'UPI'
      };

      const { data, error } = await supabase
        .from('bookings')
        .insert([payload])
        .select();

      if (error) {
        console.error('Supabase create booking error:', error);
      }
      return bookingData;
    } catch (err) {
      console.error('Failed to create booking on Supabase:', err);
      return bookingData;
    }
  },

  async deleteBooking(bookingId) {
    try {
      const { error } = await supabase
        .from('bookings')
        .delete()
        .eq('id', bookingId);

      if (error) console.error('Supabase delete booking error:', error);
      return { success: !error };
    } catch (err) {
      console.error('Failed to delete booking on Supabase:', err);
      return { success: false };
    }
  },

  async updateBookingStatus(bookingId, status) {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status: status })
        .eq('id', bookingId);

      if (error) console.error('Supabase update booking error:', error);
      return { success: !error };
    } catch (err) {
      console.error('Failed to update booking on Supabase:', err);
      return { success: false };
    }
  },

  // 3. AUTH & USER ACCOUNT API (FULL SUPABASE PERSISTENCE)
  async registerUser(userData) {
    try {
      const payload = {
        id: userData.id || 'user-' + Date.now(),
        name: userData.name,
        phone: userData.phone,
        role: userData.role || 'farmer',
        aadhaar: userData.aadhaar,
        address: userData.address,
        password: userData.password || '1234',
        shop_name: userData.shopName || '',
        email: userData.email || '',
        district: userData.district || '',
        state: userData.state || '',
        is_verified: true
      };

      const { data, error } = await supabase
        .from('users')
        .upsert([payload], { onConflict: 'phone' })
        .select();

      if (error) console.error('Supabase user register/update error:', error);
      return data && data.length > 0 ? {
        id: data[0].id,
        name: data[0].name,
        phone: data[0].phone,
        role: data[0].role,
        aadhaar: data[0].aadhaar,
        address: data[0].address,
        shopName: data[0].shop_name,
        email: data[0].email,
        district: data[0].district,
        state: data[0].state,
        isVerified: data[0].is_verified
      } : userData;
    } catch (err) {
      console.error('Failed to register/update user on Supabase:', err);
      return userData;
    }
  },

  async loginUser(phone, password, role) {
    try {
      const cleanPhone = (phone || '').trim();
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('phone', cleanPhone);

      if (data && data.length > 0) {
        const found = data.find(u => u.role === role) || data[0];
        return {
          id: found.id,
          name: found.name || (found.role === 'owner' ? 'Harpreet Singh' : 'Gurpreet Singh'),
          phone: found.phone,
          role: found.role || role || 'farmer',
          aadhaar: found.aadhaar || '1234 5678 9012',
          address: found.address || 'Ludhiana, Punjab',
          shopName: found.shop_name || '',
          email: found.email || '',
          district: found.district || 'Ludhiana',
          state: found.state || 'Punjab',
          isVerified: found.is_verified ?? true
        };
      }
      return null;
    } catch (err) {
      console.error('Supabase login error:', err);
      return null;
    }
  }
};
