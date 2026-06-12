import api from './api';
import type { Payment } from '../types';

export const paymentService = {
  // Create payment
  createPayment: async (paymentData: {
    booking: string;
    amount: number;
    type: 'booking' | 'rent' | 'maintenance';
    paymentMethod: 'online' | 'offline' | 'contact_owner';
  }): Promise<Payment> => {
    const response = await api.post('/payments', paymentData);
    return response.data.data || response.data;
  },

  // Get user payments
  getUserPayments: async (): Promise<Payment[]> => {
    const response = await api.get('/payments/my-payments');
    return response.data.data || response.data;
  },

  // Update payment status
  updatePaymentStatus: async (id: string, status: string, transactionId?: string): Promise<Payment> => {
    const response = await api.patch(`/payments/${id}/status`, { status, transactionId });
    return response.data.data || response.data;
  },

  // Get all payments (admin)
  getAllPayments: async (): Promise<Payment[]> => {
    const response = await api.get('/payments');
    return response.data.data || response.data;
  },
};
