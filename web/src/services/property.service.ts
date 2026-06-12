import api from './api';
import type { CreatePropertyInput, Project, Property, PropertyFilters } from '../types';

type BackendProperty = {
  id: string;
  title: string;
  type: 'flat' | 'shop';
  unit_type?: '1rk' | '1bhk' | '2bhk' | '3bhk' | null;
  price: number;
  advance?: number;
  status?: 'available' | 'booked';
  floor?: number;
  size_sqft?: number;
  sizeSqFt?: number;
  description?: string;
  images?: string[];
  project?: {
    id: string;
    name?: string;
    location?: string;
    images?: string[];
  };
  tenant_name?: string;
  tenant_phone?: string;
  advance_paid_date?: string;
  advance_paid?: number;
  rent_paid?: number;
  tenant_aadhar_file?: string;
  tenant_agreement_file?: string;
  createdAt: string;
  updatedAt: string;
};

const mapProperty = (property: BackendProperty): Property => ({
  id: property.id,
  title: property.title,
  description: property.description || '',
  type: property.type,
  unit_type: property.unit_type,
  price: property.price,
  advance: property.advance || 0,
  location: {
    address: property.project?.location || 'N/A',
    city: property.project?.location || 'N/A',
    state: 'N/A',
    pincode: '000000',
  },
  area: property.size_sqft || property.sizeSqFt || 0,
  floor: property.floor,
  amenities: [],
  images: property.images && property.images.length > 0 
    ? property.images 
    : (property.project?.images || []),
  status: property.status || 'available',
  projectName: property.project?.name || 'Unknown Project',
  tenantName: property.tenant_name || '',
  tenantPhone: property.tenant_phone || '',
  advancePaidDate: property.advance_paid_date || '',
  advancePaid: property.advance_paid || 0,
  rentPaid: property.rent_paid || 0,
  tenantAadharFile: property.tenant_aadhar_file || '',
  tenantAgreementFile: property.tenant_agreement_file || '',
  createdAt: property.createdAt,
  updatedAt: property.updatedAt,
  project: property.project,
});

export const propertyService = {
  // Get all properties with filters
  getProperties: async (filters?: PropertyFilters): Promise<Property[]> => {
    const response = await api.get('/admin/property/all', { params: filters });
    const properties = response.data?.properties || [];
    return properties.map(mapProperty);
  },

  // Get single property
  getProperty: async (id: string): Promise<Property> => {
    const response = await api.get(`/admin/property/${id}`);
    return mapProperty(response.data?.property);
  },

  // Create property (admin only)
  createProperty: async (propertyData: CreatePropertyInput): Promise<Property> => {
    const response = await api.post('/admin/property/create', propertyData);
    return mapProperty(response.data?.property);
  },

  getProjects: async (): Promise<Project[]> => {
    const response = await api.get('/admin/projects/all');
    return response.data?.projects || [];
  },

  // Update property (admin only)
  updateProperty: async (id: string, propertyData: Partial<Property>): Promise<Property> => {
    const response = await api.put(`/admin/property/${id}`, propertyData);
    return mapProperty(response.data?.property);
  },

  // Delete property (admin only)
  deleteProperty: async (id: string): Promise<void> => {
    await api.delete(`/admin/property/${id}`);
  },

  // Upload property images
  uploadImages: async (id: string, images: FormData): Promise<string[]> => {
    const response = await api.post(`/properties/${id}/images`, images, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data.data || response.data;
  },

  // Upload property tenant documents (Aadhaar / Agreement)
  uploadPropertyDocument: async (file: File, type: 'aadhaar' | 'agreement', propertyId: string): Promise<string> => {
    const formData = new FormData();
    formData.append('document', file);
    formData.append('type', type);
    formData.append('propertyId', propertyId);

    const response = await api.post(`/upload/property-document`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data.url;
  },

  // Generic image upload
  uploadImage: async (file: File, folder: string): Promise<string> => {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('folder', folder);

    const response = await api.post(`/upload/image`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data.url;
  }
};
