export interface User {
  id: string;
  name: string;
  phone: string;
  email?: string;
  role: 'user' | 'admin';
  aadhaar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Property {
  id: string;
  title: string;
  description: string;
  type: 'flat' | 'shop' | 'office';
  unit_type?: '1rk' | '1bhk' | '2bhk' | '3bhk' | null;
  price: number;
  advance: number;
  location: {
    address: string;
    city: string;
    state: string;
    pincode: string;
  };
  area: number;
  bedrooms?: number;
  bathrooms?: number;
  floor?: number;
  amenities: string[];
  images: string[];
  status: 'available' | 'booked' | 'rented';
  projectName: string;
  tenantName?: string;
  tenantPhone?: string;
  advancePaidDate?: string;
  advancePaid?: number;
  rentPaid?: number;
  tenantAadharFile?: string;
  tenantAgreementFile?: string;
  createdAt: string;
  updatedAt: string;
  project?: any;
}

export interface Project {
  id: string;
  name: string;
  location: string;
  map_lat?: number;
  map_lng?: number;
  description?: string;
  images?: string[];
  status?: 'active' | 'completed' | 'upcoming';
  pricing_rules?: any;
  yearDeveloped?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePropertyInput {
  title: string;
  type: 'flat' | 'shop' | 'office';
  unit_type?: '1rk' | '1bhk' | '2bhk' | '3bhk' | null;
  projectId: string;
  price: number;
  advance: number;
  floor?: number;
  sizeSqFt?: number;
  description?: string;
  images?: string | string[];
  tenantName?: string;
  tenantPhone?: string;
  advancePaidDate?: string;
  advancePaid?: number;
  rentPaid?: number;
  tenantAadharFile?: string;
  tenantAgreementFile?: string;
}

export interface Booking {
  id: string;
  user: string | User;
  property: string | Property;
  bookingDate: string;
  moveInDate: string;
  numberOfPeople?: number;
  rentAmount?: number;
  rentDueDate?: number;
  paymentType: 'online' | 'offline';
  status: 'pending' | 'confirmed' | 'cancelled';
  documents: Document[];
  createdAt: string;
  updatedAt: string;
}

export interface Document {
  id: string;
  type: 'aadhaar' | 'agreement' | 'other';
  name: string;
  url: string;
  uploadedBy: string | User;
  uploadedAt: string;
}

export interface Payment {
  id: string;
  booking: string | Booking;
  user: string | User;
  amount: number;
  type: 'booking' | 'rent' | 'maintenance';
  status: 'pending' | 'completed' | 'failed';
  transactionId?: string;
  paymentMethod: 'online' | 'offline' | 'contact_owner';
  paidAt?: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  user: string | User;
  type: 'rent_reminder' | 'payment_success' | 'booking_confirmed' | 'document_uploaded';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: User;
}

export interface OTPResponse {
  success: boolean;
  message: string;
  expiresIn?: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PropertyFilters {
  type?: 'flat' | 'shop';
  minPrice?: number;
  maxPrice?: number;
  location?: string;
  status?: string;
  bedrooms?: number;
  projectName?: string;
}

export interface Founder {
  id: string;
  name: string;
  role: string;
  qualification?: string;
  image_url?: string;
  linkedin_url?: string;
  created_at?: string;
}

export interface CreateFounderInput {
  name: string;
  role: string;
  qualification?: string;
  image_url?: string;
  linkedin_url?: string;
}
