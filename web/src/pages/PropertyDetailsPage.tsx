import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { propertyService } from '../services/property.service';
import type { Property } from '../types';
import { Loading } from '../components/Loading';
import { Button } from '../components/Button';
import { getPropertyPriceDisplay, getWhatsAppLink, getCallLink } from '../utils/helpers';
import { MapPin, Square, Bed, Bath, Phone, MessageCircle, Calendar, IndianRupee } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuthStore } from '../store/authStore';

export const PropertyDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [property, setProperty] = useState<Property | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (id) {
      fetchProperty();
    }
  }, [id]);

  const fetchProperty = async () => {
    setIsLoading(true);
    try {
      const data = await propertyService.getProperty(id!);
      setProperty(data);
    } catch (error) {
      toast.error('Failed to load property details');
      navigate('/');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBookNow = () => {
    if (!isAuthenticated) {
      toast.error('Please login to book');
      navigate('/login');
      return;
    }
    navigate(`/booking/${id}`);
  };

  if (isLoading) {
    return <Loading fullScreen />;
  }

  if (!property) {
    return null;
  }

  const contactPhone = '9110443387'; // Replace with actual admin phone

  return (
    <div className="min-h-screen bg-dark pb-12">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="text-grey-light hover:text-white mb-6 flex items-center"
        >
          ← Back to Properties
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Images and Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Main Image */}
            <div className="bg-dark-light rounded-lg overflow-hidden">
              <div className="relative h-96">
                {property.images && property.images.length > 0 ? (
                  <img
                    src={property.images[selectedImage]}
                    alt={property.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-dark-lighter">
                    <Square size={64} className="text-grey-dark" />
                  </div>
                )}
                <div className="absolute top-4 left-4">
                  <span
                    className={`px-4 py-2 rounded-full text-sm font-bold ${
                      property.status === 'available'
                        ? 'bg-green-500 text-white'
                        : property.status === 'booked'
                        ? 'bg-yellow-500 text-dark'
                        : 'bg-red-500 text-white'
                    }`}
                  >
                    {property.status.toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Thumbnail Gallery */}
              {property.images && property.images.length > 1 && (
                <div className="flex gap-2 p-4 overflow-x-auto">
                  {property.images.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`${property.title} ${index + 1}`}
                      className={`w-20 h-20 object-cover rounded cursor-pointer transition-all ${
                        selectedImage === index ? 'ring-2 ring-primary' : 'opacity-60 hover:opacity-100'
                      }`}
                      onClick={() => setSelectedImage(index)}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Property Details */}
            <div className="card">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-white mb-2">{property.title}</h1>
                  <div className="flex items-center text-grey-light mb-2">
                    <MapPin size={18} className="mr-2 text-primary" />
                    {property.project?.map_lat && property.project?.map_lng ? (
                      <a 
                        href={`https://www.google.com/maps?q=${property.project.map_lat},${property.project.map_lng}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="hover:text-primary hover:underline"
                      >
                        {property.location.address}, {property.location.city}, {property.location.state}
                      </a>
                    ) : (
                      <span>{property.location.address}, {property.location.city}, {property.location.state}</span>
                    )}
                  </div>
                  <p className="text-sm text-grey">Project: {property.projectName}</p>
                </div>
                <div className="text-right">
                  <p className="text-primary text-4xl font-bold">{getPropertyPriceDisplay(property)}</p>
                  <p className="text-grey-light text-sm mt-1">
                    {property.type === 'flat' ? 'Flat' : 'Shop'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4 border-t border-grey-dark">
                {property.type === 'shop' && property.area > 0 && (
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-2">
                      <Square size={24} className="text-primary" />
                    </div>
                    <p className="text-white font-bold">{property.area} sq.ft</p>
                    <p className="text-grey-light text-sm">Area</p>
                  </div>
                )}
                {property.type === 'flat' && (
                  <>
                    {property.bedrooms && (
                      <div className="text-center">
                        <div className="flex items-center justify-center mb-2">
                          <Bed size={24} className="text-primary" />
                        </div>
                        <p className="text-white font-bold">{property.bedrooms} BHK</p>
                        <p className="text-grey-light text-sm">Bedrooms</p>
                      </div>
                    )}
                    {property.bathrooms && (
                      <div className="text-center">
                        <div className="flex items-center justify-center mb-2">
                          <Bath size={24} className="text-primary" />
                        </div>
                        <p className="text-white font-bold">{property.bathrooms}</p>
                        <p className="text-grey-light text-sm">Bathrooms</p>
                      </div>
                    )}
                    {property.floor && (
                      <div className="text-center">
                        <div className="flex items-center justify-center mb-2">
                          <Calendar size={24} className="text-primary" />
                        </div>
                        <p className="text-white font-bold">Floor {property.floor}</p>
                        <p className="text-grey-light text-sm">Level</p>
                      </div>
                    )}
                  </>
                )}
              </div>

              <div className="pt-4 border-t border-grey-dark">
                <h3 className="text-xl font-bold text-white mb-3">Description</h3>
                <p className="text-grey-light leading-relaxed">{property.description}</p>
              </div>

              {property.amenities && property.amenities.length > 0 && (
                <div className="pt-4 border-t border-grey-dark">
                  <h3 className="text-xl font-bold text-white mb-3">Amenities</h3>
                  <div className="flex flex-wrap gap-2">
                    {property.amenities.map((amenity, index) => (
                      <span
                        key={index}
                        className="bg-dark-lighter px-4 py-2 rounded-full text-primary text-sm"
                      >
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Contact and Booking */}
          <div className="lg:col-span-1">
            <div className="card sticky top-20 space-y-4">
              <h3 className="text-2xl font-bold text-primary">Interested?</h3>
              
              {property.status === 'available' && (
                <Button onClick={handleBookNow} className="w-full" size="lg">
                  <IndianRupee size={20} className="mr-2" />
                  Book Now
                </Button>
              )}

              <div className="space-y-3">
                <a
                  href={getCallLink(contactPhone)}
                  className="flex items-center justify-center gap-2 btn-secondary w-full"
                >
                  <Phone size={20} />
                  Call Us
                </a>
                <a
                  href={getWhatsAppLink(contactPhone, `Hi, I'm interested in ${property.title}`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-lg transition-all w-full"
                >
                  <MessageCircle size={20} />
                  WhatsApp
                </a>
              </div>

              <div className="bg-dark-lighter p-4 rounded-lg space-y-2">
                <h4 className="font-bold text-white">Property ID</h4>
                <p className="text-grey-light text-sm">{property.id}</p>
              </div>

              <div className="bg-dark-lighter p-4 rounded-lg space-y-2">
                <h4 className="font-bold text-white">Location</h4>
                <p className="text-grey-light text-sm">
                  {property.location.city}, {property.location.state}
                </p>
                <p className="text-grey-light text-sm">PIN: {property.location.pincode}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
