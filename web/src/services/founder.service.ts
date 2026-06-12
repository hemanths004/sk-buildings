import api from './api';
import type { Founder, CreateFounderInput } from '../types';

export const founderService = {
  getFounders: async (): Promise<Founder[]> => {
    const response = await api.get('/admin/founders');
    return response.data;
  },

  createFounder: async (data: CreateFounderInput): Promise<Founder> => {
    const response = await api.post('/admin/founders', data);
    return response.data;
  },

  updateFounder: async (id: string, data: Partial<Founder>): Promise<Founder> => {
    const response = await api.put(`/admin/founders/${id}`, data);
    return response.data;
  },

  deleteFounder: async (id: string): Promise<void> => {
    await api.delete(`/admin/founders/${id}`);
  },

  uploadImage: async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('image', file);

    const response = await api.post('/upload/founder-image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data.url;
  }
};
