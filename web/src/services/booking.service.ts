import api from './api';
import type { Booking } from '../types';

export const bookingService = {
  // Create new booking
  createBooking: async (bookingData: {
    property: string;
    moveInDate: string;
    paymentType: 'online' | 'offline';
    rentAmount?: number;
    rentDueDate?: number;
  }): Promise<Booking> => {
    const response = await api.post('/bookings', bookingData);
    return response.data.data || response.data;
  },

  // Get user bookings
  getUserBookings: async (): Promise<Booking[]> => {
    const response = await api.get('/bookings/my-bookings');
    return response.data.data || response.data;
  },

  // Get single booking
  getBooking: async (id: string): Promise<Booking> => {
    const response = await api.get(`/bookings/${id}`);
    return response.data.data || response.data;
  },

  // Update booking status (admin)
  updateBookingStatus: async (id: string, status: string): Promise<Booking> => {
    const response = await api.patch(`/bookings/${id}/status`, { status });
    return response.data.data || response.data;
  },

  // Upload booking document
  uploadDocument: async (bookingId: string, document: FormData): Promise<any> => {
    const response = await api.post(`/bookings/${bookingId}/documents`, document, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data.data || response.data;
  },

  // Get all bookings (admin)
  getAllBookings: async (): Promise<Booking[]> => {
    const response = await api.get('/bookings');
    return response.data.data || response.data;
  },
};
