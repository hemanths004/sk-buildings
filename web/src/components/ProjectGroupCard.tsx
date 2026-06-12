import React from 'react';
import { formatCurrency } from '../utils/helpers';
import { Building2, MapPin, Layers } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export interface ProjectGroup {
  id: string;
  projectName: string;
  type: 'flat' | 'shop' | 'office';
  count: number;
  availableCount: number;
  minPrice: number;
  maxPrice: number;
  image?: string;
  location?: string;
  unitType?: string;
  sizeSqFt?: number;
  map_lat?: number;
  map_lng?: number;
  createdAt?: string;
}

interface ProjectGroupCardProps {
  group: ProjectGroup;
}

export const ProjectGroupCard: React.FC<ProjectGroupCardProps> = ({ group }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/projects/${encodeURIComponent(group.projectName)}/${group.type}`);
  };

  return (
    <div 
      onClick={handleClick} 
      className="group cursor-pointer bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 border border-slate-100 flex flex-col"
    >
      {/* Image Container */}
      <div className="relative h-56 bg-slate-50 overflow-hidden">
        {group.image ? (
          <img
            src={group.image}
            alt={group.projectName}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-slate-100">
            <Building2 size={64} className="text-slate-300" />
          </div>
        )}
        
        {/* Badges */}
        <div className="absolute top-4 right-4 bg-primary text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-md">
          {group.type === 'flat' ? (group.unitType ? `Flat - ${group.unitType.toUpperCase()}` : 'Flats') : 
           group.type === 'shop' ? (group.sizeSqFt ? `Shop - ${group.sizeSqFt} sq.ft` : 'Shops') : 'Offices'}
        </div>
        
        {group.availableCount > 0 ? (
          <div className="absolute top-4 left-4 bg-emerald-500 text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-md">
            {group.availableCount} Available
          </div>
        ) : (
          <div className="absolute top-4 left-4 bg-rose-500 text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-md">
            Sold Out
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6 flex-1 flex flex-col">
        <h3 className="text-xl font-bold text-slate-900 mb-2 line-clamp-1 group-hover:text-primary transition-colors">
          {group.projectName}
        </h3>
        
        {group.location && (
          <div 
            className="flex items-center text-slate-500 text-sm mb-5 font-medium z-10 relative"
            onClick={(e) => {
              // Prevent triggering card click
              if (group.map_lat && group.map_lng) {
                e.stopPropagation();
              }
            }}
          >
            <MapPin size={16} className="mr-1.5 text-primary" />
            {group.map_lat && group.map_lng ? (
              <a 
                href={`https://www.google.com/maps?q=${group.map_lat},${group.map_lng}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="line-clamp-1 hover:text-primary hover:underline"
              >
                {group.location}
              </a>
            ) : (
              <span className="line-clamp-1">{group.location}</span>
            )}
          </div>
        )}

        {/* Project Details */}
        <div className="flex items-center gap-4 text-slate-600 text-sm mb-6 border-y border-slate-100 py-3">
          <div className="flex items-center bg-slate-50 px-2 py-1 rounded">
            <Layers size={16} className="mr-1.5 text-slate-400" />
            <span className="font-semibold">{group.count} <span className="text-xs text-slate-400 font-normal">Total Units</span></span>
          </div>
        </div>

        {/* Price Range */}
        <div className="mt-auto">
          <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">Price Range</p>
          <p className="text-primary text-xl font-bold leading-none">
            {group.minPrice === group.maxPrice 
              ? formatCurrency(group.minPrice)
              : `${formatCurrency(group.minPrice)} - ${formatCurrency(group.maxPrice)}`
            }
          </p>
        </div>
      </div>
    </div>
  );
};
