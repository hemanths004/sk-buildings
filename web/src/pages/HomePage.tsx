import React, { useState, useEffect, useMemo } from 'react';
import { ProjectGroupCard } from '../components/ProjectGroupCard';
import type { ProjectGroup } from '../components/ProjectGroupCard';
import { Loading } from '../components/Loading';
import { Button } from '../components/Button';
import { propertyService } from '../services/property.service';
import { bookingService } from '../services/booking.service';
import { useAuthStore } from '../store/authStore';
import type { Property, PropertyFilters, Booking } from '../types';
import { Search, Filter, Building2, Home as HomeIcon, MapPin } from 'lucide-react';
import { formatCurrency } from '../utils/helpers';
import toast from 'react-hot-toast';

export const HomePage: React.FC = () => {
  const { isAuthenticated, user } = useAuthStore();
  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [myBookings, setMyBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<PropertyFilters>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchProperties();
  }, []);

  useEffect(() => {
    if (isAuthenticated && user?.role === 'user') {
      fetchMyBookings();
    } else {
      setMyBookings([]);
    }
  }, [isAuthenticated, user]);

  const fetchMyBookings = async () => {
    try {
      const data = await bookingService.getUserBookings();
      setMyBookings(data.filter((b) => b.status === 'confirmed' || b.status === 'pending'));
    } catch (error) {
      console.error('Failed to load user bookings', error);
    }
  };

  useEffect(() => {
    applyFilters();
  }, [properties, filters, searchTerm]);

  const fetchProperties = async () => {
    setIsLoading(true);
    try {
      const data = await propertyService.getProperties();
      setProperties(data);
    } catch (error) {
      toast.error('Failed to load properties');
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...properties];

    if (searchTerm) {
      filtered = filtered.filter(
        (p) =>
          p.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.location?.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.projectName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filters.type) {
      filtered = filtered.filter((p) => p.type === filters.type);
    }

    if (filters.status) {
      filtered = filtered.filter((p) => p.status === filters.status);
    }

    if (filters.minPrice) {
      filtered = filtered.filter((p) => p.price >= filters.minPrice!);
    }
    if (filters.maxPrice) {
      filtered = filtered.filter((p) => p.price <= filters.maxPrice!);
    }

    if (filters.location) {
      filtered = filtered.filter((p) =>
        p.location?.city?.toLowerCase().includes(filters.location!.toLowerCase())
      );
    }

    if (filters.bedrooms) {
      filtered = filtered.filter((p) => p.bedrooms === filters.bedrooms);
    }

    setFilteredProperties(filtered);
  };

  const resetFilters = () => {
    setFilters({});
    setSearchTerm('');
  };

  // Group filtered properties by Project Name and Type
  const projectGroups = useMemo(() => {
    const groupsMap = new Map<string, ProjectGroup>();

    filteredProperties.forEach((property) => {
      let subType = '';
      if (property.type === 'flat' && property.unit_type) subType = property.unit_type;
      else if (property.type === 'shop' && property.area) subType = `${property.area}sqft`;
      
      const key = `${property.projectName}-${property.type}-${subType}`;
      
      // Determine dynamic prices if they exist
      let propMin = property.price;
      let propMax = property.price;
      const rules = property?.project?.pricing_rules;
      if (rules) {
        let prices: number[] = [];
        if (property.type === 'shop' && rules.shop) {
          prices = Object.values(rules.shop).map(Number);
        } else if (property.type === 'flat' && rules.flat) {
          // Aggregate all prices across all unit types for the project group
          Object.values(rules.flat).forEach((unitRules: any) => {
            prices.push(...Object.values(unitRules).map(Number));
          });
        }
        if (prices.length > 0) {
          propMin = Math.min(...prices);
          propMax = Math.max(...prices);
        }
      }

      if (!groupsMap.has(key)) {
        groupsMap.set(key, {
          id: key,
          projectName: property.projectName,
          type: property.type,
          image: property.images?.[0] || property.project?.images?.[0],
          location: property.location ? `${property.location.address}, ${property.location.city}` : undefined,
          map_lat: property.project?.map_lat,
          map_lng: property.project?.map_lng,
          unitType: property.type === 'flat' ? (property.unit_type || undefined) : undefined,
          sizeSqFt: property.type === 'shop' ? (property.area || undefined) : undefined,
          count: 0,
          availableCount: 0,
          minPrice: propMin,
          maxPrice: propMax,
          createdAt: property.createdAt || '',
        });
      }

      const group = groupsMap.get(key)!;
      group.count += 1;
      if (property.status === 'available') {
        group.availableCount += 1;
      }

      if (propMin < group.minPrice) group.minPrice = propMin;
      if (propMax > group.maxPrice) group.maxPrice = propMax;
      
      // Keep replacing image until we find one, if we didn't have one initially
      if (!group.image && property.images && property.images.length > 0) {
        group.image = property.images[0];
      }

      if (property.createdAt && group.createdAt && property.createdAt > group.createdAt) {
        group.createdAt = property.createdAt;
      }
    });

    return Array.from(groupsMap.values()).sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA;
    });
  }, [filteredProperties]);

  if (isLoading) {
    return <Loading fullScreen />;
  }

  return (
    <div className="min-h-screen bg-dark">
      {/* Split Hero Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 min-h-[150px] lg:min-h-[180px]">
        
        {/* Left Column (1/4): Logo */}
        <div className="md:col-span-1 bg-white flex items-center justify-center p-0 m-0 border-b md:border-b-0 md:border-r border-slate-200 shadow-sm z-10 relative overflow-hidden h-full">
          <img src="/logo.png" alt="logo" className="w-full h-full object-contain p-0 m-0" />
        </div>

        {/* Right Column (3/4): Hero Image & Search */}
        <div className="md:col-span-3 relative flex items-center justify-center overflow-hidden">
          {/* Background Image with Overlay */}
          <div 
            className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: "url('/hero_bg.png')" }}
          >
            {/* Subtle Gradient Overlay to ensure minimum readability without darkening too much */}
            <div className="absolute inset-0 bg-gradient-to-r from-dark/30 to-transparent"></div>
          </div>

          <div className="container relative z-10 mx-auto px-4 lg:px-6 py-4 lg:py-6 flex flex-col items-center justify-center">
            
            {/* Text enclosed in a navy blue box */}
            <div className="bg-dark/80 backdrop-blur-sm p-6 rounded-2xl mb-6 text-center max-w-2xl w-full shadow-2xl border border-white/10">
              <h1 className="text-xl lg:text-3xl font-bold text-white mb-2">
                Welcome to <span className="text-primary">Comfort & Convenience</span>
              </h1>

              <p className="text-xs lg:text-sm text-white font-medium">
                Explore beautifully maintained flats and commercial spaces designed to perfectly suit your lifestyle.
              </p>
            </div>

            {/* Search Glass Panel */}
            <div className="glass-panel w-full max-w-2xl rounded-xl p-2 flex flex-col md:flex-row gap-2 items-center">
              <div className="flex-1 w-full relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input
                  type="text"
                  placeholder="Search by location, project name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-white/50 border border-white/60 focus:bg-white text-slate-900 px-9 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all placeholder:text-slate-500 font-medium text-sm"
                />
              </div>

              <Button
                onClick={() => setShowFilters(!showFilters)}
                variant="secondary"
                className="whitespace-nowrap px-4 py-2 h-full rounded-lg border-white/60 bg-white/70 hover:bg-white text-slate-800 shadow-sm text-sm flex items-center"
              >
                <Filter size={16} className="mr-1.5" />
                {showFilters ? 'Hide Filters' : 'Advanced Filters'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Booked / Rented Properties Section (For Logged in Tenant) */}
      {isAuthenticated && user?.role === 'user' && myBookings.length > 0 && (
        <div className="bg-slate-50 border-b border-slate-200 py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-slate-900 mb-8 flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <HomeIcon className="text-primary" size={28} />
              </div>
              Your Booked & Rented Properties
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {myBookings.map((booking) => {
                const property = typeof booking.property === 'object' ? booking.property : null;
                if (!property) return null;
                return (
                  <div
                    key={booking.id}
                    className="relative bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:border-primary/40 transition-all duration-300 flex flex-col justify-between group"
                  >
                    <div className="absolute top-4 right-4 z-10">
                      <span
                        className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm ${
                          booking.status === 'confirmed'
                            ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                            : 'bg-amber-50 text-amber-600 border border-amber-200'
                        }`}
                      >
                        {booking.status}
                      </span>
                    </div>

                    <div className="p-6 flex-1">
                      <div className="flex items-center gap-3 mb-4">
                        <span className="bg-slate-100 text-slate-700 text-xs font-bold px-3 py-1.5 rounded-md uppercase tracking-wide">
                          {property.type === 'flat' ? 'Flat' : 'Shop'}
                        </span>
                        <span className="text-primary font-semibold text-sm">
                          {property.projectName}
                        </span>
                      </div>
                      <h3 className="text-2xl font-bold text-slate-900 mb-2 group-hover:text-primary transition-colors">{property.title}</h3>
                      <p className="text-slate-500 text-sm mb-6 flex items-center"><MapPin size={14} className="mr-1"/> {property.location?.city}</p>

                      <div className="space-y-3 border-t border-slate-100 pt-5 text-sm text-slate-600">
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-slate-500">Move-in Date</span>
                          <span className="text-slate-900 font-semibold bg-slate-50 px-2 py-1 rounded">
                            {new Date(booking.moveInDate).toLocaleDateString()}
                          </span>
                        </div>
                        {booking.rentAmount && (
                          <div className="flex justify-between items-center">
                            <span className="font-medium text-slate-500">Monthly Rent</span>
                            <span className="text-primary font-bold text-lg">
                              {formatCurrency(booking.rentAmount)}
                            </span>
                          </div>
                        )}
                        {booking.rentDueDate && (
                          <div className="flex justify-between items-center">
                            <span className="font-medium text-slate-500">Rent Due Day</span>
                            <span className="text-slate-900 font-semibold bg-slate-50 px-2 py-1 rounded">
                              {booking.rentDueDate}th of month
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="p-6 pt-0 mt-4">
                      <Button
                        onClick={() => (window.location.href = '/dashboard')}
                        variant="primary"
                        className="w-full shadow-md hover:shadow-lg"
                      >
                        Manage & Upload Documents
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-12">
        {/* Filters Panel */}
        {showFilters && (
          <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-8 mb-12 animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
              <div>
                <label className="label">Property Type</label>
                <select
                  className="input-field"
                  value={filters.type || ''}
                  onChange={(e) =>
                    setFilters({ ...filters, type: e.target.value as any })
                  }
                >
                  <option value="">All</option>
                  <option value="flat">Flats</option>
                  <option value="shop">Shops</option>
                </select>
              </div>

              <div>
                <label className="label">Status</label>
                <select
                  className="input-field"
                  value={filters.status || ''}
                  onChange={(e) =>
                    setFilters({ ...filters, status: e.target.value })
                  }
                >
                  <option value="">All</option>
                  <option value="available">Available</option>
                  <option value="booked">Booked</option>
                  <option value="sold">Sold</option>
                </select>
              </div>

              <div>
                <label className="label">Min Price</label>
                <input
                  type="number"
                  className="input-field"
                  placeholder="Min"
                  value={filters.minPrice || ''}
                  onChange={(e) =>
                    setFilters({ ...filters, minPrice: Number(e.target.value) })
                  }
                />
              </div>

              <div>
                <label className="label">Max Price</label>
                <input
                  type="number"
                  className="input-field"
                  placeholder="Max"
                  value={filters.maxPrice || ''}
                  onChange={(e) =>
                    setFilters({ ...filters, maxPrice: Number(e.target.value) })
                  }
                />
              </div>

              <div>
                <label className="label">Bedrooms</label>
                <select
                  className="input-field"
                  value={filters.bedrooms || ''}
                  onChange={(e) =>
                    setFilters({ ...filters, bedrooms: Number(e.target.value) })
                  }
                >
                  <option value="">Any</option>
                  <option value="1">1 BHK</option>
                  <option value="2">2 BHK</option>
                  <option value="3">3 BHK</option>
                  <option value="4">4+ BHK</option>
                </select>
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <Button onClick={resetFilters} variant="outline" size="sm">
                Reset Filters
              </Button>
            </div>
          </div>
        )}

        {/* Project Count */}
        <div className="flex justify-between items-end mb-10 pb-4 border-b border-slate-200">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 mb-2">
              Our Projects
            </h2>
            <p className="text-slate-500">
              Showing {projectGroups.length} distinct properties
            </p>
          </div>
        </div>

        {projectGroups.length === 0 ? (
          <div className="text-center py-24 bg-slate-50 rounded-3xl border border-slate-100">
            <Building2 size={64} className="mx-auto text-slate-300 mb-6" />
            <h3 className="text-2xl font-bold text-slate-800 mb-3">No Projects Found</h3>
            <p className="text-slate-500 text-lg mb-6">
              We couldn't find any projects matching your current filters.
            </p>
            <Button onClick={resetFilters} variant="secondary">
              Clear All Filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {projectGroups.map((group) => (
              <ProjectGroupCard key={group.id} group={group} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
