import React from 'react';
import type { Property } from '../types';
import { getPropertyPriceDisplay } from '../utils/helpers';
import { MapPin, Bed, Bath, Square, Building2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface PropertyCardProps {
  property: Property;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({ property }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/properties/${property.id}`);
  };

  return (
    <div 
      onClick={handleClick} 
      className="group cursor-pointer bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 border border-slate-100 flex flex-col"
    >
      {/* Image Container (Edge-to-Edge) */}
      <div className="relative h-56 bg-slate-50 overflow-hidden">
        {property.images && property.images.length > 0 ? (
          <img
            src={property.images[0]}
            alt={property.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-slate-100">
            <Building2 size={64} className="text-slate-300" />
          </div>
        )}
        
        {/* Badges */}
        <div className="absolute top-4 right-4 bg-primary text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-md">
          {property.type === 'flat' ? 'Flat' : 'Shop'}
        </div>
        <div className="absolute top-4 left-4">
          <span
            className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-md ${
              property.status === 'available'
                ? 'bg-emerald-500 text-white'
                : property.status === 'booked'
                ? 'bg-amber-500 text-white'
                : 'bg-rose-500 text-white'
            }`}
          >
            {property.status}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex-1 flex flex-col">
        <h3 className="text-xl font-bold text-slate-900 mb-2 line-clamp-1 group-hover:text-primary transition-colors">{property.title}</h3>
        <p className="text-slate-500 text-sm mb-4 line-clamp-2 leading-relaxed">{property.description}</p>

        <div 
          className="flex items-center text-slate-500 text-sm mb-5 font-medium z-10 relative"
          onClick={(e) => {
            if (property.project?.map_lat && property.project?.map_lng) {
              e.stopPropagation();
            }
          }}
        >
          <MapPin size={16} className="mr-1.5 text-primary" />
          {property.project?.map_lat && property.project?.map_lng ? (
            <a 
              href={`https://www.google.com/maps?q=${property.project.map_lat},${property.project.map_lng}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="line-clamp-1 hover:text-primary hover:underline"
            >
              {property.location?.address}, {property.location?.city}
            </a>
          ) : (
            <span className="line-clamp-1">{property.location?.address}, {property.location?.city}</span>
          )}
        </div>

        {/* Property Details */}
        <div className="flex items-center gap-4 text-slate-600 text-sm mb-6 border-y border-slate-100 py-3">
          {property.type === 'shop' && property.area > 0 && (
            <div className="flex items-center bg-slate-50 px-2 py-1 rounded">
              <Square size={16} className="mr-1.5 text-slate-400" />
              <span className="font-semibold">{property.area} <span className="text-xs text-slate-400 font-normal">sq.ft</span></span>
            </div>
          )}
          {property.type === 'flat' && (
            <>
              {property.bedrooms && (
                <div className="flex items-center bg-slate-50 px-2 py-1 rounded">
                  <Bed size={16} className="mr-1.5 text-slate-400" />
                  <span className="font-semibold">{property.bedrooms} <span className="text-xs text-slate-400 font-normal">BHK</span></span>
                </div>
              )}
              {property.bathrooms && (
                <div className="flex items-center bg-slate-50 px-2 py-1 rounded">
                  <Bath size={16} className="mr-1.5 text-slate-400" />
                  <span className="font-semibold">{property.bathrooms} <span className="text-xs text-slate-400 font-normal">Bath</span></span>
                </div>
              )}
            </>
          )}
        </div>

        {/* Price, Advance and Project */}
        <div className="mt-auto border-t border-slate-100 pt-4">
          <div className="flex items-end justify-between mb-3">
            <div>
              <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">Price</p>
              <p className="text-primary text-xl font-bold leading-none">{getPropertyPriceDisplay(property)}</p>
            </div>
            <div className="text-right">
              <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">Advance</p>
              <p className="text-slate-800 text-lg font-bold leading-none">
                {property.advance ? `₹${property.advance.toLocaleString('en-IN')}` : 'N/A'}
              </p>
            </div>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 uppercase tracking-wider font-semibold">Project</span>
            <span className="text-slate-600 font-bold bg-slate-100 px-2 py-1 rounded">{property.projectName}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
